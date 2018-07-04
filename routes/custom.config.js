'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	custom: {
		route: ['/custom' ]
	}
};

module.exports = merge(xconfig, config);
