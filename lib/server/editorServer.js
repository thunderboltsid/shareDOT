var 
    ShareDB = require('sharedb'),
    richText = require('rich-text');

ShareDB.types.register(richText.type);

/** Creates a new EditorServer */
function EditorServer(){
    this.share = new ShareDB();
}

/**
 * Connects an additional TransportStream to this client. 
 * @param {TransportStream} stream TransportStream to connect
 */
EditorServer.prototype.connect = function (stream) {
    this.share.listen(stream.ws);
}

module.exports.EditorServer = EditorServer;