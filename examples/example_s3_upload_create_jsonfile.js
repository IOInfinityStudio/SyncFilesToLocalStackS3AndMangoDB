const S3Storage = require('../services/S3Storage');

async function uploadAndReadJsonFile() {
  try {
    const s3stoage = new S3Storage('users', 'us-east-1');
    const s3FileKey = 'fake_users.json';
    s3stoage.uploadFileToS3(s3FileKey);
    const jsonContent = await s3stoage.getFileFromS3(s3FileKey);
    console.log('JSON content:', jsonContent);
    const jsonContentByURL = await s3stoage.getJsonContentByS3URL(s3FileKey);
    console.log('JSON content (By URL):', jsonContentByURL);

  } catch (err) {
    console.error('Error:', err);
  }
}
uploadAndReadJsonFile();
