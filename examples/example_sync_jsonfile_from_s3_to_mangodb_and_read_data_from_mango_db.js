const MangoDB = require('../services/UsersDataStorage');

async function run() {
  // Create an instance of the MangoDB class
  const dbUrl = "mongodb://mangodb:mangodb@mangodb:27017";
  const dbName = "nodejs_proj";
  const collectionName = "users";
  const s3FileKeyName = "fake_users.json"
  const db = new MangoDB(
    dbUrl,
    dbName,
    collectionName,
    s3FileKeyName);

  // Connect to the MongoDB database
  await db.connect();

  await db.syncUsersDataFromS3ToDB();

  const lastRecord = await db.getLatestRecord();
  console.log(lastRecord);

  // Close the database connection
  await db.close();
}

run();
