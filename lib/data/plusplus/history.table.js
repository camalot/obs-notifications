"use strict";
const merge = require('merge');
let _name = "history";
let _columns = [
	{
		name: "user",
		type: "TEXT",
		constraints: ["NOT NULL"]
	},
	{
		name: "text",
		type: "TEXT",
		constraints: ["NOT NULL"]
	},
	{
		name: "created",
		type: "NUMERIC",
		constraints: ["NOT NULL"]
	},
	{
		name: "action",
		type: "NUMERIC", // 1 or -1
		constraints: ["NOT NULL", "DEFAULT(1)"]
	}
];

let _database = null;

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			console.log("CREATE ON HISTORY TABLE");
			let sql = `CREATE TABLE IF NOT EXISTS ${_name} (`;
			for (let x = 0; x < _columns.length; ++x) {
				let col = _columns[x];
				let end = ", ";
				if (x + 1 === _columns.length) {
					end = ", UNIQUE (user, text, action) ON CONFLICT REPLACE);";
				}
				sql += `${col.name} ${col.type} ${col.constraints.join(" ")}${end}`;
			}
			console.log(sql);
			_database.sql.run(sql);
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let allForText = (text) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			let utc = _database.utcNow();
			let sql = `SELECT rowid AS id, user, text, action, created FROM ${_name} WHERE text = $text;`;
			let result = [];
			_database.sql.each(sql, { $text: text.trim().toLowerCase() }, (err, row) => {
				if (err) {
					return reject(err);
				}

				result.push({
					id: row.id,
					user: row.text,
					action: row.action,
					created: row.created,
					text: row.text
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

let allTextItems = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			let utc = _database.utcNow();
			let sql = `SELECT text, SUM(action) AS points FROM ${_name} GROUP BY text ORDER BY points DESC;`;
			let result = [];
			_database.sql.each(sql, {}, (err, row) => {
				if (err) {
					return reject(err);
				}

				result.push({
					points: row.points,
					text: row.text
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

let _insert = (data) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			let utc = _database.utcNow();
			let sql = `INSERT INTO ${_name} (user, text, action, created) VALUES ($user, $text, $action, $date);`;
			_database.sql.run(sql, { $user: data.user.trim().toLowerCase(), $text: data.text.trim().toLowerCase(), $action: data.action, $date: utc }, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve({
					user: data.text,
					action: data.action,
					created: utc,
					text: data.text
				});
			});
		} catch (err) {
			return reject(err);
		}
	});
};

let add = (data) => {
	return new Promise((resolve, reject) => {
		if (data.text && data.text !== "null" && data.text !== "") {
			return _insert(merge(data, { action: 1 }))
				.then((data) => {
					return points(data.text);
				});
		} else {
			// get latest item
			return _getLastVotedItem()
				.then((item) => {
					if (item && item.text) {
						let ndata = merge(item, data);
						return add(ndata);
					}
				}).catch((err) => {
					return reject(err);
				});
		}
	});
};

let subtract = (data) => {
	return new Promise((resolve, reject) => {
		if (data.text && data.text !== "null" && data.text !== "") {
			return _insert(merge(data, { action: -1 }))
				.then((data) => {
					return points(data.text);
				});
		} else {
			// get latest item
			return _getLastVotedItem()
				.then((item) => {
					if (item && item.text) {
						let ndata = merge(item, data);
						return subtract(ndata);
					}
				}).catch((err) => {
					return reject(err);
				});
		}
	});
};

let _getLastVotedItem = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			let sql = `SELECT text, SUM(action) AS points FROM ${_name} ORDER BY created DESC LIMIT 1;`;
			let result = null;
			_database.sql.each(sql, {}, (err, row) => {
				if (err) {
					return reject(err);
				}

				result = {
					points: row.points,
					text: row.text
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
}


let points = (text) => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (history:create)");
			}
			let sql = `SELECT text, SUM(action) AS points FROM ${_name} WHERE text = $text GROUP BY text LIMIT 1;`;
			let result = {
				points: 0,
				text: text
			};
			_database.sql.each(sql, { $text: text.trim().toLowerCase() }, (err, row) => {
				if (err) {
					return reject(err);
				}

				result = {
					points: row.points,
					text: row.text
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

module.exports = (db) => {
	try {
		_database = db;
		return {
			name: _name,
			create: create,
			allForText: allForText,
			allTextItems: allTextItems,
			add: add,
			subtract: subtract,
			points: points,
			database: _database,
			columns: _columns
		};
	} catch (err) {
		throw err;
	}
};
