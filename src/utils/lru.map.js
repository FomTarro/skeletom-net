class LRUMap {
    /**
     * 
     * @param {number} max 
     */
    constructor(max = 10) {
        this.max = max;
        this.cache = new Map();
    }

    get(key) {
        let item = this.cache.get(key)
        if (item !== undefined) {
            // refresh key
            this.cache.delete(key)
            this.cache.set(key, item)
        }
        return item === undefined ? -1 : item
    }

    set(key, val) {
        // refresh key
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // evict oldest
        else if (this.cache.size == this.max) {
            this.cache.delete(this.first())
        }
        this.cache.set(key, val)
    }

    has(key) {
        return this.cache.has(key);
    }

    first() {
        return this.cache.keys().next().value
    }

    [Symbol.iterator]() {
        return this.cache.entries();
    }
}

module.exports.LRUMap = LRUMap