jest.mock('resend', () => {
    return {
        Resend: jest.fn().mockImplementation(() => {
            return {
                emails: {
                    send: jest.fn().mockResolvedValue({ id: 'mock-email-id' })
                }
            };
        })
    };
});

// Mock environment variables
process.env.RESEND_API_KEY = 're_test_key';

const {
    getAllStudents,
    addNewStudent,
    getStudentDetail,
    updateStudent
} = require('./students-service');
const {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent
} = require('./students-controller');

jest.mock('./students-service');

const mockRequest = (body = {}, params = {}) => ({
    body,
    params
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Students Controller Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handleGetAllStudents', () => {
        it('should return all students successfully', async () => {
            const mockStudents = [
                { id: '1', name: 'Student 1', email: 'student1@example.com' },
                { id: '2', name: 'Student 2', email: 'student2@example.com' }
            ];
            const req = mockRequest({ page: 1, limit: 10 });
            const res = mockResponse();
            getAllStudents.mockResolvedValue(mockStudents);

            await handleGetAllStudents(req, res);

            expect(getAllStudents).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith({ students: mockStudents });
        });

        it('should handle errors properly', async () => {
            const errorMessage = 'Students not found';
            const req = mockRequest({ page: 1, limit: 10 });
            const res = mockResponse();
            const next = jest.fn();

            getAllStudents.mockRejectedValue(new Error(errorMessage));

            await expect(handleGetAllStudents(req, res, next)).resolves.not.toThrow();
            expect(getAllStudents).toHaveBeenCalledWith(req.body);
        });
    });

    describe('handleGetStudentDetail', () => {
        it('should return student details when student exists', async () => {
            const studentId = '123';
            const mockStudent = {
                id: studentId,
                name: 'Test Student',
                email: 'test@example.com'
            };
            const req = mockRequest({}, { id: studentId });
            const res = mockResponse();
            getStudentDetail.mockResolvedValue(mockStudent);

            await handleGetStudentDetail(req, res);

            expect(getStudentDetail).toHaveBeenCalledWith(studentId);
            expect(res.json).toHaveBeenCalledWith(mockStudent);
        });

        it('should handle student not found error', async () => {
            const studentId = '999';
            const errorMessage = 'Student not found';
            const req = mockRequest({}, { id: studentId });
            const res = mockResponse();
            const next = jest.fn();

            getStudentDetail.mockRejectedValue(new Error(errorMessage));

            await expect(handleGetStudentDetail(req, res, next)).resolves.not.toThrow();
            expect(getStudentDetail).toHaveBeenCalledWith(studentId);
        });
    });

    describe('handleAddStudent', () => {
        it('should add a new student successfully', async () => {
            const newStudent = {
                name: 'New Student',
                email: 'new@example.com',
                password: 'password123'
            };
            const successResponse = {
                message: 'Student added and verification email sent successfully.'
            };
            const req = mockRequest(newStudent);
            const res = mockResponse();
            addNewStudent.mockResolvedValue(successResponse);

            await handleAddStudent(req, res);

            expect(addNewStudent).toHaveBeenCalledWith(newStudent);
            expect(res.json).toHaveBeenCalledWith(successResponse);
        });

        it('should handle error when adding student fails', async () => {
            const newStudent = {
                name: 'New Student',
                email: 'new@example.com',
                password: 'password123'
            };
            const req = mockRequest(newStudent);
            const res = mockResponse();
            const next = jest.fn();

            addNewStudent.mockRejectedValue(new Error('Unable to add student'));

            await expect(handleAddStudent(req, res, next)).resolves.not.toThrow();
            expect(addNewStudent).toHaveBeenCalledWith(newStudent);
        });
    });

    describe('handleUpdateStudent', () => {
        it('should update student successfully', async () => {
            const studentId = '123';
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com'
            };
            const successResponse = {
                message: 'Student updated successfully'
            };
            const req = mockRequest(updateData, { id: studentId });
            const res = mockResponse();
            updateStudent.mockResolvedValue(successResponse);

            await handleUpdateStudent(req, res);

            expect(updateStudent).toHaveBeenCalledWith({
                ...updateData,
                userId: studentId
            });
            expect(res.json).toHaveBeenCalledWith(successResponse);
        });

        it('should handle error when updating student fails', async () => {
            const studentId = '123';
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com'
            };
            const req = mockRequest(updateData, { id: studentId });
            const res = mockResponse();
            const next = jest.fn();

            updateStudent.mockRejectedValue(new Error('Unable to update student'));

            await expect(handleUpdateStudent(req, res, next)).resolves.not.toThrow();
            expect(updateStudent).toHaveBeenCalledWith({
                ...updateData,
                userId: studentId
            });
        });
    });

    describe('handleStudentStatus', () => {
        it('should update student status successfully', async () => {
            const studentId = '123';
            const statusData = { status: 'INACTIVE' };
            const successResponse = {
                message: 'Student status changed successfully'
            };
            const req = mockRequest(statusData, { id: studentId });
            const res = mockResponse();
            updateStudent.mockResolvedValue(successResponse);

            await handleStudentStatus(req, res);

            expect(updateStudent).toHaveBeenCalledWith({
                systemAccess: 'INACTIVE',
                userId: studentId
            });
            expect(res.json).toHaveBeenCalledWith(successResponse);
        });

        it('should handle error when updating student status fails', async () => {
            const studentId = '123';
            const statusData = { status: 'INACTIVE' };
            const req = mockRequest(statusData, { id: studentId });
            const res = mockResponse();
            const next = jest.fn();

            updateStudent.mockRejectedValue(new Error('Unable to update student status'));

            // Act & Assert
            await expect(handleStudentStatus(req, res, next)).resolves.not.toThrow();
            expect(updateStudent).toHaveBeenCalledWith({
                systemAccess: 'INACTIVE',
                userId: studentId
            });
        });
    });
});