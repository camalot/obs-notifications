"use strict";
const path = require("path");
const normalizedPath = path.join(__dirname, "./");

const express = require("express");
const router = express.Router();
const config = require("./social.config");
const utils = require("../lib/utils");
const subscriber = utils.subscriber;

const Database = require("../lib/data/database");

router.get("/stylesheet", (req, res, next) => {
	try {
		let database = new Database("social");
		res.header("Content-Type", "text/css");
		let networks = [];
		return database
			.open()
			.then(() => {
				return database.tables.networks.all();
			})
			.then((data) => {
				networks = data;
				return database.tables.settings.get('custom_css');
			})
			.then(data => {
				return res.render("social/stylesheet", {
					networks: networks,
					config: config,
					custom_css: data,
					layout: null
				});
			})
			.then(() => {
				return database.close();
			})
			.catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		return next(err);
	}
});
router.get(
	`/:position(left|right)?/:animation(${Object.keys(config["admin/social"].animations).join("|")})?/`,
	(req, res, next) => {
		try {
			let position = (req.params.position || "left").toLowerCase();
			let animation = (req.params.animation || "fade").toLowerCase();
			position =
				position !== "left" && position !== "right" ? "left" : position;
			animation = /f(lip|ade)|(v|h)(bounce|slide)/gi.test(animation) ? animation : "fade";
				let database = new Database("social");
				let settings = null;
				return database
					.open()
					.then(() => {
						return database.tables.settings.all();
					})
					.then(data => {
						settings = data || {};
						return database.tables.accounts.all();
					})
					.then(data => {
						console.log("render with all data");
						return res.render("social/overlay", {
							accounts: data,
							config: settings,
							layout: "social/overlay-layout",
							position: position,
							animation: animation
						});
					})
					.then(() => {
						return database.close();
					})
					.catch(err => {
						console.error(err);
						return next(new Error(err));
					});
				
		} catch (e) {
			return next(e);
		}
	}
);

module.exports = router;
