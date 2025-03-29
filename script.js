// Grade to GPA mapping
const gradeToGPA = {
  "A": 4.0,
  "A-": 3.67,
  "B+": 3.33,
  "B": 3.0,
  "B-": 2.67,
  "C+": 2.33,
  "C": 2.0,
  "C-": 1.67,
  "D+": 1.33,
  "D": 1.0,
  "F": 0.0,
};

// Initialize variables
let totalCredits = 0;
let totalQualityPoints = 0;
let newCourseCounter = 0; // Counter for new courses
let retakeCourseCounter = 0; // Counter for retake courses

// Add New Course
document.getElementById("addNewCourseBtn").addEventListener("click", () => {
  newCourseCounter++; // Increment the counter
  const newCoursesDiv = document.getElementById("newCourses");

  const courseDiv = document.createElement("div");
  courseDiv.className = "course";

  courseDiv.innerHTML = `
    <div class="course-header">
      <label>Course ${newCourseCounter}</label>
    </div>
    <div class="course-content">
      <label>Course Credit:</label>
      <select class="courseCredit">
        <option value="" disabled selected>Select Credit</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <label>Grade:</label>
      <select class="courseGrade">
        <option value="" disabled selected>Select Grade</option>
        ${Object.keys(gradeToGPA).map(grade => `<option value="${grade}">${grade}</option>`).join("")}
      </select>
      <button class="delete-btn" onclick="deleteCourse(this)"><i class="fas fa-trash"></i></button>
    </div>
  `;

  newCoursesDiv.appendChild(courseDiv);
});

// Add Retake Course
document.getElementById("addRetakeCourseBtn").addEventListener("click", () => {
  retakeCourseCounter++; // Increment the counter
  const retakeCoursesDiv = document.getElementById("retakeCourses");

  const retakeDiv = document.createElement("div");
  retakeDiv.className = "retake";

  retakeDiv.innerHTML = `
    <div class="course-header">
      <label>Retake ${retakeCourseCounter}</label>
    </div>
    <div class="course-content">
      <label>Course Credit:</label>
      <select class="retakeCredit">
        <option value="" disabled selected>Select Credit</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <label>Previous Grade:</label>
      <select class="previousGrade">
        <option value="" disabled selected>Select Grade</option>
        ${Object.keys(gradeToGPA).map(grade => `<option value="${grade}">${grade}</option>`).join("")}
      </select>
      <label>New Grade:</label>
      <select class="newGrade">
        <option value="" disabled selected>Select Grade</option>
        ${Object.keys(gradeToGPA).map(grade => `<option value="${grade}">${grade}</option>`).join("")}
      </select>
      <button class="delete-btn" onclick="deleteRetake(this)"><i class="fas fa-trash"></i></button>
    </div>
  `;

  retakeCoursesDiv.appendChild(retakeDiv);
});

// Delete Course
function deleteCourse(button) {
  const courseDiv = button.closest(".course");
  courseDiv.remove();
  updateCourseNumbers(); // Update serial numbers after deletion
}

// Delete Retake
function deleteRetake(button) {
  const retakeDiv = button.closest(".retake");
  retakeDiv.remove();
  updateRetakeNumbers(); // Update serial numbers after deletion
}

// Update serial numbers for courses after deletion
function updateCourseNumbers() {
  newCourseCounter = 0; // Reset counter
  const courses = document.querySelectorAll(".course");
  courses.forEach((course, index) => {
    newCourseCounter++;
    const header = course.querySelector(".course-header label");
    header.textContent = `Course ${newCourseCounter}`;
  });
}

// Update serial numbers for retakes after deletion
function updateRetakeNumbers() {
  retakeCourseCounter = 0; // Reset counter
  const retakes = document.querySelectorAll(".retake");
  retakes.forEach((retake, index) => {
    retakeCourseCounter++;
    const header = retake.querySelector(".course-header label");
    header.textContent = `Retake ${retakeCourseCounter}`;
  });
}

// Toggle Grade Chart Modal
function toggleGradeChart() {
  const modal = document.getElementById("gradeChartModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

// Close Grade Chart Modal
function closeGradeChart() {
  const modal = document.getElementById("gradeChartModal");
  modal.style.display = "none";
}

// Calculate CGPA
document.getElementById("calculateBtn").addEventListener("click", () => {
  // Reset totals
  totalCredits = parseFloat(document.getElementById("totalCredits").value) || 0;
  let initialCGPA = parseFloat(document.getElementById("totalCGPA").value) || 0;

  // Validate initial CGPA
  if (initialCGPA > 4 || initialCGPA < 0) {
    alert("Initial CGPA must be between 0 and 4.");
    return;
  }

  // Initialize total quality points from previous CGPA
  totalQualityPoints = totalCredits * initialCGPA;

  // Variables for new courses and retake contributions
  let newCredits = 0; // Credits for new courses and retakes (for semester GPA)
  let newQualityPoints = 0; // Quality points for new courses and retakes (for semester GPA)

  // Add new courses
  document.querySelectorAll(".course").forEach(course => {
    const credit = parseFloat(course.querySelector(".courseCredit").value) || 0;
    const grade = course.querySelector(".courseGrade").value;
    if (grade && credit) {
      totalCredits += credit;
      newCredits += credit;
      const qualityPoints = credit * gradeToGPA[grade];
      totalQualityPoints += qualityPoints;
      newQualityPoints += qualityPoints;
    }
  });

  // Add retake courses
  document.querySelectorAll(".retake").forEach(retake => {
    const credit = parseFloat(retake.querySelector(".retakeCredit").value) || 0;
    const previousGrade = retake.querySelector(".previousGrade").value;
    const newGrade = retake.querySelector(".newGrade").value;

    if (previousGrade && newGrade && credit) {
      // Subtract previous grade points from total (since retake replaces the old grade)
      const previousQualityPoints = credit * gradeToGPA[previousGrade];
      totalQualityPoints -= previousQualityPoints;

      // Add new grade points to total
      const newQualityPointsForRetake = credit * gradeToGPA[newGrade];
      totalQualityPoints += newQualityPointsForRetake;

      // For semester GPA, only the new grade contributes to the quality points
      // Retake credits are added to newCredits, but totalCredits remain unchanged since they were already counted
      newCredits += credit;
      newQualityPoints += newQualityPointsForRetake;
    }
  });

  // Calculate GPA for new courses and retakes (semester GPA)
  let semesterGPA = newCredits > 0 ? newQualityPoints / newCredits : 0;
  let finalCGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  // Cap GPA and CGPA at 4
  semesterGPA = Math.min(semesterGPA, 4);
  finalCGPA = Math.min(finalCGPA, 4);

  // Handle invalid cases (e.g., negative GPA/CGPA)
  if (semesterGPA < 0 || finalCGPA < 0) {
    alert("Error: GPA or CGPA cannot be negative. Please check your inputs.");
    return;
  }

  // Display results in the popup modal
  document.getElementById("totalCreditsResult").textContent = totalCredits.toFixed(2);
  document.getElementById("totalCgpaResult").textContent = finalCGPA.toFixed(2);
  document.getElementById("gpaCreditResult").textContent = newCredits.toFixed(2);
  document.getElementById("totalGpaResult").textContent = semesterGPA.toFixed(2);

  // Show the result modal
  const resultModal = document.getElementById("resultModal");
  resultModal.style.display = "flex";
});

// Close Result Modal
function closeModal() {
  const resultModal = document.getElementById("resultModal");
  resultModal.style.display = "none";
}