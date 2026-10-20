const Student = require("../models/Student");

async function createStudent(req, res) {
  const student = await Student.create(req.validated.body);
  res.status(201).json({ student });
}

async function listStudents(req, res) {
  const { page, limit, search } = req.validated.query;
  const filter = search
    ? { fullName: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
    : {};

  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1, _id: 1 }).skip((page - 1) * limit).limit(limit),
    Student.countDocuments(filter),
  ]);

  res.json({
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  });
}

async function getStudent(req, res) {
  const student = await Student.findById(req.validated.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json({ student });
}

async function updateStudent(req, res) {
  const student = await Student.findByIdAndUpdate(
    req.validated.params.id,
    req.validated.body,
    { new: true, runValidators: true }
  );
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json({ student });
}

async function deleteStudent(req, res) {
  const student = await Student.findByIdAndDelete(req.validated.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.status(204).send();
}

module.exports = { createStudent, listStudents, getStudent, updateStudent, deleteStudent };
