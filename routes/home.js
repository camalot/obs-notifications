'use strict';
const express = require('express');
const router = express.Router();
const config = require('./home.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;


router.get("/followers", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_followers.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "follow" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

router.get("/subscribers", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_subscribers.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "subscriber" }, config: config});
	}).catch((err) => {
		throw err;
	});
});

router.get("/bits", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_cheerers.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "cheer" }, config: config});
	}).catch((err) => {
		throw err;
	});
});

router.get("/donations", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_donators.txt`).then((data) => {
		res.render("index", { data: { items: data, type: "donation" }, config: config});
	}).catch((err) => {
		throw err;
	});
});

router.get("/recents", (req, res, next) => {
	streamlabels.recents().then((data) => {
		res.render("index", { data: { items: data, type: "recents" }, config: config});
	}).catch((err) => {
		throw err;
	});
});

router.get("/goals", (req, res, next) => {
	streamlabels.goals().then((data) => {
		res.render("index", { data: { items: data, type: "goals" }, config: config});
	}).catch((err) => {
		throw err;
	});
});

router.get("/custom/:id", (req, res, next) => {
	streamlabels.custom(req.params.id).then((data) => {
		res.render("index", { data: { items: data, type: "custom" }, config: config });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
