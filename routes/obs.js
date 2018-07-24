"use strict";
const express = require("express");
const router = express.Router();
const config = require("./obs.config");
const utils = require("../lib/utils");
const obs = utils.obsstudio;

router.get("/scenes", (req, res, next) => {
	obs
		.getScenes()
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.get("/sources", (req, res, next) => {
	obs
		.getSources("name", config.obs.sources.filter)
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.get("/sources/aliases", (req, res, next) => {
	obs
		.getSourceAliases()
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.get("/sources/aliases/keys", (req, res, next) => {
	obs
		.getSourceAliases()
		.then(data => {
			let keys = [];
			for (let x in data) {
				keys.push(x);
			}
			res.json(keys);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.get("/sources/alias/:alias/name", (req, res, next) => {
	obs
		.getSourceNameFromAlias(req.params.alias.trim().toLowerCase())
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.get("/sources/alias/:alias/", (req, res, next) => {
	obs
		.getSourceFromAlias(req.params.alias.trim().toLowerCase())
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

router.put("/source/:source/visible/:render", (req, res, next) => {
	let renderValue = req.params.render.trim().toLowerCase();
	let alias = req.params.source.trim().toLowerCase();
	return obs
		.getSourceNameFromAlias(alias)
		.then(name => {
			obs
				.setSourceRender(name, renderValue === "true" || renderValue === "1")
				.then(data => {
					return res.json(data);
				})
				.catch(err => {
					console.error(err);
					throw err;
				});
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
});

module.exports = router;
