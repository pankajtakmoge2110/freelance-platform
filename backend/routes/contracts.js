const express = require("express");
const router = express.Router();
const {
  createContract,
  getMyContracts,
  getContractById,
  markAsComplete,
  approveCompletion,
} = require("../controllers/contractController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.post("/",                   protect, authorizeRoles("client"),      createContract);
router.get("/",                    protect,                                getMyContracts);
router.get("/:id",                 protect,                                getContractById);
router.put("/:id/complete",        protect, authorizeRoles("freelancer"),  markAsComplete);
router.put("/:id/approve",         protect, authorizeRoles("client"),      approveCompletion);

module.exports = router;