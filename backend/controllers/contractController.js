const Contract = require("../models/Contract");
const Project = require("../models/Project");
const Bid = require("../models/Bid");

// ─────────────────────────────────────────
// @route   POST /api/contracts
// @access  Private (client only)
// ─────────────────────────────────────────
const createContract = async (req, res) => {
  try {
    const { projectId, bidId } = req.body;

    // Check project exists and belongs to client
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Check bid exists
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    // Check contract doesn't already exist
    const existing = await Contract.findOne({ project: projectId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Contract already exists for this project" });
    }

    const contract = await Contract.create({
      project: projectId,
      client: req.user.id,
      freelancer: bid.freelancer,
      bid: bidId,
      amount: bid.amount,
      deliveryDays: bid.deliveryDays,
    });

    await contract.populate("project", "title");
    await contract.populate("client", "name email");
    await contract.populate("freelancer", "name email");

    res.status(201).json({ success: true, message: "Contract created!", contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/contracts
// @access  Private
// ─────────────────────────────────────────
const getMyContracts = async (req, res) => {
  try {
    const query =
      req.user.role === "client"
        ? { client: req.user.id }
        : { freelancer: req.user.id };

    const contracts = await Contract.find(query)
      .populate("project", "title status")
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: contracts.length, contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/contracts/:id
// @access  Private
// ─────────────────────────────────────────
const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("project", "title description status")
      .populate("client", "name email")
      .populate("freelancer", "name email bio")
      .populate("bid", "amount deliveryDays coverLetter");

    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    // Only client or freelancer of contract can view
    const isClient = contract.client._id.toString() === req.user.id;
    const isFreelancer = contract.freelancer._id.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/contracts/:id/complete
// @access  Private (freelancer marks done)
// ─────────────────────────────────────────
const markAsComplete = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    if (contract.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    contract.completionNote = req.body.completionNote || "Work completed";
    contract.status = "completed";
    await contract.save();

    // Update project status
    await Project.findByIdAndUpdate(contract.project, { status: "completed" });

    res.status(200).json({ success: true, message: "Contract marked as completed!", contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/contracts/:id/approve
// @access  Private (client approves)
// ─────────────────────────────────────────
const approveCompletion = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    if (contract.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    contract.approvedByClient = true;
    await contract.save();

    res.status(200).json({ success: true, message: "Completion approved! Project is done.", contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createContract, getMyContracts, getContractById, markAsComplete, approveCompletion };