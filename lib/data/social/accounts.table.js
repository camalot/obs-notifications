"use strict";

let _name = "accounts";
let _database = null;
// const config = require("./config");
// const color = require("../../utils").color;
// const async = require("async");
// const merge = require("merge");

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:create)");
			}
			_database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
				"created NUMERIC NOT NULL, name TEXT NOT NULL, network_id INTEGER NOT NULL, enabled INTEGER NOT NULL DEFAULT(1), sort INTEGER NOT NULL DEFAULT(0));",
				err => {
					if (err) {
						console.error(err);
						return reject(err);
					}
					console.log(`create database table ${_name} complete`);
					return resolve();
				}
			);
		} catch (err) {
			return reject(err);
		}
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:all)");
			}
			let data = [];
			let index = 0;
			_database.sql.each(
				`SELECT A.rowid AS id, A.created, A.name, A.network_id, N.name AS network_name, ` +
					`N.image AS network_image, N.color AS network_color, N.background AS network_background, N.background2 AS network_background2, ` +
				`A.enabled, A.sort FROM ${_name} AS A INNER JOIN networks AS N ON A.network_id = N.rowid ORDER BY A.sort ASC`,
				{},
				(err, row) => {
					if (err) {
						return reject(err);
					}
					data.push({
						id: row.id,
						created: row.created,
						name: row.name,
						network: {
							id: row.network_id,
							name: row.network_name,
							image: row.network_image,
							background: row.network_background,
							background2: row.network_background2,
							color: row.network_color
						},
						enabled: row.enabled === 1, 
						sort: row.sort || index
					});
					index++;
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

let add = data => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:add)");
			}
			let utc = _database.utcNow();

			_validateAddData(data)
				.then(data => {
					_database.sql.run(
						`INSERT INTO ${_name} (created, name, network_id, enabled, sort) VALUES ($created, $name, $network_id, $enabled, $sort)`,
						{
							$created: utc,
							$name: data.name,
							$network_id: data.network_id,
							$enabled: data.enabled === true ? 1 : 0,
							$sort: data.sort || 9999
						},
						err => {
							if (err) {
								return reject(err);
							}
							return resolve({
								id: data.rowid,
								created: utc,
								name: data.name,
								network_id: data.network_id,
								enabled: data.enabled,
								sort: data.sort || 9999
							});
						}
					);
				})
				.catch(e => {
					console.error(e);
					return reject(e);
				});
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
};

let update = args => {
	return new Promise((resolve, reject) => {
		try {
			if (!args.id || args.id <= 0) {
				return reject(`Account id '${args.id || "null"}' not found`);
			}

			if (!_database || !_database.connected) {
				return reject("Database not open (networks:add)");
			}
			let utc = _database.utcNow();
			get(args.id)
			.then((current) => {
				args.name = args.name || current.name;
				args.enabled = args.enabled === undefined || args.enabled === null ? current.enabled : args.enabled;
				args.network_id = args.network_id || current.network.id;
				args.sort = args.sort == null ? current.sort : args.sort;
				return _validateAddData(args);
			})
			.then(r => {
					_database.sql.run(
						`UPDATE ${_name} SET name = $name, network_id = $network_id, enabled = $enabled, sort = $sort WHERE rowid = $id`,
						{
							$name: r.name,
							$network_id: r.network_id,
							$enabled: r.enabled === true ? 1 : 0,
							$sort: r.sort,
							$id: r.id
						},
						err => {
							if (err) {
								return reject(err);
							}
							return resolve({
								id: r.id,
								updated: utc,
								name: r.name,
								network_id: r.network_id,
								enabled: r.enabled,
								sort: r.sort
							});
						}
					);
				})
				.catch(e => {
					console.error(e);
					return reject(e);
				});
		} catch (err) {
			console.error(err);
			return reject(err);
		}
	});
};

let remove = (id) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:remove)");
			}
			if(!id || isNaN(id)) {
				return reject("'id' is not a valid value");
			}
			return _database.sql.run(`DELETE FROM ${_name} WHERE rowid = $id`, { $id: id }, (err) => {
				if(err) {
					return reject(err);
				}
				return resolve({id: id, deleted: true});
			});
		} catch (err) {
			return reject(err);
		}
	});
};

let get = id => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:get)");
			}
			let data = null;
			_database.sql.each(
				`SELECT A.rowid AS id, A.created, A.name, A.network_id, N.name AS network_name, ` +
					`N.image AS network_image, N.color AS network_color, N.background AS network_background, N.background2 AS network_background2, ` +
					`A.enabled, A.sort FROM ${_name} AS A INNER JOIN networks AS N ON A.network_id = N.rowid WHERE A.rowid = $id LIMIT 1`,
				{ $id: id },
				(err, row) => {
					if (err) {
						return reject(err);
					}

					if (data === null) {
						data = {
							id: row.id,
							created: row.created,
							name: row.name,
							network: {
								id: row.network_id,
								name: row.network_name,
								image: row.network_image,
								background: row.network_background,
								background2: row.network_background2,
								color: row.network_color
							},
							enabled: row.enabled === 1,
							sort: row.sort
						};
					} else {
						return reject("More than one account found for the specified ID.");
					}
				},
				(err, rows) => {
					if (err) {
						return reject(err);
					}

					if (rows === 0 || data === null) {
						return reject("Not found");
					}

					return resolve(data);
				}
			);
		} catch (err) {
			return reject(err);
		}
	});
};

let _validateAddData = data => {
	return new Promise((resolve, reject) => {
		if (!data.name || data.name === "") {
			return reject("Missing required value 'name'.");
		}
		if (!data.network_id || data.network_id === "") {
			return reject("Missing required value 'network_id'.");
		}
		if (data.network_id && isNaN(data.network_id)) {
			return reject("Value for 'network_id' is not a number.");
		}
		let count = 0;
		_database.sql.each(
			"SELECT rowid as id FROM networks where rowid = $network_id LIMIT 1",
			{
				$network_id: data.network_id
			},
			(err, row) => {
				if (err) {
					return reject(err);
				}
				count++;
			},
			(err, rows) => {
				if (rows === 0 || count !== 1) {
					return reject(`No network found for the id: ${data.network_id}`);
				}
				return resolve(data);
			}
		);
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
			database: _database,
			update: update
		};
	} catch (err) {
		throw err;
	}
};
