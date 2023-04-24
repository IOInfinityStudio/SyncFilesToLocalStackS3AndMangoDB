const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const UsersDataStorage = require('../services/UsersDataStorage');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('UsersDataStorage', () => {
  let usersDataStorage;
  let mockCollection;
  let mockClient;

  beforeEach(async () => {
    mockCollection = {
      data: [],
      async insertOne(document) {
        this.data.push(document);
      },
      async findOne(filter, options) {
        const sortedData = this.data.sort((a, b) => b._id - a._id);
        return sortedData[0];
      }
    };

    mockClient = {
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

    sinon.spy(mockClient, 'db');
    sinon.spy(mockCollection, 'insertOne');
    sinon.spy(mockCollection, 'findOne');

    usersDataStorage = new UsersDataStorage(
      'mongodb://localhost:27017', 'test_db', 'users_collection');
    usersDataStorage.mangodbClient = mockClient;
  });

  afterEach(() => {
    sinon.restore();
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

    it('should return an empty object if there are no records', async () => {
      mockCollection.data = [];
      const result = await usersDataStorage.getLatestRecord();
      expect(result).to.deep.equal({});
    });

  });
});
