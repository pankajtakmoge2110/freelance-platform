const Bid = require("../models/Bid");
const Project = require("../models/Project");

// ─────────────────────────────────────────
// @route   POST /api/bids/:projectId
// @access  Private (freelancer only)
// ─────────────────────────────────────────
const createBid = async (req, res) => {
  try {
    const { amount, deliveryDays, coverLetter } = req.body;
    const projectId = req.params.projectId;

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check project is still open
    if (project.status !== "open") {
      return res.status(400).json({ success: false, message: "Project is no longer accepting bids" });
    }

    // Client cannot bid on their own project
    if (project.client.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot bid on your own project" });
    }

    // Check if already bid
    const existingBid = await Bid.findOne({ project: projectId, freelancer: req.user.id });
    if (existingBid) {
      return res.status(400).json({ success: false, message: "You have already placed a bid on this project" });
    }

    const bid = await Bid.create({
      project: projectId,
      freelancer: req.user.id,
      amount,
      deliveryDays,
      coverLetter,
    });

    await bid.populate("freelancer", "name email");

    res.status(201).json({ success: true, message: "Bid placed successfully!", bid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/bids/:projectId
// @access  Private (client who owns project)
// ─────────────────────────────────────────
const getBidsForProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Only project owner can see all bids
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const bids = await Bid.find({ project: req.params.projectId })
      .populate("freelancer", "name email bio skills")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/bids/my
// @access  Private (freelancer only)
// ─────────────────────────────────────────
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user.id })
      .populate("project", "title budget status deadline")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/bids/:bidId/accept
// @access  Private (client only)
// ─────────────────────────────────────────
const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate("project");
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    // Only project client can accept
    if (bid.project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Accept this bid
    bid.status = "accepted";
    await bid.save();

    // Reject all other bids for this project
    await Bid.updateMany(
      { project: bid.project._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    // Update project status to in-progress and assign freelancer
    await Project.findByIdAndUpdate(bid.project._id, {
      status: "in-progress",
      assignedTo: bid.freelancer,
    });

    res.status(200).json({ success: true, message: "Bid accepted! Project is now in progress.", bid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/bids/:bidId
// @access  Private (freelancer who placed it)
// ─────────────────────────────────────────
const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    if (bid.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await bid.deleteOne();
    res.status(200).json({ success: true, message: "Bid withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBid, getBidsForProject, getMyBids, acceptBid, deleteBid };