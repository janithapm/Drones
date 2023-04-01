const db = require('../database/sqlite_init');
const fs = require('fs');
const moment = require('moment');

function createLog() {

    const fileName = `./logs/${moment().format('YYYY-MM-DD')}.log`;
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '');
        console.log(`${fileName} log is created successfully`);
    }

    const logStream = fs.createWriteStream(fileName, { flags: 'a' });
    logStream.write(`\ntime:${moment().format('YYYY-MM-DD-hh:mm:ss')}\n`);

    const query = `SELECT serial as SERIAL,battery as BATTERY FROM drones`;
    db.each(query, (err, row) => {
        if (err) {
            console.error(err.message);
            throw err;
        } else {
            logStream.write(`${JSON.stringify(row)}\n`);
        }
    });

    logStream.on('error', (err) => {
        console.error(err.message);
    });
}

// write log in to logs folder for every 30 seconds
function createLogInInterval() {
    setInterval(() => {
        createLog()
    }, 30000);
}
module.exports = createLogInInterval();