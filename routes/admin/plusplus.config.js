'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'admin/plusplus': {
		route: ['/admin/plusplus']
	}
};

module.exports = merge(xconfig, config);
