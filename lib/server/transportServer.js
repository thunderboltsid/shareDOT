var WebSocket = require('ws'),
    WebSocketJSONStream = require('websocket-json-stream'),
    
    constants = require('../constants.js');

/**
 * Creates a new TransportServer
 * @param {object} express Express server to connect to
 * @param {function} next Callback once a connection has been established
 */
function TransportServer(express){
    this.express = express;

}

/** initialises this TransportServer and bootstraps the connection
 * @param {EditorServer} editorInstance Instance of editor to use
 */
TransportServer.prototype.init = function(editorInstance){
    var me = this;
    
    this.wss = new WebSocket.Server({server: this.express});
    this.wss.on('connection', function(ws, req) {
        var stream = new TransportStream(me, ws);
        stream.init(editorInstance);
    });
}

/**
 * Creates a new TransportStream
 * @param {TransportServer} ts Transport Server
 * @param {WebSocket} ws WebSocket instance this stream connects to
 */
function TransportStream(ts, ws){
    this.ts = ts;
    this.ws_und = ws;
    this.ws = null;
}

/**
 * initialises this TransportStream 
 * @param {editorSerbver} editorInstance editor server that is used
 */
TransportStream.prototype.init = function(editorInstance){
    var me = this;
    
    var next = function(){
        editorInstance.connect(me);
    };
    
    
    this.ws = new WebSocketJSONStream(this.ws_und);
    
    this.ws.once('data', function(doc){
        // TODO: Catch authentication and handle it
        
        // find the document name
        var docName = doc[constants.documentName];
        
        var it = editorInstance.share.connect().get(constants.connectionName, docName);
        it.fetch(function(err) {
            if (err) throw err;
            if (it.type === null) {
                it.create([{insert: ''}], 'rich-text', next);
                return;
            }
            next();
        });
    });
}



module.exports.TransportServer = TransportServer;
module.exports.TransportStream = TransportStream;