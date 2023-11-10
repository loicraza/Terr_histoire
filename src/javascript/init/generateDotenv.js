const crypto = require("crypto");
const fs = require("node:fs");
const Path = require("node:path");
const readline = require('readline');

const defaultEnv = {
    "JWT_SECRET": {
        value: () => {
            return crypto.generateKeyPairSync("rsa", { modulusLength: 4096 }).privateKey.export({ type: "pkcs1", format: "pem" }).toString().replace(/\n/g, "\\n");
        },
        hidden: true
    }
}
const parsedEnv = [...
    fs
        .readFileSync(Path.join(__dirname, "..", "..", "..", ".env.example"), "utf8")
        .matchAll(/^(?<param>.+)=(?<value>.*)$/gm)
].map(({ groups: { param, value } }) => ({ param, value: value ? () => value : defaultEnv[param].value, hidden: defaultEnv[param]?.hidden || false }));

(async () => {
    const env = {};
    for await (const { param, value, hidden } of parsedEnv) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const val = value();
        const answer = await new Promise((resolve) => rl.question(`${param}=? (default: ${hidden ? "generated" : val}) : `, resolve));
        env[param] = answer || val;
        rl.close();
    }
    const envFile = Object.entries(env).map(([param, value]) => `${param}=${value}`).join("\r\n");
    await new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log("--------------------");
        console.log(Object.entries(env).map(([param, value]) => `${param}=${defaultEnv[param]?.hidden ? "**********" : value}`).join("\r\n"));
        console.log("--------------------");
        rl.question("Do you want to save this .env file? (y/n) (default: y) : ", (answer) => {
            rl.close();
            if (answer && answer !== "y") return reject("Aborted by user");
            fs.writeFileSync(Path.join(__dirname, "..", "..", "..", ".env"), envFile, { encoding: "utf8" });
            console.log("Env file generated");
            resolve();
        });
    }).catch((err) => console.error(err));
})();
