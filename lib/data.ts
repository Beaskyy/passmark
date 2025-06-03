// Define the type for marked script data
export type MarkedScript = {
  scriptUploaded: string;
  studentId: number;
  courseCode: string;
  dateMarked: string;
  status: "Approved" | "Pending";
  actions: string[];
};

export const links = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "My Courses",
    href: "/my-courses",
  },
  {
    label: "Marked Scripts",
    href: "/marked-scripts",
  },
];

export const markedScriptsData: MarkedScript[] = [
  {
    scriptUploaded: "brown-james.pdf (PNG, 2.4 MB)",
    studentId: 22343,
    courseCode: "CSC 343",
    dateMarked: "Feb 21, 2023 at 03:05 pm",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.pdf (PDF, 2.4 MB)",
    studentId: 98403,
    courseCode: "CSC 343",
    dateMarked: "Aug 3, 2023 at 12:10 am",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.pdf (JPG, 2.4 MB)",
    studentId: 34324,
    courseCode: "CSC 343",
    dateMarked: "Feb 21, 2023 at 03:05 pm",
    status: "Pending",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.pdf (PDF, 2.4 MB)",
    studentId: 654345,
    courseCode: "CSC 343",
    dateMarked: "Jan 1, 2023 at 01:49 pm",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.pdf (JPG, 2.4 MB)",
    studentId: 543345,
    courseCode: "CSC 343",
    dateMarked: "Sep 4, 2021 at 12:14 am",
    status: "Pending",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.pdf (PDF, 2.4 MB)",
    studentId: 534563,
    courseCode: "CSC 343",
    dateMarked: "Aug 18, 2023 at 04:12 pm",
    status: "Pending",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.pdf (JPG, 2.4 MB)",
    studentId: 123432,
    courseCode: "CSC 343",
    dateMarked: "Jan 11, 2023 at 01:49 pm",
    status: "Approved",
    actions: ["View Script"],
  },
];
