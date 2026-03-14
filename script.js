// 1. INITIALIZE SUPABASE
const supabaseUrl = 'https://pdmzwlsexixrbuiacyrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbXp3bHNleGl4cmJ1aWFjeXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDA1NDksImV4cCI6MjA4OTA3NjU0OX0.RoEyvgvLLGfwQ8kDp1N9xsJuXyC_In0hjdWRCzw3uHM';

let _supabase;

// Wait for the library to be ready
window.onload = () => {
    _supabase = supabase.createClient(supabaseUrl, supabaseKey);
    checkUser();
};

// 2. CHECK SESSION
async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        showApp();
    }
}

function showApp() {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

// 3. AUTH FUNCTIONS
async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await _supabase.auth.signUp({ email, password });
    
    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Success! Please check your email inbox to confirm your account before logging in.");
    }
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        alert("Login failed: " + error.message);
    } else {
        showApp();
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// 4. AI SKILL GENERATOR
let shotsLeft = parseInt(localStorage.getItem('dailyShots')) || 2;
const valTownURL = "https://amir01mk4-untitled_463.web.val.run"; 

async function generateSkill() {
    const button = document.getElementById('action-btn');
    const resultBox = document.getElementById('result-box');
    const category = document.getElementById('category').value;

    if (shotsLeft <= 0) {
        alert("Daily limit reached! Master your current skills and come back tomorrow.");
        return;
    }

    button.innerText = "Consulting AI...";
    button.disabled = true;

    try {
        const response = await fetch(valTownURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: category })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        shotsLeft--;
        localStorage.setItem('dailyShots', shotsLeft);
        
        resultBox.style.display = "block";
        resultBox.innerHTML = data.result; 
        
        const shotsDisplay = document.getElementById('shots-display');
        if (shotsDisplay) shotsDisplay.innerText = `Daily Shots Left: ${shotsLeft}`;
    } catch (error) {
        alert("Connection error: " + error.message);
    } finally {
        button.innerText = "Give Me a Skill";
        button.disabled = false;
    }
}
