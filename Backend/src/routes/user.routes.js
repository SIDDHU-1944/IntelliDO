import { Router } from "express";
import { login, logout, register, getUser, addTask, addList, handleAITask, AIsuggestions } from "../controllers/user.controller.js";
import { requireAuth, progress } from "../../middleware.js";


let router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(requireAuth ,logout);
router.route("/me").get(requireAuth, getUser);
router.route("/addTask").post(requireAuth, addTask);
router.route("/addList").post(requireAuth, addList);
router.route("/aiAddTask").post(requireAuth, handleAITask);
router.route("/suggestions").post(requireAuth, AIsuggestions);
router.route("/getProgress").get(progress, (req, res) => {
  return res.status(200).json({ message: "Progress updated for yesterday." });
}); 



export default router;