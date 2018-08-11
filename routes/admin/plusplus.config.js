'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	adminplusplus: {
		route: ['/admin/plusplus']
	}
};

module.exports = merge(xconfig, config);
