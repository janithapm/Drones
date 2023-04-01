const express = require('express')
const cors = require('cors')

require('./database/sqlite_init');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("server started at the port : " + port + ".");
});