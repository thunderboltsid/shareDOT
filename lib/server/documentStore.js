/**
 * Represents a store of documents 
 * @param {Database} database Database to store documents in
 */
function DocumentStore(database){
    this.database = database.db;
}

module.exports.DocumentStore = DocumentStore;