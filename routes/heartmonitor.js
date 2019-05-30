'use strict';
const express = require('express');
const router = express.Router();
const config = require('./heartmonitor.config');
const merge = require('merge');


router.get("/bpm", (req, res, next) => {
	return res.render("heartmonitor/bpm", {layout: "heartmonitor/layout"});
});
router.get("/ecg", (req, res, next) => {
	return res.render("heartmonitor/ecg", { layout: "heartmonitor/layout" });
});
module.exports = router;
