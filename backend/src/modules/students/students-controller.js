const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const students = await getAllStudents(req.body);
    res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const studant = await addNewStudent(req.body);
    res.json(studant);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const studant = await updateStudent({ ...req.body, userId });
    res.json(studant);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const student = await getStudentDetail(userId);
    res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { status: systemAccess } = req.body;
    const studant = await updateStudent({ systemAccess, userId });
    res.json(studant);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
