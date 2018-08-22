"use strict";

let _name = "networks";
let _database = null;
const config = require("./config");
const color = require("../../utils").color;
const async = require("async");

const DEFAULT = config.social.defaults.DEFAULT;
console.log(JSON.stringify(DEFAULT));
let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (networks:create)");
			}
			_database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
					"created NUMERIC NOT NULL, name TEXT NOT NULL UNIQUE, image TEXT NOT NULL, color NUMERIC NOT NULL, " +
					"background NUMERIC NOT NULL, background2 NUMERIC, system NUMERIC NOT NULL DEFAULT(0))",
				err => {
					if (err) {
						return reject(err);
					}
					console.log("create database complete");
					return _insertDefaultNetworks()
						.then(() => {
							console.log("after insert: resolve");
							return resolve();
						})
						.catch(err => {
							console.log("after insert: reject");
							return reject(err);
						});
				}
			);

			console.log("done create");
		} catch (err) {
			return reject(err);
		}
	});
};

let _insertDefaultNetworks = () => {
	return new Promise((resolve, reject) => {
		let utc = _database.utcNow();

		console.log("process default networks");
		async.each(
			Object.keys(config.social.defaults),
			(network, next) => {
				if (network === "DEFAULT") {
					return next();
				}
				_database.sql.each(`SELECT rowid as id FROM ${_name} where name = $name LIMIT 1`, { $name: network }, (err, row) => {
						if (err) {
							return next(err);
						}
					}, (err, rows) => {
						if (err) {
							return next(err);
						}
						if (rows === 0) {
							console.log(`processing: ${network}`);
							let n = config.social.defaults[network];
							let bgColor = n.background || DEFAULT.background || "#222";
							let bgColor2 = n.background2 || color.adjust(bgColor, DEFAULT.adjustment);

							_database.sql.run(
								"INSERT INTO networks (created, name, image, color, background, background2, system) VALUES ($created, $name, $image, $color, $background, $background2, $system)",
								{
									$created: utc,
									$name: network,
									$image: n.image || DEFAULT.image,
									$color: n.color || DEFAULT.color || "#fff",
									$background: bgColor,
									$background2: bgColor2,
									$system: 1
								},
								err => {
									if (err) {
										console.error(err);
										return next(err);
									}
									console.log("done inserting record");
									return next();
								}
							);
						} else {
							console.log("record exists");
							return next();
						}
					});
			},
			err => {
				if (err) {
					console.log("reject");
					return reject(err);
				}
				console.log("resolve");
				return resolve();
			}
		);
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:all)");
		}

		let data = [];
		_database.sql.each(`SELECT rowid AS id, created, name, image, color, background, background2, system FROM ${_name}`, {}, (err, row) => {
				if (err) {
					return reject(err);
				}
				data.push({
					id: row.id,
					created: row.created,
					name: row.name,
					image: row.image,
					background: row.background,
					background2: row.background2,
					color: row.color,
					system: row.system
				});
			}, (err, rows) => {
				if (err) {
					return reject(err);
				}
				console.log("data:" + JSON.stringify(data));
				return resolve(data);
			});
	});
};

let add = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let get = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

module.exports = db => {
	try {
		_database = db;
		return {
			name: _name,
			create: create,
			all: all,
			add: add,
			remove: remove,
			get: get,
			database: _database
		};
	} catch (err) {
		throw err;
	}
};