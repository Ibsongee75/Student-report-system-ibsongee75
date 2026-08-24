/* =========================================
   STUDENT REPORT GENERATOR
   COMPLETE script.js
========================================= */


/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://nzeddvcmabfodmvmgsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   GLOBAL VARIABLES
========================================= */

let students = [];


/* =========================================
   DEFAULT REPORT SETTINGS
========================================= */

let reportSettings = {

    schoolName:
        "YOUR SCHOOL NAME",

    schoolAddress:
        "YOUR SCHOOL ADDRESS",

    caMaximum:
        40,

    examsMaximum:
        60,

    gradeA:
        70,

    gradeB:
        60,

    gradeC:
        50,

    gradeD:
        45,

    gradeE:
        40,

    gradeF:
        0

};


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
   SHOW APPLICATION
========================================= */

function showApp() {

    const subscriptionPlans =
        document.getElementById("subscriptionPlans");

    const appSection =
        document.getElementById("appSection");

    const authSection =
        document.getElementById("authSection");

    /* Hide login */
    if (authSection) {
        authSection.style.display = "none";
    }

    /* Hide subscription plans */
    if (subscriptionPlans) {
        subscriptionPlans.style.display = "none";
    }

    /* Show report application */
    if (appSection) {
        appSection.style.display = "block";
    }

}


/* =========================================
   SHOW LOGIN
========================================= */

function showLogin() {

    const subscriptionPlans =
        document.getElementById("subscriptionPlans");

    const appSection =
        document.getElementById("appSection");

    const authSection =
        document.getElementById("authSection");

    /* Show login */
    if (authSection) {
        authSection.style.display = "block";
    }

    /* Hide report application */
    if (appSection) {
        appSection.style.display = "none";
    }

    /* Hide subscription plans initially */
    if (subscriptionPlans) {
        subscriptionPlans.style.display = "none";
    }

}


/* =========================================
   SHOW SUBSCRIPTION PLANS
========================================= */

function showSubscriptionPlans() {

    const subscriptionPlans =
        document.getElementById("subscriptionPlans");

    const appSection =
        document.getElementById("appSection");

    const authSection =
        document.getElementById("authSection");

    /* Hide login */
    if (authSection) {
        authSection.style.display = "none";
    }

    /* Hide report application */
    if (appSection) {
        appSection.style.display = "none";
    }

    /* Show payment plans */
    if (subscriptionPlans) {
        subscriptionPlans.style.display = "block";
    }

}


/* =========================================
   CREATE ACCOUNT
========================================= */

signUpButton.addEventListener(
    "click",
    async function () {

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

    }
);


/* =========================================
   SIGN IN
========================================= */

signInButton.addEventListener(
    "click",
    async function () {

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


        console.log(
            "Logged in user:",
            data.user
        );


        authStatus.innerHTML =
            "✅ Login successful.";


        await checkLogin();

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutButton.addEventListener(
    "click",
    async function () {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            return;
        }


        showLogin();


        authStatus.innerHTML =
            "You have been logged out.";

    }
);


/* =========================================
   DISPLAY SUBSCRIPTION STATUS
========================================= */

function displaySubscriptionStatus(
    subscription,
    user
) {

    const statusBox =
        document.getElementById(
            "subscriptionStatus"
        );


    if (!statusBox) return;


    if (
        subscription &&
        subscription.status &&
        subscription.status.toLowerCase() === "paid"
    ) {

        const expiryDate =
            new Date(
                subscription.expires_at
            );


        statusBox.innerHTML = `

            <strong>
                Subscription Status:
            </strong>

            <span style="color:green;">
                PAID
            </span>

            <br>

            <strong>
                Account:
            </strong>

            ${escapeHTML(user.email)}

            <br>

            <strong>
                Expires:
            </strong>

            ${expiryDate.toLocaleDateString()}

        `;

    } else {

        statusBox.innerHTML = `

            <strong>
                Subscription Status:
            </strong>

            <span style="color:red;">
                UNPAID
            </span>

        `;

    }

}


/* =========================================
   CHECK LOGIN + SUBSCRIPTION
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


    /* =====================================
       GET SUBSCRIPTION
    ===================================== */

    const {
        data: subscription,
        error: subscriptionError
    } =
        await supabaseClient
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();


    console.log(
        "CURRENT USER ID:",
        user.id
    );


    console.log(
        "SUBSCRIPTION DATA:",
        subscription
    );


    console.log(
        "SUBSCRIPTION ERROR:",
        subscriptionError
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


    displaySubscriptionStatus(
        subscription,
        user
    );


    /* =====================================
       CHECK ACTIVE SUBSCRIPTION
    ===================================== */

    if (

        subscription &&

        subscription.status === "paid" &&

        subscription.expires_at &&

        new Date(
            subscription.expires_at
        ) > new Date()

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
    async function (event, session) {

        if (session) {

            await checkLogin();

        } else {

            showLogin();

        }

    }
);


/* =========================================
   START LOGIN CHECK
========================================= */

checkLogin();


/* =========================================
   DOWNLOAD EXCEL TEMPLATE
========================================= */

document
    .getElementById("downloadTemplate")
    .addEventListener(
        "click",
        function () {


            /* =================================
               SCORES SHEET
            ================================= */

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


            /* =================================
               SETTINGS SHEET
            ================================= */

            const settingsData = [

                [
                    "SETTING",
                    "VALUE"
                ],


                [
                    "School Name",
                    "YOUR SCHOOL NAME"
                ],


                [
                    "School Address",
                    "YOUR SCHOOL ADDRESS"
                ],


                [
                    "CA Maximum",
                    40
                ],


                [
                    "Exams Maximum",
                    60
                ],


                [
                    "Grade A Minimum",
                    70
                ],


                [
                    "Grade B Minimum",
                    60
                ],


                [
                    "Grade C Minimum",
                    50
                ],


                [
                    "Grade D Minimum",
                    45
                ],


                [
                    "Grade E Minimum",
                    40
                ],


                [
                    "Grade F Minimum",
                    0
                ]

            ];


            /* =================================
               CREATE WORKBOOK
            ================================= */

            const workbook =
                XLSX.utils.book_new();


            const scoresSheet =
                XLSX.utils.aoa_to_sheet(
                    scoresData
                );


            const settingsSheet =
                XLSX.utils.aoa_to_sheet(
                    settingsData
                );


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


            /* =================================
               DOWNLOAD
            ================================= */

            XLSX.writeFile(
                workbook,
                "Student_Report_Template.xlsx"
            );

        }
    );


/* =========================================
   UPLOAD EXCEL FILE
========================================= */

document
    .getElementById("excelFile")
    .addEventListener(
        "change",
        function (event) {


            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (e) {


                    try {


                        const data =
                            new Uint8Array(
                                e.target.result
                            );


                        const workbook =
                            XLSX.read(
                                data,
                                {
                                    type: "array"
                                }
                            );


                        /* =====================
                           CHECK SCORES SHEET
                        ===================== */

                        if (
                            !workbook.Sheets["Scores"]
                        ) {

                            document
                                .getElementById(
                                    "fileStatus"
                                )
                                .innerHTML =
                                "❌ Error: The Excel file does not contain a 'Scores' sheet.";

                            return;

                        }


                        /* =====================
                           READ SETTINGS
                        ===================== */

                        if (
                            workbook.Sheets["Settings"]
                        ) {

                            readSettings(
                                workbook
                                    .Sheets["Settings"]
                            );

                        }


                        /* =====================
                           READ STUDENTS
                        ===================== */

                        const worksheet =
                            workbook
                                .Sheets["Scores"];


                        const rows =
                            XLSX.utils
                                .sheet_to_json(
                                    worksheet,
                                    {
                                        defval: ""
                                    }
                                );


                        if (
                            rows.length === 0
                        ) {

                            document
                                .getElementById(
                                    "fileStatus"
                                )
                                .innerHTML =
                                "❌ The Scores sheet is empty.";

                            return;

                        }


                        /* =====================
                           VALIDATE STUDENTS
                        ===================== */

                        const invalidStudents =
                            rows.filter(
                                function (student) {

                                    return !String(
                                        student[
                                            "Student Name"
                                        ] || ""
                                    ).trim();

                                }
                            );


                        if (
                            invalidStudents.length > 0
                        ) {

                            document
                                .getElementById(
                                    "fileStatus"
                                )
                                .innerHTML =
                                "❌ One or more student records have no Student Name.";

                            return;

                        }


                        /* =====================
                           STORE STUDENTS
                        ===================== */

                        students = rows;


                        /* =====================
                           SUCCESS MESSAGE
                        ===================== */

                        document
                            .getElementById(
                                "fileStatus"
                            )
                            .innerHTML =

                            "✅ Excel file successfully loaded. " +

                            students.length +

                            " student record(s) found.";


                        /* =====================
                           LOAD DROPDOWN
                        ===================== */

                        loadStudents();


                        /* =====================
                           SHOW REPORT SECTION
                        ===================== */

                        document
                            .getElementById(
                                "reportSection"
                            )
                            .style.display =
                            "block";


                    } catch (error) {


                        console.error(
                            error
                        );


                        document
                            .getElementById(
                                "fileStatus"
                            )
                            .innerHTML =
                            "❌ Unable to read this Excel file.";

                    }

                };


            reader.readAsArrayBuffer(
                file
            );

        }
    );


/* =========================================
   READ SETTINGS FROM EXCEL
========================================= */

function readSettings(
    settingsSheet
) {

    const settingsRows =
        XLSX.utils.sheet_to_json(
            settingsSheet,
            {
                header: 1,
                defval: ""
            }
        );


    settingsRows.forEach(
        function (row) {


            const setting =
                String(
                    row[0] || ""
                ).trim();


            const value =
                row[1];


            if (
                setting ===
                "School Name"
            ) {

                reportSettings.schoolName =
                    String(value);

            }


            if (
                setting ===
                "School Address"
            ) {

                reportSettings.schoolAddress =
                    String(value);

            }


            if (
                setting ===
                "CA Maximum"
            ) {

                reportSettings.caMaximum =
                    Number(value) || 40;

            }


            if (
                setting ===
                "Exams Maximum"
            ) {

                reportSettings.examsMaximum =
                    Number(value) || 60;

            }


            if (
                setting ===
                "Grade A Minimum"
            ) {

                reportSettings.gradeA =
                    Number(value);

            }


            if (
                setting ===
                "Grade B Minimum"
            ) {

                reportSettings.gradeB =
                    Number(value);

            }


            if (
                setting ===
                "Grade C Minimum"
            ) {

                reportSettings.gradeC =
                    Number(value);

            }


            if (
                setting ===
                "Grade D Minimum"
            ) {

                reportSettings.gradeD =
                    Number(value);

            }


            if (
                setting ===
                "Grade E Minimum"
            ) {

                reportSettings.gradeE =
                    Number(value);

            }


            if (
                setting ===
                "Grade F Minimum"
            ) {

                reportSettings.gradeF =
                    Number(value);

            }

        }
    );

}


/* =========================================
   LOAD STUDENTS INTO DROPDOWN
========================================= */

function loadStudents() {

    const select =
        document.getElementById(
            "studentSelect"
        );


    select.innerHTML =
        '<option value="">-- Select Student --</option>';


    students.forEach(
        function (student, index) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =

                (
                    student["Admission No"] ||
                    ""
                ) +

                " - " +

                (
                    student["Student Name"] ||
                    ""
                );


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================
   GENERATE SINGLE REPORT
========================================= */

document
    .getElementById("generateReport")
    .addEventListener(
        "click",
        function () {


            const index =
                document
                    .getElementById(
                        "studentSelect"
                    )
                    .value;


            if (index === "") {

                alert(
                    "Please select a student."
                );

                return;

            }


            const student =
                students[index];


            const report =
                createReport(
                    student
                );


            document
                .getElementById(
                    "reportContainer"
                )
                .innerHTML =
                report;


            window.scrollTo({

                top:
                    document
                        .getElementById(
                            "reportContainer"
                        )
                        .offsetTop,

                behavior:
                    "smooth"

            });

        }
    );


/* =========================================
   GENERATE ALL REPORTS
========================================= */

document
    .getElementById("generateAll")
    .addEventListener(
        "click",
        function () {


            if (
                students.length === 0
            ) {

                alert(
                    "No student records found."
                );

                return;

            }


            let allReports = "";


            students.forEach(
                function (student) {

                    allReports +=
                        createReport(
                            student
                        );

                }
            );


            document
                .getElementById(
                    "reportContainer"
                )
                .innerHTML =
                allReports;


            window.scrollTo({

                top:
                    document
                        .getElementById(
                            "reportContainer"
                        )
                        .offsetTop,

                behavior:
                    "smooth"

            });

        }
    );


/* =========================================
   PAYSTACK
========================================= */

/*
   TEST PUBLIC KEY

   Replace with your LIVE public key
   after Paystack approves your account
   for live mode.
*/

const PAYSTACK_PUBLIC_KEY =
    "pk_test_255b1c6ede75477e3ed59e874ebb68d9e204f844";


/* =========================================
   SUBSCRIPTION BUTTONS
========================================= */

document
    .querySelectorAll(
        ".subscribe-button"
    )
    .forEach(
        function (button) {


            button.addEventListener(
                "click",
                async function () {


                    /* =====================
                       CHECK LOGIN
                    ===================== */

                    const {
                        data: sessionData,
                        error: sessionError
                    } =
                        await supabaseClient
                            .auth
                            .getSession();


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
                        sessionData
                            .session
                            .user;


                    /* =====================
                       GET PLAN
                    ===================== */

                    const plan =
                        button.dataset.plan;


                    const price =
                        Number(
                            button.dataset.price
                        );


                    if (
                        !plan ||
                        !price
                    ) {

                        alert(
                            "Invalid subscription plan."
                        );

                        return;

                    }


                    /* =====================
                       OPEN PAYSTACK
                    ===================== */

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
                                async function (
                                    response
                                ) {


                                    console.log(
                                        "Paystack reference:",
                                        response.reference
                                    );


                                    alert(
                                        "Payment received. Verifying payment..."
                                    );


                                    /* ==============
                                       VERIFY PAYMENT
                                    ============== */

                                    const {
                                        data,
                                        error
                                    } =
                                        await supabaseClient
                                            .functions
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


                                    if (
                                        data &&
                                        data.success
                                    ) {

                                        alert(

                                            "✅ Payment successful!\n\n" +

                                            "Your " +

                                            plan
                                                .toUpperCase() +

                                            " subscription is now active."

                                        );


                                        await checkLogin();


                                    } else {

                                        alert(
                                            "Payment could not be verified."
                                        );

                                    }

                                },


                            onClose:
                                function () {

                                    console.log(
                                        "Paystack checkout closed."
                                    );

                                }

                        });


                    handler.openIframe();

                }
            );

        }
    );


/* =========================================
   CREATE REPORT
========================================= */

function createReport(
    student
) {


    const subjects = [];


    let overallTotal = 0;


    /* =====================================
       FIND SUBJECTS AUTOMATICALLY
    ===================================== */

    const keys =
        Object.keys(
            student
        );


    const subjectNames = [];


    keys.forEach(
        function (key) {


            const match =
                key.match(
                    /^(.+)\s+(CA|Exams)$/i
                );


            if (!match) {

                return;

            }


            const subjectName =
                match[1].trim();


            if (
                !subjectNames.includes(
                    subjectName
                )
            ) {

                subjectNames.push(
                    subjectName
                );

            }

        }
    );


    /* =====================================
       CALCULATE SUBJECT TOTALS
    ===================================== */

    subjectNames.forEach(
        function (subjectName) {


            const caKey =
                subjectName +
                " CA";


            const examsKey =
                subjectName +
                " Exams";


            const ca =
                Number(
                    student[caKey]
                ) || 0;


            const exams =
                Number(
                    student[examsKey]
                ) || 0;


            const total =
                ca + exams;


            overallTotal +=
                total;


            subjects.push({

                name:
                    subjectName,

                ca:
                    ca,

                exams:
                    exams,

                total:
                    total

            });

        }
    );


    /* =====================================
       CALCULATE AVERAGE
    ===================================== */

    const numberOfSubjects =
        subjects.length;


    const average =
        numberOfSubjects > 0

            ? overallTotal /
              numberOfSubjects

            : 0;


    /* =====================================
       GRADE
    ===================================== */

    const grade =
        getGrade(
            average
        );


    /* =====================================
       POSITION
    ===================================== */

    const position =
        calculatePosition(
            student,
            students
        );


    /* =====================================
       SUBJECT ROWS
    ===================================== */

    let subjectRows = "";


    subjects.forEach(
        function (
            subject,
            index
        ) {


            subjectRows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            subject.name
                        )}
                    </td>

                    <td>
                        ${subject.ca}
                    </td>

                    <td>
                        ${subject.exams}
                    </td>

                    <td>
                        ${subject.total}
                    </td>

                    <td>
                        ${getGrade(
                            subject.total
                        )}
                    </td>

                </tr>

            `;

        }
    );


    /* =====================================
       RETURN REPORT
    ===================================== */

    return `

        <div class="report">

            <div class="school-header">

                <h1>
                    ${escapeHTML(
                        reportSettings.schoolName
                    )}
                </h1>

                <p>
                    ${escapeHTML(
                        reportSettings.schoolAddress
                    )}
                </p>

                <h2>
                    STUDENT REPORT SHEET
                </h2>

            </div>


            <div class="student-info">


                <div>

                    <strong>
                        Admission No:
                    </strong>

                    ${escapeHTML(
                        student["Admission No"] ||
                        ""
                    )}

                </div>


                <div>

                    <strong>
                        Student Name:
                    </strong>

                    ${escapeHTML(
                        student["Student Name"] ||
                        ""
                    )}

                </div>


                <div>

                    <strong>
                        Gender:
                    </strong>

                    ${escapeHTML(
                        student["Gender"] ||
                        ""
                    )}

                </div>


                <div>

                    <strong>
                        Class:
                    </strong>

                    ${escapeHTML(
                        student["Class"] ||
                        ""
                    )}

                </div>


                <div>

                    <strong>
                        Term:
                    </strong>

                    ${escapeHTML(
                        student["Term"] ||
                        ""
                    )}

                </div>


                <div>

                    <strong>
                        Session:
                    </strong>

                    ${escapeHTML(
                        student["Session"] ||
                        ""
                    )}

                </div>


            </div>


            <table class="result-table">


                <thead>

                    <tr>

                        <th>
                            No.
                        </th>

                        <th>
                            Subject
                        </th>

                        <th>
                            CA
                        </th>

                        <th>
                            Exams
                        </th>

                        <th>
                            Total
                        </th>

                        <th>
                            Grade
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${subjectRows}

                </tbody>


            </table>


            <div class="summary">


                <p>

                    <strong>
                        Overall Total:
                    </strong>

                    ${overallTotal.toFixed(2)}

                </p>


                <p>

                    <strong>
                        Average:
                    </strong>

                    ${average.toFixed(2)}%

                </p>


                <p>

                    <strong>
                        Position:
                    </strong>

                    ${formatPosition(
                        position
                    )}

                </p>


                <p>

                    <strong>
                        Overall Grade:
                    </strong>

                    ${grade}

                </p>


            </div>


            <div class="comments">


                <p>

                    <strong>
                        Class Teacher's Comment:
                    </strong>

                </p>


                <div class="comment-box">
                </div>


                <p>

                    <strong>
                        Principal's Comment:
                    </strong>

                </p>


                <div class="comment-box">
                </div>


            </div>


        </div>

    `;

}


/* =========================================
   GRADING SYSTEM
========================================= */

function getGrade(
    score
) {


    if (
        score >=
        reportSettings.gradeA
    ) {

        return "A";

    }


    if (
        score >=
        reportSettings.gradeB
    ) {

        return "B";

    }


    if (
        score >=
        reportSettings.gradeC
    ) {

        return "C";

    }


    if (
        score >=
        reportSettings.gradeD
    ) {

        return "D";

    }


    if (
        score >=
        reportSettings.gradeE
    ) {

        return "E";

    }


    return "F";

}


/* =========================================
   CALCULATE CLASS POSITION
========================================= */

function calculatePosition(
    currentStudent,
    allStudents
) {


    const currentTotal =
        calculateStudentTotal(
            currentStudent
        );


    let position = 1;


    allStudents.forEach(
        function (student) {


            const studentTotal =
                calculateStudentTotal(
                    student
                );


            if (
                studentTotal >
                currentTotal
            ) {

                position++;

            }

        }
    );


    return position;

}


/* =========================================
   CALCULATE STUDENT TOTAL
========================================= */

function calculateStudentTotal(
    student
) {


    let total = 0;


    Object.keys(
        student
    ).forEach(
        function (key) {


            const match =
                key.match(
                    /^(.+)\s+(CA|Exams)$/i
                );


            if (!match) {

                return;

            }


            total +=
                Number(
                    student[key]
                ) || 0;

        }
    );


    return total;

}


/* =========================================
   FORMAT POSITION
========================================= */

function formatPosition(
    position
) {


    const lastTwo =
        position % 100;


    if (
        lastTwo >= 11 &&
        lastTwo <= 13
    ) {

        return (
            position +
            "th"
        );

    }


    switch (
        position % 10
    ) {


        case 1:

            return (
                position +
                "st"
            );


        case 2:

            return (
                position +
                "nd"
            );


        case 3:

            return (
                position +
                "rd"
            );


        default:

            return (
                position +
                "th"
            );

    }

}


/* =========================================
   SECURITY / HTML ESCAPING
========================================= */

function escapeHTML(
    value
) {


    return String(
        value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
