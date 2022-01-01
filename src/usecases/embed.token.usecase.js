const { AppConfig } = require("../../app.config");
const path = require('path');
const fs = require('fs');

/**
 * @param {string} accessCode
 * @param {AppConfig} appConfig 
 * @returns {string} Token
 */
async function usecase(accessCode, appConfig){
    const buffer = fs.readFileSync(path.join('..', 'templates', 'pulsoid.token.html'));
    const template = buffer.toString();
    return template.replace('${VALUE}', `"${accessCode}"`);
}

module.exports.EmbedToken = usecase;