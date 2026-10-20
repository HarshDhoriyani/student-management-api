const { z } = require("zod");

const studentFields = {
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  course: z.string().trim().min(2).max(100),
  age: z.coerce.number().int().min(1).max(120),
};

const studentBody = z.object(studentFields).strict();
const studentId = z.string().regex(/^[a-f\d]{24}$/i, "Must be a valid student ID");
const idParams = z.object({ id: studentId });
const studentIdRequest = z.object({ params: idParams });

const listStudents = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(100).optional(),
  }).strict(),
});

const registerBody = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
}).strict();

const loginBody = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72),
}).strict();

module.exports = {
  createStudent: z.object({ body: studentBody }),
  updateStudent: z.object({ params: idParams, body: studentBody }),
  studentIdRequest,
  listStudents,
  register: z.object({ body: registerBody }),
  login: z.object({ body: loginBody }),
};
