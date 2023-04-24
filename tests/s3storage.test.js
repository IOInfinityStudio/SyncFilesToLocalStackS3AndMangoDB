const chai = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const S3Storage = require('../services/S3Storage');

const expect = chai.expect;

describe('S3Storage', () => {
  describe('getFileFromS3', () => {
    let s3Storage;
    let getObjectStub;

    beforeEach(() => {
      const s3 = new AWS.S3();
      getObjectStub = sinon.stub(s3, 'getObject');
      s3Storage = new S3Storage('test-bucket', 'us-west-2');
      s3Storage.s3 = s3;
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return parsed JSON content of the file', async () => {
      getObjectStub.returns({
        promise: () => Promise.resolve({ Body: Buffer.from('{"data": "sample data"}') })
      });
      const result = await s3Storage.getFileFromS3('test-file.json');
      expect(result).to.deep.equal({ data: 'sample data' });
    });

    it('should return null when there is an error reading the file', async () => {
      const s3Storage = new S3Storage("test-bucket", "us-east-1");
      const getObjectStub = sinon.stub(s3Storage.s3, "getObject").throws(new Error("some error"));
      const result = await s3Storage.getFileFromS3("test-file.txt");
      expect(result).to.be.null;
      expect(getObjectStub.calledOnce).to.be.true;
    });
  });
});
