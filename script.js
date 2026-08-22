let students = [];
let students = [];


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


    const workbook = XLSX.utils.book_new();


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

    const file = event.target.files[0];

    if (!file) {
        return;
    }


    const reader = new FileReader();


    reader.onload = function(e) {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, {
                type: "array"
            });


            if (!workbook.Sheets["Scores"]) {

                document.getElementById("fileStatus").innerHTML =
                    "❌ Error: The Excel file does not contain a 'Scores' sheet.";

                return;
            }


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

                document.getElementById("fileStatus").innerHTML =
                    "❌ The Scores sheet is empty.";

                return;
            }


            students = rows;


            document.getElementById("fileStatus").innerHTML =
                "✅ Excel file successfully loaded. " +
                students.length +
                " student record(s) found.";


            loadStudents();


            document.getElementById("reportSection")
                .style.display = "block";


        } catch (error) {

            console.error(error);

            document.getElementById("fileStatus").innerHTML =
                "❌ Unable to read this Excel file.";

        }

    };


    reader.readAsArrayBuffer(file);

});


/* =========================================
   LOAD STUDENTS INTO DROPDOWN
========================================= */

function loadStudents() {

    const select =
        document.getElementById("studentSelect");


    select.innerHTML =
        '<option value="">-- Select Student --</option>';


    students.forEach(function(student, index) {

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
        document.getElementById("studentSelect").value;


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
        top: document.getElementById("reportContainer")
            .offsetTop,
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


    students.forEach(function(student) {

        allReports += createReport(student);

    });


    document.getElementById("reportContainer")
        .innerHTML = allReports;


    window.scrollTo({
        top: document.getElementById("reportContainer")
            .offsetTop,
        behavior: "smooth"
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


    Object.keys(student).forEach(function(key) {

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


    subjects.forEach(function(subject, index) {

        subjectRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(subject.name)}</td>
                <td>${subject.score}</td>
                <td>${getGrade(subject.score)}</td>
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
                    ${escapeHTML(student["Admission No"])}
                </div>

                <div>
                    <strong>Student Name:</strong>
                    ${escapeHTML(student["Student Name"])}
                </div>

                <div>
                    <strong>Gender:</strong>
                    ${escapeHTML(student["Gender"])}
                </div>

                <div>
                    <strong>Class:</strong>
                    ${escapeHTML(student["Class"])}
                </div>

                <div>
                    <strong>Term:</strong>
                    ${escapeHTML(student["Term"])}
                </div>

                <div>
                    <strong>Session:</strong>
                    ${escapeHTML(student["Session"])}
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
                    <strong>Class Teacher's Comment:</strong>
                </p>

                <div class="comment-box"></div>


                <p>
                    <strong>Principal's Comment:</strong>
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