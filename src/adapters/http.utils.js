const https = require('https');

/**
 * 
 * @param {https.RequestOptions} params 
 * @param {String} postData 
 * @param {boolean} expectJSON is the returned content json?
 * @returns {Promise<HttpResponse>} Response with content
 */
async function httpRequest(params, postData, expectJSON = true) {
    const promise = new Promise(function(resolve, reject) {
        var req = https.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                reject(new HttpResponse(res.statusCode, res.statusMessage));
            }
            // collect chunks
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                if(expectJSON == true){
                    try {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } catch(e) {
                        reject(new HttpResponse(400, e.toString()));
                    }
                }else{
                    body = Buffer.concat(body).toString();
                }
                resolve(new HttpResponse(res.statusCode, body));
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(new HttpResponse(500, err));
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    })
    .then((r) => { return r})
    .catch((r) => { return r});

    return promise;
}

class HttpResponse {
    /**
     * 
     * @param {Number} statusCode 
     * @param {String} body 
     */
    constructor(statusCode, body){
        this.statusCode = statusCode;
        this.body = body
    }
}

module.exports.httpRequest = httpRequest;
module.exports.HttpResponse = HttpResponse;