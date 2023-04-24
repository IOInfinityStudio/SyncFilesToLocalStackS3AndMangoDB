const MongoClient = require('mongodb').MongoClient;
const S3Storage = require('./S3Storage');

class UsersDataStorage {
    constructor(dbUrl, dbName, collectionName) {
        this.dbUrl = dbUrl
        this.dbName = dbName
        this.collectionName = collectionName;
        this.s3Bucket = 'users';
        this.s3Region = 'us-east-1';
        this.userFileKeyname = "fake_users.json"
    }

    async connect() {
        this.mangodbClient = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async syncUsersDataFromS3ToDB() {
        try {
            const s3stoage = new S3Storage(this.s3Bucket, this.s3Region);
            const jsonData = await s3stoage.getFileFromS3(this.userFileKeyname);
            jsonData.created_at = new Date();
            const collection = this.client.db(
                this.dbName).collection(this.collectionName);
            const result = await collection.insertOne(jsonData);
            console.log(`Inserted document with ID ${result.insertedId}`);
            return result; 
        } catch (err) {
            console.error(err);
        }
    }

    async getLatestRecord() {
        const collection = this.mangodbClient.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({}, { sort: { _id: -1 } });
        if (result == null) {
            return {};
        } 
        const createdDate = result.created_at;
        const users = result.users;
        const createdUnixTime = Math.floor(createdDate.getTime() / 1000);
        return {
            users: users,
            timestamp: createdUnixTime     
        }
    }

    async close() {
        await this.mangodbClient.close();
    }
}


module.exports = UsersDataStorage;