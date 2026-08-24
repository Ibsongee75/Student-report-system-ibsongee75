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
       Therefore you do NOT have to manu
