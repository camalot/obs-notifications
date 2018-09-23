"use strict";
const async = require('async');
const file = require('../../utils').file;

let _name = "settings";
let _database = null;


const DEFAULTS = [
	{
		key: 'bgadjustment',
		description: "When background2 is not set, the main background color is adjusted by this amount.",
		label: "Secondary Background Color Adjustment",
		value: 25,
		pattern: '\\d{1,3}',
		type: "number"
	},
	{
		key: 'pause',
		label: "Pause",
		description: "The pause after the last account before it restarts. (in seconds)",
		value: 0,
		pattern: '\\d{1,3}',
		type: "number"
	},
	{
		key: 'delay',
		description: "The delay before going to the next account. (in seconds)",
		label: "Delay",
		value: 20,
		pattern: '\\d{1,3}',
		type: "number"
	},
	{
		key: 'custom_css',
		type: 'code',
		label: "Custom CSS",
		value: file.readFileSync('./lib/data/social/custom.template.css')
	}
];


let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (settings:create)");
			}
			return _database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
				"created NUMERIC NOT NULL, key TEXT NOT NULL UNIQUE, value TEXT, description TEXT, label TEXT, pattern TEXT, type TEXT);",
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
			async.each(DEFAULTS, (item, next) => {
				add(item)
					.then(() => {
						return next();
					})
					.catch((err) => {
						return next(err);
					});
			}, (err) => {
				if (err) {
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
				`SELECT rowid AS id, created, key, value, label, description, pattern, type FROM ${_name} ORDER BY key`,
				{},
				(err, row) => {
					if (err) {
						return reject(err);
					}
					data.push({
						id: row.id,
						created: row.created,
						key: row.key,
						label: row.label,
						description: row.description,
						value: row.value,
						pattern: row.pattern,
						type: row.type
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

let add = (item) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (quotes:all)");
			}
			let utc = _database.utcNow();
			return _database.sql.run(`INSERT INTO ${_name} (created, key, value, label, description, pattern, type) ` +
				`SELECT $utc, $key, $value, $label, $description, $pattern, $type WHERE NOT EXISTS (SELECT 1 FROM ${_name} WHERE key = $key);`,
				{ $utc: utc, $key: item.key, $value: item.value, $label: item.label, $description: item.description, $pattern: item.pattern, $type: item.type || "text" }, (err) => {
					if (err) {
						return reject(err);
					}
					return resolve(item);
				});
		} catch (err) {
			return reject(err);
		}
	});
};

let updateAll = (kvp) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (quotes:all)");
			}
			let result = {};
			async.each(Object.keys(kvp), (key, next) => {
				let value = kvp[key];
				console.log(`update: ${key}: ${value}`);
				update(key, value)
					.then((r) => {
						result[key] = r.value;
						return next();
					})
					.catch((err) => {
						return next(err);
					});
			}, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve(result);
			});
		} catch (err) {
			return reject(err);
		}
	});
};

let update = (key, value) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (quotes:all)");
			}
			_database.sql.run(`UPDATE ${_name} SET value = $value WHERE key = $key`, { $key: key, $value: value }, (err) => {
				if (err) {
					return reject(err);
				}
				let result = {};
				result[key] = value;
				return resolve(result);
			});
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
			if (!_database || !_database.connected) {
				return reject("Database not open (settings:all)");
			}
			let setting = null;
			_database.sql.each(`SELECT created, key, value, label, description, pattern, type FROM ${_name} WHERE key = $key`, {
				$key: key
			}, (err, row) => {
				if (err) {
					return reject(err);
				}
				if (!setting) {
					setting = row;
				}
			}, (err, rows) => {
				if (err) {
					return reject(err);
				}
				return resolve(setting);
			});
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
			updateAll: updateAll,
			database: _database,
			DEFAULTS: DEFAULTS
		};
	} catch (err) {
		throw err;
	}
};
