'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	obs: {
		route: ['/quotes']
	}
};

module.exports = merge(xconfig, config);
