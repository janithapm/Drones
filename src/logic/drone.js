const Drone = require('../model/drone');
const Payload = require('../model/paayload');
const Medicine = require('../model/medication');

function DroneObject(serial, model, weight_limit, battery) {
    this.serial = serial;
    this.model = model;
    this.weight_limit = weight_limit;
    this.battery = battery;
}

DroneObject.prototype.validate = function () {
    if (typeof this.serial !== "string" || this.serial.length > 100) {
        return "SERIAL_NUMBER_INVALID";
    }
    if (typeof this.model !== "string" || !["Lightweight", "Middleweight", "Cruiserweight", "Heavyweight"].includes(this.model)) {
        return "MODEL_INVALID";
    }
    if (typeof this.weight_limit !== "number" || !(this.weight_limit <= 500  && this.weight_limit > 0)) {
        return "WEIGHT_LIMIT_INVALID";
      }
      if (typeof this.battery !== "number" || !(this.battery <= 500  && this.battery > 0)) {
        return "BATTERY_CAPACITY_INVALID";
      }

}

let register = async function (drone = {}) {
    const addAllowed = await hasFleetLimitExceeded();
    if (!addAllowed) {
        return { success: false, error: "FLEEET_LIMIT_EXCEEDED" };
    }

    if (typeof drone !== "object") {
        return { success: false, error: "INVALID_PARAMETER" };
    }

    const { serial, model, weight_limit, battery } = drone;

    let droneObject = new DroneObject( serial, model, weight_limit, battery);
    const error = droneObject.validate();
    if (error) {
        return {success:false, error};
    }
    if (!serial || !model || !weight_limit || !battery) {
        return { success: false, error: "INVALID_PARAMETER" };
    }

    return await Drone.add(drone);
}

let hasFleetLimitExceeded = async () => {
    try {
        let countCheck = await Drone.getCount();
        if (countCheck.success && countCheck.count < 10) {
            return true;
        }
        return false;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

let checkDroneValidation = async (serial, payload) => {
    if (!serial || !Array.isArray(payload)) {
        return { success: false, error: "INVALID_PARAMETER" };
    }

    let drone = await Drone.getDroneBySerial(serial);
    if (!drone) {
        return { success: false, error: "DRONE_NOT_FOUND" };
    }

    const { battery, state } = drone;

    if (state != "IDLE") {
        return { success: false, error: "DRONE_NOT_IDLE" };
    }

    if (!checkDroneHasBattery(battery)) {
        await Drone.updateDroneState(serial, "IDLE");
        return { success: false, error: "NO_ENOUGH_BATTERY" };
    }

    return { success: true, error: null, drone };

}

let loadMedicine = async (droineSerial, payload = [], location) => {
    try {

        if(!location || location.length == 0) {
            return { success: false, error: "INVALID_DESTINATION" };   
        }

        const { success: droneValid, error: droneValidationError, drone } = await checkDroneValidation(droineSerial, payload);
        if (!droneValid) {
            return { success: false, error: droneValidationError };
        }

        const { weight_limit } = drone;

        await Drone.updateDroneState(droineSerial, "LOADING");

        let error = null;
        let totalWeight = 0;
        let medicineCodes = [];
        let medicinePayload = []

        for (const singlemedicine of payload) {
            const { code, weight } = singlemedicine || {};
            if (!code || !weight || typeof weight !== 'number') {
                error = { success: false, error: "INVALID_PARAMETER" };
                break;
            }
            totalWeight += weight;
            medicineCodes.push(code);
            medicinePayload.push({ drone_serial: droineSerial, medication_code: code, weight });
        }

        if (error != null) {
            await Drone.updateDroneState(droineSerial, "IDLE");
            return error;
        }

        if (totalWeight > weight_limit) {
            await Drone.updateDroneState(droineSerial, "IDLE");
            return { success: false, error: "DRONE_OVERWEIGHT" };
        }

        // TODO: check if medicine codes are valid and has enough medicine


        const payloadDBInsertPromise = medicinePayload.map(payload => {

            // made it asynchronus since update weight does not need to be updated for the rest of the process
            Medicine.updateWeight(payload.medication_code, payload.medication_code);

            return Payload.add(payload, location);
        });

        return Promise.all(payloadDBInsertPromise).then(async values => {
            await Drone.updateDroneState(droineSerial, "LOADED");
            return { success: true, error: null };
        }).catch(async error => {
            await Drone.updateDroneState(droineSerial, "IDLE");
            return { success: false, error: "LOADING_FAILED" };
        });
    }

    catch (error) {
        return { success: false, error };
    }
}

let getDronesByState = async (state) => {
    stateInUpperCase = state.toUpperCase();

    return Drone.getDronesByState(stateInUpperCase);
}

let getDroneBatteryPercentage = async (serial) => {
    try {
        let drone = await Drone.getDroneBySerial(serial);
        if (!drone) {
            return { success: false, error: "DRONE_NOT_FOUND" };
        }
        return { success: true, drone: { serial, battery_percentage: drone.battery } };
    }
    catch (error) {
        return { success: false, error };
    }

}

let checkDroneHasBattery = (battery) => {
    return (battery > 25);
}

module.exports = {
    register,
    loadMedicine,
    getDronesByState,
    getDroneBatteryPercentage
}