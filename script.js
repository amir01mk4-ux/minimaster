// 1. SUPABASE CONFIGURATION
const supabaseUrl = 'https://pdmzwlsexixrbuiacyrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbXp3bHNleGl4cmJ1aWFjeXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDA1NDksImV4cCI6MjA4OTA3NjU0OX0.RoEyvgvLLGfwQ8kDp1N9xsJuXyC_In0hjdWRCzw3uHM';
let _supabase;

// 2. VAL TOWN CONFIGURATION
const valTownURL = "https://amir01mk4--a3a958c41f1011f1ae3842dde27851f2.web.val.run"; 

// 3. COURSE STATE MANAGEMENT
let currentCourseData = null;
let activeDay = 0;

window.onload = () => {
    _supabase = supabase.createClient(supabaseUrl, supabaseKey);
    checkUser();
};

// --- AUTH LOGIC ---
async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('app-view').style.display = 'block';
    }
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('auth-error');
    
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) {
        errorMsg.innerText = error.message;
        errorMsg.style.display = 'block';
    } else {
        window.location.reload();
    }
}

async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('auth-error');
    
    const { error } = await _supabase.auth.signUp({ email, password });
    if (error) {
        errorMsg.innerText = error.message;
        errorMsg.style.display = 'block';
    } else {
        alert("Account created! Please check your email to confirm, then sign in.");
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// --- CORE APP LOGIC ---
async function generateSkill() {
    const btn = document.getElementById('action-btn');
    const category = document.getElementById('category').value;
    const resultsContainer = document.getElementById('results-container');
    const courseContent = document.getElementById('course-content');
    
    // Reset UI
    btn.innerText = "Architecting...";
    btn.disabled = true;
    resultsContainer.style.display = "none";
    courseContent.style.display = "none";
    document.getElementById('course-btn').style.display = "inline-block";
    activeDay = 0; // Reset course progress

    try {
        const response = await fetch(valTownURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: category })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Store the data globally so the Course UI can use it
        currentCourseData = data;

        // Populate the Skill and Description boxes
        document.getElementById('ui-skill-name').innerText = data.skillName;
        document.getElementById('ui-skill-desc').innerText = data.description;
        
        // Pre-fill the hidden course days
        document.getElementById('ui-day-1').innerText = data.day1;
        document.getElementById('ui-day-2').innerText = data.day2;
        document.getElementById('ui-day-3').innerText = data.day3;

        // Show Results
        resultsContainer.style.display = "block";

    } catch (error) {
        alert("Connection failed: " + error.message);
    } finally {
        btn.innerText = "Architect Syllabus";
        btn.disabled = false;
    }
}

// --- PROGRESSIVE REVEAL LOGIC ---
function startCourse() {
    document.getElementById('course-btn').style.display = 'none';
    document.getElementById('course-content').style.display = 'block';
    
    // Hide all days initially
    document.getElementById('day-1-box').style.display = 'none';
    document.getElementById('day-2-box').style.display = 'none';
    document.getElementById('day-3-box').style.display = 'none';
    
    document.getElementById('next-day-btn').style.display = 'block';
    document.getElementById('next-day-btn').innerText = "Reveal Day 1";
    activeDay = 0;
}

function revealNextDay() {
    activeDay++;
    
    if (activeDay === 1) {
        document.getElementById('day-1-box').style.display = 'block';
        document.getElementById('next-day-btn').innerText = "Complete Day 1 to Reveal Day 2";
    } 
    else if (activeDay === 2) {
        document.getElementById('day-2-box').style.display = 'block';
        document.getElementById('next-day-btn').innerText = "Complete Day 2 to Reveal Day 3";
    } 
    else if (activeDay === 3) {
        document.getElementById('day-3-box').style.display = 'block';
        document.getElementById('next-day-btn').style.display = 'none'; // End of course
    }
}
