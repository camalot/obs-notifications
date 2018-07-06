'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	recents: {
		route: ['/recent', "/recents"]
	}
};

module.exports = merge(xconfig, config);
