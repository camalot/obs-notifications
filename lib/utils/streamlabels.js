'use strict';
const fs = require('fs');
const config = require("../../config");
const arrayUtil = require("./array");
const async = require("async");

function read(file) {
	return new Promise((resolve, reject) => {
		fs.exists(file, (exists) => {
			if (exists) {
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) {
						console.error(err);
						return reject(err);
					}
					let items = arrayUtil.clean((data || "").split(/,\s/gi));
					// process each item and "replace" the markup
					return processItems(items).then((r) => {
						return resolve(r);
					}).catch((err) => {
						console.error(err);
						return resolve([]);
					});
				});
			} else {
				return resolve([]);
			}
		});
	});
}

function processItems(arr) {
	let parentObject = this;
	return new Promise((resolve, reject) => {
		let fullList = [];
		return async.each(arr, (i, next) => {
			let currentItem = i;
			let r = /{{([a-z][a-z0-9_]+):([^}]+)}}/g;
			if (currentItem.match(r)) {
				let matches = r.exec(currentItem);
				let action = matches[1];
				let args = matches[2].split(/,\s*/);
				parser[action].apply(parentObject, args).then((v) => {
					currentItem = currentItem.replace(r, v);
					if (currentItem && currentItem !== "") {
						fullList.push(currentItem);
					} 
					return next();
				}).catch((e) => {
					console.error(e);
				});
			} else {
				if (currentItem && currentItem !== "") {
					fullList.push(currentItem);
				}
				return next();
			}

		}, (err) => {
			if (err) {
				console.error(err);
				return reject(err);
			}
			return resolve(fullList);
		});
	});
}


let parser = {
	label: (file) => {
		return read(`${config.slPath}/${file}.txt`);
	}
};

function readRecents() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			return async.each(config.groups.recents, (f, next) => {
				let path = `${config.slPath}/most_recent_${f.name}.txt`;
				return read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					return next();
				}).catch((e) => {
					return next(e);
				});
			}, (err) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				return resolve(fullList);
			});
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}

function readGoals() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			return async.each(config.groups.goals, (f, next) => {
				let path = `${config.slPath}/${f}.txt`;
				return read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					return next();
				}).catch((e) => {
					return next(e);
				});
			}, (err) => {
				if (err) {
					console.error(err);
					reject(err);
				}
				return resolve(fullList);
			});
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
}

function readCustom(id) {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			console.log(config.groups.custom[id]);
			return async.each(config.groups.custom[id], (f, next) => {
				let path = `${config.slPath}/${f}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					return next();
				}).catch((e) => {
					return next(e);
				});
			}, (err) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				return resolve(fullList);
			});
		} catch (err) {
			return reject(err);
		}
	});
}

module.exports = {
	read: read,
	recents: readRecents,
	goals: readGoals,
	custom: readCustom
};
