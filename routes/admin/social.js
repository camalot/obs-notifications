"use strict";
const express = require("express");
const router = express.Router();
const path = require("path");
// const multer = require('multer');
// const upload = multer({ dest: 'public/images/social/' });
const config = require("./social.config");
const utils = require("../../lib/utils");
const merge = require("merge");
const Database = require("../../lib/data/database");
const async = require("async");

let database = new Database("social");

router.get("/", (req, res, next) => {
	try {
		let resdata = {};
		return database
			.open()
			.then(() => {
				return database.tables.settings.all();
			})
			.then((data) => {
				resdata.config = data;
				return database.tables.networks.all();
			})
			.then(data => {
				resdata.networks = data;
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
				console.error(err);
				return next(err);
			});

	} catch (e) {
		return next(e);
	}
});

router.post("/account", (req, res, next) => {
	let netid = parseInt(req.body.network || "0");
	let enabled = parseInt(req.body.enabled || "0") === 1;

	try {
		return database
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

router.post("/account/delete/:id", (req, res, next) => {
	try {
		let id = req.params.id;
		if(!id) {
			throw '"id" not passed to method';
		}
		return database
			.open()
			.then(() => {
				return database.tables.accounts.remove(id);
			})
			.then((data) => {
				if(data.id === id && data.deleted) {
					return res.redirect("/admin/social");
				}
				throw JSON.stringify(data);
			})
			.catch((err) => {
				return next(new Error(err));
			});
	} catch (err) {
		return next(err);
	}
});

router.post("/accounts/sort", (req, res, next) => {
	try {
		let data = req.body.data;
		if (!data) {
			throw 'Missing sort data in body.';
		}
		database.open()
			.then(() => {
				return new Promise((resolve, reject) => {
					async.each(data, function (info, done) {
						return database.tables.accounts.update(info)
							.then((d) => {
								return done();
							})
							.catch((err) => {
								console.error(err);
								return done(err);
							});
					}, (err) => {
						if (err) {
							console.error(err);
							return reject(err);
						}
						return resolve(data);
					});
				});
			})
			.then((rdata) => {
				return res.json(rdata);
			})
			.then(() => {
				return database.close();
			})
			.catch((err) => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (e) {
		console.error(e);
		return next(e);
	}
});

module.exports = router;
