'use strict';
const express = require('express');
const router = express.Router();
const config = require('./plusplus.config');
const utils = require('../../lib/utils');
const merge = require('merge');


const Database = require("../../lib/data/database");
let database = new Database("plusplus");

router.get("/", (req, res, next) => {
	return res.json({});
});

router.delete("/", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.remove({ text: (req.body.text) });
			})
			.then(() => {
				return database.close();
			})
			.catch((err) => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		return next(err);
	}
});

router.delete("/reset", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.truncate();
			})
			.then(() => {
				return database.close();
			})
			.catch((err) => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		return next(err);
	}
});


module.exports = router;
