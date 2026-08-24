console.log("STEP 1: script.js started");

const SUPABASE_URL =
    "https://nzeddvcmabfodmvmgsyg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Iaro_sV4r31wPbLycRB4Eg_OCDBy2u3";

console.log("STEP 2: About to create Supabase client");

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("STEP 3: Supabase client created");


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


console.log(
    "STEP 4: Sign Up button =",
    signUpButton
);

console.log(
    "STEP 5: Sign In button =",
    signInButton
);


/* =========================================
   CREATE ACCOUNT
========================================= */

if (signUpButton) {

    signUpButton.addEventListener(
        "click",
        async function () {

            console.log(
                "STEP 6: CREATE ACCOUNT CLICKED"
            );

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            console.log(
                "Email entered:",
                email
            );


            if (!email || !password) {

                authStatus.textContent =
                    "Please enter your email and password.";

                return;
            }


            authStatus.textContent =
                "Creating account...";


            const result =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });


            console.log(
                "SIGN UP RESULT:",
                result
            );


            if (result.error) {

                authStatus.textContent =
                    "❌ " +
                    result.error.message;

                return;
            }


            authStatus.textContent =
                "✅ Account created. Check your email.";

        }
    );

}


/* =========================================
   SIGN IN
========================================= */

if (signInButton) {

    signInButton.addEventListener(
        "click",
        async function () {

            console.log(
                "STEP 7: SIGN IN CLICKED"
            );


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


            const result =
                await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


            console.log(
                "SIGN IN RESULT:",
                result
            );


            if (result.error) {

                authStatus.textContent =
                    "❌ " +
                    result.error.message;

                return;
            }


            authStatus.textContent =
                "✅ Login successful.";

        }
    );

}


console.log(
    "STEP 8: Authentication buttons are ready"
);
