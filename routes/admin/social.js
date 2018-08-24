"use strict";
const express = require("express");
const router = express.Router();
const path = require("path");
const normalizedPath = path.join(__dirname, "./");
// const multer = require('multer');
// const upload = multer({ dest: 'public/images/social/' });
const config = require("./social.config");
const utils = require("../../lib/utils");
const merge = require("merge");
const Database = require("../../lib/data/database");

let database = new Database("social");

router.get("/", (req, res, next) => {
	try {
		let resdata = {};
		return database
			.open()
			.then(() => {
				console.log("networks all");
				return database.tables.networks.all();
			})
			.then(data => {
				resdata.networks = data;
				console.log("accounts all");
				return database.tables.accounts.all();
			})
			.then(data => {
				resdata.accounts = data;
				return res.render("social/index", {
					data: resdata,
					layout: "material",
					page: { title: "SOCIAL" }
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

router.post("/network", (req, res, next) => {
	try {
		database
			.open()
			.then(() => {
				return database.tables.networks.add({
					name: req.body["name"],
					color: req.body["fgcolor"],
					background: req.body["bgcolor"],
					background2: req.body["bgcolor2"],
					image: req.body["image"]
				});
			})
			.then(data => {
				return res.redirect("/admin/social");
			})
			.then(() => {
				return database.close();
			})
			.catch(err => {
				return next(err);
			});
	} catch (e) {
		return next(e);
	}
});

router.get("/account/:id/enabled/:enabled", (req, res, next) => {
	try {
		let enabled = req.params.enabled === "true" || req.params.enabled === "1" ? true : false;
		console.log("enabled: " + enabled);
		return database
			.open()
			.then(() => {
				return database.tables.accounts.update({
					id: req.params.id,
					enabled: enabled
				});
			})
			.then((data) => {
				return res.json(data);
			})
			.then(() => {
				return database.close();
			})
			.catch(err => {
				return next(err);
			});

	} catch (e) {
		return next(e);
	}
});

router.post("/account", (req, res, next) => {
	console.log(req.body);
	let netid = parseInt(req.body.network || "0");
	let enabled = parseInt(req.body.enabled || "0") === 1;

	try {
		database
			.open()
			.then(() => {
				return database.tables.accounts.add({
					network_id: netid,
					name: req.body.name,
					enabled: enabled
				});
			})
			.then(data => {
				return res.redirect("/admin/social");
			})
			.then(() => {
				return database.close();
			})
			.catch(err => {
				return next(err);
			});
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
