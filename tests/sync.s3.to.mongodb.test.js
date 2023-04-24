const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const S3Storage = require('../services/S3Storage');
const UsersDataStorage = require('../services/UsersDataStorage');

describe('UsersDataStorage', () => {
  describe('syncUsersDataFromS3ToDB', () => {
    let sandbox;
    let s3storageStub;
    let getFileFromS3Stub;
    let insertOneStub;
    let consoleLogStub;
    let consoleErrorStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      s3storageStub = sandbox.stub(S3Storage.prototype);
      getFileFromS3Stub = s3storageStub.getFileFromS3;
      insertOneStub = sandbox.stub();
      consoleLogStub = sandbox.stub(console, 'log');
      consoleErrorStub = sandbox.stub(console, 'error');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should insert the data from S3 to the DB', async () => {
      const jsonData = { users: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }] };
      getFileFromS3Stub.resolves(jsonData);
      insertOneStub.resolves({ insertedId: '1234567890' });

      const usersDataStorage = new UsersDataStorage('mongodb://localhost:27017', 'test', 'users');
      usersDataStorage.client = {
        db: sandbox.stub().returns(
          { collection: sandbox.stub().returns({ insertOne: insertOneStub }) })
      };

      const result = await usersDataStorage.syncUsersDataFromS3ToDB();

      expect(getFileFromS3Stub.calledOnceWith('fake_users.json')).to.be.true;
      expect(insertOneStub.calledOnceWith({ ...jsonData, created_at: sinon.match.date })).to.be.true;
      expect(consoleLogStub.calledOnceWith('Inserted document with ID 1234567890')).to.be.true;
      expect(consoleErrorStub.notCalled).to.be.true;
      expect(result).to.deep.equal({ insertedId: '1234567890' });
    });

    it('should log an error message if an error occurs', async () => {
      const error = new Error('Failed to get file from S3');
      getFileFromS3Stub.rejects(error);

      const usersDataStorage = new UsersDataStorage('mongodb://localhost:27017', 'test', 'users');
      usersDataStorage.client = {
        db: sandbox.stub().returns(
          { collection: sandbox.stub().returns({ insertOne: insertOneStub }) })
      };

      await usersDataStorage.syncUsersDataFromS3ToDB();

      expect(getFileFromS3Stub.calledOnceWith('fake_users.json')).to.be.true;
      expect(insertOneStub.notCalled).to.be.true;
      expect(consoleLogStub.notCalled).to.be.true;
      expect(consoleErrorStub.calledOnceWith(error)).to.be.true;
    });
  });
});
