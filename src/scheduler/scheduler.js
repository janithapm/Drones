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
    logStream.write(`time:${moment().format('YYYY-MM-DD-hh:mm:ss')}\n`);

    const query = `SELECT serial as SERIAL,battery as BATTERY FROM drones`;
    db.each(query, (err, row) => {
        if (err) {
            console.error(err.message);
            throw err;
        } else {
            logStream.write(`${JSON.stringify(row)}\n`);
        }
    });

    logStream.write(`\n`);

    logStream.on('error', (err) => {
        console.error(err.message);
    });
}

function createLogInInterval() {
    setInterval(() => {
        createLog()
    }, 600000);
}
module.exports = createLogInInterval();