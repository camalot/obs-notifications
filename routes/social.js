'use strict';

const path = require("path");
const normalizedPath = path.join(__dirname, "./");

const express = require('express');
const router = express.Router();
const config = require('./social.config');
const utils = require('../lib/utils');

const Database = require("../lib/data/database");
let database = new Database("social");

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

router.get("/v2/:position(left|right)?/:animation(flip|fade)?/", (req, res, next) => {
	try {
		let position = (req.params.position || 'left').toLowerCase();
		let animation = (req.params.animation || 'fade').toLowerCase();
		position = position !== "left" && position !== "right" ? "left" : position;
		animation = animation !== 'flip' && animation !== 'fade' ? 'fade' : animation;
		database
			.open()
			.then(() => {
				return database.tables.accounts.all();
			})
			.then(data => {
				return res.render("social/overlay", {
					accounts: data,
					config: config,
					layout: "social/overlay-layout",
					position: position,
					animation: animation
				});
			})
			.then(() => {
				console.log("close database");
				return database.close();
			})
			.catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (e) {
		return next(e);
	}
});


module.exports = router;
