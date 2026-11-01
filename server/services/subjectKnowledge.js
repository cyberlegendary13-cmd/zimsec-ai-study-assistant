const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config');

const subjectDataPath = path.join(process.cwd(), DATA_DIR, 'zimsec-subjects.json');
const studentDataPath = path.join(process.cwd(), DATA_DIR, 'students.json');
const activityDataPath = path.join(process.cwd(), DATA_DIR, 'activity.json');

function ensureJson(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

ensureJson(subjectDataPath, {
  subjects: [
    {
      id: 'mathematics',
      name: 'Mathematics',
      level: 'O Level',
      chapters: [
        'Number and indices',
        'Algebra',
        'Geometry',
        'Trigonometry',
        'Statistics',
        'Graphs and functions'
      ],
      examTips: [
        'Practice past papers under timed conditions.',
        'Memorize formulas and revise common mistakes.'
      ]
    },
    {
      id: 'combined-science',
      name: 'Combined Science',
      level: 'O Level',
      chapters: [
        'Biology',
        'Chemistry',
        'Physics',
        'Practical skills',
        'Scientific method'
      ],
      examTips: [
        'Revise diagrams and definitions.',
        'Practice formula-based calculations.'
      ]
    },
    {
      id: 'geography',
      name: 'Geography',
      level: 'O Level',
      chapters: [
        'Mapwork',
        'Weather and climate',
        'Population',
        'Settlement',
        'Natural resources',
        'Economic geography'
      ],
      examTips: [
        'Learn key terminology and examples.',
        'Practice map interpretation and case studies.'
      ]
    },
    {
      id: 'shona',
      name: 'Shona',
      level: 'O Level',
      chapters: [
        'Grammar',
        'Comprehension',
        'Composition',
        'Literature',
        'Oral practice'
      ],
      examTips: [
        'Read widely and practice paragraph structure.',
        'Practice oral speaking and grammar correction.'
      ]
    },
    {
      id: 'english',
      name: 'English',
      level: 'O Level',
      chapters: [
        'Comprehension',
        'Summary writing',
        'Grammar',
        'Directed writing',
        'Literature'
      ],
      examTips: [
        'Summaries must be concise and accurate.',
        'Use topic sentences and clear paragraphs.'
      ]
    },
    {
      id: 'heritage',
      name: 'Heritage',
      level: 'O Level',
      chapters: [
        'Culture and identity',
        'Local history',
        'Cultural values',
        'Heritage sites',
        'Community traditions'
      ],
      examTips: [
        'Use examples from local communities.',
        'Explain relevance to national identity.'
      ]
    },
    {
      id: 'commerce',
      name: 'Commerce',
      level: 'O Level',
      chapters: [
        'Trade and business',
        'Marketing',
        'Finance',
        'Production',
        'Enterprise'
      ],
      examTips: [
        'Define business terms clearly.',
        'Use real-life examples in explanations.'
      ]
    },
    {
      id: 'accounts',
      name: 'Accounts',
      level: 'O Level',
      chapters: [
        'Double entry',
        'Cash book',
        'Ledger accounts',
        'Trial balance',
        'Final accounts'
      ],
      examTips: [
        'Balance entries carefully and practice posting.',
        'Check arithmetic before answering.'
      ]
    }
  ]
});

ensureJson(studentDataPath, { students: [] });
ensureJson(activityDataPath, { activity: [] });

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getSubjects() {
  return readJson(subjectDataPath).subjects;
}

function getSubjectById(subjectId) {
  const subjects = getSubjects();
  return subjects.find((subject) => subject.id === subjectId);
}

function registerStudent(student) {
  const data = readJson(studentDataPath);
  const existing = data.students.find((item) => item.phone === student.phone);

  if (existing) {
    Object.assign(existing, student);
    writeJson(studentDataPath, data);
    return existing;
  }

  data.students.push({
    id: student.id || `student-${Date.now()}`,
    name: student.name || 'Student',
    phone: student.phone,
    subjects: student.subjects || [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });

  writeJson(studentDataPath, data);
  return data.students[data.students.length - 1];
}

function logActivity(entry) {
  const data = readJson(activityDataPath);
  data.activity.unshift({
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry
  });
  writeJson(activityDataPath, data);
  return data.activity[0];
}

function getAllStudents() {
  return readJson(studentDataPath).students;
}

function getActivityLog() {
  return readJson(activityDataPath).activity;
}

function getUsageStats() {
  const students = getAllStudents();
  const activity = getActivityLog();

  const subjectCounts = {};
  for (const item of activity) {
    if (!item.subject) continue;
    subjectCounts[item.subject] = (subjectCounts[item.subject] || 0) + 1;
  }

  return {
    totalStudents: students.length,
    totalMessages: activity.length,
    mostUsedSubjects: Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    recentActivity: activity.slice(0, 10)
  };
}

module.exports = {
  getSubjects,
  getSubjectById,
  registerStudent,
  logActivity,
  getAllStudents,
  getActivityLog,
  getUsageStats
};
