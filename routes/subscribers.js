'use strict';
const express = require('express');
const router = express.Router();
const config = require('./subscribers.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;

router.get("/", (req, res, next) => {
	streamlabels.read(`${config.slPath}/session_subscribers.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "subscriber" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
