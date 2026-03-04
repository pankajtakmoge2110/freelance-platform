const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} = require("../controllers/projectController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get("/",                protect,                        getAllProjects);
router.get("/my",              protect, authorizeRoles("client"), getMyProjects);
router.get("/:id",             protect,                        getProjectById);
router.post("/",               protect, authorizeRoles("client"), createProject);
router.put("/:id",             protect, authorizeRoles("client"), updateProject);
router.delete("/:id",          protect, authorizeRoles("client"), deleteProject);

module.exports = router;