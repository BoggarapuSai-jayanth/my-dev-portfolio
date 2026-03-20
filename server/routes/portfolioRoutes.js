const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/authMiddleware');

// Get default initial data if database is empty
const getInitialPortfolioData = () => {
  return {
    hero: {
      greeting: "Hi, I'm",
      name: "Boggarapu Sai Jayanth",
      description: "A passionate Full-Stack Developer specializing in the MERN stack. I build scalable, high-performance web applications with stunning user interfaces.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
    },
    about: {
      text1: "Hello! I'm a highly motivated full-stack developer who enjoys building engaging, accessible, and performant digital experiences. My journey into web development started back in college, and since then, I've had the privilege of building software for startups, mid-sized companies, and open-source projects.",
      text2: "My main focus these days is building robust APIs with Node.js and dynamic, responsive user interfaces with React. I'm deeply passionate about software architecture, clean code, and creating intuitive user experiences.",
      experienceYears: "3+",
      projectsCompleted: "20+",
      satisfactionRate: "100%",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000"
    },
    skills: [
      { title: "Frontend Development", items: ["React", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { title: "Backend Development", items: ["Node.js", "Express", "REST APIs", "GraphQL"] },
      { title: "Database & Cloud", items: ["MongoDB", "Mongoose", "PostgreSQL", "AWS S3"] },
      { title: "Tools & Methods", items: ["Git", "GitHub", "Docker", "Agile", "CI/CD"] }
    ],
    projects: [
      {
        title: "AI Call Automation System",
        description: "A production-ready full-stack application using MERN stack and Twilio for automating voice-based AI calls.",
        tags: ["React", "Node.js", "MongoDB", "Twilio", "OpenAI"],
        github: "https://github.com",
        demo: "https://demo.com",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        duration: "2018 - 2022",
        description: "Graduated with Honors. Specialized in Software Engineering and Web Technologies."
      }
    ],
    certifications: [
      {
        title: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services (AWS)",
        date: "Issued Jun 2023",
        link: "#",
        pdfUrl: ""
      }
    ],
    achievements: [
      {
        title: "1st Place - Global Hackathon 2023",
        description: "Built an AI-powered accessibility tool in 48 hours, competing against 500+ teams."
      }
    ],
    internships: [
      {
        role: "Software Engineering Intern",
        company: "Tech Solutions Inc.",
        duration: "May 2021 - Aug 2021",
        description: "Developed and maintained full-stack web applications using React and Node.js. Collaborated with senior engineers to design robust APIs."
      }
    ],
    training: [
      {
        title: "Full Stack Web Development Bootcamp",
        institution: "Coding Academy",
        duration: "Jan 2022 - Apr 2022",
        description: "Intensive 12-week program covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
        pdfUrl: ""
      }
    ]
  }
};

// GET /api/portfolio
// Public route to fetch portfolio data
router.get('/', async (req, res) => {

  try {
    let portfolio = await Portfolio.findOne();

    // If no portfolio exists, create an initial seed document
    if (!portfolio) {
      portfolio = await Portfolio.create(getInitialPortfolioData());
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Portfolio Fetch Error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
});

// PUT /api/portfolio
// Protected admin route to update entire portfolio or specific sections
router.put('/', protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    if (portfolio) {
      // Update fields that were sent in the request body
      if (req.body.hero) portfolio.hero = req.body.hero;
      if (req.body.about) portfolio.about = req.body.about;
      if (req.body.skills) portfolio.skills = req.body.skills;
      if (req.body.projects) portfolio.projects = req.body.projects;
      if (req.body.education) portfolio.education = req.body.education;
      if (req.body.certifications) portfolio.certifications = req.body.certifications;
      if (req.body.achievements) portfolio.achievements = req.body.achievements;
      if (req.body.internships) portfolio.internships = req.body.internships;
      if (req.body.training) portfolio.training = req.body.training;

      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ message: 'Portfolio document not found' });
    }
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

module.exports = router;
