const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getProjectMessages,
  getUnreadCount,
  getConversations,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.post("/",                    protect, sendMessage);
router.get("/unread",               protect, getUnreadCount);
router.get("/conversations",        protect, getConversations);
router.get("/:projectId",           protect, getProjectMessages);

module.exports = router;