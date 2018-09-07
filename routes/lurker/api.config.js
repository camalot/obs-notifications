'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	"lurker/api": {
		route: ['/lurker/api']
	}
};

module.exports = merge(xconfig, config);
