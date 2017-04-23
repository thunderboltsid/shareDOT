var
   ShareDBMingo = require('sharedb-mingo-memory');
/**
 * Creates a new Database
 * @param {string} url URL of database to connect to
 */
function Database(url, next){
    this.url = url;
    this.db = null;
}

/**
 * Initialises this database and connects to it. 
 * @param {function} next Callback once database connection is established. 
 */
Database.prototype.init = function(next){
    this.db = new ShareDBMingo(); 
    next();
}

module.exports.Database = Database;