var 
    EventEmitter = require('events'),
    util = require('util');

/**
 * Creates a new channel implemented via a websocket
 * @param {WebSocket} ws WebSocket to connect via
 * @param {string} name Name of channel to send data via. 
 */
function TransportChannel(ws, name){
    this.ws = ws;
    this.name = name
    this.readyState = this.ws.readyState;
}

util.inherits(TransportChannel, EventEmitter);

/**
 * Sends data via this channel. 
 * @param {object} data Data to send via this channel
 */
TransportChannel.prototype.send = TransportChannel.prototype.write = function(data){
    var decodedData = (typeof data == 'string') ? JSON.parse(data) : data;
    
    // DEBUG
    // console.log("SEND_DATA", this.name, decodedData);
    
    this.ws.send(JSON.stringify({
        'channel': this.name, 
        'payload': decodedData
    }));
}

/**
 * Feeds some data to this channel and calls the message handler if applicable. 
 */
TransportChannel.prototype.feed = function(data){
    // decode the message
    var messageWasString = (typeof data.data == 'string');
    var decodedData = messageWasString ? JSON.parse(data.data) : data.data;
        
    // if it is for our channel, re-compose it. 
    if(decodedData.channel == this.name){
        
        // DEBUG
        // console.log("RECEIVE_DATA", this.name, decodedData.payload);
        
        // create a fake newData object
        var payload = {
            'data': messageWasString ? JSON.stringify(decodedData.payload) : decodedData.payload
        };
        
        // and send the data
        this.onmessage(payload);
    }
}

/**
 * Dummy onmessage callback
 */
TransportChannel.prototype.onmessage = function(data){
    this.emit('data', (typeof data.data == 'string') ? JSON.parse(data.data) : data.data);
}

/**
 * Dummy onclose callback
 */
TransportChannel.prototype.onclose = function(data){
    this.emit('close');
}

module.exports.TransportChannel = TransportChannel;