'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	"api/twitch": {
		route: ['/api/twitch'],
		clientID: process.env.APP_TWITCH_CLIENT_ID
	}
};

module.exports = merge(xconfig, config);
