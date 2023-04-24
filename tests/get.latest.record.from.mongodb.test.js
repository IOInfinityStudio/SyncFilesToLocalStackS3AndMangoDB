const chai = require('chai');
const UsersDataStorage = require('../services/UsersDataStorage');
const expect = chai.expect;

describe('UsersDataStorage', () => {
  let usersDataStorage;

  beforeEach(async () => {
    const mockCollection = {
      data: [],
      async insertOne(document) {
        this.data.push(document);
      },
      async findOne(filter, options) {
        const sortedData = this.data.sort((a, b) => b._id - a._id);
        return sortedData[0];
      }
    };

    // Create a mock MongoClient that returns the mock collection
    const mockClient = {
      db(dbName) {
        return {
          collection(collectionName) {
            return mockCollection;
          }
        };
      },
      async connect() {},
      async close() {}
    };

    // Create a new instance of UsersDataStorage with the mock MongoClient
    usersDataStorage = new UsersDataStorage(
      'mongodb://localhost:27017', 'test_db', 'users_collection');
    usersDataStorage.mangodbClient = mockClient;
  });

  describe('getLatestRecord', () => {
    const now = new Date();
    const nowPlus10Seconds = new Date(now + 10000);

    const mockDataRank1 = {
      _id: '1',
      created_at: now,
      users: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 35 }]
    };
    const mockDataRank2 = {
      _id: '2',
      created_at: nowPlus10Seconds,
      users: [{ name: 'Sandy', age: 5 }, { name: 'Kevin', age: 2 }]
    };

    beforeEach(async () => {
      const collection = usersDataStorage.mangodbClient.db(
        usersDataStorage.dbName).collection(usersDataStorage.collectionName);
      await collection.insertOne(mockDataRank1);
      await collection.insertOne(mockDataRank2);
    });

    it('should return the latest record', async () => {
      const result = await usersDataStorage.getLatestRecord();
      expect(result).to.deep.equal({
        users: mockDataRank2.users,
        timestamp: Math.floor(mockDataRank2.created_at.getTime() / 1000)
      });
    });
  });
});
