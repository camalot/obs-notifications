'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	"admin-social": {
		route: ['/admin/social']
	}
};

module.exports = merge(xconfig, config);
