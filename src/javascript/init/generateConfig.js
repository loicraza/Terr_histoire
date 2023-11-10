const fs = require("node:fs");
const Path = require("node:path");
const configPath = Path.join(__dirname, "..", "..", "resources", "config");
const checkWriteAndLog = (path, content) => {
    const fullPath = Path.join(configPath, path);
    if (fs.existsSync(fullPath)) return console.log(`Fichier ${path} déjà existant.`);
    fs.writeFileSync(fullPath, content, { encoding: "utf8" });
    console.log(`Fichier ${path} généré. Pensez à le modifier à votre guise.`);
};

checkWriteAndLog("description_accueil.txt", "Ceci est une description.\r\n\r\nVous pouvez même faire des sauts de ligne.");
checkWriteAndLog("data.yaml", `colonne:\n  nom: le nom de la donnée qui apparaît sur le site\n  description_simple: la description de l'input sur le formulaire simple\n  description_bdd: la description de l'input sur le formulaire de données\n  type: le type du paramètre (String, Number, Integer, Date ou Array)\n  required: si le paramètre doit être forcément renseigné ou non (true/false)\n  min: si vous avez un nombre/entier, sa valeur minimale\n  max: si vous avez un nombre/entier, sa valeur maximale`);
checkWriteAndLog("liste_communes.txt", "Lyon\r\nParis\r\nMarseille\r\nToulouse");
checkWriteAndLog("relations_colonnes.yaml", "commune: laColonneDesCommunes\r\nlatitude: laColonneDesLatitudes\r\nlongitude: laColonneDesLongitudes");