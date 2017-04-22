# In-Order-Transport

This library provides a transport that guarantees one-direction in-order delivery of any kind of JSON messages over a bi-directiona;l transport that potentially loses messages and does not preserver order. This assumes that all messages are delivered. 

## API

### Server

```
Server.handle(message) --> to be called by user to send a message over the secure channel
Server.send(message) --> called by the Server to send a message over an unsecure channel 
Server.receive(message) --> to be called by the user whenever an unsecure message is received
```

### Client

```
Client.send(message) --> called by the Client when transmitting an (unsecure)  message over the channel
Client.receive(message) --> should be called by the user whenever an unsecure message is received. 
Client.handle(message) --> called by the Client when an in-order message is received. 
```

## Protocol

The protocol is roughly based on TCP. 
Both the server and the client keep a message counter that starts at 0. 
Upon sending a message, the server sends along the message number:

Server -> Client
```
// sending a message from the server to the client
{
    'type': 'DATA'
    'id': ID, 
    'data': data, 
}
```

Whenever a client receives a message, it checks the local counter it expects. 
If the counter matches, it sends an ACK:

```
// received an out-of-order message
// upon receiving this, the sevrer 
{
    'type': 'ACK', 
    'id': ID
}
```

If it receives a future packet, it sends an EXP (expected) message with the message ID it expects. 

Client --> Server:

```
// received an out-of-order message
// upon receiving this, the sevrer 
{
    'type': 'EXP', 
    'id': ID
}
```

Already known packets are ignored. 

Upon receving an ACK, the server deletes the existing packet and tries to send the next packet (if available). 
If receiving an EXP, the server re-sends such a packet. 
Once the ACK for a package is received, the server deletes it from the cache. 