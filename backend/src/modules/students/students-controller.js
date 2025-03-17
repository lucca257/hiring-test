const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const students = await getAllStudents(req.body);
    res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const student = await addNewStudent(req.body);
    res.json(student);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const student = await updateStudent({ ...req.body, userId });
    res.json(student);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const student = await getStudentDetail(userId);
    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { status } = req.body;
    const { id: reviewerId } = req.user;

    const student = await setStudentStatus({ userId, reviewerId, status })
    res.json(student);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
