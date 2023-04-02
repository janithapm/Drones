const db = require('../database/sqlite_init');
const fs = require('fs');
const moment = require('moment');
const Drone = require('../model/drone');

function createLog() {

    const fileName = `./logs/${moment().format('YYYY-MM-DD')}.log`;
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '');
        console.log(`${fileName} log is created successfully`);
    }

    const logStream = fs.createWriteStream(fileName, { flags: 'a' });
    logStream.write(`\ntime:${moment().format('YYYY-MM-DD-hh:mm:ss')}\n`);

    Drone.getBatteryLog().then(battery => {
        logStream.write(`${JSON.stringify(battery)}\n`);
    }).catch(err =>  {
        throw err;
    })

    logStream.on('error', (err) => {
        console.error(err.message);
    });
}

let timeInterval =  process.env.LOG_INTERVAL || 30000;

// write log in to logs folder for every 30 seconds
function createLogInInterval() {
    setInterval(() => {
        createLog()
    }, timeInterval);
}
module.exports = createLogInInterval();