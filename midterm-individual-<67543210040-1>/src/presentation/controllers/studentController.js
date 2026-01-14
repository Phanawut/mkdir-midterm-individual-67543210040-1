// src/presentation/controllers/studentController.js
const studentService = require('../../business/services/studentService');

class StudentController {
    // TODO: Implement getAllStudents
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            // เรียก studentService.getAllStudents()
            // ส่ง response กลับ
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement getStudentById
    async getStudentById(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement createStudent
    async createStudent(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement updateStudent
    async updateStudent(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement updateGPA
    async updateGPA(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement updateStatus
    async updateStatus(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement deleteStudent
    async deleteStudent(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }
}

module.exports = new StudentController();