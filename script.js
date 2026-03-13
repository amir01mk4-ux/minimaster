// 1. Set up the 2-Shot Limit Logic
let shotsLeft = localStorage.getItem('dailyShots');
let lastDate = localStorage.getItem('lastPlayDate');
let today = new Date().toLocaleDateString();

if (lastDate !== today || shotsLeft === null) {
    shotsLeft = 2;
    localStorage.setItem('dailyShots', shotsLeft);
    localStorage.setItem('lastPlayDate', today);
}

shotsLeft = parseInt(shotsLeft, 10);

// Update UI when page loads
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

async function generateSkill() {
    if (shotsLeft > 0) {
        const button = document.getElementById('action-btn');
        const resultBox = document.getElementById('result-box');
        const category = document.getElementById('category').value;
        
        // https://amir01mk4--e84f29b01f0e11f1b29842dde27851f2.web.val.run ---
        // Replace the link below with the one from the top of your Val Town page
        const valTownURL = "https://amir-randomskill.web.val.run"; 

        button.innerText = "Consulting AI...";
        button.disabled = true;

        try {
            const response = await fetch(valTownURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: category })
            });
            
            const data = await response.json();
            
            // Deduct a shot
            shotsLeft--;
            localStorage.setItem('dailyShots', shotsLeft);
            
            // Show the result
            resultBox.style.display = "block";
            resultBox.innerHTML = data.result;
            
            updateUI();

        } catch (error) {
            console.error(error);
            resultBox.style.display = "block";
            resultBox.innerHTML = "Error: Check your Val Town URL and ensure it is set to 'Public'.";
            button.innerText = "Try Again";
        }

        button.disabled = false;
    }
}

function startCourse() {
    const resultBox = document.getElementById('result-box');
    resultBox.innerHTML = "Generating your custom 3-day syllabus... (This feature is next on our list!)";
    const button = document.getElementById('action-btn');
    button.innerText = "Generating...";
    button.disabled = true;
}

function updateUI() {
    const shotsDisplay = document.getElementById('shots-display');
    const button = document.getElementById('action-btn');
    
    if (shotsDisplay) {
        shotsDisplay.innerText = `Daily Shots Left: ${shotsLeft}`;
    }
    
    if (shotsLeft <= 0 && button) {
         button.innerText = "Start 3-Day Course";
         button.onclick = startCourse;
    } else if (button && shotsLeft < 2) {
         button.innerText = "Give Me Another Skill";
    }
}
