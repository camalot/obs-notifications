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
						console.log("error:");
						console.error(err);
						reject(err);
					}
					let items = arrayUtil.clean((data || "").split(/,\s/gi));
					resolve(items);
				});
			} else {
				reject(new Error(`File '${file}' was not found.`));
			}
		});
	});
}

function readRecents() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			async.each(config.recents, (f, next) => {
				let path = `${config.slPath}\\most_recent_${f.name}.txt`;
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
			async.each(config.goals, (f, next) => {
				let path = `${config.slPath}\\${f}.txt`;
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
			async.each(config.custom[id], (f, next) => {
				let path = `${config.slPath}\\${f}.txt`;
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
