/**
 * Represents a store of documents 
 * @param {Database} database Database to store documents in
 */
function DocumentStore(database){
    this.database = database.db;
}

/**
 * Gets all documents that are accessible by a certain user
 * @param {string} username 
 */
DocumentStore.prototype.getDocumentsFromUser = function(username){
    
}

DocumentStore.prototype.create = function(owner){}

module.exports.DocumentStore = DocumentStore;