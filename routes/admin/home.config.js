'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	adminhome: {
		route: ['/admin/']
	}
};

module.exports = merge(xconfig, config);
