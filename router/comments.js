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
    .post(createComment);
router.route("/:id")
    .get(getComment)
    .put(updateComment)
    .delete(deleteComment);

module.exports = router;
