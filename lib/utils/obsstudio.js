'use strict';
const async = require('async');
const config = require('../../config');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
obs.registerRequest(["SetSourceRender"]);

function getSources() {
	return new Promise((resolve, reject) => {
		obs.connect({ address: config.obs.host })
			.then(() => {
				return obs.getSourcesList();
			})
			.then(data => {
				console.log(`${data.sources.length} Available Sources!`);
				data.sources.forEach(source => {
					console.log(`found: ${source.name} : ${source.typeId} : ${source.type}`);
				});

				return resolve(data.sources);
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

function setSourceRender(source, render) {
	let sourceName = config.obs.sources[source];
	if (sourceName == null) {
		sourceName = source;
	}
	return new Promise((resolve, reject) => {
		_hideAllSources().then((data) => {
			setTimeout(() => {
			console.log("hide complete");
			console.log(data);
			obs.connect({ address: config.obs.host })
				.then(() => {
					console.log("after connect 1");
					return obs.setSourceRender({ source: sourceName, render: render });
				})
				.then(data => {
					return resolve(data);
				})
				.then(() => {
					console.log("disconnect 1");
					obs.disconnect();
				})
				.catch(err => {
					console.log(err);
					return reject(err);
				});
			}, 500);

		}).catch(err => {
			console.log(err);
			return reject(err);
		});
	});

}

function _hideAllSources() {
	return new Promise((resolve, reject) => {
		let datas = [];
		obs.connect({ address: config.obs.host })
			.then(() => {
				console.log("after connect 2");
				async.each(config.obs.sources, (sourceItem, done) => {
					try {
						console.log(sourceItem);
						obs.setSourceRender({ source: sourceItem, render: false }).then((data) => {
							console.log(data);
							datas.push(data);
							done();
						}).catch(err => {
							done(err);
						});
					} catch (e) {
						done(e);
					}
				}, (err) => {
					if (err) {
						console.log(err);
						return reject(err);
					} else {
						console.log("done");
						return resolve(datas);
					}
				});
			})
			.then(() => {
				console.log("disconnect 2");
				obs.disconnect();
			})
			.catch(err => {
				console.log(err);
				return reject(err);
			});
	});

}

module.exports = {
	getSources: getSources,
	setSourceRender: setSourceRender
};
