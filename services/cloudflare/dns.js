const api = require('./api');

module.exports = {
    async get(zoneID, name) {
        try {
            const response = await api.get(`zones/${zoneID}/dns_records`);
            const entry = response.data.result && response.data.result.find(entry => entry.name === name);
            return entry;
        } catch (err) {
            console.error(`Error listing DNS entries for zone ${zoneID}: ${err}`);
            if (err.response.data && err.response.data.errors) {
                err.response.data.errors.forEach(({ message }) => console.error(message));
            }
        }
    },
    async update({id, type, name, ttl, zone_id}, newAdress) {
        try {
            const response = await api.put(`/zones/${zone_id}/dns_records/${id}`, {
                type,
                name,
                ttl,
                content: newAdress,
            });
            return response.data.success === true;
        } catch (err) {
            console.error('Error updating DNS entry: ' + err);
            if (err.response.data && err.response.data.errors) {
                err.response.data.errors.forEach(({ message }) => console.error(message));
            }
            return false;
        }
    }
}