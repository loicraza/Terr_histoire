const YAML = require('yaml');
const fs = require('node:fs');
const Path = require("node:path");
const { latitude, longitude } = YAML.parse(fs.readFileSync(Path.join(__dirname, "..", "..", "..", "..", "resources", "config", "relations_colonnes.yaml"), { encoding: "utf8" }));
const { DataSchema } = require("../../bdd/schemas/DataSchema");
const { checkCredentials } = require("../../functions.js");

module.exports = (app, db) => {
    async function validateData(data, isNew) {
        const query = {
            $and: [
                { [latitude]: data[latitude] },
                { [longitude]: data[longitude] }
            ]
        };
        if (!isNew) query.$and.push({ _id: { $ne: data._id } });
        const hasSameLongAndLat = !!(await db.model('data').findOne(query));
        if (hasSameLongAndLat) throw new Error(`Ce couple latitude/longitude existent déjà dans notre base de données.`);
        const model = db.model('data')(data);
        try {
            await model.validate();
        } catch (err) {
            if ("errors" in err) {
                const missingProperties = Object.keys(err.errors).reverse().map((prop) => DataSchema.tree[prop].nom).join(", ");
                throw new Error(`Il vous manque les propriétés suivantes: ${missingProperties}`);
            } else throw err;
        }
    }
    return {
        // ajoute un élément à la base de données en fonction des données du body
        // il est automatiquement ajouté à la liste des données à traiter
        post: async (req, res) => {
            if (!req.body || typeof req.body !== "object") return res.status(400).send("Body manquant");
            const { inputs, credentials } = req.body;
            if (!inputs || typeof inputs !== "object") return res.status(400).send("Inputs manquant");
            try {
                checkCredentials(credentials);
                await validateData(inputs, true);
            } catch (err) {
                return res.status(400).send({ error: err.message });
            }
            db.model('data').create(inputs, (err, docData) => {
                if (err) return console.log(err) && res.status(500).send(err);
                db.model('processing').create(({
                    _id: docData._id,
                    addedByEmail: credentials.email,
                    addedByName: credentials.name,
                    addedBySurname: credentials.surname
                }), (err, _) => {
                    if (err) return console.log(err) && res.status(500).send(err);
                    res.send(docData);
                });
            });
        },
        // modifie l'élément grâce à son id en fonction des données du body
        patch: async (req, res) => {
            const { id } = req.params;
            if (!req.body) return res.status(400).send("Body manquant");
            try {
                await validateData({ ...req.body, _id: id }, false);
            } catch (err) {
                return res.status(400).send({ error: err.message });
            }
            db.model('data').findOneAndReplace(
                { _id: id },
                req.body,
                { new: true },
                (err, doc) => {
                    if (err) return res.status(500).send(err);
                    if (doc) return res.status(200).send(doc);
                    return res.status(404).send("No document found");
                }
            )
        },
        // supprime l'élément grâce à son id
        delete: (req, res) => {
            const { id } = req.params;
            db.model('data').findByIdAndRemove(
                id,
                (err, docs) => {
                    if (err) return res.status(500).send(err);
                    if (docs) return res.status(200).send(docs);
                    res.status(404).send("No document found or it is already deleted");
                }
            );
        },
    }
}