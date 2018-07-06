'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	followers: {
		route: ['/follower', '/followers']
	}
};

module.exports = merge(xconfig, config);
