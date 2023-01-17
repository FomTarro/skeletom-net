const { AppConfig } = require("../../app.config");
const { httpRequest, HttpResponse } = require("../adapters/http.utils");

/**
 * @param {string} question
 * @param {AppConfig} appConfig 
 * @returns {HttpResponse} answer
 */
async function usecase(question, appConfig){

    //http://api.wolframalpha.com/v1/result?appid=DEMO
    // Wolfram demands that the query uses '+' for spaces, which means the actual plus operation gets confused.
    const decodedQuestion = question.replace(/([+])+/g, 'plus').replace(/([ ])+/g, '+');
    const opts = {
        host: 'api.wolframalpha.com',
        method: 'GET',
        path: encodeURI(`/v1/result?appid=${appConfig.WOLFRAM_CLIENT_ID}&i=${decodedQuestion}`)
    }
    // console.log(opts.path);
    const result = await httpRequest(opts, undefined, false);
    return result;
}

module.exports.WolframAsk = usecase;