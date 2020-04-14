const api = require('axios').create({
    baseURL: 'https://api.cloudflare.com/client/v4/',
    headers: {
        authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    }
});
module.exports = api;