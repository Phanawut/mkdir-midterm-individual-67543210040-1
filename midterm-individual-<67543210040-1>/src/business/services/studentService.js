// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    // TODO: Implement getAllStudents
    async getAllStudents(major = null, status = null) {
        // 1. Validate filters (if provided)
        // 2. เรียก studentRepository.findAll(major, status)
        // 3. คำนวณสถิติ (active, graduated, suspended, total, avgGPA)
        // 4. return { students, statistics }
    }

    // TODO: Implement getStudentById
    async getStudentById(id) {
        // 1. Validate ID
        // 2. เรียก repository
        // 3. ถ้าไม่เจอ throw NotFoundError
        // 4. return student
    }

    // TODO: Implement createStudent
    async createStudent(studentData) {
        // 1. Validate student data
        // 2. Validate student_code format
        // 3. Validate email format
        // 4. Validate major
        // 5. เรียก repository.create()
        // 6. return created student
    }

    // TODO: Implement updateStudent
    async updateStudent(id, studentData) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement updateGPA
    async updateGPA(id, gpa) {
        // 1. Validate GPA range (0.0 - 4.0)
        // 2. ดึงนักศึกษาจาก repository
        // 3. เรียก repository.updateGPA(id, gpa)
        // 4. return updated student
    }

    // TODO: Implement updateStatus
    async updateStatus(id, status) {
        // 1. Validate status
        // 2. ดึงนักศึกษาจาก repository
        // 3. ตรวจสอบ business rule: ไม่สามารถเปลี่ยนสถานะ withdrawn ได้
        // 4. เรียก repository.updateStatus(id, status)
        // 5. return updated student
    }

    // TODO: Implement deleteStudent
    async deleteStudent(id) {
        // 1. ดึงนักศึกษาจาก repository
        // 2. ตรวจสอบ business rule: ไม่สามารถลบ active student
        // 3. เรียก repository.delete(id)
    }
}

module.exports = new StudentService();