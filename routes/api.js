const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { User, Service, Project, Post, Contact, Testimonial } = require("../models");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoState: mongoose.connection.readyState,
    timestamp: new Date(),
  });
});

// ==========================================
// PROJECTS API (CRUD)
// ==========================================
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    res.json(projects);
  } catch (err) {
    console.error("GET /projects error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/projects/featured", async (req, res) => {
  try {
    const projects = await Project.find({ featured: 1 })
      .sort({ created_at: -1 })
      .limit(3);
    res.json(projects);
  } catch (err) {
    console.error("GET /projects/featured error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "Invalid project ID" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(`GET /projects/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tech_stack,
      image,
      live_url,
      github_url,
      featured,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description: description || "",
      category: category || "General",
      tech_stack: tech_stack || "",
      image: image || "",
      live_url: live_url || "#",
      github_url: github_url || "#",
      featured: featured ? 1 : 0,
    });
    console.log(`✅ Project created: ${project._id} - ${project.title}`);
    res.status(201).json(project);
  } catch (err) {
    console.error("POST /projects error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    const {
      title,
      description,
      category,
      tech_stack,
      image,
      live_url,
      github_url,
      featured,
    } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        tech_stack,
        image,
        live_url,
        github_url,
        featured: featured ? 1 : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }

    console.log(`✅ Project updated: ${updated._id} - ${updated.title}`);
    res.json(updated);
  } catch (err) {
    console.error(`PUT /projects/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log(`🗑️ Project deleted: ${req.params.id}`);
    res.json({ message: "Project deleted successfully", id: req.params.id });
  } catch (err) {
    console.error(`DELETE /projects/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SERVICES API (CRUD)
// ==========================================
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ created_at: -1 });
    res.json(services);
  } catch (err) {
    console.error("GET /services error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "Invalid service ID" });
    }
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(`GET /services/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { title, description, icon, icon_color, features, active } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Service title is required" });
    }
    const service = await Service.create({
      title,
      description: description || "",
      icon: icon || "⚡",
      icon_color: icon_color || "blue",
      features: features || "",
      active: active ? 1 : 0,
    });
    console.log(`✅ Service created: ${service._id} - ${service.title}`);
    res.status(201).json(service);
  } catch (err) {
    console.error("POST /services error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    const { title, description, icon, icon_color, features, active } = req.body;
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        icon,
        icon_color,
        features,
        active: active ? 1 : 0,
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }
    console.log(`✅ Service updated: ${updated._id} - ${updated.title}`);
    res.json(updated);
  } catch (err) {
    console.error(`PUT /services/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Service not found" });
    }
    console.log(`🗑️ Service deleted: ${req.params.id}`);
    res.json({ message: "Service deleted successfully", id: req.params.id });
  } catch (err) {
    console.error(`DELETE /services/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POSTS API (CRUD)
// ==========================================
router.get("/posts", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { published: 1 };
    const posts = await Post.find(filter).sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET /posts error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Single post by ID
router.get("/posts/id/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "Invalid post ID" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(`GET /posts/id/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Single post by slug (or fallback by ID)
router.get("/posts/:slug", async (req, res) => {
  try {
    let post = null;
    if (mongoose.Types.ObjectId.isValid(req.params.slug)) {
      post = await Post.findById(req.params.slug);
    }
    if (!post) {
      post = await Post.findOne({ slug: req.params.slug });
    }
    if (!post) return res.status(404).json({ error: "Post not found" });

    // increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    const relatedPosts = await Post.find({
      published: 1,
      _id: { $ne: post._id },
    })
      .sort({ created_at: -1 })
      .limit(3);

    res.json({ post, relatedPosts });
  } catch (err) {
    console.error(`GET /posts/${req.params.slug} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const { title, content, excerpt, image, category, tags, published, author_name, author_id } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and Content are required" });
    }

    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await Post.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || "",
      image: image || "",
      author_id: mongoose.Types.ObjectId.isValid(author_id) ? author_id : null,
      author_name: author_name || "Ankit Chauhan",
      category: category || "General",
      tags: tags || "",
      published: published ? 1 : 0,
    });
    console.log(`✅ Post created: ${post._id} - ${post.title}`);
    res.status(201).json(post);
  } catch (err) {
    console.error("POST /posts error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/posts/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    const { title, content, excerpt, image, category, tags, published } = req.body;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt,
        image,
        category,
        tags,
        published: published ? 1 : 0,
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(`✅ Post updated: ${updated._id} - ${updated.title}`);
    res.json(updated);
  } catch (err) {
    console.error(`PUT /posts/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(`🗑️ Post deleted: ${req.params.id}`);
    res.json({ message: "Post deleted successfully", id: req.params.id });
  } catch (err) {
    console.error(`DELETE /posts/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TESTIMONIALS API
// ==========================================
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: 1 }).sort({ created_at: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error("GET /testimonials error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CONTACTS API
// ==========================================
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created_at: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("GET /contacts error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }
    const contact = await Contact.create({
      name,
      email,
      subject: subject || "No Subject",
      message,
    });

    // Send email notification
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact from Website: ${subject || "No Subject"}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.warn("Mail send notification notice:", error.message);
      }
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error("POST /contacts error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/contacts/:id/read", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(`PUT /contacts/${req.params.id}/read error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// AUTH API
// ==========================================
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      user: {
        id: user.id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("POST /auth/login error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user.id, _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("POST /auth/register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ADMIN DASHBOARD API
// ==========================================
router.get("/admin/dashboard", async (req, res) => {
  try {
    const [projectCount, postCount, unreadCount, userCount, recentMessages] =
      await Promise.all([
        Project.countDocuments(),
        Post.countDocuments(),
        Contact.countDocuments({ status: "unread" }),
        User.countDocuments(),
        Contact.find().sort({ created_at: -1 }).limit(5),
      ]);

    res.json({
      stats: {
        projects: projectCount,
        posts: postCount,
        messages: unreadCount,
        users: userCount,
      },
      recentMessages: recentMessages || [],
    });
  } catch (err) {
    console.error("GET /admin/dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
