'use strict';
const express = require('express');
const router = express.Router();
const config = require('./social.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;

router.get("/", (req, res, next) => {
	res.render("social", { config: config, layout: 'social-layout' });
});

module.exports = router;
