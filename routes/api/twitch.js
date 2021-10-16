'use strict';
const express = require('express');
const router = express.Router();
const config = require('./twitch.config');
const http = require('http');

router.get("/channel/:user", (req, res, next) => {
	let http_req = http.get({
		hostname: "decapi.me",
		path: `/twitch/avatar/${req.params.user}`,
		method: 'get',
		protocol: "http:"
	}, (resp) => {
		let data = "";
		resp.on("data", (chunk) => {
			data += chunk;
		});
		resp.on("end", () => {
			return res.json(JSON.parse(`{ "logo": "${data}" }`));
		});
	});

	http_req.on("error", (err) => {
		return next(err);
	});
});

module.exports = router;
