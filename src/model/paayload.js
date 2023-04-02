const db = require('../database/sqlite_init');
const utils = require('../utils/utils');

let add = function (payload = {}) {
    return new Promise((resolve, reject) => {
        const payloadData = [payload.drone_serial, payload.medication_code, payload.weight];

        const INSERT_PAYLOAD = 'INSERT INTO payloads (drone_serial, medication_code, weight) VALUES (?, ?, ?)';

        return db.run(INSERT_PAYLOAD, payloadData, (error) => {
            if (error) {
                return reject({ success: false, error: utils.matchErrorCode(error.code) });
            }
            return resolve({ success: true, error: null });
        });
    });
}

let get = function (droneSerial) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM payloads where drone_serial = '${droneSerial}' and delivered = 0`;
        db.all(query, (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}


module.exports = {
    add,
    get
}