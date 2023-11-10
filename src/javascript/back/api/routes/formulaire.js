const YAML = require('yaml');
const fs = require('node:fs');
const Path = require("node:path");
const { latitude, longitude, commune } = YAML.parse(fs.readFileSync(Path.join(__dirname, "..", "..", "..", "..", "resources", "config", "relations_colonnes.yaml"), { encoding: "utf8" }));
const { DataSchema } = require("../../bdd/schemas/DataSchema");
const schema = JSON.parse(JSON.stringify(DataSchema.obj));
const [lat,long,com] = [latitude, longitude, commune].map((col) => ({ colonne: col, ...schema[col] }));
delete schema[latitude];
delete schema[longitude];
delete schema[commune];
const parsed = { schema: { ...schema, [commune]: com, [latitude]: lat, [longitude]: long } , latitude: lat, longitude: long, commune: com };

module.exports = (app, db) => {
    return {
        get: (req, res) => {
            res.status(200).send(parsed);
        }
    }
}