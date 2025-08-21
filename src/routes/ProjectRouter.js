import { getProjectById, getProjects, postProject } from "../controllers/Controller.js";
import express from 'express';
const router= express.Router();
// router.post('/projects',postProject)
router.get('/projects',getProjects);
router.get('/projects/:id', getProjectById);
export default router;
