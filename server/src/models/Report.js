// server/src/models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    suspectName: { type: String, required: true },
    suspectRole: { type: String, required: true },
    corruptionType: { type: String, required: true },
    corruptionDate: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
