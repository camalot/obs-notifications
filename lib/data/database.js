"use strict";

const sqlite3 = require('sqlite3').verbose();
const config = require('../../config');
const async = require('async');

function Database (name) {
	console.log(`invoke DB for ${name}`);
	let _db = this;
	this.sql = null;
	this.connected = false;
	this.tables = require(`./${name}`)(_db);

	let open = () => {
		return new Promise((resolve, reject) => {
			try {
				console.log(`loading: ${name}.sqlite`);
				this.sql = new sqlite3.Database(`${config.databasePath}/${name}.sqlite`, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
				this.connected = true;
				return create()
					.then(() => { return resolve(); })
					.catch((err) => { return reject(err); });
			} catch (err) {
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
						return table.create().then(() => {
							return done();
						}).catch(err => {
							return done(err);
						});
					}
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

	let close = () => {
		return new Promise((resolve, reject) => {
			try {
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
	}

	this.close = close;
	this.open = open;
	this.create = create;
	this.utcNow = utcNow;
	return this;

}


module.exports = Database;
