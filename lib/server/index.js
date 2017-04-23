var 
    http = require('http'),
    express = require('express'),
    
    EditorServer = require('./editorServer.js').EditorServer,
    TransportServer = require('./transportServer.js').TransportServer;


// Setup static express routes
var app = express();
app.use(express.static('static'));
app.use(express.static('node_modules/quill/dist'));

// Create a server and start listening
var httpServerInstance = http.createServer(app);
httpServerInstance.listen(process.env.port || 8080);
console.log('Listening on '+httpServerInstance.port);

// create an editor server
var editorInstance = new EditorServer();
var serverInstance = new TransportServer(httpServerInstance);
serverInstance.init(editorInstance);