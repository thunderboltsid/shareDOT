var 
    sharedb = require('sharedb/lib/client')
    richText = require('rich-text'),
    quill = require('quill'),
    showdown  = require('showdown');

var constants = require('../constants.js');

// setup sharedb types
sharedb.types.register(richText.type);

/**
 * Creates a new Editor instance. 
 * @param {string} doc Name of the document to load
 * @param {DOM} editorElement Element representing the document
 * @param {DOM} previewElement Element representing the preview
 */
function EditorClient(doc, docElement, previewElement) {
    // store the document as well as the elements
    this.doc = doc;
    this.docElement = docElement;
    this.previewElement = previewElement;
    
    // and create an editor
    this.editor = new quill(
        this.docElement, 
        {
            theme: 'snow', 
            formats: [], 
            modules: {
                toolbar: false
            }
        }
    );
    
    // create a previewer
    this.preview = new showdown.Converter()
    
    // we are not yet connected
    this.connected = false;
    this.connection = null;
    this.share = null;
};

/**
 * Connects this editor to a connection endpoint and starts editing
 *
 * @param {TransportClient} transport Transport connection to use for communication
 */
EditorClient.prototype.connect = function(transport){
    // if we are already connected, quit
    if(this.connected){
        return false;
    }
    
    // we are now connected
    this.connected = true;
    
    // setup a connection and bind it to the transport
    this.connection = new sharedb.Connection(transport.ws);
    
    // create a share and subscribe
    this.share = this.connection.get(constants.documentStorageCollection, this.doc);
    
    // and setup all the events
    this._bindEvents();
}



/**
 * Binds all the editor events
 */
EditorClient.prototype._bindEvents = function(){
    var me = this;
    
    this.share.subscribe(function(err) {
        
        // if there was an error, throw it
        if (err) throw err;
        
        // set the initial contents of the editor
        me.editor.setContents(me.share.data);
        me._updatePreview();
        
        // send all changes to to the server
        me.editor.on('text-change', function(delta, oldDelta, source) {
            if (source !== 'user') return;
            me.share.submitOp(delta, {source: quill});
            me._updatePreview();
        });
        
        // see all changes from the server
        me.share.on('op', function(op, source) {
            if (source === quill) return;
            me.editor.updateContents(op);
            me._updatePreview();
            
        });
    });

}

/** Updates the preview */
EditorClient.prototype._updatePreview = function(){
    // TODO: Have a different set of editor
    this.previewElement.innerHTML = this.preview.makeHtml(this.editor.getText());
}

module.exports.EditorClient = EditorClient;