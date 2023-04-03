const db = require('../database/sqlite_init');

let updateWeight = function (code, weight) {
    return new Promise((resolve, reject) => {

        const query = `UPDATE medications SET weight = ? WHERE code = ?`;

        db.run(query, [weight, code], (updateError) => {
            if (updateError) {
                return reject({ success: false, error: `${code}_MEDICINE_CAN_NOT_USE` });
            }
            return resolve({ success: true, error: null });
        })
    });
}

let getMedicationsByCode = function (code, minimumWeight) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM medications where code = '${code}' and weight >= ${minimumWeight}`;
        db.get(query, (error, result) => {
            if (error) {
                return reject({ success: false, error: checkError });
            }
            if (result == null) {
                return reject({ success: false, error: `${code}_MEDICINE_NOT_AVAILABLE` });
            }
            return resolve({ success: true, medicine:result });
        });
    });
}

module.exports = {
    updateWeight,
    getMedicationsByCode
}