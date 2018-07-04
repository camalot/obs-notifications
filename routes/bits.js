'use strict';
const express = require('express');
const router = express.Router();
const config = require('./bits.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;


router.get("/", (req, res, next) => {
	streamlabels.read(`${config.slPath}/session_cheerers.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "cheer" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
