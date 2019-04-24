'use strict';
const express = require('express');
const router = express.Router();
const config = require('../subscribers.config');
const utils = require('../../lib/utils');
const merge = require('merge');

router.get("/overlay", (req, res, next) => {
	return res.render("chatbot/caster/overlay", {layout: 'chatbot/layout'});
});

router.get("/settings", (req, res, next) => {
	return res.render("chatbot/caster/scripts", {
		data: config.chatbot.caster,
		layout: null
	});
});

module.exports = router;
