const express = require("express");
const studentController = require("../controllers/studentController");
const asyncHandler = require("../middleware/asyncHandler");
const { authenticate, requireAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const schemas = require("../validation/schemas");

const router = express.Router();

router.use(authenticate);
router.get("/", validate(schemas.listStudents), asyncHandler(studentController.listStudents));
router.get("/:id", validate(schemas.studentIdRequest), asyncHandler(studentController.getStudent));
router.post(
  "/",
  requireAdmin,
  validate(schemas.createStudent),
  asyncHandler(studentController.createStudent)
);
router.put(
  "/:id",
  requireAdmin,
  validate(schemas.updateStudent),
  asyncHandler(studentController.updateStudent)
);
router.delete(
  "/:id",
  requireAdmin,
  validate(schemas.studentIdRequest),
  asyncHandler(studentController.deleteStudent)
);

module.exports = router;
