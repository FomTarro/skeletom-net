const { AppConfig } = require("../../app.config");
const { httpRequest, HttpResponse } = require("../adapters/http.utils");

/**
 * @param {string} question
 * @param {AppConfig} appConfig 
 * @returns {HttpResponse} answer
 */
async function usecase(question, appConfig){

    //http://api.wolframalpha.com/v1/result?appid=DEMO
    const decodedQuestion = decodeURI(question);
    const opts = {
        host: 'api.wolframalpha.com',
        method: 'GET',
        path: encodeURI(`/v1/result?appid=${appConfig.WOLFRAM_CLIENT_ID}&i=${question}`)
    }
    // console.log(opts.path);
    const result = await httpRequest(opts, undefined, false);
    return result;
}

module.exports.WolframAsk = usecase;