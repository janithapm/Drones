const db = require('../database/sqlite_init');

let add = function (payload = {}) {
    return new Promise((resolve, reject) => {
        const payloadData = [payload.drone_serial, payload.medication_code, payload.weight];

        const INSERT_PAYLOAD = 'INSERT INTO payloads (drone_serial, medication_code, weight) VALUES (?, ?, ?)';

        return db.run(INSERT_PAYLOAD, payloadData, (error) => {
            if (error) {
                return reject({ success: false, error:error.code });
            }
            return resolve({ success: true, error: null });
        });
    });
}


module.exports = {
    add
}