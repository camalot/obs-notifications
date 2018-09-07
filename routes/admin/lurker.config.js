'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'admin/lurker': {
		route: ['/admin/lurker']
	}
};

module.exports = merge(xconfig, config);
