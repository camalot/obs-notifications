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
					processItems(items).then((r) => {
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
		console.log("prcessItems");
		async.each(arr, (i, next) => {
			let currentItem = i;
			let r = /{{([a-z][a-z0-9_]+):([^}]+)}}/g;
			if (currentItem.match(r) ) {
				let matches = r.exec(currentItem);
				let action = matches[1];
				let args = matches[2].split(/,\s*/);
				console.log(`calling '${action}(${args.join(',')})'`);
				parser[action].apply(parentObject, args).then((v) => {
					currentItem = currentItem.replace(r, v);
					fullList.push(currentItem);
					next();
				}).catch( (e) => {
					console.error(e);
				});
			} else {
				fullList.push(currentItem);
				next();
			}
	
		}, (err) => {
			if (err) {
				console.log(err);
				reject(err);
			}
			resolve(fullList);
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
			console.log(config.groups.recents);
			async.each(config.groups.recents, (f, next) => {
				let path = `${config.slPath}/most_recent_${f.name}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					next();
				}).catch((e) => {
					next(e);
				});
			}, (err) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(fullList);
			});
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

function readGoals() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			async.each(config.groups.goals, (f, next) => {
				let path = `${config.slPath}/${f}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					next();
				}).catch((e) => {
					next(e);
				});
			}, (err) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(fullList);
			});
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}

function readCustom(id) {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			async.each(config.groups.custom[id], (f, next) => {
				let path = `${config.slPath}/${f}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList = arrayUtil.concat(fullList, d);
					}
					next();
				}).catch((e) => {
					next(e);
				});
			}, (err) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(fullList);
			})
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = {
	read: read,
	recents: readRecents,
	goals: readGoals,
	custom: readCustom
};
