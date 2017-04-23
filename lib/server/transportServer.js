var WebSocket = require('ws'),
    
    TransportChannel = require('../shared/transportChannel.js').TransportChannel, 
    constants = require('../shared/constants.js');

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
    this.ws = ws;
    
    this.diffStream = null;
    this.controlStream = null;
}

/**
 * initialises this TransportStream 
 * @param {editorServer} editorInstance editor server that is used
 */
TransportStream.prototype.init = function(editorInstance){
    var me = this;
    
    var next = function(){
        editorInstance.connect(me);
    };
    
    // setup all the different streams
    me.diffStream = new TransportChannel(me.ws, constants.stream_diff);
    me.controlStream = new TransportChannel(me.ws, constants.stream_control);
    
    // hook up a message handler
    this.controlStream.once('data', function(data){
        // find the document name
        var docName = data[constants.field_documentName];
        
        // TODO: Get the session id and things
        var it = editorInstance.share.connect().get(constants.collection_documents, docName);
        it.fetch(function(err) {
            if (err) throw err;
            if (it.type === null) {
                it.create([{insert: ''}], 'rich-text', next);
                return;
            }
            next();
        });
    });
        
    // and add a message handler
    me.ws.onmessage = function(data){
        me.diffStream.feed(data);
        me.controlStream.feed(data);
    };
    
    // also for closing
    me.ws.onclose = function(){
        me.diffStream.onclose();
        me.controlStream.onclose();
    }
}

module.exports.TransportServer = TransportServer;
module.exports.TransportStream = TransportStream;