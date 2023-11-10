require("dotenv").config();
const fs = require("node:fs");
const Path = require("node:path");
const configPath = Path.join(__dirname, "..", "..", "resources", "config");

;["MONGO_URI", "API_ROOT", "API_PORT", "JWT_SECRET", "JWT_EXPIRATION_TIME"].forEach((param) => {
    if (!process.env[param]) {
        throw new Error(
            "Missing parameter '" + param + "' in .env file." + '\n' +
            "Please add it and restart the server." + '\n' +
            "You can generate your .env file by running the command \"npm run init\""
        );
    }
});

;["data.yaml", "description_accueil.txt", "liste_communes.txt"].forEach((file) => {
    const filePath = Path.join(configPath, file);
    if (!fs.existsSync(filePath)) {
        throw new Error(
            "Missing file '" + file + "' in config folder." + '\n' +
            "Please add it and restart the server." + '\n' +
            "You can generate the config files by running the command \"npm run init\""
        );
    }
});

const { connect } = require("./bdd/index.js");
const { api } = require("./api/app.js");

async function init() {
    const db = await connect(process.env.MONGO_URI);
    api(db);
};

init();