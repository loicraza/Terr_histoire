const bcrypt = require("bcrypt");
const fs = require("node:fs");
const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    return {
        post: async (req, res) => { 
            if (!req.body) return res.status(400).send("Body manquant");
            const { email, password } = req.body;
            if (!email) return res.status(400).send("Email manquant");
            if (!password) return res.status(400).send("Mot de passe manquant");

            const user = await db.model('user').findOne({ email: { $eq: email } });
            if (!user) return res.status(400).send({ error: "Mail inconnu" });

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) return res.status(400).send({ error: "Mot de passe incorrect" });
            const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET.replace(/\\n/gm, '\n'), {
                expiresIn: 24 * 60 * 60,
                algorithm: 'RS256'
            });

            return res.status(200).send({ token });
        }
    }
}