const bcrypt = require("bcrypt");

module.exports = (app, db) => {
    return {
        post: async (req, res) => {   // url contenant url de départ + le caractère '/'
            if (!req.body) return res.status(400).send("Body manquant");
            const { email, password } = req.body;
            if (!email) return res.status(400).send({ error: "Email manquant" });
            if (!password) return res.status(400).send({ error: "Mot de passe manquant" });
            const isAlreadyRegistered = !!(await db.model('user').findOne(  // cherche ds l'API si un mail est identique à celui tapé
                { email: { $eq: email } }
            ));
            if (isAlreadyRegistered) return res.status(400).send({ error: "Mail déjà utilisé" });  // si oui, affiche une erreur

            const salt = await bcrypt.genSalt(10);  // génère un salt
            const hashedPassword = await bcrypt.hash(password, salt);  // hash le mot de passe avec le salt

            const user = db.model('user')({
                email,
                password: hashedPassword,
                salt
            });  // crée un nouvel utilisateur

            user.save(async (err, doc) => {
                if (err) return res.status(500).send(err);
                return res.status(201).send(doc); // renvoie le nouvel utilisateur
            });
        }
    }
}