'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'chatbot/medal': {
		route: ['/chatbot/medal']
	}
};

module.exports = merge(xconfig, config);
