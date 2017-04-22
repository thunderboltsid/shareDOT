/**
 * Created by sid on 22/04/2017.
 */

var sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
var socket = new WebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
var doc = connection.get('examples', 'textUpdate');

// Get initial value of document and subscribe to changes
doc.subscribe(showText);
// When document changes (by this client or any other, or the server),
// update the number on the page
doc.on('op', showText);

function showText() {
    document.querySelector('#text-up').textContent = doc.data.textContent;
};

// When clicking on the '+1' button, change the number in the local
// document and sync the change to the server and other connected
// clients
function updateText() {
    // Increment `doc.data.numClicks`. See
    // https://github.com/ottypes/json0 for list of valid operations.
    doc.submitOp([{p: ['textContent'], si: document.querySelector('#text-up')}]);
}

// Expose to index.html
global.updateText = updateText;