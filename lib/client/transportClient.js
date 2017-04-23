var
    TransportChannel = require('../shared/transportChannel.js').TransportChannel, 
    constants = require('../shared/constants.js');

/** Creates a new TransportClient
 * @param {WebSocket} ws WebSocket to use. 
 */
function TransportClient(connection){
    this.connection = connection;
    this.ws = null;
    
    this.diffStream = null;
    this.controlStream = null;
}

/** initialises this TransportClient and bootstraps the connection serverside. 
 * @param {EditorClient} editorInstance Instance of editor to use
 */
TransportClient.prototype.init = function(editorInstance){
    var me = this;
    
    // create the websocket
    this.ws = new WebSocket(this.connection);
    
    // and wait for it to open
    this.ws.onopen = function(){
        
        // create a diff stream and a control stream
        me.diffStream = new TransportChannel(me.ws, constants.stream_diff);
        me.controlStream = new TransportChannel(me.ws, constants.stream_control);
        
        // send data through the control stream
        var data = {};
        data[constants.field_documentName] = editorInstance.doc;
        me.controlStream.send(data);
        
        // hook up the editor instance
        editorInstance.connect(me);
    
        // and finally register a message handler
        me.ws.onmessage = function(data){
            me.diffStream.feed(data);
            me.controlStream.feed(data);
        }
    }
}

module.exports.TransportClient = TransportClient;