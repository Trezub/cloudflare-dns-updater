var Service = require('node-windows').Service;
var svc = new Service({
    name: 'Cloudflare Updater',
    description: 'Cloudflare dynamic dns updater client',
    script: __dirname + '\\app.js'
});
svc.on('install', function () {
    svc.start();
});
svc.install();