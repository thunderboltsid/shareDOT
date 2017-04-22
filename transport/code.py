class Client(object):
    """ Protocol client """
    
    def __init__(self):
        self.id = 0
    
    def send(self, message):
        """ Send a message over an unsecure change. To be implemented by the user. """
        
        raise NotImplementedError
    
    def handle(self, message):
        """ Handles a message, to be implemented by user """
        
        raise NotImplementedError
    
    def receive(self, message):
        """ To be called whenever a message is recevied """
        
        # Check the message type
        try:
            tp = message["type"]
        except ValueError:
            return False
        
        if tp != "DATA":
            return False
        
        # Check the id
        try:
            mid = message["id"]
        except ValueError:
            return False
        
        # message matches
        if mid == self.id:
            # send an ACK
            self.send({
                'type': 'ACK', 
                'id': mid
            })
            
            # increase the counter
            self.id += 1
            
            # handle the message            
            self.handle(message["data"])
        
        # future message, send an EXP
        elif mid > self.id:
            self.send({
                'type': 'EXP', 
                'id': self.id
            })

class Server(object):
    def __init__(self):
        self.id = 0
        self.cache = {}
    
    def send(self, message):
        """ Send a message over an unsecure change. To be implemented by the user. """
        
        raise NotImplementedError
    
    def handle(self, message):
        """ Handles a message, to be implemented by user """
        
        self.cache[self.id] = message
        self.send({
            'type': 'DATA', 
            'id': self.id, 
            'data': message
        })
        self.id += 1
        
    
    def receive(self, message):
        """ To be called whenever a message is recevied """
        
        # in case of an ACK, first check if the package is still there
        if message["type"] == "ACK":
            mid = message["id"]
            
            # if so, delete it
            if mid in self.cache:
                del self.cache[mid]
            
            # and try to send the next message
            if mid+1 in self.cache:
                self.send({
                    'type': 'DATA', 
                    'id': mid + 1, 
                    'data': self.cache[mid + 1]
                })
        
        # EXP -- send the message
        elif message["type"] == "EXP":
            mid = message["id"]
            
            if mid in self.cache:
                self.send({
                    'type': 'DATA', 
                    'id': mid, 
                    'data': self.cache[mid]
                })
            
    