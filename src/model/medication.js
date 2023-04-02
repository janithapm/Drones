const db = require('../database/sqlite_init');

let updateWeight = function(code, weight) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE medications SET weight = ? WHERE code = ?`;
        db.run(query, [code, weight], (err) => {
            if (err) {
                const error = utils.matchErrorCode(err.code)
                return reject({ success: false, error});
            }
            resolve(true);
        });
    });
}

let getMedicationsByCode = function(code) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM medications where code = ${code}`;
        db.get(query, (err, row) => {
            if (err) {
                const error = utils.matchErrorCode(err.code)
                return reject({ success: false, error});;
            }
            resolve(row);
        });
    });
}

module.exports = {
    updateWeight,
    getMedicationsByCode
}