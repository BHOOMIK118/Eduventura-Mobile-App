export const MAJOR_SUBJECTS = [
  "Science",
  "Mathematics",
  "Engineering",
  "Medicine",
  "Law",
  "Arts",
  "Commerce",
  "Education",
  "Information Technology",
  "Business Administration",
  "Economics",
  "Psychology",
  "History",
  "Political Science",
  "Sociology",
].map((item) => ({
  value: item,
  label: item,
}));

export const DEGREE_OPTIONS = [
  "Undergraduate",
  "Diploma",
  "Senior High School",
  "Doctorate",
].map((item) => ({
  value: item,
  label: item,
}));

export const GRADING_OPTIONS = [
  "Percentage (1-100)",
  "CGPA10 (1-10)",
  "CGPA4 (1-4)",
  "CGPA5 (1-5)",
  "CGPA7 (1-7)",
].map((item) => ({ value: item, label: item }));

export const TEST_OPTIONS = [
  "TOEFL",
  "PTE Academic",
  "C1 Advanced(CAE)",
  "IELTS",
  "Duolingo",
  "OET",
  "LanguageCert International ESOL",
  "CAEL",
  "CAELGoethe-Zertifikat",
  "TestDaF",
].map((item) => ({ value: item, label: item }));

export const BACKLOG_OPTIONS = [
  { label: "0", value: ")" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
