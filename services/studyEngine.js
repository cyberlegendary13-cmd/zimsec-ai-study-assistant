function buildTwoWeekPlan(subject = 'mathematics') {
  const clean = String(subject || 'mathematics').trim().toLowerCase();
  const label = clean.charAt(0).toUpperCase() + clean.slice(1);

  return [
    `2-Week ZIMSEC Ready Plan for ${label}`,
    '1. Day 1-2: core syllabus basics and formula review',
    '2. Day 3-4: high-frequency exam questions and common mistakes',
    '3. Day 5-6: timed practice and topic mastery checking',
    '4. Day 7: review weak areas and redo mistakes',
    '5. Day 8-9: intensify working under timed conditions',
    '6. Day 10: practice full section questions',
    '7. Day 11: past paper style revision',
    '8. Day 12: difficult topics and exam traps',
    '9. Day 13: light review + formula recall + final notes',
    '10. Day 14: final prep, confidence-building, and full paper practice',
    '',
    'Study rule: revise daily, solve timed questions, and review mistakes before moving on.'
  ].join('\n');
}

function buildStudySummary(subject = 'general', topic = 'general topic') {
  return [
    `Study Summary: ${subject.toUpperCase()} - ${topic}`,
    '- Understand the key concept first.',
    '- Learn the most common rules, formulas, or themes.',
    '- Practice at least 5 exam-style questions.',
    '- Review errors and note the recurring pattern.',
    '- Convert notes into short revision points for quick revision.'
  ].join('\n');
}

function buildQuiz(subject = 'mathematics', count = 5) {
  const label = String(subject || 'mathematics').trim();
  const questions = [];

  for (let i = 1; i <= Number(count) || 5; i++) {
    questions.push(`${i}. ${label} quick question: explain the concept, solve the problem, and give the final answer in exam style.`);
  }

  return [
    `Quick Quiz: ${label}`,
    ...questions,
    '',
    'Reply with your answer and I will guide you step by step.'
  ].join('\n');
}

function analyzeSubject(subject = 'mathematics') {
  const label = String(subject || 'mathematics').trim();
  return [
    `Topic Priority Analysis for ${label}`,
    '1. Focus on high-frequency syllabus topics first.',
    '2. Prioritize topics with high question repetition.',
    '3. Review common mistakes and weak areas every 2 days.',
    '4. Mix theory revision with timed practice.',
    '5. Keep a small mistakes list for final revision.',
    '',
    'Tip: Start by identifying the chapter areas that appear most often in past papers and practice them first.'
  ].join('\n');
}

module.exports = {
  buildTwoWeekPlan,
  buildStudySummary,
  buildQuiz,
  analyzeSubject
};
