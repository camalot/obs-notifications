'use strict';

const xconfig = require('../../../config');
const merge = require('merge');

let config = require('../../../routes/social.config');

module.exports = merge(xconfig,config);
