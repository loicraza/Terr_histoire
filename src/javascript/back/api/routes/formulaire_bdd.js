const { readAndParseCsv } = require("../../functions.js");
const { DataSchema } = require("../../bdd/schemas/DataSchema.js");
const { checkCredentials } = require("../../functions.js");

module.exports = (app, db) => {
    return {
        post: async (req, res) => {
            if (!req.body) return res.status(400).send({ error: "Body manquant" });
            if (!req.file) return res.status(400).send({ error: "Fichier manquant" });
            const { relations, columnDelimiter } = req.body;
            const credentials = JSON.parse(req.body.credentials);
            try {
                checkCredentials(credentials);
                const { data, uuid } = await readAndParseCsv({ name: req.file.filename, relations: JSON.parse(relations), columnDelimiter });
                let i = 0;
                try {
                    while (i < data.length) {
                        const doc = data[i];
                        await db.model('data')(doc).validate();
                        i++;
                    }
                } catch (err) {
                    if ("errors" in err) {
                        const missingProperties = Object.keys(err.errors).reverse().map((prop) => DataSchema.tree[prop].nom).join(", ");
                        res.status(400).send({ error: `Il vous manque les propriétés suivantes sur la ligne ${i + 1}: ${missingProperties}` });
                    } else res.status(400).send(err);
                    return;
                }
                db.model('data').insertMany(data, (err, dataDocs) => {
                    if (err) return res.status(500).send(err);
                    const processing = dataDocs.map((doc) => db.model('processing')({ 
                        _id: doc._id, 
                        bddUUID: uuid,
                        addedByEmail: credentials.email,
                        addedByName: credentials.name,
                        addedBySurname: credentials.surname
                    }));
                    db.model('processing').insertMany(processing, (err, _) => {
                        if (err) return res.status(500).send(err);
                        return res.status(200).send(dataDocs);
                    });
                });
            } catch (err) {
                return res.status(400).send({ error: err.message });
            }
        },
        delete: async (req, res) => {
            const { bddUUID } = req.params;
            if (!req.body) return res.status(400).send("Body manquant");
            db.model('data').deleteMany(
                { bddUUID },
                (err, docs) => {
                    if (err) return res.status(500).send(err); // par ex : erreur de connexion
                    if (docs) return res.status(200).send(docs);
                    res.status(404).send("No database found or it is already deleted");
                }
            );
        }
    }
}