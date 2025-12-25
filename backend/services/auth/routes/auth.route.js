const express = require("express");
const { asyncHandler } = require("../../../shared/http");
const { requireAuth } = require("../../../shared/auth");

const { validate } = require("../validators");
const { registerSchema } = require("../validators/user.schema");
const { loginSchema } = require("../validators/login.schema");

const {
  register,
  login,
  refresh,
  me,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.get("/me", requireAuth, asyncHandler(me));

module.exports = router;
