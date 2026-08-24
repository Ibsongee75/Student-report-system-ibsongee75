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

let isCheckingLogin = false;


/* =========================================================
   REPORT SETTINGS
   ========================================================= */

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


/* =========================================================
   GET HTML ELEMENTS
   ========================================================= */

const authSection =
    document.getElementById("authSection");

const appSection =
    document.getElementById("appSection");

const subscriptionPlans =
    document.getElementById("subscriptionPlans");

const subscriptionStatus =
    document.getElementById("subscriptionStatus");

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


/* =========================================================
   BASIC SAFETY CHECK
   ========================================================= */

console.log(
    "Student Report Generator JavaScript loaded."
);


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    if (authSection) {

        authSection.style.display = "block";

    }

    if (appSection) {

        appSection.style.display = "none";

    }

    if (subscriptionPlans) {

        subscriptionPlans.style.display = "none";

    }

    if (subscriptionStatus) {

        subscriptionStatus.style.display = "none";

    }

}


/* =========================================================
   SHOW SUBSCRIPTION PLANS
   ========================================================= */

function showSubscriptionPlans() {

    if (authSection) {

        authSection.style.display = "none";

    }

    if (appSection) {

        appSection.style.display = "none";

    }

    if (subscriptionPlans) {

        subscriptionPlans.style.display = "block";

    }

    if (subscriptionStatus) {

        subscriptionStatus.style.display = "block";

    }

}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

function showApp() {

    if (authSection) {

        authSection.style.display = "none";

    }

    if (subscriptionPlans) {

        subscriptionPlans.style.display = "none";

    }

    if (subscriptionStatus) {

        subscriptionStatus.style.display = "block";

    }

    if (appSection) {

        appSection.style.display = "block";

    }

}


/* =========================================================
   CREATE ACCOUNT
   ========================================================= */

if (signUpButton) {

    signUpButton.addEventListener(
        "click",
        async function () {

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                if (authStatus) {

                    authStatus.innerHTML =
                        "❌ Please enter your email and password.";

                }

                return;

            }


            if (password.length < 6) {

                if (authStatus) {

                    authStatus.innerHTML =
                        "❌ Password must contain at least 6 characters.";

                }

                return;

            }


            if (authStatus) {

                authStatus.innerHTML =
                    "Creating your account...";

            }


            try {

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

                    console.error(
                        "SIGN UP ERROR:",
                        error
                    );


                    if (authStatus) {

                        authStatus.innerHTML =
                            "❌ " + error.message;

                    }

                    return;

                }


                console.log(
                    "SIGN UP RESULT:",
                    data
                );


                if (
                    data.user &&
                    !data.session
                ) {

                    if (authStatus) {

                        authStatus.innerHTML =
                            "✅ Account created successfully. Please check your email and confirm your account before signing in.";

                    }

                    return;

                }


                if (authStatus) {

                    authStatus.innerHTML =
                        "✅ Account created successfully.";

                }

            }

            catch (error) {

                console.error(
                    "SIGN UP EXCEPTION:",
                    error
                );


                if (authStatus) {

                    authStatus.innerHTML =
                        "❌ Something went wrong while creating the account.";

                }

            }

        }
    );

}


/* =========================================================
   SIGN IN
   ========================================================= */

if (signInButton) {

    signInButton.addEventListener(
        "click",
        async function () {

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                if (authStatus) {

                    authStatus.innerHTML =
                        "❌ Please enter your email and password.";

                }

                return;

            }


            if (authStatus) {

                authStatus.innerHTML =
                    "Signing in...";

            }


            try {

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                if (error) {

                    console.error(
                        "SIGN IN ERROR:",
                        error
                    );


                    if (authStatus) {

                        authStatus.innerHTML =
                            "❌ " + error.message;

                    }

                    return;

                }


                console.log(
                    "LOGIN SUCCESS:",
                    data.user
                );


                if (authStatus) {

                    authStatus.innerHTML =
                        "✅ Login successful. Checking subscription...";

                }


                /*
                   Do NOT call checkLogin() here.
                   Supabase's auth state listener will handle it.
                */

            }

            catch (error) {

                console.error(
                    "SIGN IN EXCEPTION:",
                    error
                );


                if (authStatus) {

                    authStatus.innerHTML =
                        "❌ Unable to sign in. Please try again.";

                }

            }

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const { error } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );

                    alert(
                        "Unable to log out."
                    );

                    return;

                }


                students = [];


                showLogin();


                if (authStatus) {

                    authStatus.innerHTML =
                        "You have been logged out.";

                }

            }

            catch (error) {

                console.error(
                    "LOGOUT EXCEPTION:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   DISPLAY SUBSCRIPTION STATUS
   ========================================================= */

function displaySubscriptionStatus(
    subscription,
    user
) {

    if (!subscriptionStatus) {

        return;

    }


    subscriptionStatus.style.display =
        "block";


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


            if (
                !isNaN(
                    expiryDate.getTime()
                )
            ) {

                expiryText =
                    expiryDate.toLocaleDateString();

            }

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
                user.email || ""
            )}

            <br>

            <strong>
                Expires:
            </strong>

            ${escapeHTML(
                expiryText
            )}

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

            Please choose a subscription plan below.

        `;

    }

}


/* =========================================================
   CHECK LOGIN AND SUBSCRIPTION
   ========================================================= */

async function checkLogin() {

    /*
       Prevent multiple simultaneous checks.
    */

    if (isCheckingLogin) {

        return;

    }


    isCheckingLogin = true;


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "SESSION ERROR:",
                error
            );


            showLogin();

            return;

        }


        if (
            !data ||
            !data.session
        ) {

            showLogin();

            return;

        }


        const user =
            data.session.user;


        console.log(
            "CURRENT USER:",
            user.email
        );


        /*
           Check subscription.
        */

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
            "SUBSCRIPTION:",
            subscription
        );


        console.log(
            "SUBSCRIPTION ERROR:",
            subscriptionError
        );


        /*
           If the subscriptions table cannot be
           accessed, don't silently open the app.
        */

        if (subscriptionError) {

            console.error(
                "SUBSCRIPTION CHECK ERROR:",
                subscriptionError
            );


            showSubscriptionPlans();


            if (subscriptionStatus) {

                subscriptionStatus.innerHTML = `

                    <strong>
                        Subscription Status:
                    </strong>

                    <span style="color:red;">
                        Unable to verify
                    </span>

                    <br>

                    Please try again.

                `;

            }

            return;

        }


        displaySubscriptionStatus(
            subscription,
            user
        );


        /*
           Check paid status and expiry.
        */

        const isPaid =
            subscription &&
            String(
                subscription.status || ""
            ).toLowerCase() === "paid";


        let isActive = false;


        if (
            isPaid &&
            subscription.expires_at
        ) {

            const expiryDate =
                new Date(
                    subscription.expires_at
                );


            isActive =
                !isNaN(
                    expiryDate.getTime()
                ) &&
                expiryDate > new Date();

        }


        if (isActive) {

            console.log(
                "ACTIVE SUBSCRIPTION CONFIRMED."
            );


            showApp();

        }

        else {

            console.log(
                "NO ACTIVE SUBSCRIPTION."
            );


            showSubscriptionPlans();

        }

    }

    catch (error) {

        console.error(
            "CHECK LOGIN EXCEPTION:",
            error
        );


        showLogin();

    }

    finally {

        isCheckingLogin = false;

    }

}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        console.log(
            "AUTH EVENT:",
            event
        );


        /*
           Don't perform heavy Supabase calls directly
           inside the auth callback.
        */

        setTimeout(
            function () {

                if (session) {

                    checkLogin();

                }

                else {

                    showLogin();

                }

            },
            0
        );

    }
);


/* =========================================================
   INITIAL LOGIN CHECK
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showLogin();

        checkLogin();

    }
);


/* =========================================================
   DOWNLOAD EXCEL TEMPLATE
   ========================================================= */

const downloadTemplateButton =
    document.getElementById(
        "downloadTemplate"
    );


if (downloadTemplateButton) {

    downloadTemplateButton.addEventListener(
        "click",
        function () {


            /*
               IMPORTANT:

               Schools can replace these subjects
               with their own subjects.

               The program detects the subject names
               automatically from:

               Subject CA
               Subject Exams
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


 
