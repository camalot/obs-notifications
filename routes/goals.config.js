'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	goals: {
		route: ['/goal']
	}
};

module.exports = merge(xconfig, config);
