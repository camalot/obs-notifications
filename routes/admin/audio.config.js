'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	'admin/audio': {
		route: ['/admin/audio']
	}
};

module.exports = merge(xconfig, config);
