'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	recents: {
		route: '/recent'
	}
};

module.exports = merge(xconfig, config);
