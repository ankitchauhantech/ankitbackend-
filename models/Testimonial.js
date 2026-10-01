const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, default: "" },
    company: { type: String, default: "" },
    message: { type: String, required: true },
    rating: { type: Number, default: 5 },
    avatar: { type: String, default: "" },
    active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
