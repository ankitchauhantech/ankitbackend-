const API_URL = "http://localhost:5000/api";

async function testAdminOperations() {
  console.log("==================================================");
  console.log("🧪 TESTING ALL ADMIN OPERATIONS (VIEW, EDIT, DELETE)");
  console.log("==================================================");

  // --------------------------------------------------
  // 1. SERVICES CRUD TEST
  // --------------------------------------------------
  console.log("\n--- [1] Testing Services: Add -> View -> Edit -> Delete ---");
  // A. Add
  const addServiceRes = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Temporary Test Service",
      description: "Service created for admin CRUD testing",
      icon: "🧪",
      icon_color: "green",
      features: "Test Feature 1, Test Feature 2",
      active: 1
    })
  });
  if (!addServiceRes.ok) throw new Error("Failed to add service");
  const createdService = await addServiceRes.json();
  const sId = createdService._id || createdService.id;
  console.log(`✅ Add Service: Created with ID ${sId}`);

  // B. View (Get by ID)
  const getServiceRes = await fetch(`${API_URL}/services/${sId}`);
  if (!getServiceRes.ok) throw new Error("Failed to view service");
  const viewedService = await getServiceRes.json();
  console.log(`✅ View Service: Retrieved "${viewedService.title}"`);

  // C. Edit (Update)
  const editServiceRes = await fetch(`${API_URL}/services/${sId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Updated Test Service Name",
      description: "Updated description for test service",
      icon: "⭐",
      icon_color: "pink",
      features: "Updated Feature",
      active: 1
    })
  });
  if (!editServiceRes.ok) throw new Error("Failed to update service");
  const updatedService = await editServiceRes.json();
  console.log(`✅ Edit Service: Updated title to "${updatedService.title}"`);

  // D. Delete
  const deleteServiceRes = await fetch(`${API_URL}/services/${sId}`, { method: "DELETE" });
  if (!deleteServiceRes.ok) throw new Error("Failed to delete service");
  console.log(`✅ Delete Service: Successfully deleted service ${sId}`);

  // --------------------------------------------------
  // 2. PROJECTS CRUD TEST
  // --------------------------------------------------
  console.log("\n--- [2] Testing Projects: Add -> View -> Edit -> Delete ---");
  // A. Add
  const addProjectRes = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Temporary Test Project",
      description: "Project created for admin CRUD verification",
      category: "Node.js",
      tech_stack: "Node.js, Express, MongoDB",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      live_url: "#",
      github_url: "#",
      featured: 1
    })
  });
  if (!addProjectRes.ok) throw new Error("Failed to add project");
  const createdProject = await addProjectRes.json();
  const pId = createdProject._id || createdProject.id;
  console.log(`✅ Add Project: Created with ID ${pId}`);

  // B. View (Get by ID)
  const getProjectRes = await fetch(`${API_URL}/projects/${pId}`);
  if (!getProjectRes.ok) throw new Error("Failed to view project");
  const viewedProject = await getProjectRes.json();
  console.log(`✅ View Project: Retrieved "${viewedProject.title}"`);

  // C. Edit (Update)
  const editProjectRes = await fetch(`${API_URL}/projects/${pId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Updated Test Project Title",
      description: "Updated description",
      category: "Web App",
      tech_stack: "Node.js, MongoDB",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      live_url: "https://example.com",
      github_url: "https://github.com",
      featured: 0
    })
  });
  if (!editProjectRes.ok) throw new Error("Failed to update project");
  const updatedProject = await editProjectRes.json();
  console.log(`✅ Edit Project: Updated title to "${updatedProject.title}"`);

  // D. Delete
  const deleteProjectRes = await fetch(`${API_URL}/projects/${pId}`, { method: "DELETE" });
  if (!deleteProjectRes.ok) throw new Error("Failed to delete project");
  console.log(`✅ Delete Project: Successfully deleted project ${pId}`);

  // --------------------------------------------------
  // 3. BLOG POSTS CRUD TEST
  // --------------------------------------------------
  console.log("\n--- [3] Testing Blog Posts: Add -> View -> Edit -> Delete ---");
  // A. Add
  const addPostRes = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Temporary Test Blog Post",
      content: "<p>This is a test post body for verification.</p>",
      excerpt: "Short test excerpt",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      category: "Tutorial",
      tags: "Node.js, MongoDB",
      published: 1,
      author_name: "Ankit Chauhan"
    })
  });
  if (!addPostRes.ok) throw new Error("Failed to add blog post");
  const createdPost = await addPostRes.json();
  const postId = createdPost._id || createdPost.id;
  console.log(`✅ Add Post: Created with ID ${postId}, Slug: ${createdPost.slug}`);

  // B. View (Get by ID and by Slug)
  const getPostById = await fetch(`${API_URL}/posts/id/${postId}`);
  if (!getPostById.ok) throw new Error("Failed to view post by ID");
  const viewedPost = await getPostById.json();
  console.log(`✅ View Post by ID: Retrieved "${viewedPost.title}"`);

  const getPostBySlug = await fetch(`${API_URL}/posts/${createdPost.slug}`);
  if (!getPostBySlug.ok) throw new Error("Failed to view post by slug");
  console.log(`✅ View Post by Slug: Retrieved successfully`);

  // C. Edit (Update)
  const editPostRes = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Updated Test Blog Post Title",
      content: "<p>Updated content body</p>",
      excerpt: "Updated excerpt",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      category: "Web Development",
      tags: "Updated, Tags",
      published: 1
    })
  });
  if (!editPostRes.ok) throw new Error("Failed to update post");
  const updatedPost = await editPostRes.json();
  console.log(`✅ Edit Post: Updated title to "${updatedPost.title}"`);

  // D. Delete
  const deletePostRes = await fetch(`${API_URL}/posts/${postId}`, { method: "DELETE" });
  if (!deletePostRes.ok) throw new Error("Failed to delete post");
  console.log(`✅ Delete Post: Successfully deleted post ${postId}`);

  // --------------------------------------------------
  // 4. MESSAGES (CONTACT) READ TEST
  // --------------------------------------------------
  console.log("\n--- [4] Testing Contact Messages: Add -> Mark Read ---");
  const addMsgRes = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Message",
      message: "Testing read action"
    })
  });
  const newMsg = await addMsgRes.json();
  const mId = newMsg._id || newMsg.id;

  const readMsgRes = await fetch(`${API_URL}/contacts/${mId}/read`, { method: "PUT" });
  if (!readMsgRes.ok) throw new Error("Failed to mark message as read");
  console.log(`✅ Mark Message Read: Message ${mId} status updated to read`);

  console.log("\n==================================================");
  console.log("🎉 ALL ADMIN VIEW, EDIT, AND DELETE OPERATIONS FULLY VERIFIED!");
  console.log("==================================================");
}

testAdminOperations().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
