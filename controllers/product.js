const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const errorHandler = require("../helpers/dbErrorHandle");

exports.productById = (req, res, next, id) => {
	Product.findById(id).exec((error, product) => {
		if (error || !product) {
			return res.status(400).json({
				error: "Product not found!",
			});
		}
		req.product = product;
		next();
	});
};

// read product
exports.read = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

// create product
exports.create = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (error, fields, files) => {
		if (error)
			return res.status(400).json({
				error: "Image could not be uploaded",
			});

		// check for all fields
		const {
			name,
			description,
			price,
			category,
			quantity,
			shipping,
		} = fields;

		if (
			!name ||
			!description ||
			!price ||
			!category ||
			!quantity ||
			!shipping
		)
			return res.status(400).json({
				error: "All fields are required!",
			});

		let product = new Product(fields);

		// 1kb = 1000
		// 1mb = 1000000

		if (files.photo) {
			// console.log('FILE PHOTO: ', files.photo)
			if (files.photo.size > 1000000)
				return res.status(400).json({
					error: "Image should be less than 1mb in size.",
				});
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		product.save((error, result) => {
			if (error) {
				return res.status(400).json({
					error: errorHandler(error),
				});
			}

			res.json({ result });
		});
	});
};

// deleted Product
exports.remove = (req, res) => {
	let product = req.product;
	product.remove((error, deletedProduct) => {
		if (error) return res.status(400).json({ error: errorHandler(error) });
		res.json({ message: "Product deleted successfuly!" });
	});
};

// update product
exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (error, fields, files) => {
		if (error)
			return res.status(400).json({
				error: "Image could not be uploaded",
			});

		// check for all fields
		const {
			name,
			description,
			price,
			category,
			quantity,
			shipping,
		} = fields;

		if (
			!name ||
			!description ||
			!price ||
			!category ||
			!quantity ||
			!shipping
		)
			return res.status(400).json({
				error: "All fields are required!",
			});

		let product = req.product;
		product = _.extend(product, fields);

		// 1kb = 1000
		// 1mb = 1000000

		if (files.photo) {
			// console.log('FILE PHOTO: ', files.photo)
			if (files.photo.size > 1000000)
				return res.status(400).json({
					error: "Image should be less than 1mb in size.",
				});
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		product.save((error, result) => {
			if (error) {
				return res.status(400).json({
					error: errorHandler(error),
				});
			}

			res.json({ result });
		});
	});
};

/**
 * sell / arrival
 * by sell = /product?sortBy=sold&order=desc&limit=4
 * by arrival = /product?sortBy=createAt&order=desc&limit=4
 * if no param are send, then all products are return
 */

exports.list = (req, res) => {
	let order = req.query.order ? req.query.order : "asc";
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let limit = req.query.limit ? req.query.limit : 6;

	Product.find()
		.select("-photo")
		.populate("category")
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((error, data) => {
			if (error)
				return res.status(400).json({
					error: "Products not found!",
				});
			res.send(data);
		});
};
