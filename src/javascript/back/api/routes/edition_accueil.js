const fs = require("node:fs");
const Path = require("node:path");
const descriptionAccueilPath = Path.join(__dirname, "..", "..", "..", "..", "resources", "config", "description_accueil.txt");

module.exports = (app, db) => {
    return {
        get: (req, res) => {
            fs.readFile(descriptionAccueilPath, { encoding: "utf8" }, (err, text) => {
                if (err) return res.status(500).send(err);
                res.status(200).send({ text });
            });
        },
        patch: (req, res) => {
            if (!req.body) return res.status(400).send("Body manquant");
            const { text } = req.body;
            if (!text) return res.status(400).send("Aucun texte");
            fs.writeFile(descriptionAccueilPath, text.trim(), { encoding: "utf8" }, (err) => {
                if (err) return res.status(500).send(err);
                res.status(200).send();
            });
        } 
    }
}