const express = require('express');
const router = express.Router();
router.use(express.json());

const Drone = require('../logic/drone');
const Payload = require('../logic/payload');

router.post('/', async (req, res) => {
    try {
        const drone = req.body;

        const { serial, model, weight_limit, battery } = req.body;
        if (!serial || !model || !weight_limit || !battery) {
            return res.status(400).send({ success:false, error:{code:"INVLAID_PARAMETER"}});
          }

        let resp = await Drone.register(drone);
        if (resp.success) {
            return res.status(201).send(resp);
        }
        return res.status(400).send(resp);
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const {state} = req.query;

        let drones = await Drone.getDronesByState(state);

        if (Array.isArray(drones) && drones.length) {
            return res.status(200).send({success:true, drones});
        }
        return  res.status(404).send({success:true, drones}); 
    }
    catch (error) {
        return res.status(500).send({success:false, error});
    }
});


router.post('/:droneSerial/medications', async (req, res) => {
    try {
        const {droneSerial} = req.params;
        const {medications} = req.body;

        let response = await Drone.loadMedicine(droneSerial, medications);
        return response.success ?  res.status(201).send(response) : res.status(400).send(response);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.get('/:droneSerial/medications', async (req, res) => {
    try {
        const {droneSerial} = req.params;

        let response = await Payload.getPayloadsByDrone(droneSerial);
        return res.status(200).send({success:true, payloads:response});
    }
    catch (error) {
        return res.status(500).send({success:true,error});
    }
});

router.get('/:droneSerial/battery', async (req, res) => {
    try {
        const {droneSerial} = req.params;

        let response = await Drone.getDroneBatteryPercentage(droneSerial);
        if (response.success) {
            return res.status(200).send(response);
        }
        return res.status(400).send(response);
    }
    catch (error) {
        return res.status(500).send({success:true,error});
    }
});


module.exports = router;