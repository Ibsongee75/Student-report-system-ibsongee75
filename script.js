console.log("SCRIPT.JS HAS LOADED");

const SUPABASE_URL =
    "https://nzeddvcmabfodmvmgsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

console.log("Supabase library:", typeof supabase);

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("Supabase client created");


/* =========================================
   GET HTML ELEMENTS
========================================= */

const signUpButton =
    document.getElementById("signUpButton");

const signInButton =
    document.getElementById("signInButton");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const authStatus =
    document.getElementById("authStatus");


console.log("Sign Up button:", signUpButton);
console.log("Sign In button:", signInButton);


/* =========================================
   CREATE ACCOUNT
========================================= */

signUpButton.addEventListener(
    "click",
    async function () {

        console.log("CREATE ACCOUNT BUTTON CLICKED");

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            authStatus.textContent =
                "Please enter email and password.";

            return;
        }


        authStatus.textContent =
            "Creating account...";


        try {

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });


            console.log(
                "SIGN UP RESULT:",
                data,
                error
            );


            if (error) {

                authStatus.textContent =
                    "❌ " + error.message;

                return;
            }


            authStatus.textContent =
                "✅ Account created. Check your email.";

        }

        catch (error) {

            console.error(error);

            authStatus.textContent =
                "❌ " + error.message;

        }

    }
);


/* =========================================
   SIGN IN
========================================= */

signInButton.addEventListener(
    "click",
    async function () {

        console.log("SIGN IN BUTTON CLICKED");

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            authStatus.textContent =
                "Please enter email and password.";

            return;
        }


        authStatus.textContent =
            "Signing in...";


        try {

            const { data, error } =
                await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


            console.log(
                "SIGN IN RESULT:",
                data,
                error
            );


            if (error) {

                authStatus.textContent =
                    "❌ " + error.message;

                return;
            }


            authStatus.textContent =
                "✅ Login successful.";

        }

        catch (error) {

            console.error(error);

            authStatus.textContent =
                "❌ " + error.message;

        }

    }
);


console.log("AUTH BUTTONS READY");
