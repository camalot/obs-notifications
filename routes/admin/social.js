'use strict';
const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'public/images/social/' });
const config = require('./social.config');
const utils = require('../../lib/utils');
const merge = require('merge');


const Database = require("../../lib/data/database");
let database = new Database("social");

router.get("/", (req, res, next) => {
	try {
		let resdata = {};
		database.open()
			.then(() => {
				return database.tables.networks.all();
			})
			.then((data) => {
				resdata.networks = data;
				return database.tables.accounts.all();
				
			})
			.then((data) => {
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
			.catch((err) => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (e) {
		return next(e);
	}
});


router.post("/network", (req, res, next) => {
	try {
		console.log(req.body);
		database.open()
			.then(() => {
				return database.tables.networks.add({
					name: req.body['name'],
					color: req.body['fgcolor'],
					background: req.body['bgcolor'],
					background2: req.body['bgcolor2'],
					image: req.body['image']
				});
			})
			.then((data) => {
				return res.redirect("/admin/social");
			})
			.then(() => {
				return database.close();
			})
			.catch((err) => {
				return next(err);
			});

	} catch (e) {
		return next(e);
	}
});

module.exports = router;
