'use strict';

module.exports = (on, config) => {

    if (config.env && config.env.baseUrl) {
        config.baseUrl = config.env.baseUrl;
    }

    on('task', {
        table(message) {
            console.table(message);
            return null;
        },
    });

    return config;
};
