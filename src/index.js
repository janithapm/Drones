import express, { json, urlencoded } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded( {extended: true} ));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("server started at the port : " + port + ".");
});