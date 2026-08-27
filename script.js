/* =========================================================
   STUDENT REPORT GENERATOR
   COMPLETE CORRECTED script.js
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


/*
   Number of student rows prepared in the
   downloaded Excel template.
*/

const TEMPLATE_STUDENT_ROWS = 100;


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

    const email =
        prompt(
            "Enter the email address you used to create your account:"
        );


    if (!email) {

        return;

    }


    const cleanEmail =
        email.trim();


    if (!cleanEmail) {

        alert(
            "Please enter your email address."
        );

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .resetPasswordForEmail(
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
                "❌ " +
                error.message
            );


            return;

        }


        alert(
            "✅ Password reset email sent. Please check your email."
        );


    } catch (error) {

        console.error(
            error
        );


        alert(
            "❌ Unable to send password reset email."
        );

    }

}


/* =========================================================
   UPDATE PASSWORD
   ========================================================= */

async function updatePassword() {

    const newPasswordElement =
        document.getElementById(
            "newPassword"
        );


    const confirmPasswordElement =
        document.getElementById(
            "confirmNewPassword"
        );


    if (
        !newPasswordElement ||
        !confirmPasswordElement
    ) {

        alert(
            "Password fields could not be found."
        );

        return;

    }


    const newPassword =
        newPasswordElement.value;


    const confirmPassword =
        confirmPasswordElement.value;


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


    try {

        const {
            error
        } =
            await supabaseClient
                .auth
                .updateUser({

                    password:
                        newPassword

                });


        if (error) {

            console.error(
                "Password update error:",
                error
            );


            alert(
                "❌ " +
                error.message
            );


            return;

        }


        alert(
            "✅ Password changed successfully."
        );


        const resetSection =
            document.getElementById(
                "resetPasswordSection"
            );


        if (resetSection) {

            resetSection.style.display =
                "none";

        }


        newPasswordElement.value =
            "";


        confirmPasswordElement.value =
            "";


    } catch (error) {

        console.error(
            error
        );


        alert(
            "❌ Unable to change password."
        );

    }

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


        setTimeout(
            function () {

                checkLogin();

            },
            0
        );

    }
);


/* =========================================================
   PASSWORD RECOVERY
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (
            event ===
            "PASSWORD_RECOVERY"
        ) {

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
        !elementExists(
            appSection
        )
    ) {

        return;

    }


    const existing =
        document.getElementById(
            "subjectManager"
        );


    if (existing) {

        return;

    }


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
            ".card"
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


                    const duplicate =
                        schoolSubjects.some(
                            function (
                                subject,
                                subjectIndex
                            ) {

                                return (
                                    subjectIndex !== index &&
                                    subject.toLowerCase() ===
                                    newName.toLowerCase()
                                );

                            }
                        );


                    if (duplicate) {

                        alert(
                            "This subject already exists."
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
   CLEAN EXCEL SHEET NAME
   ========================================================= */

function makeSafeSheetName(
    name,
    usedNames
) {

    let clean =
        String(
            name
        )
            .replace(
                /[:\\\/\?\*\[\]]/g,
                ""
            )
            .trim();


    if (!clean) {

        clean =
            "Subject";

    }


    clean =
        clean.substring(
            0,
            31
        );


    let finalName =
        clean;


    let counter =
        2;


    while (
        usedNames.has(
            finalName.toLowerCase()
        )
    ) {

        const suffix =
            " " +
            counter;


        finalName =
            clean.substring(
                0,
                31 - suffix.length
            ) +
            suffix;


        counter++;

    }


    usedNames.add(
        finalName.toLowerCase()
    );


    return finalName;

}


/* =========================================================
   DOWNLOAD EXCEL TEMPLATE
   ========================================================= */

function downloadExcelTemplate() {
  
    try {

        if (typeof XLSX === "undefined") {

            alert("Excel library has not loaded. Please refresh the page.");

            return;
        }


        /* =========================================
           CLEAN SUBJECT LIST
        ========================================= */

        schoolSubjects = schoolSubjects
            .map(function(subject) {
                return String(subject).trim();
            })
            .filter(function(subject) {
                return subject !== "";
            });


        if (schoolSubjects.length === 0) {

            alert("Please add at least one subject.");

            return;
        }


        /* =========================================
           CREATE WORKBOOK
        ========================================= */

        const workbook = XLSX.utils.book_new();


        /* =========================================
           CREATE SCORES SHEET
        ========================================= */

        const scoresHeaders = [
            "Admission No",
            "Student Name",
            "Gender",
            "Class",
            "Term",
            "Session"
        ];


        schoolSubjects.forEach(function(subject) {

            scoresHeaders.push(subject + " CA");
            scoresHeaders.push(subject + " Exams");

        });


        const scoresData = [scoresHeaders];


        for (
            let i = 1;
            i <= TEMPLATE_STUDENT_ROWS;
            i++
        ) {

            const row = [

                i === 1 ? "001" : "",
                i === 1 ? "Example Student" : "",
                i === 1 ? "Male" : "",
                i === 1 ? "SS2" : "",
                i === 1 ? "First Term" : "",
                i === 1 ? "2025/2026" : ""

            ];


            schoolSubjects.forEach(function() {

                row.push("");
                row.push("");

            });


            scoresData.push(row);

        }


        const scoresSheet =
            XLSX.utils.aoa_to_sheet(scoresData);


        scoresSheet["!cols"] = [
            { wch: 15 },
            { wch: 30 },
            { wch: 12 },
            { wch: 12 },
            { wch: 15 },
            { wch: 15 }
        ];


        schoolSubjects.forEach(function() {

            scoresSheet["!cols"].push({
                wch: 15
            });

            scoresSheet["!cols"].push({
                wch: 15
            });

        });


        scoresSheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1
        };


        XLSX.utils.book_append_sheet(
            workbook,
            scoresSheet,
            "Scores"
        );


        /* =========================================
           CREATE SETTINGS SHEET
        ========================================= */

        const settingsData = [

            ["SETTING", "VALUE"],

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
            XLSX.utils.aoa_to_sheet(settingsData);


        settingsSheet["!cols"] = [
            { wch: 25 },
            { wch: 50 }
        ];


        XLSX.utils.book_append_sheet(
            workbook,
            settingsSheet,
            "Settings"
        );


        /* =========================================
           CREATE ONE SHEET FOR EACH SUBJECT
        ========================================= */

        schoolSubjects.forEach(function(subject) {

            let sheetName = String(subject)
                .replace(/[:\\\/\?\*\[\]]/g, "")
                .trim();


            if (!sheetName) {

                sheetName = "Subject";

            }


            /*
               Excel sheet names cannot exceed 31 characters.
            */

            sheetName =
                sheetName.substring(0, 31);


            /*
               Make sure the name is unique.
            */

            let originalName = sheetName;
            let counter = 2;


            while (
                workbook.SheetNames.some(
                    function(name) {

                        return name.toLowerCase() ===
                               sheetName.toLowerCase();

                    }
                )
            ) {

                const suffix =
                    " " + counter;


                sheetName =
                    originalName.substring(
                        0,
                        31 - suffix.length
                    ) +
                    suffix;


                counter++;

            }


            /* =====================================
               SUBJECT SHEET DATA
            ===================================== */

            const subjectData = [

                [
                    "Adm No",
                    "Student Name",
                    "C.A Scores",
                    "Exams Scores"
                ]

            ];


            for (
                let i = 1;
                i <= TEMPLATE_STUDENT_ROWS;
                i++
            ) {

                subjectData.push([

                    i === 1 ? "001" : "",

                    i === 1
                        ? "Example Student"
                        : "",

                    "",

                    ""

                ]);

            }


            const subjectSheet =
                XLSX.utils.aoa_to_sheet(
                    subjectData
                );


            subjectSheet["!cols"] = [

                { wch: 15 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 }

            ];


            subjectSheet["!freeze"] = {

                xSplit: 0,
                ySplit: 1

            };


            /*
               ADD THE SUBJECT SHEET
               DIRECTLY TO THE WORKBOOK.
            */

            XLSX.utils.book_append_sheet(
                workbook,
                subjectSheet,
                sheetName
            );

        });


        /* =========================================
           ADD VLOOKUP FORMULAS TO SCORES
        ========================================= */

        schoolSubjects.forEach(function(
            subject,
            subjectIndex
        ) {

            const caColumn =
                7 + (subjectIndex * 2);


            const examsColumn =
                caColumn + 1;


            const caLetter =
                XLSX.utils.encode_col(
                    caColumn - 1
                );


            const examsLetter =
                XLSX.utils.encode_col(
                    examsColumn - 1
                );


            /*
               Find the actual subject sheet.
            */

            let sheetName =
                subject
                    .replace(
                        /[:\\\/\?\*\[\]]/g,
                        ""
                    )
                    .trim();


            if (!sheetName) {

                sheetName = "Subject";

            }


            sheetName =
                sheetName.substring(
                    0,
                    31
                );


            /*
               Find matching sheet name
               case-insensitively.
            */

            const actualSheetName =
                workbook.SheetNames.find(
                    function(name) {

                        return name.toLowerCase() ===
                               sheetName.toLowerCase();

                    }
                );


            if (!actualSheetName) {

                console.error(
                    "Subject sheet not found:",
                    subject
                );

                return;

            }


            const safeSheetName =
                actualSheetName.replace(
                    /'/g,
                    "''"
                );


            for (
                let row = 2;
                row <= TEMPLATE_STUDENT_ROWS + 1;
                row++
            ) {

                scoresSheet[
                    caLetter + row
                ] = {

                    t: "n",

                    f:
                        `IF($B${row}="","",IFERROR(VLOOKUP($B${row},'${safeSheetName}'!$B:$D,2,FALSE),""))`

                };


                scoresSheet[
                    examsLetter + row
                ] = {

                    t: "n",

                    f:
                        `IF($B${row}="","",IFERROR(VLOOKUP($B${row},'${safeSheetName}'!$B:$D,3,FALSE),""))`

                };

            }

        });


        /* =========================================
           WRITE EXCEL FILE
        ========================================= */

        const excelData =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array"
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
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "Student_Report_Template.xlsx";


        document.body.appendChild(link);

        link.click();


        setTimeout(function() {

            URL.revokeObjectURL(url);

            if (link.parentNode) {

                link.parentNode.removeChild(link);

            }

        }, 5000);


        /* =========================================
           CONFIRM SUCCESS
        ========================================= */

        setFileStatus(

            "✅ Template created with " +
            schoolSubjects.length +
            " subject sheet(s): " +
            schoolSubjects.join(", ")

        );


        console.log(
            "Workbook sheets created:",
            workbook.SheetNames
        );


    } catch (error) {

        console.error(
            "Excel template error:",
            error
        );


        alert(
            "❌ Excel template could not be created.\n\n" +
            error.message
        );


        setFileStatus(
            "❌ Excel template generation failed."
        );

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


                if (
                    !workbook.Sheets["Scores"]
                ) {

                    setFileStatus(
                        "❌ The Excel file does not contain a 'Scores' sheet."
                    );


                    return;

                }


                if (
                    workbook.Sheets["Settings"]
                ) {

                    readSettings(
                        workbook.Sheets[
                            "Settings"
                        ]
                    );

                }


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


                /*
                   Remove completely empty rows.

                   This is important because the
                   template contains prepared rows.
                */

                const actualRows =
                    rows.filter(
                        function (student) {

                            return (
                                String(
                                    student[
                                        "Admission No"
                                    ] ||
                                    ""
                                ).trim() !== "" ||

                                String(
                                    student[
                                        "Student Name"
                                    ] ||
                                    ""
                                ).trim() !== ""
                            );

                        }
                    );


                if (
                    actualRows.length ===
                    0
                ) {

                    setFileStatus(
                        "❌ The Scores sheet does not contain any student records."
                    );


                    return;

                }


                const invalidStudents =
                    actualRows.filter(
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


                const detectedSubjects =
                    detectSubjectsFromRows(
                        actualRows
                    );


                if (
                    detectedSubjects.length >
                    0
                ) {

                    schoolSubjects =
                        detectedSubjects;


                    renderSubjectList();

                }


                students =
                    actualRows;


                setFileStatus(

                    "✅ Excel file successfully loaded. " +

                    students.length +

                    " student record(s) found. " +

                    schoolSubjects.length +

                    " subject(s) detected."

                );


                loadStudents();


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


        if (
            typeof PaystackPop ===
            "undefined"
        ) {

            alert(
                "Paystack has not loaded. Please refresh the page and try again."
            );


            return;

        }


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
   CREATE REPORT
   ========================================================= */

function createReport(
    student
) {

    const subjects =
        [];


    let overallTotal =
        0;


    let subjectsToUse =
        schoolSubjects;


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


    const numberOfSubjects =
        subjects.length;


    const average =
        numberOfSubjects > 0

            ? overallTotal /
              numberOfSubjects

            : 0;


    const grade =
        getGrade(
            average
        );


    const position =
        calculatePosition(
            student,
            students
        );


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
