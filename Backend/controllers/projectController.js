import Project from "../models/project.js";
import fs from "fs";
import path from "path";

// Add new project
export const addProject = async (req, res) => {
  try {
    const { title, liveUrl } = req.body;
    const image = req.file ? `/uploads/projects/${req.file.filename}` : null;

    if (!title || !image) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const project = await Project.create({ title, image, liveUrl });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, liveUrl } = req.body;
    const image = req.file ? `/uploads/projects/${req.file.filename}` : null;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = title || project.title;
    project.liveUrl = liveUrl || project.liveUrl;
    if (image) project.image = image;

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete image from filesystem
    if (project.image) {
      const imagePath = path.join(
        process.cwd(),
        "uploads/projects",
        path.basename(project.image)
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
