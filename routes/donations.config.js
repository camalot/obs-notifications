'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	donations: {
		route: ['/donation', '/donations']
	}
};

module.exports = merge(xconfig, config);
