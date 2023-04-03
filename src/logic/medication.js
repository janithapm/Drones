const Drone = require('../model/drone');
const Medication = require('../model/medication');

let getDroneBySerial = async function (serial) {
    try {
        const drone = await Drone.getDroneBySerial(serial);
        return drone;
    }
    catch (error) {
        throw error;
    }
}

let getMedicine = async function (code, minimumWeight) {
    try {
        const medication = await Medication.getMedicationsByCode(code, minimumWeight);
        if (medication.success){
            const weightAfterUpdate = medication.medicine.weight - minimumWeight;
            const medicine = {...medication.medicine, weightAfterUpdate};
            return {success:true, medicine};
        }
        throw medication;
    }
    catch (error) {
        throw error;
    }
}

let updateMedicine = async function (code, weight) {
    return await Medication.updateWeight(code, weight);
}


let checkAndUpdateMedicine = async function(code, weight) {
    try {
        let medicine = await getMedicine(code, weight);
        if (medicine.success){
            let weightUpdate = medicine.medicine.weightAfterUpdate;
            let medicineUpdate = await updateMedicine(code, weightUpdate);
            return medicineUpdate; 
        }
        throw medicine;

    }

    catch (error) {
        throw error
    }
}

module.exports = {
    getDroneBySerial,
    checkAndUpdateMedicine,
}