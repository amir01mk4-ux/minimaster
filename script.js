console.log("MiniMaster Script Loaded Successfully!");

let shotsLeft = parseInt(localStorage.getItem('dailyShots'));
if (isNaN(shotsLeft)) shotsLeft = 2;

function updateUI() {
    const shotsDisplay = document.getElementById('shots-display');
    if (shotsDisplay) shotsDisplay.innerText = `Daily Shots Left: ${shotsLeft}`;
}

// Ensure the UI updates as soon as the page opens
window.onload = updateUI;

async function generateSkill() {
    console.log("Button Clicked!"); // This tells us the button is working
    
    const button = document.getElementById('action-btn');
    const resultBox = document.getElementById('result-box');
    const category = document.getElementById('category').value;
    
    // REPLACE THIS WITH YOUR LINK
    const valTownURL = "https://amir01mk4--a3a958c41f1011f1ae3842dde27851f2.web.val.run"; 

    if (shotsLeft <= 0) {
        alert("You're out of shots! Returning tomorrow for more.");
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
        resultBox.innerHTML = `<div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">${data.result}</div>`;
        
        updateUI();
    } catch (error) {
        console.error("Error:", error);
        resultBox.style.display = "block";
        resultBox.innerHTML = "Connection error. Please try again.";
    } finally {
        button.innerText = "Give Me a Skill";
        button.disabled = false;
    }
}
// 1. INITIALIZE SUPABASE
const supabaseUrl = 'https://pdmzwlsexixrbuiacyrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbXp3bHNleGl4cmJ1aWFjeXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDA1NDksImV4cCI6MjA4OTA3NjU0OX0.RoEyvgvLLGfwQ8kDp1N9xsJuXyC_In0hjdWRCzw3uHM';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. CONFIGURATION
const valTownURL = "https://amir01mk4-untitled_463.web.val.run"; 
let shotsLeft = parseInt(localStorage.getItem('dailyShots')) || 2;

// 3. ON PAGE LOAD: Check if user is logged in
document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        showApp();
    }
    updateUI();
});

function showApp() {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
}

// 4. AUTH LOGIC
async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await _supabase.auth.signUp({ email, password });
    if (error) {
        alert(error.message);
    } else {
        alert("Success! Check your email to confirm your account.");
    }
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert(error.message);
    } else {
        showApp();
    }
}

// 5. CORE AI LOGIC
async function generateSkill() {
    const button = document.getElementById('action-btn');
    const resultBox = document.getElementById('result-box');
    const category = document.getElementById('category').value;

    if (shotsLeft <= 0) {
        alert("Daily limit reached! Come back tomorrow for your next mastery step.");
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
        
        updateUI();
    } catch (error) {
        console.error("Error:", error);
        resultBox.style.display = "block";
        resultBox.innerHTML = "Connection error. Check your internet.";
    } finally {
        button.innerText = "Give Me a Skill";
        button.disabled = false;
    }
}

function updateUI() {
    const shotsDisplay = document.getElementById('shots-display');
    if (shotsDisplay) shotsDisplay.innerText = `Daily Shots Left: ${shotsLeft}`;
}
async function handleLogout() {
    const { error } = await _supabase.auth.signOut();
    if (error) {
        alert(error.message);
    } else {
        // Refresh the page to show the login screen again
        window.location.reload();
    }
}
