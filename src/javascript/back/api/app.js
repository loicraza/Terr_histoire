const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Connection } = require('mongoose');
const root = process.env.API_ROOT || "localhost";
const port = process.env.API_PORT || 3001;
const routes = require('./startup/routes.js');

/**
 * @param {Connection} db 
 */
module.exports.api = (db) => {

    // defining the Express app
    const app = express();

    // adding Helmet to enhance your API's security
    app.use(helmet());

    // using bodyParser to parse JSON bodies into JS objects
    app.use(express.json());

    // enabling CORS for all requests
    app.use(cors());

    // adding morgan to log HTTP requests
    app.use(morgan('combined'));

    // adding routes
    routes(app, db);

    // starting the server
    app.listen(port, root, () => {
        console.log(`Listening on port ${port}.`);
    });

};