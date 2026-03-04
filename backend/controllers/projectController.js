const Project = require("../models/Project");

// ─────────────────────────────────────────
// @route   POST /api/projects
// @access  Private (client only)
// ─────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, skillsRequired } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      skillsRequired,
      client: req.user.id,
    });

    res.status(201).json({ success: true, message: "Project created!", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/projects
// @access  Public
// ─────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "open" })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/projects/:id
// @access  Public
// ─────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("assignedTo", "name email");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/projects/:id
// @access  Private (client who owns it)
// ─────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Make sure logged in user is the project owner
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this project" });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Project updated!", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/projects/:id
// @access  Private (client who owns it)
// ─────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this project" });
    }

    await project.deleteOne();

    res.status(200).json({ success: true, message: "Project deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/projects/my
// @access  Private (client only)
// ─────────────────────────────────────────
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getMyProjects };