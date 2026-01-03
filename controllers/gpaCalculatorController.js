/**
 * GPA Calculator Controller
 * 
 * This controller handles GPA calculation functionality
 * 
 * Functions:
 * - calculateGPA(semester, courses) - Calculate semester and cumulative GPA
 * - calculateGradePoints(grade) - Get grade points for a letter grade
 * - calculateGradeDistribution(courses) - Calculate grade distribution
 * - validateCourses(courses) - Validate course data
 * - getCumulativeGPA(userId, currentSemester) - Get cumulative GPA from previous semesters
 */

// Grade point mapping
const GRADE_POINTS = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
};

/**
 * Calculate GPA
 * @param {number} semester - Semester number
 * @param {Array<Object>} courses - Array of course objects
 * @returns {Promise<Object>} GPA calculation results
 */
async function calculateGPA(semester, courses) {
    try {
        // Validate inputs
        validateCourses(courses);

        // Calculate semester GPA
        let totalQualityPoints = 0;
        let totalCredits = 0;

        const coursesWithPoints = courses.map(course => {
            const gradePoints = calculateGradePoints(course.grade);
            const qualityPoints = gradePoints * course.credits;
            totalQualityPoints += qualityPoints;
            totalCredits += course.credits;

            return {
                courseName: course.courseName,
                credits: course.credits,
                grade: course.grade,
                gradePoints,
                qualityPoints: Math.round(qualityPoints * 100) / 100
            };
        });

        const semesterGPA = totalCredits > 0 ? Math.round((totalQualityPoints / totalCredits) * 100) / 100 : 0;

        // TODO: Calculate cumulative GPA from previous semesters
        // This would require database access to retrieve previous semester data
        // For now, return semester GPA as cumulative
        const cumulativeGPA = semesterGPA;

        // Calculate grade distribution
        const gradeDistribution = calculateGradeDistribution(courses);

        return {
            semester,
            courses: coursesWithPoints,
            semesterGPA,
            cumulativeGPA,
            totalCredits,
            totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
            gradeDistribution
        };

    } catch (error) {
        console.error('Error calculating GPA:', error);
        throw error;
    }
}

/**
 * Calculate Grade Points
 * @param {string} grade - Letter grade
 * @returns {number} Grade points
 */
function calculateGradePoints(grade) {
    return GRADE_POINTS[grade] || 0;
}

/**
 * Calculate Grade Distribution
 * @param {Array<Object>} courses - Array of course objects
 * @returns {Object} Grade distribution object
 */
function calculateGradeDistribution(courses) {
    const distribution = {
        'A+': 0, 'A': 0, 'A-': 0,
        'B+': 0, 'B': 0, 'B-': 0,
        'C+': 0, 'C': 0, 'C-': 0,
        'D+': 0, 'D': 0, 'F': 0
    };

    courses.forEach(course => {
        if (distribution.hasOwnProperty(course.grade)) {
            distribution[course.grade]++;
        }
    });

    return distribution;
}

/**
 * Validate Courses
 * @param {Array<Object>} courses - Array of course objects
 * @throws {Error} If validation fails
 */
function validateCourses(courses) {
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        throw new Error('At least one course is required');
    }

    courses.forEach(course => {
        if (!course.courseName || course.courseName.trim().length < 2) {
            throw new Error('Invalid course name');
        }

        if (!course.credits || course.credits < 1 || course.credits > 10) {
            throw new Error('Credits must be between 1 and 10');
        }

        if (!course.grade || !GRADE_POINTS[course.grade]) {
            throw new Error(`Invalid grade: ${course.grade}`);
        }
    });
}

/**
 * Get Cumulative GPA (Future Implementation)
 * @param {string} userId - User ID
 * @param {number} currentSemester - Current semester number
 * @returns {Promise<number>} Cumulative GPA
 */
async function getCumulativeGPA(userId, currentSemester) {
    // TODO: Implement database query to get all previous semester GPAs
    // Calculate cumulative GPA from all previous semesters
    // This would require:
    // 1. Database schema for storing semester data
    // 2. Query to retrieve all semesters up to currentSemester
    // 3. Calculation of weighted average across all semesters
    
    // Placeholder return
    return 0;
}

module.exports = {
    calculateGPA,
    calculateGradePoints,
    calculateGradeDistribution,
    validateCourses,
    getCumulativeGPA
};

