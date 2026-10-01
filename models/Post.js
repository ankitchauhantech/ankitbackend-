const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: { type: String, default: "" },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    author_name: { type: String, default: "Ankit Chauhan" },
    views: { type: Number, default: 0 },
    published: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
