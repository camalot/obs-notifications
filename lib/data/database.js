"use strict";

const sqlite3 = require('sqlite3').verbose();
const config = require('../../config');
const async = require('async');
const fs = require('fs');

function Database(name, override) {
	console.log(`invoke DB for ${name}`);
	let _db = this;
	this.sql = null;
	this.connected = false;

	let open = () => {
		return new Promise((resolve, reject) => {
			try {
				this.tables = require(`./${name}`)(_db);
				let dbFile = override ? override : name;
				let dbDir = override ? `${config.databasePath}/${name}` : config.databasePath;

				if (!fs.existsSync(dbDir)) {
					console.log(`make directory: ${dbDir}`);
					fs.mkdirSync(dbDir);
				}

				console.log(`loading: ${dbFile}.sqlite`);
				this.sql = new sqlite3.Database(`${dbDir}/${dbFile}.sqlite`, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
				this.connected = true;
				console.log(`connected: ${dbFile} : ${this.connected}`);
				return create()
					.then(() => { return resolve(); })
					.catch((err) => {
						console.error(err);
						return reject(err);
					});
			} catch (err) {
				console.error(err);
				return reject(err);
			}
		});
	};
	let create = () => {
		return new Promise((resolve, reject) => {
			try {
				if (!this.connected) {
					return reject("Database not open (db:create)");
				}

				async.each(this.tables, (table, done) => {
					if (table.create && table.hasOwnProperty('database')) {
						console.log(`create: ${table.name}`);
						return table.create()
							.then(() => {
								return done();
							}).catch(err => {
								return done(err);
							});
					}
				}, (err) => {
					if (err) {
						console.error(err);
						return reject(err);
					}
					console.log("created");
					return resolve();
				});
			} catch (err) {
				return reject(err);
			}
		});
	};

	let close = () => {
		return new Promise((resolve, reject) => {
			try {
				console.log("closing database");
				this.sql.close();
				this.connected = false;
				return resolve();
			} catch (err) {
				return reject(err);
			}
		});
	};

	let utcNow = () => {
		let date = new Date();
		let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
			date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return now_utc;
	};

	this.close = close;
	this.open = open;
	this.create = create;
	this.utcNow = utcNow;
	return this;

}


module.exports = Database;
