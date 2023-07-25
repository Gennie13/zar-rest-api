const express = require("express");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory

} = require("../controller/categoryController");
const router = express.Router();
const {
    protect, 
    authorize
} = require("../middleware/protect");



//  /api/v1/categories
router.route("/")
                .get(getCategories)
                .post(protect, authorize("admin"), createCategory);
router.route("/:id")
                    .get(getCategory)
                    .put(protect, authorize("admin"), updateCategory)
                    .delete(protect, authorize("admin"), deleteCategory);
// router.route("/:id/zaruud").get(getCatZaruud)

module.exports = router;
