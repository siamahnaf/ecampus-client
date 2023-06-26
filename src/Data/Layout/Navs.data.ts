interface Subs {
    name: string;
    url: string;
    id: string;
}
export interface NavsTypes {
    icon: string;
    name: string;
    url: string;
    id: string;
    sub?: Subs[];
}

//Data
const PrincipleNavs = [
    {
        icon: "material-symbols:dashboard",
        name: "Dashboard",
        url: "/",
        id: "dashboard"
    },
    {
        icon: "mdi:book-open-blank-variant",
        name: "Academics",
        url: "/academics",
        id: "academics",
        sub: [
            { name: "Section", url: "/academics/section", id: "section" },
            { name: "Group", url: "/academics/group", id: "group" },
            { name: "Shift", url: "/academics/shift", id: "shift" },
            { name: "Class", url: "/academics/class", id: "class" },
            { name: "Subject", url: "/academics/subject", id: "subject" },
            { name: "Class Room", url: "/academics/class-room", id: "classRoom" },
            { name: "Period", url: "/academics/period", id: "period" },
            { name: "Class Routine", url: "/academics/class-routine", id: "cRoutine" },
            { name: "Teacher Routine", url: "/academics/teacher-routine", id: "tRoutine" }
        ]
    },
    {
        icon: "mdi:people-group",
        name: "Student",
        url: "/students",
        id: "students",
        sub: [
            { name: "Add Student", url: "/students/add-student", id: "addStudent" },
            { name: "Student List", url: "/students/student-list", id: "studentList" },
            { name: "Promote Student", url: "/students/promote-student", id: "promoteStudent" },
            { name: "Bulk Upload", url: "/students/bulk-upload", id: "bulkUpload" }
        ]
    },
    {
        icon: "ic:round-people",
        name: "Staff",
        url: "/staff",
        id: "staff",
        sub: [
            { name: "Add Teacher", url: "/staff/add-teacher", id: "addTeacher" },
            { name: "Teacher List", url: "/staff/teacher-list", id: "teacherList" }
        ]
    },
    {
        icon: "mdi:file-document",
        name: "Attendance",
        url: "/attendance",
        id: "attendance",
        sub: [
            { name: "Add Attendance", url: "/attendance/add-attendance", id: "addAttendance" },
            { name: "Attendance Report", url: "/attendance/attendance-report", id: "attendanceReport" }
        ]
    },
    {
        icon: "material-symbols:credit-card",
        name: "Fees",
        url: "/fee",
        id: "fee",
        sub: [
            { name: "Add Fee", url: "/fee/add-fees", id: "addFee" },
            { name: "Weaver", url: "/fee/weaver", id: "weaver" },
            { name: "Offline Payment", url: "/fee/offline-payment", id: "offlinePayment" },
            { name: "Invoice", url: "/fee/invoice", id: "invoice" }
        ]
    },
    {
        icon: "solar:wallet-money-bold",
        name: "Income",
        url: "/income",
        id: "income",
        sub: [
            { name: "Add Income", url: "/income/add-income", id: "addIncome" },
            { name: "Income Head", url: "/income/income-head", id: "incomeHead" }
        ]
    },
    {
        icon: "ic:round-payments",
        name: "Expense",
        url: "/expense",
        id: "expense",
        sub: [
            { name: "Add Expense", url: "/expense/add-expense", id: "addExpense" },
            { name: "Expense Head", url: "/expense/expense-head", id: "expenseHead" }
        ]
    },
    {
        icon: "material-symbols:report-rounded",
        name: "Complain",
        url: "/complain",
        id: "complain"
    },
    {
        icon: "fluent:communication-person-20-filled",
        name: "Communication",
        url: "/communication",
        id: "communication",
        sub: [
            { name: "Notification", url: "/communication/notifications", id: "notification" },
            { name: "Notification List", url: "/communication/notification-list", id: "notificationList" }
        ]
    },
    {
        icon: "fe:notice-active",
        name: "Notice Board",
        url: "/notice-board",
        id: "notice"
    },
    {
        icon: "healthicons:i-exam-multiple-choice",
        name: "Examination",
        url: "/examination",
        id: "examination",
        sub: [
            { name: "Add Exam", url: "/examination/add-exam", id: "addExam" },
            { name: "Add Exam Result", url: "/examination/add-exam-result", id: "addExamResult" },
            { name: "Exam Result", url: "/examination/exam-result", id: "examResult" },
            { name: "Grade System", url: "/examination/grade-system", id: "gradeSystem" },
            { name: "Exam Conf", url: "/examination/exam-conf", id: "examConf" }
        ]
    },
    {
        icon: "material-symbols:settings",
        name: "Settings",
        url: "/settings",
        id: "settings",
        sub: [
            { name: "User Profile", url: "/settings/user-profile", id: "userProfile" },
            { name: "Site Settings", url: "/settings/site-settings", id: "siteSettings" },
            { name: "Edit Portfolio", url: "/settings/edit-portfolio", id: "editPortfolio" },
            { name: "Admin", url: "/settings/admin", id: "admin" }
        ]
    }
]


const AccountantNavs = [
    {
        icon: "material-symbols:dashboard",
        name: "Dashboard",
        url: "/",
        id: "dashboard"
    },
    {
        icon: "mdi:book-open-blank-variant",
        name: "Academics",
        url: "/academics",
        id: "academics",
        sub: [
            { name: "Section", url: "/academics/section", id: "section" },
            { name: "Group", url: "/academics/group", id: "group" },
            { name: "Shift", url: "/academics/shift", id: "shift" },
            { name: "Class", url: "/academics/class", id: "class" },
            { name: "Subject", url: "/academics/subject", id: "subject" },
            { name: "Class Room", url: "/academics/class-room", id: "classRoom" },
            { name: "Period", url: "/academics/period", id: "period" },
            { name: "Class Routine", url: "/academics/class-routine", id: "cRoutine" },
            { name: "Teacher Routine", url: "/academics/teacher-routine", id: "tRoutine" }
        ]
    },
    {
        icon: "mdi:people-group",
        name: "Student",
        url: "/students",
        id: "students",
        sub: [
            { name: "Add Student", url: "/students/add-student", id: "addStudent" },
            { name: "Student List", url: "/students/student-list", id: "studentList" },
            { name: "Promote Student", url: "/students/promote-student", id: "promoteStudent" },
            { name: "Bulk Upload", url: "/students/bulk-upload", id: "bulkUpload" }
        ]
    },
    {
        icon: "ic:round-people",
        name: "Staff",
        url: "/staff",
        id: "staff",
        sub: [
            { name: "Add Teacher", url: "/staff/add-teacher", id: "addTeacher" },
            { name: "Teacher List", url: "/staff/teacher-list", id: "teacherList" }
        ]
    },
    {
        icon: "mdi:file-document",
        name: "Attendance",
        url: "/attendance",
        id: "attendance",
        sub: [
            { name: "Add Attendance", url: "/attendance/add-attendance", id: "addAttendance" },
            { name: "Attendance Report", url: "/attendance/attendance-report", id: "attendanceReport" }
        ]
    },
    {
        icon: "fe:notice-active",
        name: "Notice Board",
        url: "/notice-board",
        id: "notice"
    },
    {
        icon: "fluent:communication-person-20-filled",
        name: "Communication",
        url: "/communication",
        id: "communication",
        sub: [
            { name: "Notification", url: "/communication/notifications", id: "notification" },
            { name: "Notification List", url: "/communication/notification-list", id: "notificationList" }
        ]
    },
    {
        icon: "healthicons:i-exam-multiple-choice",
        name: "Examination",
        url: "/examination",
        id: "examination",
        sub: [
            { name: "Add Exam", url: "/examination/add-exam", id: "addExam" },
            { name: "Add Exam Result", url: "/examination/add-exam-result", id: "addExamResult" },
            { name: "Exam Result", url: "/examination/exam-result", id: "examResult" },
            { name: "Grade System", url: "/examination/grade-system", id: "gradeSystem" },
            { name: "Exam Conf", url: "/examination/exam-conf", id: "examConf" }
        ]
    },
    {
        icon: "material-symbols:settings",
        name: "Settings",
        url: "/settings",
        id: "settings",
        sub: [
            { name: "User Profile", url: "/settings/user-profile", id: "userProfile" },
            { name: "Edit Portfolio", url: "/settings/edit-portfolio", id: "editPortfolio" }
        ]
    }
]

const TeacherNavs = [
    {
        icon: "material-symbols:dashboard",
        name: "Dashboard",
        url: "/",
        id: "dashboard"
    },
    {
        icon: "mdi:file-document",
        name: "Attendance",
        url: "/attendance",
        id: "attendance",
        sub: [
            { name: "Add Attendance", url: "/attendance/add-attendance", id: "addAttendance" },
            { name: "Attendance Report", url: "/attendance/attendance-report", id: "attendanceReport" }
        ]
    },
    {
        icon: "fe:notice-active",
        name: "Notice Board",
        url: "/teacher-notice",
        id: "notice"
    },
    {
        icon: "healthicons:i-exam-multiple-choice",
        name: "Examination",
        url: "/examination",
        id: "examination",
        sub: [
            { name: "Add Exam Result", url: "/examination/add-exam-result", id: "addExamResult" },
            { name: "Exam Result", url: "/examination/exam-result", id: "examResult" }
        ]
    },
    {
        icon: "material-symbols:settings",
        name: "Settings",
        url: "/settings",
        id: "settings",
        sub: [
            { name: "User Profile", url: "/settings/user-profile", id: "userProfile" }
        ]
    }
]

export { PrincipleNavs, AccountantNavs, TeacherNavs }