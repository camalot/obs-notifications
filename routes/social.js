'use strict';
const express = require('express');
const router = express.Router();
const config = require('./social.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;

router.get("/:position(left|right)?/", (req, res, next) => {
	let position = (req.params.position || 'left').toLowerCase();
	position = position !== "left" && position !== "right" ? "left" : position;
	res.render("social", {
		config: config,
		layout: "social-layout", 
		position: position
	});
});


router.get("/stylesheet", (req, res, next) => {
	res.header("Content-Type", "text/css");
	res.render("social-stylesheet", { config: config, layout: null });
});


module.exports = router;
