

import Project from "../models/projectModels.js";


// export const postProject = async (req, res) => {
//     try {
//         const { title, description, image, githubLink, liveLink, figmaLink, technologies, video } = req.body;

//         if (!title || !description || !image || !githubLink || !technologies) {
//             return res.status(400).json({ message: "All fields are required except liveLink, figmaLink, and video." });
//         }

//         const newProject = new Project({
//             title,
//             description,
//             image,
//             githubLink,
//             liveLink,
//             figmaLink,
//             technologies,
//             video
//         });

//         await newProject.save();
//         res.status(201).json({ message: "Project created successfully", project: newProject });
//     } catch (error) {
//         console.error("Error creating project:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

export const getProjects= async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    }
    catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}