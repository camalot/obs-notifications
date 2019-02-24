"use strict";
const express = require("express");
const router = express.Router();
const config = require("./obs.config");
const utils = require("../lib/utils");
const obs = utils.obsstudio;

router.get("/commands/list", (req, res, next) => {
	obs.getSceneAliases(true)
		.then(data => {
			return new Promise((resolve, reject) => {
				let commands = [];
				for (let x in data) {
					if (data.hasOwnProperty(x)) {
						commands.push({
							name: x,
							level: data[x].level || 2
						});
					}
				}
				return resolve(commands);
			});
		}).then(data => {
			return new Promise((resolve, reject) => {
				obs.getSourceAliases(true)
				.then(newData => {
						let commands = [].concat(data);
						for (let x in newData) {
							if (newData.hasOwnProperty(x)) {
								commands.push({
									name: x,
									level: newData[x].level || 2
								});
							}
						}
						return resolve(commands);
					}).catch(err => {
						return next(err);
					});
			});
		}).then(data => {
			return res.json(data);
		}).catch(err => {
			return next(err);
		});
});

router.get("/scenes", (req, res, next) => {
	obs
		.getScenes()
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/scenes/aliases", (req, res, next) => {
	obs
		.getSceneAliases(true)
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/scenes/keys/:all?", (req, res, next) => {
	let all = (req.params.all || "false").toLowerCase() === "true" || false;
	obs
		.getSceneAliasKeys(all)
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.put("/scene/current/:name", (req, res, next) => {
	obs.setCurrentScene(req.params.name).then(data => {
		return res.json(data);
	}).catch(err => {
		console.error(err);
		return next(err);
	});
});

router.get("/sources", (req, res, next) => {
	obs
		.getSources("name", config.obs.sources.filter)
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/all", (req, res, next) => {
	obs
		.getSources("name", ".*")
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/filters/:name", (req, res, next) => {
	let name = req.params.name;
	return obs.getSourceFilters(name)
		.then((data) => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/aliases/:all?", (req, res, next) => {
	let all = (req.params.all || "false").toLowerCase() === "true" || false;
	obs
		.getSourceAliases(all)
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/keys/:all?", (req, res, next) => {
	let all = (req.params.all || "false").toLowerCase() === "true" || false;
	obs
		.getSourceAliases(all)
		.then(data => {
			let keys = [];
			for (let x in data) {
				keys.push(x);
			}
			return res.json(keys);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/alias/:alias/name", (req, res, next) => {
	obs
		.getSourceNameFromAlias(req.params.alias.trim().toLowerCase())
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

router.get("/sources/alias/:alias/", (req, res, next) => {
	obs
		.getSourceFromAlias(req.params.alias.trim().toLowerCase())
		.then(data => {
			return res.json(data);
		})
		.catch(err => {
			console.error(err);
			return next(err);
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
					return next(err);
				});
		})
		.catch(err => {
			console.error(err);
			return next(err);
		});
});

module.exports = router;
