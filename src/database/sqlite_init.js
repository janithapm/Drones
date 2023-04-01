const sqlite3 = require('sqlite3').verbose();
let instance = null;

function getInstance() {
  if (!instance) {
    instance = new sqlite3.Database('drones.sqlite');
  }
  return instance;
}

module.exports = getInstance();