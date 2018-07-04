'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	subscribers: {
		route: ['/subscriber', '/subs', '/sub']
	}
};

module.exports = merge(xconfig, config);
