'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	followers: {
		route: '/follower'
	}
};

module.exports = merge(xconfig, config);
