"use strict";
const async = require('async');
let _name = "settings";
let _database = null;

const DEFAULTS = {
	bgadjustment: 25,
	pause: 0,
	delay: 20
};

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (settings:create)");
			}
			return _database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
				"created NUMERIC NOT NULL, key TEXT NOT NULL UNIQUE, value TEXT);",
				err => {
					console.log("create done");
					if (err) {
						console.error(err);
						return reject(err);
					}
					console.log(`create database table ${_name} complete`);
					_insertDefaults().then(() => {
						return resolve();
					}).catch((err) => {
						return reject(err);
					});

					return resolve();
				}
			);
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
};

let _insertDefaults = () => {
	return new Promise((resolve, reject) => {
		try {
			async.each(Object.keys(DEFAULTS), (key, next) => {
				let value = DEFAULTS[key] || null;
				_database.sql.run(`INSERT INTO ${_name} (created, key, value) SELECT $key, $value WHERE NOT EXISTS (SELECT 1 FROM ${_name} WHERE key = $key);`, 
					{ $key: key, $value: value }, (err) => {
					if(err) {
						return next(err);
					}
					return next();
				});
			}, (err) => {
				if(err) {
					return reject(err);
				}
				return resolve();
			});
		} catch (err) {
			return reject(err);
		}
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (quotes:all)");
			}

			let data = [];
			_database.sql.each(
				`SELECT rowid AS id, created, key, value FROM ${_name} ORDER BY key`,
				{},
				(err, row) => {
					if (err) {
						return reject(err);
					}
					data.push({
						id: row.id,
						created: row.created,
						key: row.key,
						value: row.value
					});
				},
				(err, rows) => {
					if (err) {
						return reject(err);
					}
					return resolve(data);
				}
			);
		} catch (e) {
			return reject(e);
		}
	});
};

let add = (key, value) => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let update = (key, newValue) => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = (key) => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let get = (key) => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

module.exports = (db) => {
	try {
		_database = db;
		return {
			name: _name,
			create: create,
			all: all,
			add: add,
			remove: remove,
			get: get,
			update: update,
			database: _database,
			DEFAULTS: DEFAULTS
		};
	} catch (err) {
		throw err;
	}
};
