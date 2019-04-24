'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'chatbot/api': {
		route: ['/chatbot/api']
	}
};

module.exports = merge(xconfig, config);
