"use strict";
const async = require("async");
const config = require("../../config");
const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();

// register the missing action
obs.registerRequest(["SetSourceRender"]);

function getSourceAliases() {
	return new Promise((resolve, reject) => {
		let keys = {};
		for (let x in config.obs.sources.aliases) {
			let item = config.obs.sources.aliases[x];
			if (item.advertise) {
				keys[x] = item;
			}
		}

		for(let x in keys) {
			delete keys[x].advertise;
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
		for (let x in config.obs.sources.aliases) {
			keys.push(x);
		}

		async.filter(
			keys,
			(key, done) => {
				return done(null, key === alias);
			},
			(err, results) => {
				console.log(err);
				if (err) {
					return reject(err);
				}
				let itemKey = results[0];
				if (results.length === 0 || !config.obs.sources.aliases[itemKey]) {
					return resolve(alias);
				}
				let item = config.obs.sources.aliases[itemKey];
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
				console.log(err);
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
				console.log(err);
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
				console.log(err);
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
				console.log(err);
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
			});
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
						console.log(source);
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
			.then(() => {
				obs.disconnect();
			})
			.catch(err => {
				console.log(err);
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
				console.log(err);
				return reject(err);
			});
	});
}

function setCurrentScene(name) {
	return new Promise((resolve, reject) => {
		return _connect()
			.then(() => {
				return obs.setCurrentScene({ "scene-name": name }).then(() => {
					return obs.getCurrentScene();
				});
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				console.log(err);
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
				console.log(err);
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
							return obs.setSourceRender({
								source: sourceName,
								render: render
							});
						})
						.then(data => {
							return resolve(data);
						})
						.catch(err => {
							console.log(err);
							return reject(err);
						});
				}, 500);
			})
			.catch(err => {
				console.log(err);
				return reject(err);
			});
	});
}

function _hideAllLinkedSources() {
	return new Promise((resolve, reject) => {
		let dataItems = [];
		return _connect()
			.then(() => {
				async.each(
					config.obs.sources,
					(sourceItem, done) => {
						try {
							console.log(sourceItem);
							obs
								.setSourceRender({ source: sourceItem, render: false })
								.then(data => {
									console.log(data);
									dataItems.push(data);
									done();
								})
								.catch(err => {
									done(err);
								});
						} catch (e) {
							done(e);
						}
					},
					err => {
						if (err) {
							console.log(err);
							return reject(err);
						} else {
							console.log("done");
							return resolve(dataItems);
						}
					}
				);
			})
			.catch(err => {
				console.log(err);
				return reject(err);
			});
	});
}

function _connect() {
	// return new Promise((resolve, reject) => {
		// if (!obs._connected) {
			return obs.connect({
				address: config.obs.host,
				password: config.obs.password || undefined
			});
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
	setCurrentScene: setCurrentScene,
	getCurrentScene: getCurrentScene,
	getSourceAliases: getSourceAliases,
	getSourceNameFromAlias: getSourceNameFromAlias,
	getSourceFromAlias: getSourceFromAlias
};
