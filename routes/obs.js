'use strict';
const express = require('express');
const router = express.Router();
const config = require('./obs.config');
const utils = require('../lib/utils');
const obs = utils.obsstudio;

router.get("/", (req, res, next) => {
	obs.getSources().then((data) => {
		res.render("index", { data: { items: data, type: "recents" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

router.get("/source/:source/:render", (req, res, next) => {
	let renderValue = req.params.render.trim().toLowerCase();
	obs.setSourceRender(req.params.source, renderValue === 'true' || renderValue === '1').then((data) => {
		console.log(data);
		res.render("index", { data: { items: data, type: "recents" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
