/**
 * Wrapper for fetch that handles failures like HTTP errors.
 * @param {string | URL | globalThis.Request} input 
 * @param {RequestInit} init 
 * @returns {Promise<Response>}
 */
const customFetch = async(input, init) => {
    try{
        return await fetch(input, init);
    }catch(e){
        return new Response(undefined, {
            status: 500,
            statusText: `${e}`
        });
    }
}

module.exports.customFetch = customFetch;