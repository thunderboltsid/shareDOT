var 
    EditorClient = require('./editorClient.js').EditorClient, 
    TransportClient = require('./transportClient.js').TransportClient,
    
    constants = require('../shared/constants.js');

document.addEventListener('DOMContentLoaded',function(){
    // TODO: PreFill the document field with a hash
    if(location.hash != "" && location.hash != "#"){
        // pre-fill the document
        document.getElementById("document").value =  location.hash.substring(1);
    }
    
    
    
    document.getElementById('doLogin').onclick = function(){
        // read username    
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var docName = document.getElementById("document").value;
        
        if(docName == ''){
            alert("Document name may not be empty");
            return;
        }
        
        if(username !== password){
            alert("Wrong password");
            return;
        }
        
        location.hash = "#"+docName;
        
        // remove the login box
        var element = document.getElementById('loginform');
        document.body.removeChild(element);
        
        document.getElementById('main').style.display='';
        
        // UI
        var editorDiv = document.getElementById('editor');
        var previewDiv = document.getElementById('preview');

        // Create a new connection
        var transportInstance = new TransportClient('ws://' + window.location.host);
        
        // Create the editor
        var editorInstance = new EditorClient(docName, username, editorDiv, previewDiv);
        
        // and init the transport
        transportInstance.init(editorInstance);
            
    };
});

