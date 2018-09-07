'use strict';

const xconfig = require('../../routes/obs.config');
const merge = require('merge');

let config = {
	'admin/obs': {
		route: ['/admin/obs']
	}
};

module.exports = merge(xconfig, config);
