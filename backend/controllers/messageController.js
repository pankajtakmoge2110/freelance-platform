const Message = require("../models/Message");
const Project = require("../models/Project");

// ─────────────────────────────────────────
// @route   POST /api/messages
// @access  Private
// ─────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiverId, projectId, content } = req.body;

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      project: projectId,
      content,
    });

    await message.populate("sender", "name email");
    await message.populate("receiver", "name email");

    res.status(201).json({ success: true, message: "Message sent!", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/messages/:projectId
// @access  Private
// ─────────────────────────────────────────
const getProjectMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      project: req.params.projectId,
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { project: req.params.projectId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/messages/unread
// @access  Private
// ─────────────────────────────────────────
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    res.status(200).json({ success: true, unreadCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/messages/conversations
// @access  Private
// ─────────────────────────────────────────
const getConversations = async (req, res) => {
  try {
    // Get all unique conversations for current user
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    // Get unique conversations by project
    const seen = new Set();
    const conversations = messages.filter((msg) => {
      const key = msg.project._id.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.status(200).json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getProjectMessages, getUnreadCount, getConversations };