'use strict';

const fs = require('fs');
const path = require('path');

const ip = require('./services/ip');

if (!fs.existsSync(path.join(__dirname, '.env'))) {
    console.error(`Can't load .env file.`);
    process.exit(-1);
}
require('dotenv').config(); // Loads .env file into process.env

const token = process.env.CLOUDFLARE_TOKEN;
const hostname = process.env.CLOUDFLARE_HOSTNAME;
const interval = Number(process.env.CLOUDFLARE_UPDATE_INTERVAL) || 60;

if (!token || !hostname) {
    console.error('Missing variables in .env file.');
    process.exit(-1);
}

const CloudFlareAPI = require('./services/cloudflare');

let lastIPAdress = '';
let dnsEntry;

async function checkIPChange() {
    const ipAddress = await ip.get();
    if (!ipAddress) {
        console.error(`Can't get public IP address.`);
        return false;
    }
    if (lastIPAdress !== ipAddress) {
        lastIPAdress = ipAddress;
        return true;
    }
    return false;
}

async function fetch() {
    if (await checkIPChange()) {
        if (!dnsEntry) {
            const zoneId = process.env.CLOUDFLARE_ZONE_ID ||  await CloudFlareAPI.zone.get(hostname);
            if (zoneId) {
                if (!(dnsEntry = await CloudFlareAPI.dns.get(zoneId, hostname))) {
                    return;
                }
            }
        }
        if (dnsEntry && await CloudFlareAPI.dns.update(dnsEntry, lastIPAdress)) {
            console.log('Updated: ' + lastIPAdress);
        }
        
    }
}

fetch();
setInterval(fetch, interval * 1000);

