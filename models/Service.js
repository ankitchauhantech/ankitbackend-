const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "⚡" },
    icon_color: { type: String, default: "blue" },
    features: { type: String, default: "" },
    active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);
