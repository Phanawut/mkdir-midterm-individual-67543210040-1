// src/presentation/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// TODO: Define routes
// GET /api/students
router.get('/', studentController.getAllStudents);

// GET /api/students/:id
// POST /api/students
// PUT /api/students/:id
// PATCH /api/students/:id/gpa
// PATCH /api/students/:id/status
// DELETE /api/students/:id

// ให้นักศึกษาเขียนเองต่อที่นี่

module.exports = router;