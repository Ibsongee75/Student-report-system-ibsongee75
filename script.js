/* =====================================================
   STUDENT REPORT GENERATOR
   COMPLETE script.js
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */
alert("SCRIPT.JS IS LOADING");
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
   WEBSITE URL
===================================================== */

const SITE_URL =
    "https://ibsongee75.github.io/Student-report-system-ibsongee75/";



/* =====================================================
   PAYSTACK
===================================================== */

const PAYSTACK_PUBLIC_KEY =
    "pk_test_255b1c6ede75477e3ed59e874ebb68d9e204f844";



/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let students = [];

let recoveryMode = false;



/* =====================================================
   REPORT SETTINGS
===================================================== */

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



/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const authSection =
    document.getElementById("authSection");


const resetSection =
    document.getElementById("resetSection");


const subscriptionSection =
    document.getElementById(
        "subscriptionSection"
    );


const appSection =
    document.getElementById("appSection");


const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const signUpButton =
    document.getElementById(
        "signUpButton"
    );


const signInButton =
    document.getElementById(
        "signInButton"
    );


const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const authStatus =
    document.getElementById(
        "authStatus"
    );


const resetStatus =
    document.getElementById(
        "resetStatus"
    );


const newPassword =
    document.getElementById(
        "newPassword"
    );


const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );


const updatePasswordButton =
    document.getElementById(
        "updatePasswordButton"
    );



/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    authSection.style.display =
        "block";

    resetSection.style.display =
        "none";

    subscriptionSection.style.display =
        "none";

    appSection.style.display =
        "none";

}



/* =====================================================
   SHOW RESET PASSWORD
===================================================== */

function showResetPassword() {

    authSection.style.display =
        "none";

    subscriptionSection.style.display =
        "none";

    appSection.style.display =
        "none";

    resetSection.style.display =
        "block";

}



/* =====================================================
   SHOW SUBSCRIPTION
===================================================== */

function showSubscription() {

    authSection.style.display =
        "none";

    resetSection.style.display =
        "none";

    appSection.style.display =
        "none";

    subscriptionSection.style.display =
        "block";

}



/* =====================================================
   SHOW APPLICATION
===================================================== */

function showApp() {

    authSection.style.display =
        "none";

    resetSection.style.display =
        "none";

    subscriptionSection.style.display =
        "none";

    appSection.style.display =
        "block";

}



/* =====================================================
   CREATE ACCOUNT
===================================================== */

signUpButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            authStatus.textContent =
                "Please enter your email and password.";

            return;

        }


        if (password.length < 6) {

            authStatus.textContent =
                "Password must contain at least 6 characters.";

            return;

        }


        authStatus.textContent =
            "Creating your account...";


        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({

                email:
                    email,

                password:
                    password,

                options: {

                    emailRedirectTo:
                        SITE_URL

                }

            });


        if (error) {

            console.error(
                "SIGN UP ERROR:",
                error
            );


            authStatus.textContent =
                "❌ " + error.message;

            return;

        }


        if (
            data.user &&
            !data.session
        ) {

            authStatus.textContent =
                "✅ Account created. Please check your email and confirm your account before signing in.";

            return;

        }


        authStatus.textContent =
            "✅ Account created successfully.";

    }
);



/* =====================================================
   SIGN IN
===================================================== */

signInButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            authStatus.textContent =
                "Please enter your email and password.";

            return;

        }


        authStatus.textContent =
            "Signing in...";


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email:
                    email,

                password:
                    password

            });


        if (error) {

            console.error(
                "SIGN IN ERROR:",
                error
            );


            authStatus.textContent =
                "❌ " + error.message;

            return;

        }


        console.log(
            "Logged in:",
            data.user
        );


        authStatus.textContent =
            "✅ Login successful.";


        await checkLogin();

    }
);



/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPasswordButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();


        if (!email) {

            authStatus.textContent =
                "Enter your email address first.";

            emailInput.focus();

            return;

        }


        authStatus.textContent =
            "Sending password reset email...";


        const {
            error
        } =
            await supabaseClient.auth
                .resetPasswordForEmail(
                    email,
                    {

                        redirectTo:
                            SITE_URL

                    }
                );


        if (error) {

            console.error(
                "RESET EMAIL ERROR:",
                error
            );


            authStatus.textContent =
                "❌ " + error.message;

            return;

        }


        authStatus.textContent =
            "✅ Password reset email sent. Check your email and click the reset link.";

    }
);



/* =====================================================
   UPDATE PASSWORD
===================================================== */

updatePasswordButton.addEventListener(
    "click",
    async function () {

        const password =
            newPassword.value;

        const confirm =
            confirmPassword.value;


        if (!password || !confirm) {

            resetStatus.textContent =
                "Please enter and confirm your new password.";

            return;

        }


        if (password.length < 6) {

            resetStatus.textContent =
                "Password must contain at least 6 characters.";

            return;

        }


        if (password !== confirm) {

            resetStatus.textContent =
                "The passwords do not match.";

            return;

        }


        resetStatus.textContent =
            "Updating password...";


        const {
            error
        } =
            await supabaseClient.auth.updateUser({

                password:
                    password

            });


        if (error) {

            console.error(
                "PASSWORD UPDATE ERROR:",
                error
            );


            resetStatus.textContent =
                "❌ " + error.message;

            return;

        }


        recoveryMode =
            false;


        resetStatus.textContent =
            "✅ Password updated successfully. You can now sign in with your new password.";


        newPassword.value =
            "";

        confirmPassword.value =
            "";


        setTimeout(
            function () {

                showLogin();

                authStatus.textContent =
                    "Password updated. Please sign in.";

            },
            1500
        );

    }
);



/* =====================================================
   LOGOUT
===================================================== */

logoutButton.addEventListener(
    "click",
    async function () {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

            return;

        }


        showLogin();

        authStatus.textContent =
            "You have been logged out.";

    }
);



/* =====================================================
   DISPLAY SUBSCRIPTION STATUS
===================================================== */

function displaySubscriptionStatus(
    subscription,
    user
) {

    const box =
        document.getElementById(
            "subscriptionStatus"
        );


    if (!box) return;


    if (
        subscription &&
        subscription.status &&
        subscription.status.toLowerCase() ===
            "paid"
    ) {

        let expiryText =
            "Not available";


        if (subscription.expires_at) {

            const expiry =
                new Date(
                    subscription.expires_at
                );


            expiryText =
                expiry.toLocaleDateString();

        }


        box.innerHTML = `

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

    } else {

        box.innerHTML = `

            <strong>
                Subscription Status:
            </strong>

            <span style="color:red;">
                UNPAID
            </span>

            <br>

            <small>
                Choose a subscription plan below to continue.
            </small>

        `;

    }

}



/* =====================================================
   CHECK LOGIN + SUBSCRIPTION
===================================================== */

async function checkLogin() {

    if (recoveryMode) {

        return;

    }


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


    if (!data.session) {

        showLogin();

        return;

    }


    const user =
        data.session.user;


    console.log(
        "CURRENT USER:",
        user.email
    );


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


    if (subscriptionError) {

        console.error(
            "SUBSCRIPTION ERROR:",
            subscriptionError
        );


        showSubscription();


        document.getElementById(
            "subscriptionStatus"
        ).innerHTML =

            "Unable to verify subscription. Please try again.";

        return;

    }


    displaySubscriptionStatus(
        subscription,
        user
    );


    const activeSubscription =

        subscription &&

        subscription.status &&
        subscription.status.toLowerCase() ===
            "paid" &&

        subscription.expires_at &&

        new Date(
            subscription.expires_at
        ) > new Date();


    if (activeSubscription) {

        console.log(
            "ACTIVE SUBSCRIPTION"
        );


        showApp();

    } else {

        console.log(
            "NO ACTIVE SUBSCRIPTION"
        );


        showSubscription();

    }

}



/* =====================================================
   AUTH STATE CHANGE
===================================================== */

supabaseClient.auth.onAuthStateChange(
    async function (
        event,
        session
    ) {

        console.log(
            "AUTH EVENT:",
            event
        );


        /* =============================================
           PASSWORD RECOVERY
        ============================================= */

        if (
            event ===
            "PASSWORD_RECOVERY"
        ) {

            recoveryMode =
                true;

            showResetPassword();

            resetStatus.textContent =
                "Enter your new password.";

            return;

        }


        /* =============================================
           NORMAL LOGIN
        ============================================= */

        if (
            session &&
            !recoveryMode
        ) {

            await checkLogin();

            return;

        }


        /* =============================================
           LOGGED OUT
        ============================================= */

        if (!session) {

            recoveryMode =
                false;

            showLogin();

        }

    }
);



/* =====================================================
   START APPLICATION
===================================================== */

(async function () {

    /*
       Give Supabase a moment to process
       a password recovery URL.
    */

    await new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                300
            );

        }
    );


    const {
        data
    } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        if (!recoveryMode) {

            await checkLogin();

        }

    } else {

        showLogin();

    }

})();



/* =====================================================
   DOWNLOAD EXCEL TEMPLATE
===================================================== */

document
    .getElementById(
        "downloadTemplate"
    )
    .addEventListener(
        "click",
        function () {


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


            XLSX.utils.book_append_sheet(
                workbook,
                settingsSheet,
                "Settings"
            );


            XLSX.writeFile(
                workbook,
                "Student_Report_Template.xlsx"
            );

        }
    );



/* =====================================================
   UPLOAD EXCEL FILE
===================================================== */

document
    .getElementById(
        "excelFile"
    
