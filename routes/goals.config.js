'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	goals: {
		route: ['/goal', '/goals']
	}
};

module.exports = merge(xconfig, config);
