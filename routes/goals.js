'use strict';
const express = require('express');
const router = express.Router();
const config = require('./goals.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;


router.get("/", (req, res, next) => {
	streamlabels.goals().then((data) => {
		res.render("index", { data: { items: data, type: "goals" }, config: config });
	}).catch((err) => {
		throw err;
	});
});
module.exports = router;
