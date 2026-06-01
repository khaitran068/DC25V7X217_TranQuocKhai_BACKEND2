const {MongoClient} = require('mongodb');

class MongoDB {
    static async connect(uri) {
        if (!this.client) {
            this.client = new MongoClient(uri);
            await this.client.connect();
        }
        return this.client.db();
    };
}

module.exports = MongoDB;