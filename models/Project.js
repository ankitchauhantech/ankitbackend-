const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    tech_stack: { type: String, default: "" },
    image: { type: String, default: "" },
    live_url: { type: String, default: "#" },
    github_url: { type: String, default: "#" },
    featured: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
