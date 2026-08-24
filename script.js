/* =========================================================
   STUDENT REPORT GENERATOR
   COMPLETE script.js
   ========================================================= */


/* =========================================================
   WAIT UNTIL HTML IS FULLY LOADED
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Student Report System JavaScript started");


    /* =====================================================
       SUPABASE
       ===================================================== */

    const SUPABASE_URL =
        "https://nzeddvcmabfodmvmgsyg.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

    const supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =====================================================
       GLOBAL VARIABLES
       ===================================================== */

    let students = [];


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

    };


    /* =====================================================
       GET HTML ELEMENTS
       ===================================================== */

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

    const subscriptionStatus =
        document.getElementById("subscriptionStatus");

    const subscriptionPlans =
        document.getElementById("subscriptionPlans");

    const downloadTemplate =
        document.getElementById("downloadTemplate");

    const excelFile =
        document.getElementById("excelFile");

    const fileStatus =
        document.getElementById("fileStatus");

    const reportSection =
        document.getElementById("reportSection");

    const studentSelect =
        document.getElementById("studentSelect");

    const generateReportButton =
        document.getElementById("generateReport");

    const generateAllButton =
        document.getElementById("generateAll");

    const reportContainer =
        document.getElementById("reportContainer");


    /* =====================================================
       CHECK REQUIRED ELEMENTS
       ===================================================== */

    console.log("Checking HTML elements...");

    if (!authSection) {
        console.error("authSection was not found.");
    }

    if (!appSection) {
        console.error("appSection was not found.");
    }

    if (!emailInput) {
        console.error("email input was not found.");
    }

    if (!passwordInput) {
        console.error("password input was not found.");
    }

    if (!signUpButton) {
        console.error("signUpButton was not found.");
    }

    if (!signInButton) {
        console.error("signInButton was not found.");
    }


    /* =====================================================
       SHOW APPLICATION
       ===================================================== */

    function showApp() {

        if (authSection) {
            authSection.style.display = "none";
        }

        if (subscriptionPlans) {
            subscriptionPlans.style.display = "none";
        }

        if (appSection) {
            appSection.style.display = "block";
        }

    }


    /* =====================================================
       SHOW LOGIN / SUBSCRIPTION AREA
       ===================================================== */

    function showLogin() {

        if (authSection) {
            authSection.style.display = "block";
        }

        if (appSection) {
            appSection.style.display = "none";
        }

        if (subscriptionPlans) {
            subscriptionPlans.style.display = "block";
        }

    }


    /* =====================================================
       CREATE ACCOUNT
       ===================================================== */

    if (signUpButton) {

        signUpButton.addEventListener(
            "click",
            async function () {

                console.log("Create Account button clicked");

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
                    "Creating account...";


                try {

                    const result =
                        await supabaseClient.auth.signUp({

                            email: email,

                            password: password,

                            options: {

                                emailRedirectTo:
                                    "https://ibsongee75.github.io/Student-report-system-ibsongee75/"

                            }

                        });


                    const data =
                        result.data;

                    const error =
                        result.error;


                    if (error) {

                        console.error(
                            "SIGN UP ERROR:",
                            error
                        );

                        authStatus.innerHTML =
                            "❌ " +
                            escapeHTML(
                                error.message
                            );

                        return;

                    }


                    console.log(
                        "Account created:",
                        data
                    );


                    if (
                        data.user &&
                        !data.session
                    ) {

                        authStatus.innerHTML =
                            "✅ Account created successfully. Please check your email and confirm your account before signing in.";

                        return;

                    }


                    authStatus.innerHTML =
                        "✅ Account created successfully.";

                }

                catch (error) {

                    console.error(
                        "SIGN UP EXCEPTION:",
                        error
                    );

                    authStatus.innerHTML =
                        "❌ Unable to create account.";

                }

            }
        );

    }


    /* =====================================================
       SIGN IN
       ===================================================== */

    if (signInButton) {

        signInButton.addEventListener(
            "click",
            async function () {

                console.log("Sign In button clicked");

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


                try {

                    const result =
                        await supabaseClient.auth.signInWithPassword({

                            email: email,

                            password: password

                        });


                    const data =
                        result.data;

                    const error =
                        result.error;


                    if (error) {

                        console.error(
                            "SIGN IN ERROR:",
                            error
                        );

                        authStatus.innerHTML =
                            "❌ " +
                            escapeHTML(
                                error.message
                            );

                        return;

                    }


                    console.log(
                        "Login successful:",
                        data.user
                    );


                    authStatus.innerHTML =
                        "✅ Login successful.";

                    await checkLogin();

                }

                catch (error) {

                    console.error(
                        "SIGN IN EXCEPTION:",
                        error
                    );

                    authStatus.innerHTML =
                        "❌ Unable to sign in.";

                }

            }
        );

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                try {

                    const { error } =
                        await supabaseClient.auth.signOut();


                    if (error) {

                        console.error(
                            "Logout error:",
                            error
                        );

                        return;

                    }


                    showLogin();


                    authStatus.innerHTML =
                        "You have been logged out.";

                }

                catch (error) {

                    console.error(
                        "Logout exception:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       DISPLAY SUBSCRIPTION STATUS
       ===================================================== */

    function displaySubscriptionStatus(
        subscription,
        user
    ) {

        if (!subscriptionStatus) {
            return;
        }


        if (
            subscription &&
            subscription.status &&
            subscription.status.toLowerCase() === "paid"
        ) {

            let expiryText =
                "Unknown";


            if (subscription.expires_at) {

                const expiryDate =
                    new Date(
                        subscription.expires_at
                    );


                expiryText =
                    expiryDate.toLocaleDateString();

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

                ${escapeHTML(user.email)}

                <br>

                <strong>
                    Expires:
                </strong>

                ${expiryText}

            `;

        }

        else {

            subscriptionStatus.innerHTML = `

                <strong>
                    Subscription Status:
                </strong>

                <span style="color:red;">
                    UNPAID
                </span>

                <br>

                <small>
                    Please choose a subscription plan below.
                </small>

            `;

        }

    }


    /* =====================================================
       CHECK LOGIN AND SUBSCRIPTION
       ===================================================== */

    async function checkLogin() {

        console.log(
            "Checking login..."
        );


        try {

            const result =
                await supabaseClient.auth.getSession();


            const data =
                result.data;

            const error =
                result.error;


            if (error) {

                console.error(
                    "Session error:",
                    error
                );

                showLogin();

                return;

            }


            if (
                !data ||
                !data.session
            ) {

                console.log(
                    "No logged-in user."
                );

                showLogin();

                return;

            }


            const user =
                data.session.user;


            console.log(
                "Logged-in user:",
                user.email
            );


            /* =============================================
               CHECK SUBSCRIPTION
               ============================================= */

            const subscriptionResult =
                await supabaseClient
                    .from("subscriptions")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();


            const subscription =
                subscriptionResult.data;

            const subscriptionError =
                subscriptionResult.error;


            console.log(
                "Subscription:",
                subscription
            );


            if (subscriptionError) {

                console.error(
                    "Subscription error:",
                    subscriptionError
                );


                if (subscriptionStatus) {

                    subscriptionStatus.innerHTML =
                        "⚠️ Unable to check subscription.";

                }


                showLogin();

                return;

            }


            displaySubscriptionStatus(
                subscription,
                user
            );


            /* =============================================
               ACTIVE SUBSCRIPTION
               ============================================= */

            const activeSubscription =

                subscription &&

                subscription.status &&
                subscription.status.toLowerCase() === "paid" &&

                subscription.expires_at &&

                new Date(
                    subscription.expires_at
                ) > new Date();


            if (activeSubscription) {

                console.log(
                    "Active subscription found."
                );

                showApp();

            }

            else {

                console.log(
                    "No active subscription."
                );

                showLogin();

            }

        }

        catch (error) {

            console.error(
                "CHECK LOGIN ERROR:",
                error
            );

            showLogin();

        }

    }


    /* =====================================================
       AUTH STATE CHANGE
       ===================================================== */

    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            console.log(
                "Auth event:",
                event
            );


            if (!session) {

                showLogin();

            }

        }
    );


    /* =====================================================
       DOWNLOAD EXCEL TEMPLATE
       ===================================================== */

    if (downloadTemplate) {

        downloadTemplate.addEventListener(
            "click",
            function () {

                console.log(
                    "Downloading Excel template..."
                );


                /*
                   The school can change/add subjects
                   by changing the subject columns.

                   Every subject must have:

                   Subject CA
                   Subject Exams

                   Example:

                   Mathematics CA
                   Mathematics Exams

                   English CA
                   English Exams

                   Agricultural Science CA
                   Agricultural Science Exams
                */


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


                const workbook =
                    XLSX.utils.book_new();


                const scoresSheet =
                    XLSX.utils.aoa_to_sheet(
                     
