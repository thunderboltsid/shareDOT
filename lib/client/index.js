var 
    EditorClient = require('./editorClient.js').EditorClient, 
    TransportClient = require('./transportClient.js').TransportClient,
    
    constants = require('../constants.js');

document.addEventListener('DOMContentLoaded',function(){
    // UI
    var editorDiv = document.getElementById('editor');
    var previewDiv = document.getElementById('preview');

    // Create a new connection
    var transportInstance = new TransportClient('ws://' + window.location.host);
    
    // Create the editor
    var editorInstance = new EditorClient(constants.exampleClient, editorDiv, previewDiv);
    
    // and init the transport
    transportInstance.init(editorInstance);
});

