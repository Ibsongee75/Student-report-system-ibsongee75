/* =========================================================
   STUDENT REPORT GENERATOR
   COMPLETE script.js
   ========================================================= */


/* =========================================================
   SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
    "https://nzeddvcmabfodmvmgsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   PAYSTACK
   ========================================================= */

const PAYSTACK_PUBLIC_KEY =
    "pk_test_255b1c6ede75477e3ed59e874ebb68d9e204f844";


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let students = [];

let schoolSubjects = [
    "Mathematics",
    "English",
    "Biology",
    "Physics",
    "Chemistry",
    "Computer Science"
];


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


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

let authSection;
let appSection;
let subscriptionPlans;
let subscriptionStatus;

let emailInput;
let passwordInput;

let signUpButton;
let signInButton;
let logoutButton;

let authStatus;

let downloadTemplateButton;
let excelFileInput;

let fileStatus;

let reportSection;
let studentSelect;
let generateReportButton;
let generateAllButton;
let reportContainer;


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeElements();

        attachAuthenticationEvents();

        attachApplicationEvents();

        createSubjectManager();

        checkLogin();

    }
);


/* =========================================================
   GET HTML ELEMENTS
   ========================================================= */

function initializeElements() {

    authSection =
        document.getElementById(
            "authSection"
        );


    appSection =
        document.getElementById(
            "appSection"
        );


    subscriptionPlans =
        document.getElementById(
            "subscriptionPlans"
        );


    subscriptionStatus =
        document.getElementById(
            "subscriptionStatus"
        );


    emailInput =
        document.getElementById(
            "email"
        );


    passwordInput =
        document.getElementById(
            "password"
        );


    signUpButton =
        document.getElementById(
            "signUpButton"
        );


    signInButton =
        document.getElementById(
            "signInButton"
        );


    logoutButton =
        document.getElementById(
            "logoutButton"
        );


    authStatus =
        document.getElementById(
            "authStatus"
        );


    downloadTemplateButton =
        document.getElementById(
            "downloadTemplate"
        );


    excelFileInput =
        document.getElementById(
            "excelFile"
        );


    fileStatus =
        document.getElementById(
            "fileStatus"
        );


    reportSection =
        document.getElementById(
            "reportSection"
        );


    studentSelect =
        document.getElementById(
            "studentSelect"
        );


    generateReportButton =
        document.getElementById(
            "generateReport"
        );


    generateAllButton =
        document.getElementById(
            "generateAll"
        );


    reportContainer =
        document.getElementById(
            "reportContainer"
        );

}


/* =========================================================
   SAFE ELEMENT CHECK
   ========================================================= */

function elementExists(element) {

    return element !== null &&
           element !== undefined;

}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    if (elementExists(authSection)) {

        authSection.style.display =
            "block";

    }


    if (elementExists(subscriptionPlans)) {

        subscriptionPlans.style.display =
            "none";

    }


    if (elementExists(appSection)) {

        appSection.style.display =
            "none";

    }


    if (elementExists(subscriptionStatus)) {

        subscriptionStatus.style.display =
            "none";

    }

}


/* =========================================================
   SHOW SUBSCRIPTION
   ========================================================= */

function showSubscription() {

    if (elementExists(authSection)) {

        authSection.style.display =
            "none";

    }


    if (elementExists(subscriptionPlans)) {

        subscriptionPlans.style.display =
            "block";

    }


    if (elementExists(appSection)) {

        appSection.style.display =
            "none";

    }


    if (elementExists(subscriptionStatus)) {

        subscriptionStatus.style.display =
            "block";

    }

}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

function showApp() {

    if (elementExists(authSection)) {

        authSection.style.display =
            "none";

    }


    if (elementExists(subscriptionPlans)) {

        subscriptionPlans.style.display =
            "none";

    }


    if (elementExists(appSection)) {

        appSection.style.display =
            "block";

    }


    if (elementExists(subscriptionStatus)) {

        subscriptionStatus.style.display =
            "block";

    }

}


/* =========================================================
   AUTHENTICATION EVENTS
   ========================================================= */

function attachAuthenticationEvents() {


    /* =====================================================
       CREATE ACCOUNT
       ===================================================== */

    if (elementExists(signUpButton)) {

        signUpButton.addEventListener(
            "click",
            async function () {

                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                if (!email || !password) {

                    setAuthStatus(
                        "❌ Please enter your email and password."
                    );

                    return;

                }


                if (password.length < 6) {

                    setAuthStatus(
                        "❌ Password must contain at least 6 characters."
                    );

                    return;

                }


                setAuthStatus(
                    "Creating your account..."
                );


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signUp({

                                email:
                                    email,

                                password:
                                    password,

                                options: {

                                    emailRedirectTo:
                                        "https://ibsongee75.github.io/Student-report-system-ibsongee75/"

                                }

                            });


                    if (error) {

                        console.error(
                            "Sign up error:",
                            error
                        );


                        setAuthStatus(
                            "❌ " +
                            error.message
                        );


                        return;

                    }


                    if (
                        data.user &&
                        !data.session
                    ) {

                        setAuthStatus(
                            "✅ Account created. Please check your email and confirm your account before signing in."
                        );


                        return;

                    }


                    setAuthStatus(
                        "✅ Account created successfully."
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    setAuthStatus(
                        "❌ An unexpected error occurred while creating the account."
                    );

                }

            }
        );

    }


    /* =====================================================
       SIGN IN
       ===================================================== */

    if (elementExists(signInButton)) {

        signInButton.addEventListener(
            "click",
            async function () {

                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                if (!email || !password) {

                    setAuthStatus(
                        "❌ Please enter your email and password."
                    );

                    return;

                }


                setAuthStatus(
                    "Signing in..."
                );


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signInWithPassword({

                                email:
                                    email,

                                password:
                                    password

                            });


                    if (error) {

                        console.error(
                            "Sign in error:",
                            error
                        );


                        setAuthStatus(
                            "❌ " +
                            error.message
                        );


                        return;

                    }


                    console.log(
                        "Login successful:",
                        data.user
                    );


                    setAuthStatus(
                        "✅ Login successful."
                    );


                    await checkLogin();


                } catch (error) {

                    console.error(
                        error
                    );


                    setAuthStatus(
                        "❌ Unable to sign in. Please try again."
                    );

                }

            }
        );

    }

  
    /* =====================================================
       LOGOUT
       ===================================================== */

    if (elementExists(logoutButton)) {

        logoutButton.addEventListener(
            "click",
            async function () {

                try {

                    const {
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signOut();


                    if (error) {

                        console.error(
                            error
                        );

                        return;

                    }


                    students = [];


                    showLogin();


                    setAuthStatus(
                        "You have been logged out."
                    );


                } catch (error) {

                    console.error(
                        error
                    );

                }

            }
        );

    }

}

/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

async function forgotPassword() {

    alert("Forgot Password function is running!");

    const email = prompt(
        "Enter the email address you used to create your account:"
    );

    if (!email) {
        return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {

        alert(
            "Please enter your email address."
        );

        return;
    }

    const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
            cleanEmail,
            {
                redirectTo:
                    "https://ibsongee75.github.io/Student-report-system-ibsongee75/"
            }
        );

    if (error) {

        console.error(
            "Password reset error:",
            error
        );

        alert(
            "❌ " + error.message
        );

        return;
    }

    alert(
        "✅ Password reset email sent. " +
        "Please check your email and click the password reset link."
    );
}
  /* =========================================================
   UPDATE PASSWORD
   ========================================================= */

async function updatePassword() {

    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmNewPassword"
        ).value;


    if (!newPassword) {

        alert(
            "Please enter a new password."
        );

        return;
    }


    if (newPassword !== confirmPassword) {

        alert(
            "❌ The passwords do not match."
        );

        return;
    }


    if (newPassword.length < 6) {

        alert(
            "❌ Password must be at least 6 characters."
        );

        return;
    }


    const { error } =
        await supabaseClient.auth.updateUser({
            password: newPassword
        });


    if (error) {

        console.error(
            "Password update error:",
            error
        );

        alert(
            "❌ " + error.message
        );

        return;
    }


    alert(
        "✅ Password changed successfully. You can now sign in with your new password."
    );


    document.getElementById(
        "resetPasswordSection"
    ).style.display = "none";

    document.getElementById(
        "newPassword"
    ).value = "";

    document.getElementById(
        "confirmNewPassword"
    ).value = "";
}


/* =========================================================
   AUTH STATUS MESSAGE
   ========================================================= */

function setAuthStatus(message) {

    if (elementExists(authStatus)) {

        authStatus.innerHTML =
            message;

    }

}


/* =========================================================
   CHECK LOGIN
   ========================================================= */

async function checkLogin() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
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
            "Logged in user:",
            user.email
        );


        await checkSubscription(
            user
        );


    } catch (error) {

        console.error(
            "checkLogin error:",
            error
        );


        showLogin();

    }

}


/* =========================================================
   CHECK SUBSCRIPTION
   ========================================================= */

async function checkSubscription(user) {

    try {

        const {
            data: subscription,
            error
        } =
            await supabaseClient
                .from("subscriptions")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .maybeSingle();


        console.log(
            "Subscription:",
            subscription
        );


        if (error) {

            console.error(
                "Subscription error:",
                error
            );


            showSubscription();


            displaySubscriptionStatus(
                null,
                user
            );


            return;

        }


        displaySubscriptionStatus(
            subscription,
            user
        );


        if (

            subscription &&

            String(
                subscription.status
            ).toLowerCase() ===
            "paid" &&

            subscription.expires_at &&

            new Date(
                subscription.expires_at
            ) > new Date()

        ) {

            showApp();

        } else {

            showSubscription();

        }


    } catch (error) {

        console.error(
            error
        );


        showSubscription();

    }

}


/* =========================================================
   AUTH STATE CHANGE
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "Auth event:",
            event
        );


        /*
           Do not await checkLogin directly inside
           onAuthStateChange. This prevents Supabase
           authentication lock problems.
        */

        setTimeout(
            function () {

                checkLogin();

            },
            0
        );

    }
);


/* =========================================================
   DISPLAY SUBSCRIPTION STATUS
   ========================================================= */

function displaySubscriptionStatus(
    subscription,
    user
) {

    if (
        !elementExists(
            subscriptionStatus
        )
    ) {

        return;

    }


    subscriptionStatus.style.display =
        "block";


    if (

        subscription &&

        String(
            subscription.status
        ).toLowerCase() ===
        "paid"

    ) {

        let expiryText =
            "Unknown";


        if (
            subscription.expires_at
        ) {

            const expiry =
                new Date(
                    subscription.expires_at
                );


            expiryText =
                expiry.toLocaleDateString();

        }


        subscriptionStatus.innerHTML = `

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

            ${escapeHTML(
                user.email
            )}

            <br>

            <strong>
                Expires:
            </strong>

            ${escapeHTML(
                expiryText
            )}

        `;

    } else {

        subscriptionStatus.innerHTML = `

            <strong>
                Subscription Status:
            </strong>

            <span style="color:red;">
                UNPAID
            </span>

            <br>

            <span>
                Please choose a subscription plan below.
            </span>

        `;

    }

}


/* =========================================================
   APPLICATION EVENTS
   ========================================================= */

function attachApplicationEvents() {


    /* =====================================================
       DOWNLOAD TEMPLATE
       ===================================================== */

    if (
        elementExists(
            downloadTemplateButton
        )
    ) {

        downloadTemplateButton.addEventListener(
            "click",
            function () {

                downloadExcelTemplate();

            }
        );

    }


    /* =====================================================
       EXCEL UPLOAD
       ===================================================== */

    if (
        elementExists(
            excelFileInput
        )
    ) {

        excelFileInput.addEventListener(
            "change",
            function (event) {

                handleExcelUpload(
                    event
                );

            }
        );

    }


    /* =====================================================
       GENERATE ONE REPORT
       ===================================================== */

    if (
        elementExists(
            generateReportButton
        )
    ) {

        generateReportButton.addEventListener(
            "click",
            function () {

                generateSingleReport();

            }
        );

    }


    /* =====================================================
       GENERATE ALL
       ===================================================== */

    if (
        elementExists(
            generateAllButton
        )
    ) {

        generateAllButton.addEventListener(
            "click",
            function () {

                generateAllReports();

            }
        );

    }


    /* =====================================================
       PAYSTACK BUTTONS
       ===================================================== */

    attachPaystackButtons();

}


/* =========================================================
   CREATE SUBJECT MANAGER
   ========================================================= */

function createSubjectManager() {

    if (
        !elementExists(appSection)
    ) {

        return;

    }


    /*
       We create this section automatically.
       Therefore you do NOT have to manually add
       another section to your HTML.
    */

    const manager =
        document.createElement(
            "section"
        );


    manager.id =
        "subjectManager";


    manager.className =
        "card";


    manager.innerHTML = `

        <h2>
            School Subjects
        </h2>

        <p>
            Enter the subjects offered by your school.
            You can add or remove subjects before downloading
            the Excel template.
        </p>

        <div id="subjectList"></div>

        <div style="margin-top:10px;">

            <input
                type="text"
                id="newSubjectInput"
                placeholder="Enter subject name"
            >

            <button
                type="button"
                id="addSubjectButton"
            >
                Add Subject
            </button>

        </div>

    `;


    const firstCard =
        appSection.querySelector(
            "main .card"
        );


    if (firstCard) {

        firstCard.parentNode.insertBefore(
            manager,
            firstCard
        );

    } else {

        appSection.prepend(
            manager
        );

    }


    renderSubjectList();


    const addButton =
        document.getElementById(
            "addSubjectButton"
        );


    const input =
        document.getElementById(
            "newSubjectInput"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                const subject =
                    input.value.trim();


                if (!subject) {

                    alert(
                        "Please enter a subject name."
                    );

                    return;

                }


                addSubject(
                    subject
                );


                input.value =
                    "";

            }
        );

    }

}


/* =========================================================
   RENDER SUBJECT LIST
   ========================================================= */

function renderSubjectList() {

    const list =
        document.getElementById(
            "subjectList"
        );


    if (!list) {

        return;

    }


    list.innerHTML =
        "";


    schoolSubjects.forEach(
        function (
            subject,
            index
        ) {

            const item =
                document.createElement(
                    "div"
                );


            item.style.display =
                "flex";


            item.style.alignItems =
                "center";


            item.style.gap =
                "8px";


            item.style.marginBottom =
                "6px";


            item.innerHTML = `

                <input
                    type="text"
                    value="${escapeHTML(subject)}"
                    data-subject-index="${index}"
                    class="subject-name-input"
                    style="flex:1;"
                >

                <button
                    type="button"
                    data-remove-subject="${index}"
                >
                    Remove
                </button>

            `;


            list.appendChild(
                item
            );

        }
    );


    list.querySelectorAll(
        ".subject-name-input"
    ).forEach(
        function (input) {

            input.addEventListener(
                "change",
                function () {

                    const index =
                        Number(
                            input.dataset.subjectIndex
                        );


                    const newName =
                        input.value.trim();


                    if (!newName) {

                        alert(
                            "Subject name cannot be empty."
                        );


                        renderSubjectList();


                        return;

                    }


                    schoolSubjects[index] =
                        newName;

                }
            );

        }
    );


    list.querySelectorAll(
        "[data-remove-subject]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.removeSubject
                        );


                    schoolSubjects.splice(
                        index,
                        1
                    );


                    renderSubjectList();

                }
            );

        }
    );

}


/* =========================================================
   ADD SUBJECT
   ========================================================= */

function addSubject(
    subject
) {

    const exists =
        schoolSubjects.some(
            function (existing) {

                return existing
                    .toLowerCase() ===
                    subject.toLowerCase();

            }
        );


    if (exists) {

        alert(
            "This subject already exists."
        );


        return;

    }


    schoolSubjects.push(
        subject
    );


    renderSubjectList();

}


/* =========================================================
/* =========================================================
   DOWNLOAD EXCEL TEMPLATE
   ========================================================= */

function downloadExcelTemplate() {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel library has not loaded yet. Please refresh the page and try again."
        );

        return;

    }


    if (
        schoolSubjects.length ===
        0
    ) {

        alert(
            "Please add at least one subject."
        );

        return;

    }


    /* =====================================================
       CREATE WORKBOOK
    ===================================================== */

    const workbook =
        XLSX.utils.book_new();


    /* =====================================================
       CREATE SCORES SHEET
    ===================================================== */

    const scoresHeaders = [

        "Admission No",

        "Student Name",

        "Gender",

        "Class",

        "Term",

        "Session"

    ];


    /*
       Add CA and Exams columns for every subject.
    */

    schoolSubjects.forEach(
        function (subject) {

            scoresHeaders.push(
                subject + " CA"
            );

            scoresHeaders.push(
                subject + " Exams"
            );

        }
    );


    /*
       Example student row.
    */

    const exampleRow = [

        "001",

        "Example Student",

        "Male",

        "SS2",

        "First Term",

        "2025/2026"

    ];


    /*
       Add empty cells for the subject
       CA and Exams columns.

       The formulas will be inserted below.
    */

    schoolSubjects.forEach(
        function () {

            exampleRow.push("");

            exampleRow.push("");

        }
    );


    const scoresData = [

        scoresHeaders,

        exampleRow

    ];


    const scoresSheet =
        XLSX.utils.aoa_to_sheet(
            scoresData
        );


    /* =====================================================
       COLUMN NUMBERS
    ===================================================== */

    /*
       Scores sheet structure:

       A = Admission No
       B = Student Name
       C = Gender
       D = Class
       E = Term
       F = Session

       Subject columns start from G.
    */


    const subjectStartColumn =
        7; // Column G


    /*
       Number of rows initially prepared
       for student entry.

       Users can add more rows in Excel/WPS,
       but formulas will initially be prepared
       for these rows.
    */

    const templateRows =
        100;


    /* =====================================================
       CREATE SUBJECT SHEETS
    ===================================================== */

    schoolSubjects.forEach(
        function (subject) {

            /*
               Each subject gets its own sheet.

               Example:

               Mathematics
               English
               Biology
               etc.
            */

            const subjectData = [

                [
                    "Adm No",
                    "Student Name",
                    "C.A Scores",
                    "Exams Scores"
                ],

                [
                    "001",
                    "Example Student",
                    "",
                    ""
                ]

            ];


            const subjectSheet =
                XLSX.utils.aoa_to_sheet(
                    subjectData
                );


            /*
               Make the subject sheet easier to use.
            */

            subjectSheet["!cols"] = [

                {
                    wch: 15
                },

                {
                    wch: 30
                },

                {
                    wch: 15
                },

                {
                    wch: 15
                }

            ];


            /*
               Add the subject sheet to the workbook.
            */

            XLSX.utils.book_append_sheet(
                workbook,
                subjectSheet,
                subject.substring(
                    0,
                    31
                )
            );

        }
    );


    /* =====================================================
       ADD VLOOKUP FORMULAS TO SCORES SHEET
    ===================================================== */

    /*
       We prepare formulas for rows 2 to 101.

       This means the user can enter up to
       100 students initially.

       The VLOOKUP searches the subject sheet
       using Admission No in column A.

       Subject sheet:

       A = Adm No
       B = Student Name
       C = C.A Scores
       D = Exams Scores

       Therefore:

       C.A = column 3
       Exams = column 4
    */


    schoolSubjects.forEach(
        function (
            subject,
            subjectIndex
        ) {

            /*
               Scores sheet column positions.

               Each subject has two columns:

               CA
               Exams
            */

            const caColumn =
                subjectStartColumn +
                (
                    subjectIndex * 2
                );


            const examsColumn =
                caColumn + 1;


            /*
               Convert column number to Excel
               column letters.
            */

            const caLetter =
                XLSX.utils.encode_col(
                    caColumn - 1
                );


            const examsLetter =
                XLSX.utils.encode_col(
                    examsColumn - 1
                );


            /*
               Excel sheet names can contain
               special characters, so quote them.
            */

            const safeSheetName =
                subject.replace(
                    /'/g,
                    "''"
                );


            /*
/* =====================================================
   ADD VLOOKUP FORMULAS TO SCORES SHEET
   LOOKUP BASED ON STUDENT NAME
===================================================== */

schoolSubjects.forEach(
    function (
        subject,
        subjectIndex
    ) {

        /*
           Scores sheet structure:

           A = Admission No
           B = Student Name
           C = Gender
           D = Class
           E = Term
           F = Session

           Subject columns start from G.
        */


        const caColumn =
            subjectStartColumn +
            (
                subjectIndex * 2
            );


        const examsColumn =
            caColumn + 1;


        /*
           Convert column numbers to Excel
           column letters.
        */

        const caLetter =
            XLSX.utils.encode_col(
                caColumn - 1
            );


        const examsLetter =
            XLSX.utils.encode_col(
                examsColumn - 1
            );


        /*
           Safely handle apostrophes in
           subject names.
        */

        const safeSheetName =
            subject.replace(
                /'/g,
                "''"
            );


        /*
           Create formulas for rows 2 to 101.
        */

        for (
            let row = 2;
            row <= templateRows + 1;
            row++
        ) {

            /* =========================================
               C.A VLOOKUP
            =========================================

               Lookup value:
               Student Name in column B

               Subject sheet:
               B:D

               B = Student Name
               C = C.A Scores
               D = Exams Scores

               Return column 2 = C.A Scores
            */

            scoresSheet[
                caLetter + row
            ] = {

                t: "n",

                f:
                    `IFERROR(VLOOKUP($B${row},'${safeSheetName}'!$B:$D,2,FALSE),"")`

            };


            /* =========================================
               EXAMS VLOOKUP
            =========================================

               Lookup value:
               Student Name in column B

               Subject sheet:
               B:D

               Return column 3 = Exams Scores
            */

            scoresSheet[
                examsLetter + row
            ] = {

                t: "n",

                f:
                    `IFERROR(VLOOKUP($B${row},'${safeSheetName}'!$B:$D,3,FALSE),"")`

            };

        }

    }
);


    /* =====================================================
       ADD SAMPLE ADMISSION NUMBER
    ===================================================== */

    /*
       The example row has Admission No 001.

       The formulas will therefore look for
       001 in each subject sheet.
    */


    /* =====================================================
       SETTINGS SHEET
    ===================================================== */

    const settingsData = [

        [
            "SETTING",
            "VALUE"
        ],

        [
            "School Name",
            reportSettings.schoolName
        ],

        [
            "School Address",
            reportSettings.schoolAddress
        ],

        [
            "CA Maximum",
            reportSettings.caMaximum
        ],

        [
            "Exams Maximum",
            reportSettings.examsMaximum
        ],

        [
            "Grade A Minimum",
            reportSettings.gradeA
        ],

        [
            "Grade B Minimum",
            reportSettings.gradeB
        ],

        [
            "Grade C Minimum",
            reportSettings.gradeC
        ],

        [
            "Grade D Minimum",
            reportSettings.gradeD
        ],

        [
            "Grade E Minimum",
            reportSettings.gradeE
        ],

        [
            "Grade F Minimum",
            reportSettings.gradeF
        ],

        [
            "Subjects",
            schoolSubjects.join(", ")
        ]

    ];


    const settingsSheet =
        XLSX.utils.aoa_to_sheet(
            settingsData
        );


    /* =====================================================
       ADD SCORES AND SETTINGS SHEETS
    ===================================================== */

    /*
       Add Scores first so it appears first.
    */

    XLSX.utils.book_append_sheet(
        workbook,
        scoresSheet,
        "Scores"
    );


    /*
       Settings second.
    */

    XLSX.utils.book_append_sheet(
        workbook,
        settingsSheet,
        "Settings"
    );


    /* =====================================================
       FORMAT COLUMN WIDTHS
    ===================================================== */

    scoresSheet["!cols"] = [

        {
            wch: 15
        },

        {
            wch: 30
        },

        {
            wch: 12
        },

        {
            wch: 12
        },

        {
            wch: 15
        },

        {
            wch: 15
        }

    ];


    /*
       Add widths for subject CA/Exam columns.
    */

    schoolSubjects.forEach(
        function () {

            scoresSheet["!cols"].push(
                {
                    wch: 15
                }
            );

            scoresSheet["!cols"].push(
                {
                    wch: 15
                }
            );

        }
    );


    /* =====================================================
       FREEZE HEADER ROW
    ===================================================== */

    scoresSheet["!freeze"] = {
        xSplit: 0,
        ySplit: 1
    };


    /* =====================================================
       WRITE EXCEL FILE
    ===================================================== */

    const excelData =
        XLSX.write(
            workbook,
            {
                bookType: "xlsx",

                type: "array",

                /*
                   Ask Excel/WPS to recalculate
                   formulas when the workbook opens.
                */

                cellFormula: true
            }
        );


    const blob =
        new Blob(
            [excelData],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "Student_Report_Template.xlsx";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    if (fileStatus) {

        fileStatus.innerHTML =
            "✅ Excel template downloaded successfully with Scores, Settings and individual subject sheets.";

    }

}


    /* =====================================================
       BUILD HEADER
       ===================================================== */

    const headers = [

        "Admission No",

        "Student Name",

        "Gender",

        "Class",

        "Term",

        "Session"

    ];


    schoolSubjects.forEach(
        function (subject) {

            headers.push(
                subject + " CA"
            );


            headers.push(
                subject + " Exams"
            );

        }
    );


    /* =====================================================
       EXAMPLE ROW
       ===================================================== */

    const exampleRow = [

        "001",

        "Example Student",

        "Male",

        "SS2",

        "First Term",

        "2025/2026"

    ];


    schoolSubjects.forEach(
        function () {

            exampleRow.push(
                ""
            );


            exampleRow.push(
                ""
            );

        }
    );


    const scoresData = [

        headers,

        exampleRow

    ];


    /* =====================================================
       SETTINGS
       ===================================================== */

    const settingsData = [

        [
            "SETTING",
            "VALUE"
        ],

        [
            "School Name",
            reportSettings.schoolName
        ],

        [
            "School Address",
            reportSettings.schoolAddress
        ],

        [
            "CA Maximum",
            reportSettings.caMaximum
        ],

        [
            "Exams Maximum",
            reportSettings.examsMaximum
        ],

        [
            "Grade A Minimum",
            reportSettings.gradeA
        ],

        [
            "Grade B Minimum",
            reportSettings.gradeB
        ],

        [
            "Grade C Minimum",
            reportSettings.gradeC
        ],

        [
            "Grade D Minimum",
            reportSettings.gradeD
        ],

        [
            "Grade E Minimum",
            reportSettings.gradeE
        ],

        [
            "Grade F Minimum",
            reportSettings.gradeF
        ],

        [
            "Subjects",
            schoolSubjects.join(", ")
        ]

    ];


    /* =====================================================
       CREATE WORKBOOK
       ===================================================== */

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


    const excelData = XLSX.write(
    workbook,
    {
        bookType: "xlsx",
        type: "array"
    }
);

const blob = new Blob(
    [excelData],
    {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
);

const url = URL.createObjectURL(blob);

const link = document.createElement("a");

link.href = url;
link.download = "Student_Report_Template.xlsx";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);


    if (fileStatus) {

        fileStatus.innerHTML =
            "✅ Excel template downloaded successfully.";

    }

}


/* =========================================================
   HANDLE EXCEL UPLOAD
   ========================================================= */

function handleExcelUpload(
    event
) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (
        typeof XLSX ===
        "undefined"
    ) {

        setFileStatus(
            "❌ Excel library has not loaded."
        );


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
                            type:
                                "array"
                        }
                    );


                /* =========================================
                   CHECK SCORES SHEET
                ========================================= */

                if (
                    !workbook.Sheets["Scores"]
                ) {

                    setFileStatus(
                        "❌ The Excel file does not contain a 'Scores' sheet."
                    );


                    return;

                }


                /* =========================================
                   READ SETTINGS
                ========================================= */

                if (
                    workbook.Sheets["Settings"]
                ) {

                    readSettings(
                        workbook
                            .Sheets["Settings"]
                    );

                }


                /* =========================================
                   DETECT SUBJECTS
                ========================================= */

                const worksheet =
                    workbook.Sheets[
                        "Scores"
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {
                            defval:
                                ""
                        }
                    );


                if (
                    rows.length ===
                    0
                ) {

                    setFileStatus(
                        "❌ The Scores sheet is empty."
                    );


                    return;

                }


                /* =========================================
                   VALIDATE STUDENT NAME
                ========================================= */

                const invalidStudents =
                    rows.filter(
                        function (
                            student
                        ) {

                            return !String(
                                student[
                                    "Student Name"
                                ] ||
                                ""
                            ).trim();

                        }
                    );


                if (
                    invalidStudents.length >
                    0
                ) {

                    setFileStatus(
                        "❌ One or more student records have no Student Name."
                    );


                    return;

                }


                /* =========================================
                   DETECT SUBJECTS FROM COLUMNS
                ========================================= */

                const detectedSubjects =
                    detectSubjectsFromRows(
                        rows
                    );


                if (
                    detectedSubjects.length >
                    0
                ) {

                    schoolSubjects =
                        detectedSubjects;


                    renderSubjectList();

                }


                /* =========================================
                   STORE STUDENTS
                ========================================= */

                students =
                    rows;


                /* =========================================
                   SUCCESS
                ========================================= */

                setFileStatus(

                    "✅ Excel file successfully loaded. " +

                    students.length +

                    " student record(s) found. " +

                    schoolSubjects.length +

                    " subject(s) detected."

                );


                /* =========================================
                   LOAD DROPDOWN
                ========================================= */

                loadStudents();


                /* =========================================
                   SHOW REPORT SECTION
                ========================================= */

                if (
                    reportSection
                ) {

                    reportSection.style.display =
                        "block";

                }


            } catch (error) {

                console.error(
                    "Excel upload error:",
                    error
                );


                setFileStatus(
                    "❌ Unable to read this Excel file. Please make sure you are using the correct template."
                );

            }

        };


    reader.readAsArrayBuffer(
        file
    );

}


/* =========================================================
   READ SETTINGS
   ========================================================= */

function readSettings(
    settingsSheet
) {

    const rows =
        XLSX.utils.sheet_to_json(
            settingsSheet,
            {
                header:
                    1,

                defval:
                    ""
            }
        );


    rows.forEach(
        function (row) {

            const setting =
                String(
                    row[0] ||
                    ""
                ).trim();


            const value =
                row[1];


            if (
                setting ===
                "School Name"
            ) {

                reportSettings.schoolName =
                    String(
                        value
                    );

            }


            if (
                setting ===
                "School Address"
            ) {

                reportSettings.schoolAddress =
                    String(
                        value
                    );

            }


            if (
                setting ===
                "CA Maximum"
            ) {

                reportSettings.caMaximum =
                    Number(
                        value
                    ) || 40;

            }


            if (
                setting ===
                "Exams Maximum"
            ) {

                reportSettings.examsMaximum =
                    Number(
                        value
                    ) || 60;

            }


            if (
                setting ===
                "Grade A Minimum"
            ) {

                reportSettings.gradeA =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Grade B Minimum"
            ) {

                reportSettings.gradeB =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Grade C Minimum"
            ) {

                reportSettings.gradeC =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Grade D Minimum"
            ) {

                reportSettings.gradeD =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Grade E Minimum"
            ) {

                reportSettings.gradeE =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Grade F Minimum"
            ) {

                reportSettings.gradeF =
                    Number(
                        value
                    );

            }


            if (
                setting ===
                "Subjects"
            ) {

                const subjectText =
                    String(
                        value ||
                        ""
                    );


                const importedSubjects =
                    subjectText
                        .split(",")
                        .map(
                            function (
                                subject
                            ) {

                                return subject.trim();

                            }
                        )
                        .filter(
                            function (
                                subject
                            ) {

                                return subject.length >
                                    0;

                            }
                        );


                if (
                    importedSubjects.length >
                    0
                ) {

                    schoolSubjects =
                        importedSubjects;

                }

            }

        }
    );


    renderSubjectList();

}


/* =========================================================
   DETECT SUBJECTS FROM EXCEL HEADERS
   ========================================================= */

function detectSubjectsFromRows(
    rows
) {

    if (
        !rows ||
        rows.length ===
        0
    ) {

        return [];

    }


    const firstStudent =
        rows[0];


    const subjectSet =
        new Set();


    Object.keys(
        firstStudent
    ).forEach(
        function (key) {

            const match =
                key.match(
                    /^(.+)\s+(CA|Exams)$/i
                );


            if (
                match
            ) {

                const subject =
                    match[1].trim();


                if (
                    subject
                ) {

                    subjectSet.add(
                        subject
                    );

                }

            }

        }
    );


    return Array.from(
        subjectSet
    );

}


/* =========================================================
   LOAD STUDENTS INTO DROPDOWN
   ========================================================= */

function loadStudents() {

    if (
        !elementExists(
            studentSelect
        )
    ) {

        return;

    }


    studentSelect.innerHTML =
        '<option value="">-- Select Student --</option>';


    students.forEach(
        function (
            student,
            index
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =

                (
                    student[
                        "Admission No"
                    ] ||
                    ""
                ) +

                " - " +

                (
                    student[
                        "Student Name"
                    ] ||
                    ""
                );


            studentSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   GENERATE SINGLE REPORT
   ========================================================= */

function generateSingleReport() {

    if (
        !elementExists(
            studentSelect
        )
    ) {

        return;

    }


    const index =
        studentSelect.value;


    if (
        index === ""
    ) {

        alert(
            "Please select a student."
        );


        return;

    }


    const student =
        students[
            Number(index)
        ];


    if (!student) {

        return;

    }


    const report =
        createReport(
            student
        );


    if (
        reportContainer
    ) {

        reportContainer.innerHTML =
            report;


        reportContainer.scrollIntoView({
            behavior:
                "smooth"
        });

    }

}


/* =========================================================
   GENERATE ALL REPORTS
   ========================================================= */

function generateAllReports() {

    if (
        students.length ===
        0
    ) {

        alert(
            "No student records found."
        );


        return;

    }


    let allReports =
        "";


    students.forEach(
        function (
            student
        ) {

            allReports +=
                createReport(
                    student
                );

        }
    );


    if (
        reportContainer
    ) {

        reportContainer.innerHTML =
            allReports;


        reportContainer.scrollIntoView({
            behavior:
                "smooth"
        });

    }

}


/* =========================================================
   PAYSTACK BUTTONS
   ========================================================= */

function attachPaystackButtons() {

    const buttons =
        document.querySelectorAll(
            ".subscribe-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    startPaystackPayment(
                        button
                    );

                }
            );

        }
    );

}


/* =========================================================
   START PAYSTACK PAYMENT
   ========================================================= */

async function startPaystackPayment(
    button
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            error ||
            !data.session
        ) {

            alert(
                "Please create an account or sign in before subscribing."
            );


            return;

        }


        const user =
            data.session.user;


        const plan =
            button.dataset.plan;


        const price =
            Number(
                button.dataset.price
            );


        const duration =
            button.dataset.duration ||
            "";


        if (
            !plan ||
            !price
        ) {

            alert(
                "Invalid subscription plan."
            );


            return;

        }


        /*
           Check whether Paystack loaded.
        */

        if (
            typeof PaystackPop ===
            "undefined"
        ) {

            alert(
                "Paystack has not loaded. Please refresh the page and try again."
            );


            return;

        }


        /*
           Paystack checkout
        */

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
                        plan,

                    duration:
                        duration

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


                        await verifyPaystackPayment(
                            response.reference,
                            plan
                        );

                    },


                onClose:
                    function () {

                        console.log(
                            "Paystack checkout closed."
                        );

                    }

            });


        handler.openIframe();


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        alert(
            "Unable to start payment. Please try again."
        );

    }

}


/* =========================================================
   VERIFY PAYSTACK PAYMENT
   ========================================================= */

async function verifyPaystackPayment(
    reference,
    plan
) {

    try {

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
                                reference,

                            plan:
                                plan

                        }

                    }
                );


        console.log(
            "Verification result:",
            data
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


        if (
            data &&
            data.success
        ) {

            alert(
                "✅ Payment successful!\n\nYour " +
                plan.toUpperCase() +
                " subscription is now active."
            );


            await checkLogin();


        } else {

            alert(
                "Payment could not be verified."
            );

        }


    } catch (error) {

        console.error(
            error
        );


        alert(
            "An error occurred while verifying the payment."
        );

    }

}

/* =========================================================
   DETECT PASSWORD RECOVERY
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (event === "PASSWORD_RECOVERY") {

            const resetSection =
                document.getElementById(
                    "resetPasswordSection"
                );

            if (resetSection) {

                resetSection.style.display =
                    "block";

            }

        }

    }
);

/* =========================================================
   CREATE REPORT
   ========================================================= */

function createReport(
    student
) {

    const subjects =
        [];


    let overallTotal =
        0;


    /*
       Use the subjects defined by the school.
    */

    let subjectsToUse =
        schoolSubjects;


    /*
       If the uploaded Excel contains different
       subjects, detect them automatically.
    */

    const detectedSubjects =
        detectSubjectsFromRows(
            [student]
        );


    if (
        detectedSubjects.length >
        0
    ) {

        subjectsToUse =
            detectedSubjects;

    }


    /* =====================================================
       CALCULATE EACH SUBJECT
       ===================================================== */

    subjectsToUse.forEach(
        function (
            subjectName
        ) {

            const caKey =
                subjectName +
                " CA";


            const examsKey =
                subjectName +
                " Exams";


            const ca =
                Number(
                    student[
                        caKey
                    ]
                ) || 0;


            const exams =
                Number(
                    student[
                        examsKey
                    ]
                ) || 0;


            const total =
                ca +
                exams;


            /*
               Only add a subject if its columns
               actually exist in the Excel record.
            */

            if (
                Object.prototype
                    .hasOwnProperty.call(
                        student,
                        caKey
                    ) ||

                Object.prototype
                    .hasOwnProperty.call(
                        student,
                        examsKey
                    )
            ) {

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


                overallTotal +=
                    total;

            }

        }
    );


    /* =====================================================
       AVERAGE
       ===================================================== */

    const numberOfSubjects =
        subjects.length;


    const average =
        numberOfSubjects > 0

            ? overallTotal /
              numberOfSubjects

            : 0;


    /* =====================================================
       GRADE
       ===================================================== */

    const grade =
        getGrade(
            average
        );


    /* =====================================================
       POSITION
       ===================================================== */

    const position =
        calculatePosition(
            student,
            students
        );


    /* =====================================================
       SUBJECT ROWS
       ===================================================== */

    let subjectRows =
        "";


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
                        ${formatScore(
                            subject.ca
                        )}
                    </td>

                    <td>
                        ${formatScore(
                            subject.exams
                        )}
                    </td>

                    <td>
                        ${formatScore(
                            subject.total
                        )}
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


    /* =====================================================
       RETURN REPORT HTML
       ===================================================== */

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
                        student[
                            "Admission No"
                        ] ||
                        ""
                    )}
                </div>


                <div>
                    <strong>
                        Student Name:
                    </strong>

                    ${escapeHTML(
                        student[
                            "Student Name"
                        ] ||
                        ""
                    )}
                </div>


                <div>
                    <strong>
                        Gender:
                    </strong>

                    ${escapeHTML(
                        student[
                            "Gender"
                        ] ||
                        ""
                    )}
                </div>


                <div>
                    <strong>
                        Class:
                    </strong>

                    ${escapeHTML(
                        student[
                            "Class"
                        ] ||
                        ""
                    )}
                </div>


                <div>
                    <strong>
                        Term:
                    </strong>

                    ${escapeHTML(
                        student[
                            "Term"
                        ] ||
                        ""
                    )}
                </div>


                <div>
                    <strong>
                        Session:
                    </strong>

                    ${escapeHTML(
                        student[
                            "Session"
                        ] ||
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


                <tfoot>

                    <tr>

                        <th colspan="4">
                            OVERALL TOTAL
                        </th>

                        <th colspan="2">
                            ${overallTotal.toFixed(2)}
                        </th>

                    </tr>

                </tfoot>

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


/* =========================================================
   GRADING SYSTEM
   ========================================================= */

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


/* =========================================================
   CALCULATE CLASS POSITION
   ========================================================= */

function calculatePosition(
    currentStudent,
    allStudents
) {

    const currentTotal =
        calculateStudentTotal(
            currentStudent
        );


    let position =
        1;


    allStudents.forEach(
        function (
            student
        ) {

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


/* =========================================================
   CALCULATE STUDENT TOTAL
   ========================================================= */

function calculateStudentTotal(
    student
) {

    let total =
        0;


    Object.keys(
        student
    ).forEach(
        function (
            key
        ) {

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


/* =========================================================
   FORMAT POSITION
   ========================================================= */

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


/* =========================================================
   FORMAT SCORE
   ========================================================= */

function formatScore(
    score
) {

    const number =
        Number(score);


    if (
        Number.isInteger(
            number
        )
    ) {

        return String(
            number
        );

    }


    return number.toFixed(2);

}


/* =========================================================
   FILE STATUS
   ========================================================= */

function setFileStatus(
    message
) {

    if (
        elementExists(
            fileStatus
        )
    ) {

        fileStatus.innerHTML =
            message;

    }

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

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


/* =========================================================
   END OF SCRIPT
   ========================================================= */
