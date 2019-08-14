const storage = require('node-persist');



class database {
    constructor() {
        this.cache = storage.create({
        
        dir: 'cache',

        stringify: JSON.stringify,
    
        parse: JSON.parse,
    
        encoding: 'utf8',
    
        logging: false,  // can also be custom logging function
    
        ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    
        expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
    
        // in some cases, you (or some other service) might add non-valid storage files to your
        // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
        forgiveParseErrors: false});

        //simpler blacklist
        this.accounts = storage.create({dir: 'accounts'});
        
        await this.cache.init();
        await this.accounts.init();
        
    }



    /**  assumes well-formed checkTX
     * @param UUID is the server-assigned transaction ID for status querying
     * @param checkTX will be added to the cache if it doesn't already exist
     * @returns boolean whether the transaction was cached
     */
    async incomingTX(UUID, checkTX) {
        return await this.cache.setItem(UUID, checkTX);
    }
    /**
     * 
     * @param account is the address to check against
     */
    async getAccount(account) {
        return await this.accounts.get(account);
    }

}
module.exports = database;