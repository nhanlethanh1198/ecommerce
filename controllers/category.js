const category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandle");

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((error, data) => {
    if (error) {
      res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({ data });
  });
};
