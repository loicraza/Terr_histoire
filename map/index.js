const Path = require("node:path");
require("dotenv").config({ path: Path.join(__dirname, "..", "") })
if (!process.env.MONGO_URI) throw new Error("Missing parameter 'MONGO_URI' in .env file.");

const express = require('express');
const cors = require('cors');
const { connect } = require("../src/javascript/back/bdd/index");

const port = 8080;
const communes = require("../src/resources/communes.json");

(async () => {
    const db = await connect(process.env.MONGO_URI);
    const app = express();

    app.use(cors());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/test', (req, res) => {
        res.send(test);
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
})();
