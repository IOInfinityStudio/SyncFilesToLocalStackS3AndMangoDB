const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const UsersDataStorage = require('../services/UsersDataStorage');
const S3Storage = require('../services/S3Storage');
const { MongoClient } = require('mongodb');

describe('UsersDataStorage', () => {
    describe('connect', () => {
        let usersDataStorage;

        beforeEach(() => {
            usersDataStorage = new UsersDataStorage(
                'mongodb://mock.mangodb.url:27017', 'mockjsdb', 'mockuserscollection');
            sinon.stub(MongoClient, 'connect').resolves();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should connect to MongoDB server', async () => {
            await usersDataStorage.connect();
            expect(MongoClient.connect.calledOnce).to.be.true;
            expect(MongoClient.connect.calledWith('mongodb://mock.mangodb.url:27017', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })).to.be.true;
        });
    });

    describe('close', () => {
        let usersDataStorage;

        beforeEach(() => {
            usersDataStorage = new UsersDataStorage(
                'mongodb://mock.mangodb.url:27017', 'mockjsdb', 'mockuserscollection');
            usersDataStorage.mangodbClient = {
                close: sinon.stub().resolves()
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should close MongoDB client connection', async () => {
            await usersDataStorage.close();
            expect(usersDataStorage.mangodbClient.close.calledOnce).to.be.true;
        });
    });


});