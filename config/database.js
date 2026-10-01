const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Service, Project, Post, Testimonial } = require("../models");

// Configure public DNS servers to resolve MongoDB Atlas SRV records smoothly on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (err) {
  console.warn("DNS server override notice:", err.message);
}

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ankitkrajput46_db_user:Tj1xTKa33pBZ6LxB@cluster0.e4vzhan.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    await seedData();
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

const init = () => {
  connectDB().catch((err) => {
    console.error("Database initialization failed:", err.message);
  });
};

async function seedData() {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("ankit@202@", 10);
      await User.create({
        name: "Ankit Chauhan",
        email: "ankitchauhan.mobrilz@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin user seeded: ankitchauhan.mobrilz@gmail.com / ankit@202@");
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: "WordPress Development",
          description:
            "Custom WordPress themes and plugins built from scratch. Full site development, theme customization, and migrations.",
          icon: "🌐",
          icon_color: "purple",
          features:
            "Custom Theme Development,Plugin Development & Integration,Elementor / Gutenberg Expert,WordPress Security & Optimization",
          active: 1,
        },
        {
          title: "Headless CMS Development",
          description:
            "Modern, decoupled CMS architecture for maximum performance and flexibility. API-first approach with React/Next.js frontend.",
          icon: "⚡",
          icon_color: "blue",
          features:
            "Strapi CMS Setup & Config,Contentful / Sanity Integration,REST & GraphQL APIs,Next.js + CMS Integration",
          active: 1,
        },
        {
          title: "E-Commerce Solutions",
          description:
            "Complete e-commerce stores with WooCommerce, product management, payment gateways, and order management systems.",
          icon: "🛒",
          icon_color: "green",
          features:
            "WooCommerce Development,Payment Gateway Integration,Custom Shop Features,Inventory Management",
          active: 1,
        },
        {
          title: "SEO & Performance",
          description:
            "Technical SEO audits, on-page optimization, Core Web Vitals improvement, and speed optimization.",
          icon: "🔍",
          icon_color: "pink",
          features:
            "Technical SEO Audit,Core Web Vitals Optimization,Page Speed Optimization,Yoast SEO Configuration",
          active: 1,
        },
      ]);
      console.log("✅ Sample services seeded");
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "E-Commerce CMS Platform",
          description:
            "A full-featured content management system for e-commerce businesses with product management, order tracking, and analytics dashboard.",
          category: "CMS",
          tech_stack: "WordPress, WooCommerce, PHP, MySQL",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
          live_url: "#",
          github_url: "#",
          featured: 1,
        },
        {
          title: "Corporate Headless Website",
          description:
            "A blazing fast corporate website built with Next.js on the frontend and Strapi CMS on the backend.",
          category: "Headless CMS",
          tech_stack: "Next.js, Strapi, Tailwind CSS, GraphQL",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
          live_url: "#",
          github_url: "#",
          featured: 1,
        },
        {
          title: "Real Estate Portal",
          description:
            "Custom WordPress development with advanced property search, agent dashboards, and interactive maps.",
          category: "WordPress",
          tech_stack: "WordPress, PHP, Google Maps API",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
          live_url: "#",
          github_url: "#",
          featured: 0,
        },
      ]);
      console.log("✅ Sample projects seeded");
    }

    // 4. Seed Posts
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.insertMany([
        {
          title: "Why Headless CMS is the Future of Web Development",
          slug: "why-headless-cms-is-future",
          excerpt:
            "Discover how decoupling your frontend from the backend can lead to better performance and flexibility.",
          content:
            "<p>Traditional CMS architectures have served us well, but the demands of modern web development require more flexibility. Headless CMS separates the content repository from the presentation layer...</p><h2>Benefits of Headless Architecture</h2><ul><li>Omnichannel content delivery</li><li>Better performance with modern frameworks</li><li>Enhanced security</li><li>Developer flexibility</li></ul><p>By using APIs to deliver content, developers can use their favorite tools like React, Vue, or Next.js to build lightning-fast user interfaces.</p>",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
          category: "Headless CMS",
          tags: "Architecture, CMS, Next.js",
          author_name: "Ankit Chauhan",
          views: 145,
          published: 1,
        },
        {
          title: "Top 10 Essential WordPress Plugins for 2024",
          slug: "top-10-essential-wordpress-plugins",
          excerpt:
            "Boost your WordPress site's performance, security, and SEO with these must-have plugins.",
          content:
            "<p>With over 60,000 plugins in the WordPress repository, finding the right ones can be overwhelming. Here are the top plugins you need for a robust website...</p>",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
          category: "WordPress",
          tags: "Plugins, WordPress, Guide",
          author_name: "Ankit Chauhan",
          views: 89,
          published: 1,
        },
      ]);
      console.log("✅ Sample posts seeded");
    }

    // 5. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany([
        {
          name: "Rahul Sharma",
          designation: "CEO",
          company: "TechNova Solutions",
          message:
            "Ankit built an exceptional CMS solution for our team. Delivery was prompt and communication was seamless throughout the project.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          active: 1,
        },
        {
          name: "Sophia Martinez",
          designation: "Product Lead",
          company: "Digital Flow",
          message:
            "Working with Ankit was fantastic. He quickly turned our design into a high-performance headless website.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
          active: 1,
        },
      ]);
      console.log("✅ Sample testimonials seeded");
    }
  } catch (err) {
    console.error("❌ Error seeding initial data:", err.message);
  }
}

module.exports = { connectDB, init };
