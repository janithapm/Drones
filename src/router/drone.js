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
            return res.send(resp);
        }
        return res.status(400).send(resp);
    }
    catch (err) {
        return res.status(400).send(err);
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
        return res.status(400).send(err);
    }
});

router.get('/:droneSerial/medications', async (req, res) => {
    try {
        const {droneSerial} = req.params;

        let response = await Payload.getPayloadsByDrone(droneSerial);
        return res.status(200).send({payloads:response});
    }
    catch (err) {
        return res.status(400).send(err);
    }
});


module.exports = router;