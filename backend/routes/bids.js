const express = require("express");
const router = express.Router();
const {
  createBid,
  getBidsForProject,
  getMyBids,
  acceptBid,
  deleteBid,
} = require("../controllers/bidController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get("/my",                  protect, authorizeRoles("freelancer"),  getMyBids);
router.get("/:projectId",          protect, authorizeRoles("client"),      getBidsForProject);
router.post("/:projectId",         protect, authorizeRoles("freelancer"),  createBid);
router.put("/:bidId/accept",       protect, authorizeRoles("client"),      acceptBid);
router.delete("/:bidId",           protect, authorizeRoles("freelancer"),  deleteBid);

module.exports = router;