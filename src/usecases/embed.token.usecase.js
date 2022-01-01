const { AppConfig } = require("../../app.config");
const fs = require('fs');

/**
 * @param {string} templatePath
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {string} Token
 */
async function usecase(templatePath, accessCode, appConfig){
    const buffer = fs.readFileSync(templatePath);
    const template = buffer.toString();
    return template.replace('${VALUE}', `${accessCode}`);
}

module.exports.EmbedToken = usecase;