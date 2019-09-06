'use strict';
const express = require('express');
const router = express.Router();
const config = require('./twitch.config');
const https = require('https');

router.get("/channel/:user", (req, res, next) => {
	let http_req = https.get({
		hostname: "decapi.me",
		path: `/twitch/avatar/${req.params.user}`,
		method: 'get',
		protocol: "https:"
	}, (resp) => {
		let data = "";
		resp.on("data", (chunk) => {
			data += chunk;
		});
		resp.on("end", () => {
			return res.json({ logo: data });
		});
	});

	http_req.on("error", (err) => {
		return next(err);
	});
});

module.exports = router;
