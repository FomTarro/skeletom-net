const { AppConfig } = require("../../app.config");
const { customFetch } = require("../utils/custom.fetch");

class WolframClient {
    /**
     * 
     * @param {AppConfig} appConfig 
     */
    constructor(appConfig){
        this.client_id = appConfig.WOLFRAM_CLIENT_ID;
    }

    /**
     * 
     * @param {string} question 
     * @returns 
     */
    async ask(question){
        //http://api.wolframalpha.com/v1/result?appid=DEMO
        // Wolfram demands that the query uses '+' for spaces, which means the actual plus operation gets confused.
        const decodedQuestion = question.replace(/([+])+/g, 'plus').replace(/([ ])+/g, '+');
        const path = encodeURI(`v1/result?appid=${this.client_id}&i=${decodedQuestion}`);
        const url = new URL(`https://api.wolframalpha.com/${path}`);
        const result = await customFetch(url);
        if(result.status >= 200 && result.status < 400){
            const text = await result.text();
            return {
                status: 200,
                body: text
            }
        }else{
            return {
                status: result.status,
                body: result.statusText
            }
        }
    }
}

module.exports.WolframClient = WolframClient;