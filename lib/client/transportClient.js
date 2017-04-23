var
    constants = require('../constants.js');

/** Creates a new TransportClient
 * @param {WebSocket} ws WebSocket to use. 
 */
function TransportClient(connection){
    this.connection = connection;
    this.ws = null;
}

/** initialises this TransportClient and bootstraps the connection serverside. 
 * @param {EditorClient} editorInstance Instance of editor to use
 */
TransportClient.prototype.init = function(editorInstance){
    var me = this;
    
    this.ws = new WebSocket(this.connection);
    this.ws.onopen = function(){
        // send the document name
        var data = {};
        data[constants.documentName] = editorInstance.doc;
        me.ws.send(JSON.stringify(data));
        
        // and then run all the other things
        editorInstance.connect(me);
    }
}

module.exports.TransportClient = TransportClient;