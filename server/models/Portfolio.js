const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  hero: {
    greeting: { type: String, default: "Hi, I'm" },
    name: { type: String, default: "Boggarapu Sai Jayanth" },
    description: { type: String, default: "A passionate Full-Stack Developer specializing in the MERN stack." },
    image: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    github: { type: String, default: "https://github.com" },
    linkedin: { type: String, default: "https://linkedin.com" },
    email: { type: String, default: "hello@example.com" },
    twitter: { type: String, default: "" }
  },
  about: {
    text1: { type: String, default: "Hello! I'm a highly motivated full-stack developer who enjoys building engaging, accessible, and performant digital experiences. My journey into web development started back in college, and since then, I've had the privilege of building software for startups, mid-sized companies, and open-source projects." },
    text2: { type: String, default: "My main focus these days is building robust APIs with Node.js and dynamic, responsive user interfaces with React. I'm deeply passionate about software architecture, clean code, and creating intuitive user experiences." },
    text3: { type: String, default: "" },
    experienceYears: { type: String, default: "3+" },
    projectsCompleted: { type: String, default: "20+" },
    satisfactionRate: { type: String, default: "100%" },
    image: { type: String, default: "" }
  },
  skills: [{
    title: { type: String, required: true },
    items: [{ type: String }]
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    github: { type: String },
    demo: { type: String },
    image: { type: String, default: "" }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, required: true },
    status: { type: String, default: "Currently Pursuing" },
    cgpa: { type: String, default: "" }
  }],
  certifications: [{
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    link: { type: String },
    pdfUrl: { type: String, default: "" }
  }],
  achievements: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  internships: [{
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String }
  }],
  training: [{
    title: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String },
    pdfUrl: { type: String, default: "" }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
