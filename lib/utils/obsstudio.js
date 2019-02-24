"use strict";
const async = require("async");
const config = require("../../config");
const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();

// register the missing action
obs.registerRequest(["SetSourceRender"]);
obs.registerRequest(["GetSourceFilters"]);

function getSourceAliases(all) {
	return new Promise((resolve, reject) => {
		let keys = {};
		let sources = config.obs.sources.aliases;
		for (let x in sources) {
			if (sources.hasOwnProperty(x)) {

				let item = sources[x];
				if (item.advertise || all) {
					keys[x] = {
						name: item.name,
						length: item.length,
						level: item.level
					};
				}
			}
		}
		return resolve(keys);
	});
}

function getSourceNameFromAlias(alias) {
	return new Promise((resolve, reject) => {
		return getSourceFromAlias(alias)
			.then(data => {
				if (typeof data === "string" || data === null) {
					return resolve(alias);
				} else {
					if (typeof data.name === "string") {
						return resolve(data.name);
					} else {
						return resolve(
							data.name[Math.floor(Math.random() * data.name.length)]
						);
					}
				}
			})
			.catch(err => {
				return reject(err);
			});
	});
}

function getSourceFromAlias(alias) {
	return new Promise((resolve, reject) => {
		let keys = [];
		let sources = config.obs.sources.aliases;
		for (let x in sources) {
			if (sources.hasOwnProperty(x)) {
				keys.push(x);
			}
		}

		async.filter(
			keys,
			(key, done) => {
				return done(null, key === alias);
			},
			(err, results) => {
				if (err) {
					return reject(err);
				}
				let itemKey = results[0];
				if (results.length === 0 || !sources[itemKey]) {
					return resolve(alias);
				}
				let item = sources[itemKey];
				return resolve(item);
			}
		);
	});
}

function getTransitions() {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getTransitionList();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function getCurrentTransition() {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getCurrentTransition();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function setCurrentTransition(name) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.setCurrentTransition({ "transition-name": name });
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function getCurrentTransitionDuration() {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getTransitionDuration();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function setCurrentTransitionDuration(duration = 0) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.setTransitionDuration({ duration: duration });
			})
			.then(() => {
				return getCurrentTransition();
			}).catch(err => {
				return reject(err);
			});
	});
}

function getSceneAliases(all) {
	return new Promise((resolve, reject) => {
		try {
			let keys = {};
			let scenes = config.obs.scenes.aliases;
			for (let x in scenes) {
				if (scenes.hasOwnProperty(x)) {
					let item = scenes[x];
					if(item.advertise || all) {
						keys[x] = {
							name: item.name,
							level: item.level
						};
					}
				}
			}
			return resolve(keys);
		} catch (err) {
			return reject(err);
		}
	});
}

function getSceneAliasKeys(all) {
	return new Promise((resolve, reject) => {
		try {
			let keys = [];
			let scenes = config.obs.scenes.aliases;
			for (let x in scenes) {
				if (scenes.hasOwnProperty(x)) {
					let item = scenes[x];
					if(item.advertise || all) {
						keys.push(x);
					}
				}
			}
			return resolve(keys);
		} catch (err) {
			return reject(err);
		}
	});
}

function getSourceSettings(name) {

}

function getSourceFilters(source) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getSourceFilters({ sourceName: source });
			})
			.then((data) => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			})
	});
}

// by default, matches the name to the config filter.
function getSources(field = "name", filter = config.obs.sources.filter) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getSourcesList();
			})
			.then(data => {
				let pattern = new RegExp(filter, "i");
				async.filter(
					data.sources,
					(source, done) => {
						return done(null, pattern.test(source[field]));
					},
					(err, results) => {
						if (err) {
							return reject(err);
						}
						return resolve(results);
					}
				);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function getScenes() {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getSceneList();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function setCurrentScene(name) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return getSceneAliases(true);
			}).then(data => {
				return new Promise((resolve, reject) => {
					let sceneName = name;
					if (data.hasOwnProperty(name)) {
						sceneName = data[name].name;
					}
					console.log("scene found as: " + sceneName);
					resolve(sceneName);
				});
			}).then(sceneName => {
				console.log("set current scene: " + sceneName);
				return obs.setCurrentScene({ "scene-name": sceneName });
			}).then(() => {
				return obs.getCurrentScene();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function getCurrentScene() {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.getCurrentScene();
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function setSourceRender(source, render) {
	let sourceName = config.obs.sources[source];
	if (sourceName == null) {
		sourceName = source;
	}
	return new Promise((resolve, reject) => {
		return _hideAllLinkedSources()
			.then(data => {
				setTimeout(() => {
					return _connect()
						.then(() => {
							console.log(sourceName);
							return obs.setSourceRender({
								source: sourceName,
								render: render
							});
						})
						.then(data => {
							return resolve(data);
						})
						.catch(err => {
							console.error(err);
							return reject(err);
						});
				}, 500);
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function _hideAllLinkedSources() {
	return new Promise((resolve, reject) => {
		let dataItems = [];
		let s = null;
		return getSources()
			.then(sources => {
				s = sources;
				return _connect();
			})
			.then(() => {
				async.each(
					s,
					(sourceItem, done) => {
						try {
							obs
								.setSourceRender({ source: sourceItem.name, render: false })
								.then(data => {
									dataItems.push(data);
									return done();
								})
								.catch(err => {
									console.error("------------------------------");
									console.error(err);
									console.error(sourceItem);
									console.error("------------------------------");

									return done();
								});
						} catch (e) {
							return done();
						}
					},
					err => {
						if (err) {
							console.error(err);
							return reject(err);
						} else {
							return resolve(dataItems);
						}
					});
			})
			.catch(err => {
				console.error(err);
				return reject(err);
			});
	});
}

function _connect() {
	// return new Promise((resolve, reject) => {
	// if (!obs._connected) {
	try {
		return obs
			.connect({
				address: config.obs.host,
				password: config.obs.password || undefined
			})
			.catch(e => {
				throw e;
			});
	} catch (err) {
		throw err;
	}
	// } else {
	// 	return resolve();
	// }
	// });
}

module.exports = {
	getSources: getSources,
	setSourceRender: setSourceRender,
	getTransitions: getTransitions,
	getCurrentTransition: getCurrentTransition,
	setCurrentTransition: setCurrentTransition,
	getCurrentTransitionDuration: getCurrentTransitionDuration,
	setCurrentTransitionDuration: setCurrentTransitionDuration,
	getScenes: getScenes,
	getSceneAliases: getSceneAliases,
	getSceneAliasKeys: getSceneAliasKeys,
	setCurrentScene: setCurrentScene,
	getCurrentScene: getCurrentScene,
	getSourceAliases: getSourceAliases,
	getSourceNameFromAlias: getSourceNameFromAlias,
	getSourceFromAlias: getSourceFromAlias,
	getSourceFilters: getSourceFilters
};
