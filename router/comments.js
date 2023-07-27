const express = require("express");
const {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
} = require("../controller/commentController");
const router = express.Router();
const {
    protect, 
    authorize
} = require("../middleware/protect");


//  /api/v1/comments
router.route("/")
    .get(getComments)
    .post(protect, authorize("admin", "user"), createComment);
router.route("/:id")
    .get(getComment)
    .put(protect, authorize("admin", "user"), updateComment)
    .delete(protect, authorize("admin", "user"), deleteComment);

module.exports = router;
