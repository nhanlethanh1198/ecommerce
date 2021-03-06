const express = require("express");
const router = express.Router();

const {
	create,
	productById,
	read,
	remove,
	update,
	list,
	listCategories,
	listBySearch,
	photo,
	listSearch,
	listRelated
} = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
	"/product/:productId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	remove
);
router.put(
	"/product/:productId/:userId",
	requireSignin,
	isAuth,
	isAdmin,
	update
);
router.get("/product/:productId", read);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/search", listSearch);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
