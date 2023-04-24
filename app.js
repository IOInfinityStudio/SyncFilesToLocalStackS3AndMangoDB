const Koa = require('koa');
const MangoDB = require('./services/MangoDB');
const S3Storage = require('./services/S3Storage')
const app = new Koa();
const mangodb = new MangoDB("fake_users.json");

app.use(async (ctx, next) => {
    if (ctx.path === '/users/mongodb') {
        await mangodb.connect();
        const latestRecord = await mangodb.getLatestRecord();
        await mangodb.close();
        ctx.body = latestRecord;
    }
    else {
        ctx.throw(404, `Not Found: ${ctx.path}`);
    }
    await next();
});

// start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});