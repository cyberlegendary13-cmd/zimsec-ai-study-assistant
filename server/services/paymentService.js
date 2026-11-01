const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config');

const docsPath = path.join(DATA_DIR, 'documents.json');
const studentsPath = path.join(DATA_DIR, 'students.json');

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

ensureFile(docsPath, { documents: [] });
ensureFile(studentsPath, { students: [] });

async function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function saveDocument(record) {
  const data = await readJson(docsPath);
  data.documents.unshift(record);
  await writeJson(docsPath, data);
  return record;
}

async function getAllDocuments() {
  const data = await readJson(docsPath);
  return data.documents || [];
}

async function getStudentSummary() {
  const data = await readJson(studentsPath);
  return {
    totalStudents: data.students.length,
    totalDocuments: (await getAllDocuments()).length,
    students: data.students
  };
}

module.exports = {
  saveDocument,
  getAllDocuments,
  getStudentSummary,
  readJson,
  writeJson
};
