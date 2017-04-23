var 
    ShareDB = require('sharedb'),
    richText = require('rich-text');

ShareDB.types.register(richText.type);

/**
  * A server for editors
  * @param {Database} database Database to be used for storing content
  * @param {DocumentStore} documentStore to be used to retrieve documents to / from
  */
function EditorServer(database, docstore){
    this.database = database;
    this.share = new ShareDB({db: this.database.db});
}

/**
 * Connects an additional TransportStream to this client. 
 * @param {TransportStream} stream TransportStream to connect
 */
EditorServer.prototype.connect = function (stream) {
    this.share.listen(stream.ws);
}

module.exports.EditorServer = EditorServer;