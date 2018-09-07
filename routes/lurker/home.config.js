'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	"lurker/home": {
		route: ['/lurker/']
	}
};

module.exports = merge(xconfig, config);
