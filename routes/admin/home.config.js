'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'admin/home': {
		route: ['/admin', '/admin/home']
	}
};

module.exports = merge(xconfig, config);
