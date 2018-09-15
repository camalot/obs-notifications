"use strict";
const express = require("express");
const router = express.Router();
const config = require("../obs.config");
const utils = require("../../lib/utils");
const obs = utils.obsstudio;

router.get("/", (req, res, next) => {
	return new Promise((resolve, reject) => {
		try {
			let aliases = null;
			return obs.getSourceAliases(true)
				.then(data => {
					return new Promise((resolve, reject) => {

						let commands = [].concat(data);
						for (let x in data) {
							if (data.hasOwnProperty(x)) {
								commands.push({
									name: x,
									level: data[x].level || 2,
									length: data[x].length
								});
							}
						}
						return resolve(commands);
					});
				})
				.then((data) => {
					aliases = data;
					return obs.getSources();
				})
				.then((data) => {
					console.log("render");
					console.log(data);

					return res.render("admin/obs/index", {
						layout: "material",
						aliases: aliases,
						scenes: data
					});
				}).catch(err => {
					console.error(err);
					return next(err);
				});
		} catch (err) {
			console.error(err);
			return next(err);
		}
	});
});


module.exports = router;
