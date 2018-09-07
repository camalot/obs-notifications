"use strict";
const express = require("express");
const router = express.Router();
const config = require("./lurker.config");

router.get("/", (req, res, next) => {
	return new Promise((resolve, reject) => {
		try {
			return res.render("admin/lurker", { layout: "material" });
		} catch (err) {
			console.error(err);
			return next(err);
		}
	});
});

module.exports = router;
