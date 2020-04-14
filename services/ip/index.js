const axios = require('axios');

module.exports = {
    async get() {
        try {
            const response = await axios.get('https://api.ipify.org');
            return response.data;
        } catch {
            return null;
        }
    }
}