"use strict";

let _name = "users";
let _database = null;


if (!_name || _name === "") {
	throw new Error("_name not defined");
}

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:create)`);
			}

			_database.sql.run(`CREATE TABLE IF NOT EXISTS ${_name} (username TEXT NOT NULL UNIQUE, _json TEXT NOT NULL, id TEXT NOT NULL UNIQUE, enabled INTEGER NOT NULL DEFAULT(1));`, {}, (err) => {
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
				return reject(`Database not open (${_name}:all)`);
			}
			let result = [];
			_database.sql.each(`SELECT rowid AS _id, username, id, enabled, _json FROM ${_name};`, {}, (err, row) => {
				if (err) {
					return reject(err);
				}
				result.push({
					_id: row._id,
					id: row.id,
					username: row.username,
					enabled: row.enabled === 1,
					_json: JSON.parse(row._json || "{}")
				});
			}, (err, rows) => {
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

let add = (data) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:add)`);
			}
			return _database.sql.run(`INSERT INTO ${_name} (username, id, enabled, _json) VALUES ($username, $id, $enabled, $json);`, {
				$id: data.id,
				$enabled: data.enabled ? 1 : 0,
				$json: JSON.stringify(data._json),
				$username: data.username
			}, (err) => {
				if (err) {
					return reject(err);
				}
				return get(data.username)
					.then((d) => {
						return resolve(d);
					})
					.catch((e) => {
						return reject(e);
					});
			});
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = (username) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:remove)`);
			}
			return _database.sql.run(`DELETE FROM ${_name} WHERE username = $username`, { $username: username }, (err) => {
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

let get = (username) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:get)`);
			}
			let result = null;
			_database.sql.each(`SELECT rowid AS _id, username, id, enabled, _json FROM ${_name} WHERE username = $username LIMIT 1;`, { $username: username }, (err, row) => {
				if (err) {
					return reject(err);
				}
				result = {
					_id: row._id,
					id: row.id,
					username: row.username,
					enabled: row.enabled === 1,
					_json: JSON.parse(row._json || "{}")
				};
			}, (err, rows) => {
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

let update = (data) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:update)`);
			}

			return _database.sql.run(`UPDATE ${_name} SET id = $id, $enabled = $enabled, _json = $json WHERE username = $username;`, {
				$id: data.id,
				$enabled: data.enabled ? 1 : 0,
				$json: JSON.stringify(data._json),
				$username: data.username
			}, (err) => {
				if (err) {
					return reject(err);
				}
				return get(data.username)
					.then((d) => {
						return resolve(d);
					})
					.catch((e) => {
						return reject(e);
					});
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
			database: _database
		};
	} catch (err) {
		throw err;
	}
};
