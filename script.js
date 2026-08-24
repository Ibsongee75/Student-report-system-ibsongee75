/* =========================================
   SUPABASE CONNECTION
========================================= */

// IMPORTANT:
// Replace these two values with your own
// Supabase Project URL and Publishable/Anon Key.

const SUPABASE_URL = "https://nzeddvcmabfodmvmgsyg.supabase.co";
const SUPABASE_KEY = "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================
   GLOBAL VARIABLES
========================================= */

let studenlet students = [];

let reportSettings = {
    schoolName: "YOUR SCHOOL NAME",
    schoolAddress: "YOUR SCHOOL ADDRESS",
    caMaximum: 40,
    examsMaximum: 60,
    gradeA: 70,
    gradeB: 60,
    gradeC: 50,
    gradeD: 45,
    gradeE: 40,
    gradeF: 0
};ts = [];


/* =========================================
   AUTHENTICATION ELEMENTS
========================================= */

const authSection =
    document.getElementById("authSection");

const appSection =
    document.getElementById("appSection");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const signUpButton =
    document.getElementById("signUpButton");

const signInButton =
    document.getElementById("signInButton");

const logoutButton =
    document.getElementById("logoutButton");

const authStatus =
    document.getElementById("authStatus");


/* =========================================
   SHOW / HIDE APPLICATION
========================================= */

function showApp() {

    authSection.style.display = "none";

    appSection.style.display = "block";

}


function showLogin() {

    authSection.style.display = "block";

    appSection.style.display = "none";

}


/* =========================================
   CREATE ACCOUNT
========================================= */

signUpButton.addEventListener("click", async function() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        authStatus.innerHTML =
            "❌ Please enter your email and password.";

        return;
    }


    if (password.length < 6) {

        authStatus.innerHTML =
            "❌ Password must contain at least 6 characters.";

        return;
    }


    authStatus.innerHTML =
        "Creating your account...";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,
          options: {
    emailRedirectTo:
        "https://ibsongee75.github.io/Student-report-system-ibsongee75/"
}

        });


    if (error) {

        console.error(error);

        authStatus.innerHTML =
            "❌ " + error.message;

        return;
    }


    if (data.user && !data.session) {

        authStatus.innerHTML =
            "✅ Account created. Please check your email and confirm your account before signing in.";

        return;
    }


    authStatus.innerHTML =
        "✅ Account created successfully.";

});


/* =========================================
   SIGN IN
========================================= */

signInButton.addEventListener("click", async function() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        authStatus.innerHTML =
            "❌ Please enter your email and password.";

        return;
    }


    authStatus.innerHTML =
        "Signing in...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        console.error(error);

        authStatus.innerHTML =
            "❌ " + error.message;

        return;
    }


    console.log("Logged in user:", data.user);

authStatus.innerHTML =
    "✅ Login successful.";

await checkLogin();

});


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener("click", async function() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(error);

        return;
    }


    showLogin();

    authStatus.innerHTML =
        "You have been logged out.";

});
function displaySubscriptionStatus(subscription, user) {

    const statusBox =
        document.getElementById("subscriptionStatus");

    if (!statusBox) return;

    if (
        subscription &&
        subscription.status &&
        subscription.status.toLowerCase() === "paid"
    ) {

        const expiryDate =
            new Date(subscription.expires_at);

        statusBox.innerHTML = `
            <strong>Subscription Status:</strong>
            <span style="color:green;">PAID</span>
            <br>
            <strong>Account:</strong>
            ${escapeHTML(user.email)}
            <br>
            <strong>Expires:</strong>
            ${expiryDate.toLocaleDateString()}
        `;

    } else {

        statusBox.innerHTML = `
            <strong>Subscription Status:</strong>
            <span style="color:red;">UNPAID</span>
        `;

    }
}


/* =========================================
   CHECK EXISTING LOGIN + SUBSCRIPTION
========================================= */

async function checkLogin() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Session check failed:",
            error
        );

        showLogin();

        return;
    }


    if (!data.session) {

        showLogin();

        return;
    }


    const user =
        data.session.user;


    console.log(
        "Existing session found:",
        user.email
    );


    /* =========================================
       CHECK USER SUBSCRIPTION
    ========================================= */

    const { data: subscription, error: subscriptionError } =
    await supabaseClient
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

console.log("CURRENT USER ID:", user.id);
console.log("SUBSCRIPTION DATA:", subscription);
console.log("SUBSCRIPTION ERROR:", subscriptionError);
   displaySubscriptionStatus(
    subscription,
    user
);



    if (subscriptionError) {

        console.error(
            "Subscription check failed:",
            subscriptionError
        );

        alert(
            "Unable to verify your subscription. Please try again."
        );

        return;
    }


    /* =========================================
       CHECK PAID STATUS AND EXPIRY
    ========================================= */

    if (
        subscription &&
        subscription.status === "paid" &&
        new Date(subscription.expires_at) > new Date()
    ) {

        console.log(
            "Paid subscription confirmed."
        );

        showApp();

    } else {

        console.log(
            "User does not have an active subscription."
        );

        showLogin();

        alert(
            "Your account does not have an active subscription."
        );

    }

}
/* =========================================
   AUTH STATE CHANGES
========================================= */

supabaseClient.auth.onAuthStateChange(
    async function(event, session) {

        if (session) {

            await checkLogin();

        } else {

            showLogin();

        }

    }
);


/* =========================================
   START AUTHENTICATION
========================================= */

checkLogin();


/* =========================================
   DOWNLOAD EXCEL TEMPLATE
========================================= */

document.getElementById("downloadTemplate")
.addEventListener("click", function () {

    const scoresData = [

        [
            "Admission No",
            "Student Name",
            "Gender",
            "Class",
            "Term",
            "Session",
            "Mathematics",
            "English",
            "Biology",
            "Physics",
            "Chemistry",
            "Computer Science"
        ],

        [
            "001",
            "Example Student",
            "Male",
            "SS2",
            "First Term",
            "2025/2026",
            85,
            78,
            82,
            74,
            80,
            90
        ]

    ];


    const settingsData = [

        ["SETTING", "VALUE"],

        ["School Name", "YOUR SCHOOL NAME"],

        ["School Address", "YOUR SCHOOL ADDRESS"],

        ["Maximum Score", 100],

        ["Grade A Minimum", 70],

        ["Grade B Minimum", 60],

        ["Grade C Minimum", 50],

        ["Grade D Minimum", 45],

        ["Grade E Minimum", 40],

        ["Grade F Minimum", 0]

    ];


    const workbook =
        XLSX.utils.book_new();


    const scoresSheet =
        XLSX.utils.aoa_to_sheet(scoresData);


    const settingsSheet =
        XLSX.utils.aoa_to_sheet(settingsData);


    XLSX.utils.book_append_sheet(
        workbook,
        scoresSheet,
        "Scores"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        settingsSheet,
        "Settings"
    );


    XLSX.writeFile(
        workbook,
        "Student_Report_Template.xlsx"
    );

});


/* =========================================
   UPLOAD EXCEL FILE
========================================= */

document.getElementById("excelFile")
.addEventListener("change", function(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
    function(e) {

        try {

            const data =
                new Uint8Array(
                    e.target.result
                );


            const workbook =
                XLSX.read(data, {
                    type: "array"
                });


            if (!workbook.Sheets["Scores"]) {
/* =========================================
   DOWNLOAD EXCEL TEMPLATE
========================================= */

document.getElementById("downloadTemplate")
.addEventListener("click", function () {

    const scoresData = [

        [
            "Admission No",
            "Student Name",
            "Gender",
            "Class",
            "Term",
            "Session",

            "Mathematics CA",
            "Mathematics Exams",

            "English CA",
            "English Exams",

            "Biology CA",
            "Biology Exams",

            "Physics CA",
            "Physics Exams",

            "Chemistry CA",
            "Chemistry Exams",

            "Computer Science CA",
            "Computer Science Exams"
        ],

        [
            "001",
            "Example Student",
            "Male",
            "SS2",
            "First Term",
            "2025/2026",

            35,
            55,

            32,
            52,

            30,
            58,

            28,
            60,

            34,
            50,

            36,
            57
        ]

    ];


    /* =========================================
       SETTINGS
    ========================================= */

    const settingsData = [

        ["SETTING", "VALUE"],

        ["School Name", "YOUR SCHOOL NAME"],

        ["School Address", "YOUR SCHOOL ADDRESS"],

        ["CA Maximum", 40],

        ["Exams Maximum", 60],

        ["Grade A Minimum", 70],

        ["Grade B Minimum", 60],

        ["Grade C Minimum", 50],

        ["Grade D Minimum", 45],

        ["Grade E Minimum", 40],

        ["Grade F Minimum", 0]

    ];


    const workbook =
        XLSX.utils.book_new();


    const scoresSheet =
        XLSX.utils.aoa_to_sheet(scoresData);


    const settingsSheet =
        XLSX.utils.aoa_to_sheet(settingsData);


    XLSX.utils.book_append_sheet(
        workbook,
        scoresSheet,
        "Scores"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        settingsSheet,
        "Settings"
    );


    XLSX.writeFile(
      /* =========================================
   UPLOAD EXCEL FILE
========================================= */

document.getElementById("excelFile")
.addEventListener("change", function(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
    function(e) {

        try {

            const data =
                new Uint8Array(
                    e.target.result
                );


            const workbook =
                XLSX.read(data, {
                    type: "array"
                });


            /* =====================================
               CHECK SCORES SHEET
            ===================================== */

            if (!workbook.Sheets["Scores"]) {

                document.getElementById("fileStatus")
                .innerHTML =
                    "❌ Error: The Excel file does not contain a 'Scores' sheet.";

                return;
            }


            /* =====================================
               READ SETTINGS
            ===================================== */

            if (workbook.Sheets["Settings"]) {

                const settingsSheet =
                    workbook.Sheets["Settings"];


                const settingsRows =
                    XLSX.utils.sheet_to_json(
                        settingsSheet,
                        {
                            header: 1,
                            defval: ""
                        }
                    );


                settingsRows.forEach(function(row) {

                    const setting =
                        String(row[0]).trim();

                    const value =
                        row[1];


                    if (setting === "School Name") {

                        reportSettings.schoolName =
                            String(value);

                    }


                    if (setting === "School Address") {

                        reportSettings.schoolAddress =
                            String(value);

                    }


                    if (setting === "CA Maximum") {

                        reportSettings.caMaximum =
                            Number(value) || 40;

                    }


                    if (setting === "Exams Maximum") {

                        reportSettings.examsMaximum =
                            Number(value) || 60;

                    }


                    if (setting === "Grade A Minimum") {

                        reportSettings.gradeA =
                            Number(value);

                    }


                    if (setting === "Grade B Minimum") {

                        reportSettings.gradeB =
                            Number(value);

                    }


                    if (setting === "Grade C Minimum") {

                        reportSettings.gradeC =
                            Number(value);

                    }


                    if (setting === "Grade D Minimum") {

                        reportSettings.gradeD =
                            Number(value);

                    }


                    if (setting === "Grade E Minimum") {

                        reportSettings.gradeE =
                            Number(value);

                    }


                    if (setting === "Grade F Minimum") {

                        reportSettings.gradeF =
                            Number(value);

                    }

                });

            }


            /* =====================================
               READ SCORES
            ===================================== */

            const worksheet =
                workbook.Sheets["Scores"];


            const rows =
                XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        defval: ""
                    }
                );


            if (rows.length === 0) {

                document.getElementById("fileStatus")
                .innerHTML =
                    "❌ The Scores sheet is empty.";

                return;
            }


            /* =====================================
               VALIDATE STUDENT NAMES
            ===================================== */

            const invalidStudents =
                rows.filter(function(student) {

                    return !String(
                        student["Student Name"] || ""
                    ).trim();

                });


            if (invalidStudents.length > 0) {

                document.getElementById("fileStatus")
                .innerHTML =
                    "❌ One or more student records have no Student Name.";

                return;
            }


            students = rows;


            /* =====================================
               SUCCESS
            ===================================== */

            document.getElementById("fileStatus")
            .innerHTML =
                "✅ Excel file successfully loaded. " +
                students.length +
                " student record(s) found.";


            loadStudents();


            document.getElementById("reportSection")
            .style.display = "block";


        } catch (error) {

            console.error(error);


            document.getElementById("fileStatus")
            .innerHTML =
                "❌ Unable to read this Excel file.";

        }

    };


    reader.readAsArrayBuffer(file);

});  workbook,
        "Student_Report_Template.xlsx"
    );

});
/* =========================================
   LOAD STUDENTS INTO DROPDOWN
========================================= */

function loadStudents() {

    const select =
        document.getElementById("studentSelect");


    select.innerHTML =
        '<option value="">-- Select Student --</option>';


    students.forEach(
    function(student, index) {

        const option =
            document.createElement("option");


        option.value = index;


        option.textContent =
            student["Admission No"] +
            " - " +
            student["Student Name"];


        select.appendChild(option);

    });

}


/* =========================================
   GENERATE SINGLE REPORT
========================================= */

document.getElementById("generateReport")
.addEventListener("click", function() {

    const index =
        document.getElementById("studentSelect")
        .value;


    if (index === "") {

        alert("Please select a student.");

        return;

    }


    const student =
        students[index];


    const report =
        createReport(student);


    document.getElementById("reportContainer")
    .innerHTML = report;


    window.scrollTo({

        top:
            document.getElementById(
                "reportContainer"
            ).offsetTop,

        behavior: "smooth"

    });

});


/* =========================================
   GENERATE ALL REPORTS
========================================= */

document.getElementById("generateAll")
.addEventListener("click", function() {

    if (students.length === 0) {

        alert("No student records found.");

        return;

    }


    let allReports = "";


    students.forEach(
    function(student) {

        allReports +=
            createReport(student);

    });


    document.getElementById("reportContainer")
    .innerHTML = allReports;


    window.scrollTo({

        top:
            document.getElementById(
                "reportContainer"
            ).offsetTop,

        behavior: "smooth"

    });

});

/* =========================================
   SUBSCRIPTION PLAN SELECTION
========================================= */

/* =========================================
   PAYSTACK SUBSCRIPTION PAYMENT
========================================= */

const PAYSTACK_PUBLIC_KEY = "pk_test_255b1c6ede75477e3ed59e874ebb68d9e204f844";


document.querySelectorAll(".subscribe-button")
.forEach(function(button) {

    button.addEventListener("click", async function() {

        /* ================================
           CHECK LOGIN
        ================================= */

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (
            sessionError ||
            !sessionData.session
        ) {

            alert(
                "Please log in before subscribing."
            );

            return;
        }


        const user =
            sessionData.session.user;


        /* ================================
           GET SELECTED PLAN
        ================================= */

        const plan =
            button.dataset.plan;

        const price =
            Number(button.dataset.price);


        if (!plan || !price) {

            alert(
                "Invalid subscription plan."
            );

            return;
        }


        /* ================================
           OPEN PAYSTACK
        ================================= */

        const handler =
            PaystackPop.setup({

                key:
                    PAYSTACK_PUBLIC_KEY,

                email:
                    user.email,

                amount:
                    price * 100,

                currency:
                    "NGN",

                metadata: {

                    user_id:
                        user.id,

                    plan:
                        plan

                },

                callback:
                async function(response) {

                    console.log(
                        "Paystack reference:",
                        response.reference
                    );


                    alert(
                        "Payment received. Verifying payment..."
                    );


                    /* =========================
                       CALL EDGE FUNCTION
                    ========================== */

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.functions
                        .invoke(
                            "verify-paystack-payment",
                            {

                                body: {

                                    reference:
                                        response.reference,

                                    plan:
                                        plan

                                }

                            }
                        );


                    if (error) {

                        console.error(
                            "Verification error:",
                            error
                        );

                        alert(
                            "Payment verification failed. Please contact support."
                        );

                        return;
                    }


                    console.log(
                        "Verification result:",
                        data
                    );


                    if (data && data.success) {

                        alert(
                            "✅ Payment successful!\n\n" +
                            "Your " +
                            plan.toUpperCase() +
                            " subscription is now active."
                        );


                        /* =====================
                           REFRESH SUBSCRIPTION
                        ====================== */

                        await checkLogin();

                    } else {

                        alert(
                            "Payment could not be verified."
                        );

                    }

                },

                onClose:
                function() {

                    console.log(
                        "Paystack checkout closed."
                    );

                }

            });


        handler.openIframe();

    });

});

/* =========================================
   CREATE REPORT
========================================= */

function createReport(student) {

    const subjects = [];

    let total = 0;


    const excludedColumns = [

        "Admission No",
        "Student Name",
        "Gender",
        "Class",
        "Term",
        "Session"

    ];


    Object.keys(student)
    .forEach(function(key) {

        if (!excludedColumns.includes(key)) {

            const score =
                Number(student[key]) || 0;


            subjects.push({

                name: key,

                score: score

            });


            total += score;

        }

    });


    const numberOfSubjects =
        subjects.length;


    const average =
        numberOfSubjects > 0
        ? total / numberOfSubjects
        : 0;


    const grade =
        getGrade(average);


    let subjectRows = "";


    subjects.forEach(
    function(subject, index) {

        subjectRows += `

            <tr>

                <td>${index + 1}</td>

                <td>
                    ${escapeHTML(subject.name)}
                </td>

                <td>
                    ${subject.score}
                </td>

                <td>
                    ${getGrade(subject.score)}
                </td>

            </tr>

        `;

    });


    return `

        <div class="report">

            <div class="school-header">

                <h1>YOUR SCHOOL NAME</h1>

                <p>YOUR SCHOOL ADDRESS</p>

                <h2>STUDENT REPORT SHEET</h2>

            </div>


            <div class="student-info">

                <div>

                    <strong>Admission No:</strong>

                    ${escapeHTML(
                        student["Admission No"]
                    )}

                </div>


                <div>

                    <strong>Student Name:</strong>

                    ${escapeHTML(
                        student["Student Name"]
                    )}

                </div>


                <div>

                    <strong>Gender:</strong>

                    ${escapeHTML(
                        student["Gender"]
                    )}

                </div>


                <div>

                    <strong>Class:</strong>

                    ${escapeHTML(
                        student["Class"]
                    )}

                </div>


                <div>

                    <strong>Term:</strong>

                    ${escapeHTML(
                        student["Term"]
                    )}

                </div>


                <div>

                    <strong>Session:</strong>

                    ${escapeHTML(
                        student["Session"]
                    )}

                </div>

            </div>


            <table class="result-table">

                <thead>

                    <tr>

                        <th>No.</th>

                        <th>Subject</th>

                        <th>Score</th>

                        <th>Grade</th>

                    </tr>

                </thead>


                <tbody>

                    ${subjectRows}

                </tbody>

            </table>


            <div class="summary">

                <p>

                    <strong>Total Score:</strong>

                    ${total.toFixed(2)}

                </p>


                <p>

                    <strong>Average:</strong>

                    ${average.toFixed(2)}

                </p>


                <p>

                    <strong>Overall Grade:</strong>

                    ${grade}

                </p>

            </div>


            <div class="comments">

                <p>

                    <strong>
                        Class Teacher's Comment:
                    </strong>

                </p>


                <div class="comment-box"></div>


                <p>

                    <strong>
                        Principal's Comment:
                    </strong>

                </p>


                <div class="comment-box"></div>

            </div>

        </div>

    `;

}


/* =========================================
   GRADING SYSTEM
========================================= */

function getGrade(score) {

    if (score >= 70) return "A";

    if (score >= 60) return "B";

    if (score >= 50) return "C";

    if (score >= 45) return "D";

    if (score >= 40) return "E";

    return "F";

}


/* =========================================
   SECURITY / HTML ESCAPING
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
