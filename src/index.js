// initialize the database
require('./database/sqlite_init');

//start schedlure job
require('./scheduler/scheduler');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

const port = process.env.PORT || 8080;

const droneRouter = require('./router/drone');

app.use('/drone', droneRouter);
app.use('*', (req,res)=>{res.status(404).send({message:"resource not found"})});

app.listen(port, () => {
    console.log("server started at the port : " + port + ".");
});