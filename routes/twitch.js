'use strict';
const express = require('express');
const router = express.Router();
const config = require('./subscribers.config');
const utils = require('../lib/utils');
const merge = require('merge');

router.get("/", (req, res, next) => {
	return res.render("twitch-embed", {
		data: {
			channel: "darthminos",
			theme: "dark",
			allowfullscreen: true,
			chat: "default",
			"font-size": "small",
			height: "100%",
			width: "100%"
		}
	});
});

module.exports = router;
