'use strict';
const express = require('express');
const router = express.Router();
const config = require('./home.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;



router.get("/custom/:id", (req, res, next) => {
	streamlabels.custom(req.params.id).then((data) => {
		res.render("index", { data: { items: data, type: "custom" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
