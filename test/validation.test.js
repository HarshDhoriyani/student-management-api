const test = require("node:test");
const assert = require("node:assert/strict");
const schemas = require("../src/validation/schemas");

const validStudent = {
  fullName: "Ada Lovelace",
  email: "ADA@example.com",
  course: "Computer Science",
  age: 20,
};

test("student create validation trims input and normalizes email", () => {
  const result = schemas.createStudent.safeParse({
    body: { ...validStudent, fullName: " Ada Lovelace " },
    params: {},
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.fullName, "Ada Lovelace");
  assert.equal(result.data.body.email, "ada@example.com");
});

test("student create validation rejects missing fields, invalid email, and fractional age", () => {
  const result = schemas.createStudent.safeParse({
    body: { fullName: "A", email: "not-an-email", course: "Math", age: 19.5 },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.length >= 3);
});

test("student listing defaults pagination and rejects limits over 100", () => {
  const defaults = schemas.listStudents.safeParse({ body: {}, params: {}, query: {} });
  assert.equal(defaults.success, true);
  assert.deepEqual(defaults.data.query, { page: 1, limit: 10 });

  const tooMany = schemas.listStudents.safeParse({
    body: {},
    params: {},
    query: { page: "1", limit: "101" },
  });
  assert.equal(tooMany.success, false);
});

test("student update requires a complete valid student record and valid ID", () => {
  const result = schemas.updateStudent.safeParse({
    body: validStudent,
    params: { id: "not-an-object-id" },
    query: {},
  });
  assert.equal(result.success, false);
});
