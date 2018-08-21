'use strict';
const express = require('express');
const router = express.Router();
const config = require('./social.config');
const utils = require('../lib/utils');

router.get("/:position(left|right)?/:animation(flip|fade)?/", (req, res, next) => {
	let position = (req.params.position || 'left').toLowerCase();
	let animation = (req.params.animation || 'fade').toLowerCase();
	position = position !== "left" && position !== "right" ? "left" : position;
	animation = animation !== 'flip' && animation !== 'fade' ? 'fade' : animation;
	res.render("social", {
		config: config,
		layout: "social-layout", 
		position: position,
		animation: animation
	});
});


router.get("/stylesheet", (req, res, next) => {
	res.header("Content-Type", "text/css");
	res.render("social-stylesheet", { config: config, layout: null });
});


module.exports = router;
