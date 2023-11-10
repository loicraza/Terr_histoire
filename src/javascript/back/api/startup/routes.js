const multer = require('multer');
const Path = require('node:path');
const upload = multer({ dest: Path.join(__dirname, "..", "..", "..", "..", "resources", "tmp") });

module.exports = (app, db) => {
    app.get('/', (_, res) => {
        res.status(200).send("Hello world!");
    });

    const formulaire = require("../routes/formulaire.js")(app, db);
    app.get('/formulaire', formulaire.get);

    const formulaire_simple = require("../routes/formulaire_simple.js")(app, db)
    app.post('/formulaire_simple', formulaire_simple.post);
    app.patch('/formulaire_simple/:id', formulaire_simple.patch);
    app.delete('/formulaire_simple/:id', formulaire_simple.delete);

    const formulaire_bdd = require("../routes/formulaire_bdd.js")(app, db);
    app.post('/formulaire_bdd', upload.single("fichier"), formulaire_bdd.post);
    app.delete('/formulaire_bdd/:bddUUID', formulaire_bdd.delete);

    const traitement = require("../routes/traitement.js")(app, db);
    app.get('/traitement', traitement.get);
    app.patch('/traitement/:id', traitement.patch);
    app.delete('/traitement/:id', traitement.delete);

    const inscription = require("../routes/inscription.js")(app, db);
    app.post('/inscription', inscription.post);

    const connexion = require("../routes/connexion.js")(app, db);
    app.post('/connexion', connexion.post);

    const edition_accueil = require("../routes/edition_accueil.js")(app, db);
    app.get('/edition_accueil', edition_accueil.get);
    app.patch('/edition_accueil', edition_accueil.patch);
}