"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const router = express.Router();
const config = require("./audio.config");
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(`path: ${config.pb.upload}`);
		cb(null, config.pb.upload);
	},
	filename: function (req, file, cb) {
		// let ext = path.extname(file.originalname);
		console.log(file);
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
	return new Promise((resolve, reject) => {
		try {
			fs.readdir(config.pb.upload, (err, files) => {
				if(err) {
					console.error(err);
					return next(err);
				}
				let hooks = files.map((x) => { return { fullname: x, name: path.basename(x, path.extname(x)), ext: path.extname(x)}; });
				console.log(hooks);
				return res.render("admin/audio", { layout: "material", hooks: hooks });
			}) ;
		} catch (err) {
			console.error(err);
			return next(err);
		}
	});
});

router.post("/upload", upload.single('clip'), (req, res, next) => {
	return new Promise((resolve, reject) => {
		try {
			return res.redirect("/admin/audio");
		} catch (err) {
			console.error(err);
			return next(err);
		}
	});
});

module.exports = router;
