'use strict';
const express = require('express');
const router = express.Router();
const config = require('./donations.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;

router.get("/", (req, res, next) => {
	streamlabels.read(`${config.slPath}/session_donators.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "donation" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
