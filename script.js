// --- CONFIGURATION ---
const valTownURL = https://amir01mk4--a3a958c41f1011f1ae3842dde27851f2.web.val.run; 

// --- APP LOGIC ---
let shotsLeft = parseInt(localStorage.getItem('dailyShots')) || 2;
let lastDate = localStorage.getItem('lastPlayDate');
let today = new Date().toLocaleDateString();

// Reset shots if it's a new day
if (lastDate !== today) {
    shotsLeft = 2;
    localStorage.setItem('dailyShots', shotsLeft);
    localStorage.setItem('lastPlayDate', today);
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

async function generateSkill() {
    const button = document.getElementById('action-btn');
    const resultBox = document.getElementById('result-box');
    const category = document.getElementById('category').value;

    if (shotsLeft <= 0) {
        startCourse();
        return;
    }

    // 1. UI Loading State
    button.innerHTML = '<span class="spinner"></span> Consulting AI...';
    button.disabled = true;
    resultBox.style.display = "none";

    try {
        // 2. Fetch from your Backend
        const response = await fetch(valTownURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category: category })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 3. Success Logic
        shotsLeft--;
        localStorage.setItem('dailyShots', shotsLeft);
        
        resultBox.innerHTML = `
            <div class="skill-card">
                ${data.result}
            </div>
        `;
        resultBox.style.display = "block";
        resultBox.classList.add('fade-in');

    } catch (error) {
        console.error("Connection Error:", error);
        resultBox.innerHTML = `<p style="color: #ff4d4d;">⚠️ Connection Error: ${error.message}</p>`;
        resultBox.style.display = "block";
    } finally {
        button.disabled = false;
        updateUI();
    }
}

function updateUI() {
    const shotsDisplay = document.getElementById('shots-display');
    const button = document.getElementById('action-btn');
    
    if (shotsDisplay) shotsDisplay.innerText = `Daily Shots Left: ${shotsLeft}`;
    
    if (shotsLeft <= 0) {
        button.innerText = "🚀 Start 3-Day Mastery Course";
        button.classList.add('premium-btn');
    } else {
        button.innerText = "Give Me a Skill";
    }
}

function startCourse() {
    alert("Great choice! We are generating your custom 3-day syllabus. Check back in a moment!");
}
