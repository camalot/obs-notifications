'use strict';
const express = require('express');
const router = express.Router();
const config = require('./api.config.js');

router.get("/settings", (req, res, next) => {
	return res.render("chatbot/scripts", {
		data: config.chatbot.settings,
		layout: null
	});
});

module.exports = router;
