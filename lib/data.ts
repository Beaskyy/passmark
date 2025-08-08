export type MarkedScript = {
  script_id: string;
  student_id: string;
  student: {
    student_id: string;
    student_number: string;
    full_name: string;
  };
  assessment_id: string;
  assessment: {
    assessment_id: string;
    title: string;
    description: string;
    total_marks: number;
  };
  course_id: string;
  course: {
    course_id: string;
    title: string;
    code: string;
    session: string;
    description: string;
  };
  status: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: string;
  marked_comment: string | null;
  total_mark_awarded: number;
  total_questions_evaluated: number;
  extract: string | null;
  marked_at: string | null;
  created_at: string;
  updated_at: string;
  actions?: string[];
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

export const markedScriptsData = [
  {
    scriptUploaded: "brown-james.png",
    studentId: 22343,
    courseCode: "CSC 343",
    studentScore: "65",
    dateMarked: "Feb 21, 2023 at 03:05 pm",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.pdf",
    studentId: 98403,
    courseCode: "CSC 343",
    studentScore: "23",
    dateMarked: "Aug 3, 2023 at 12:10 am",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.jpg",
    studentId: 34324,
    courseCode: "CSC 343",
    studentScore: "34",
    dateMarked: "Feb 21, 2023 at 03:05 pm",
    status: "Requires attention",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.pdf",
    studentId: 654345,
    courseCode: "CSC 343",
    studentScore: "40",
    dateMarked: "Jan 1, 2023 at 01:49 pm",
    status: "Approved",
    actions: ["View Script"],
  },
  {
    scriptUploaded: "brown-james.jpg",
    studentId: 543345,
    courseCode: "CSC 343",
    studentScore: "79",
    dateMarked: "Sep 4, 2021 at 12:14 am",
    status: "Pending",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.pdf",
    studentId: 534563,
    courseCode: "CSC 343",
    studentScore: "50",
    dateMarked: "Aug 18, 2023 at 04:12 pm",
    status: "Pending",
    actions: ["View Script", "Approve"],
  },
  {
    scriptUploaded: "brown-james.jpg",
    studentId: 123432,
    courseCode: "CSC 343",
    studentScore: "23",
    dateMarked: "Jan 11, 2023 at 01:49 pm",
    status: "Approved",
    actions: ["View Script"],
  },
];

export type UnitHistory = {
  units: string;
  amountPaid: string;
  transactionId: string;
  transactionDate: string;
  status: "Success" | "Pending";
};

export const unitHistoryData: UnitHistory[] = [
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Feb 21, 2023 at 03:05 pm",
    status: "Success",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Aug 3, 2023 at 12:10 am",
    status: "Success",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Feb 21, 2023 at 03:05 pm",
    status: "Pending",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Jan 1, 2023 at 01:49 pm",
    status: "Success",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Sep 4, 2021 at 12:14 am",
    status: "Pending",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Aug 18, 2023 at 04:12 pm",
    status: "Pending",
  },
  {
    units: "50,000 Units",
    amountPaid: "₦300,000",
    transactionId: "12304-3405JK",
    transactionDate: "Jan 11, 2023 at 01:49 pm",
    status: "Success",
  },
];
