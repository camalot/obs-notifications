'use strict';
const express = require('express');
const router = express.Router();
const config = require('./home.config');
const utils = require('../lib/utils');
const merge = require('merge');
const streamlabels = utils.streamlabels;


router.get("/followers", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_followers.txt`).then((data) => {
		res.render("index", { data: data });
	}).catch((err) => {
		throw err;
	});
});

router.get("/subscribers", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_subscribers.txt`).then((data) => {
		res.render("index", { data: data });
	}).catch((err) => {
		throw err;
	});
});

router.get("/bits", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_cheerers.txt`).then((data) => {
		res.render("index", { data: data });
	}).catch((err) => {
		throw err;
	});
});

router.get("/donations", (req, res, next) => {
	streamlabels.read(`${config.slPath}\\session_donators.txt`).then((data) => {
		res.render("index", { data: data });
	}).catch((err) => {
		throw err;
	});
});


/*
	reads each of the most recent file from streamlabels.
	take each and build the list


	/mostrecent
*/

router.get("/recent", (req, res, next) => {
	streamlabels.recents().then((data) => {
		res.render("index", { data: data });
	}).catch((err) => {
		throw err;
	});
});

module.exports = router;
