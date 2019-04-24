'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'chatbot/caster': {
		route: ['/chatbot/caster']
	}
};

module.exports = merge(xconfig, config);
