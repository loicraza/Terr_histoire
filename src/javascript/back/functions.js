const fs = require("node:fs");
const Path = require("node:path");
const CvsStreamReader = require("csv-reader");
const { DataSchema } = require("./bdd/schemas/DataSchema.js");
const inputParser = {
    "String": (value) => value,
    "Number": (value) => Number(value),
    "Date": (value) => new Date(value),
    "Integer": (value) => Number(value)
};

/**
 * @typedef {Object<string, string>} Relations
 */

/**
 * @typedef {Object & { relations: Relations }} CsvReadingOption
 * @property {string} columnDelimiter
 * @property {string} name
 */

/**
 * Lis le fichier CSV contenu dans le fichier et retourne les lignes en fonction de la relation
 * @param {CsvReadingOption} option
 * @returns {Promise<string[][]>}
 */
async function readAndParseCsv({ name, columnDelimiter, relations } = {}) {
    if (!name || typeof name !== "string") throw new Error("Le nom du fichier est manquant");
    if (!columnDelimiter || typeof columnDelimiter !== "string") throw new Error("Le délimiteur de colonne est manquant");
    if (!relations || typeof relations !== "object") throw new Error("Les relations sont manquantes");
    const missingRelations = Object.entries(DataSchema.obj)
        .filter(([column, { required }]) => required && relations[column] === undefined)
        .map(([column, { nom }]) => `${nom} (${column})`)
        ;
    if (missingRelations.length) throw new Error(`Les relations suivantes sont manquantes: ${missingRelations.join(", ")}`);
    const path = Path.join(__dirname, "..", "..", "resources", "tmp", name);
    console.log(`Reading file "${name}"`);
    try {
        const stream = fs.createReadStream(path, { encoding: "utf8" });
        const rows = await new Promise((resolve, reject) => {
            const rows = [];
            stream.pipe(CvsStreamReader({ delimiter: columnDelimiter, asObject: true }))
                .on("data", (row) => {
                    rows.push(row);
                })
                .on("end", () => {
                    resolve(rows);
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
        if (!rows[0]) return [];
        const header = Object.keys(rows[0]);
        const relationsEntries = Object.entries(relations);
        const missingColumns = relationsEntries
            .filter(([, value]) => !header.includes(value))
            .map(([column, value]) => `${value} (${DataSchema.obj[column].nom})`);
        ;
        // if (missingColumns.length) throw new Error("Ces colonnes sont inexistantes dans votre base de donnée : " + missingColumns.join(", "));
        const data = rows.map((row) => {
            const obj = {};
            relationsEntries.forEach(([key,]) => {
                const value = relations[key];
                obj[key] = row[value];
            });
            return obj;
        });
        return { data, uuid: name };
    } catch (err) {
        throw err;
    } finally {
        if (fs.existsSync(path)) fs.unlink(path, (err) => {
            if (err) throw err;
            console.log(`Deleted file "${name}"`);
        });
    }
}

/**
 * Lis le fichier CSV et retourne les lignes en fonction de la relation
 * @param {CsvReadingOption[]} options 
 * @returns 
 */
async function readAndParseCsvs(options) {
    console.log("Reading files");
    const rows = await Promise.all(options.map(async (option) => readAndParseCsv(option)));
    console.log("Files read");
    return rows.flat();
}

/**
 * Tranforme les données lues et parsées en GeoJSON
 * @param {Object<string, string>} rows 
 * @returns {Object}
 */
function toGeoJSON(rows) {
    return {
        type: "FeatureCollection",
        features: rows.map((row) => {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [row.longitude, row.latitude]
                },
                properties: {
                    name: row.nom,
                    description: row.description
                }
            };
        })
    };
}

/**
 * Check if the credentials object is valid
 * @param {Object} credentials
 * @throws {Error}
 */
function checkCredentials(credentials) {
    if (!credentials || typeof credentials !== "object") throw Error("Credentials manquant");
    if (!credentials.name) throw Error("Nom manquant");
    if (!credentials.surname) throw Error("Prénom manquant");
    if (!credentials.email) throw Error("Email manquant");
    const invalidCredentials = Object.entries(credentials)
        .filter(([, value]) => typeof value !== "string" || value.length === 0 || !/^[a-zA-Z0-9_@.]+$/.test(value))
        .map(([key]) => key)
        ;
    if (invalidCredentials.length) throw Error(`Les credentials suivants sont invalides: ${invalidCredentials.join(", ")}`);
}

module.exports = {
    readAndParseCsv,
    readAndParseCsvs,
    toGeoJSON,
    checkCredentials
}
