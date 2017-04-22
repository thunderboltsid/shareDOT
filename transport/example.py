import code
import random

class MyClient(code.Client):
    def __init__(self):
        super().__init__()
        self.messages = []
        
    def handle(self, message):
        print("CLIENT:MESSAGE", message)
    
    def send(self, message):
        self.messages.append(message)

class MyServer(code.Server):
    def __init__(self):
        super().__init__()
        self.messages = []
    
    def send(self, message):
        self.messages.append(message)

s = MyServer()
c = MyClient()
s.client = c
c.server = s

for i in range(1000):
    s.handle("MESSAGE {}".format(i))

while len(s.messages) + len(c.messages) > 0:
    
    # and send a random message
    if random.getrandbits(1) and len(s.messages) > 0:
        s.messages = random.sample(s.messages, len(s.messages))
        c.receive(s.messages.pop())
    elif len(c.messages) > 0:
        c.messages = random.sample(c.messages, len(c.messages))
        s.receive(c.messages.pop())