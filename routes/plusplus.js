'use strict';
const express = require('express');
const router = express.Router();
const config = require('./plusplus.config');
const utils = require('../lib/utils');
const merge = require('merge');


const Database = require("../lib/data/database");
let database = new Database("plusplus");

router.get("/", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.allTextItems();
			})
			.then(data => {
				return res.json(data);
			})
			.then(() => {
				return database.close();
			})
			.catch((err) => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.get("/:id", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.points(req.params.id);
			})
			.then(data => {
				return res.json(data);
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


router.put("/:text?/:user?", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.add({ text: (req.body.text || req.params.text), user: (req.params.user || req.body.user) });
			})
			.then(data => {
				return res.json(data);
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


router.delete("/:text?/:user?", (req, res, next) => {
	try {
		database.open()
			.then(() => {
				return database.tables.history.subtract({ text: (req.body.text || req.params.text), user: (req.params.user || req.body.user) });
			})
			.then(data => {
				return res.json(data);
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
