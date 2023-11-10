const { Schema } = require('mongoose');
const YAML = require("yaml");
const fs = require("node:fs");
const Path = require("node:path");

const data = YAML.parse(fs.readFileSync(Path.join(__dirname, "..", "..", "..", "..", "resources", "config", "data.yaml"), { encoding: "utf8" }));
if (Object.keys(data).find((column) => column === "_id" || column === "__v")) throw new Error("data.yaml cannot contain the column _id or __v");

module.exports.DataSchema = new Schema(data);