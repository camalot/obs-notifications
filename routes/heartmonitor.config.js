'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	hms: {
		route: ['/hms', '/heartmonitor']
	}
};

module.exports = merge(xconfig, config);
