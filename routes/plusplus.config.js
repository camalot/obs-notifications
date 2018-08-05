'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	plusplus: {
		route: ['/plusplus']
	}
};

module.exports = merge(xconfig, config);
