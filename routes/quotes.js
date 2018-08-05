"use strict";
const express = require("express");
const router = express.Router();
const config = require("./quotes.config");
const utils = require("../lib/utils");

const Database = require("../lib/data/database");
let database = new Database("quotes");
const defaultCategory = "[DEFAULT]";

router.get("/list/:category?", (req, res, next) => {
	let cat = req.params.category || defaultCategory;
	cat = cat === "" || cat === "null" ? defaultCategory : cat;
	try {
		return database.open()
			.then(() => {
				return database.tables.quotes.all(cat);
			}).then(data => {
				return res.json(data);
			}).then(() => {
				return database.close();
			}).catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.get("/get/:id", (req, res, next) => {
	try {
		let rowid = parseInt(req.params.id);
		if (isNaN(rowid) || rowid === Infinity) {
			return next(new Error("Invalid item id"));
		}
		return database.open()
			.then(() => {
				return database.tables.quotes.get(rowid);
			})
			.then((data) => {
				return res.json(data);
			})
			.then(() => {
				return database.close();
			})
			.catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}

});

router.get("/random/:category?", (req, res, next) => {

	let cat = (req.params.category || defaultCategory);
	cat = cat === "" || cat === "null" ? defaultCategory : cat;
	try {
		return database.open()
			.then(() => {
				console.log(`random: ${cat}`);
				return database.tables.quotes.random(cat);
			}).then(data => {
				console.log(`data: ${data}`);
				return res.json(data);
			}).then(() => {
				console.log(`close`);
				return database.close();
			}).catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.get("/categories", (req, res, next) => {
	try {
		return database.open()
			.then(() => {
				return database.tables.categories.all();
			}).then((data) => {
				return res.json(data);
			}).then(() => {
				return database.close();
			}).catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.post("/:category?", (req, res, next) => {
	let cat = req.params.category || defaultCategory;
	cat = cat === "" || cat === "null" ? defaultCategory : cat;
	try {
		return database.open()
			.then(() => {
				return database.tables.quotes.add({
					category: cat,
					text: req.body.text,
					user: req.body.user
				});
			}).then((data) => {
				return res.json(data);
			}).then(() => {
				return database.close();
			}).catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.delete("/:id", (req, res, next) => {
	try {
		let rowid = parseInt(req.params.id);
		if (isNaN(rowid) || rowid === Infinity) {
			return next(new Error("Invalid item id"));
		}
		return database.open()
			.then(() => {
				return database.tables.quotes.remove(rowid);
			}).then(() => {
				return res.json({ status: "ok" });
			})
			.then(() => {
				return database.close();
			}).catch(err => {
				console.error(err);
				return next(new Error(err));
			});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

module.exports = router;
