const express = require("express");
const { body, param, validationResult } = require("express-validator");
const Report = require("../models/Report");
const moderatorAuth = require("../middleware/moderatorAuth");
const sse = require("../sse");

const router = express.Router();

// Validation helper
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Create new report
router.post(
  "/",
  [
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("suspectName").notEmpty(),
    body("suspectRole").notEmpty(),
    body("corruptionType").notEmpty(),
    body("corruptionDate").notEmpty(),
    body("description").notEmpty(),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const report = await Report.create(req.body);
      sse.broadcast({ event: "new-report", data: report });
      res.status(201).json(report);
    } catch (err) {
      next(err);
    }
  }
);

// List all reports
router.get("/", async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// Update status
router.put(
  "/:id/status",
  moderatorAuth,
  [param("id").isMongoId()],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const updated = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Not found" });

      sse.broadcast({ event: "status-updated", data: updated });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;



