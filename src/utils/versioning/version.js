class Version {
    /**
     * 
     * @param {string} version 
     * @param {string} date 
     * @param {string} url 
     */
    constructor(version, date, url){
        this.version = version;
        this.date = date;
        this.url = url;
    }
}

module.exports.Version = Version;