'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	donations: {
		route: ['/donation']
	}
};

module.exports = merge(xconfig, config);
