const api = require('./api');

module.exports = {
    async get(name) {
        try {
            const response = await api.get('/zones');
            const zone = response.data.result && response.data.result.find(zone => name.endsWith(zone.name));
            if (zone) {
                return zone.id;
            }
        } catch (err) {
            console.error('Error lising zones: ' + err);
            if (err.response.data && err.response.data.errors) {
                err.response.data.errors.forEach(({ message }) => console.error(message));
            }
        }
    }
}