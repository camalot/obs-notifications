'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	bits: {
		route: ['/bit', '/cheer', '/cheers']
	}
};

module.exports = merge(xconfig, config);
