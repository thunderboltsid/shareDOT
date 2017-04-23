var 
    ShareDB = require('sharedb'),
    richText = require('rich-text'),
    
    constants = require('../shared/constants.js');

ShareDB.types.register(richText.type);

/**
  * A server for editors
  * @param {Database} database Database to be used for storing content
  * @param {DocumentStore} documentStore to be used to retrieve documents to / from
  */
function EditorServer(database, docstore){
    this.database = database;
    this.share = new ShareDB({db: this.database.db});
    this.streams = [];
}

/**
 * Sends a broadcase to all documents with a given ID
 * @param {string} doc Document to send message to. 
 * @param {string} message Message to send. 
 */
EditorServer.prototype.broadcast = function(doc, message){
    
    // prepare message to send
    var messageObj = {};
    messageObj[constants.field_message] = message;
    
    // iterate over all matching transports
    this.streams.map(function(transport, e){
        if(transport.documentName == doc){
            transport.broadcastStream.write(messageObj);
        }
    })
}


/**
 * Connects an additional TransportStream to this client. 
 * @param {TransportStream} stream TransportStream to connect
 */
EditorServer.prototype.connect = function (stream) {
    var me = this;
    
    this.share.listen(stream.diffStream);
    this.streams.push(stream);
    
    // remove the stream on closure
    stream.controlStream.on('close', function(){
        var index = me.streams.indexOf(stream);
        if(index > -1){
            me.streams.splice(index, 1);
        }
    });
}

module.exports.EditorServer = EditorServer;