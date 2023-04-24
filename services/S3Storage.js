const AWS = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');


class S3Storage {
    constructor(bucketName, region) {
        this.S3_URL = "http://localstack:4566";
        this.bucketName = bucketName;
        this.region = region;
        this.s3 = new AWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: 'test',
            secretAccessKey: 'test',
            region: this.region,
            endpoint: this.S3_URL,
        });
    }

    async uploadFileToS3(s3FileKeyName) {
        const fileContent = fs.readFileSync(s3FileKeyName);
        const params = {
            Bucket: this.bucketName,
            Key: s3FileKeyName,
            Body: fileContent,
        };
        try {
            const result = await this.s3.upload(params).promise();
            console.log(`File uploaded successfully. Location: ${result.Location}`);
            return result.Location;
        } catch (error) {
            console.error(`Error uploading file: ${error}`);
        }
    }

    async getFileFromS3(s3FileKeyName) {
        const params = {
            Bucket: this.bucketName,
            Key: s3FileKeyName,
        };
        try {
            const s3Data = await this.s3.getObject(params).promise();
            console.log(`File content: ${s3Data.Body.toString('utf-8')}`);
            const jsonData = JSON.parse(s3Data.Body.toString('utf-8'));
            return jsonData;
        } catch (error) {
            console.error(`Error reading file: ${error}`);
            return null;
        }
    }

    async getJsonContentByS3URL(s3FileKeyName) {

        try {
            const s3FileURL = this.S3_URL + "/" + this.bucketName + "/" + s3FileKeyName
            const response = await axios.get(s3FileURL);
            return response.data;
        } catch (error) {
            console.log(`Error downloading data: ${error}`);
            return null;
        }

    }
}


module.exports = S3Storage;
