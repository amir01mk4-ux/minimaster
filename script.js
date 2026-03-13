// 1. Set up the 2-Shot Limit Logic using the browser's local memory
let shotsLeft = localStorage.getItem('dailyShots');
let lastDate = localStorage.getItem('lastPlayDate');
let today = new Date().toLocaleDateString();

// Reset shots if it's a new day or if it's their first time visiting
if (lastDate !== today || shotsLeft === null) {
    shotsLeft = 2;
    localStorage.setItem('dailyShots', shotsLeft);
    localStorage.setItem('lastPlayDate', today);
}

// Ensure shotsLeft is treated as a number
shotsLeft = parseInt(shotsLeft, 10);

// Wait for the HTML to load before updating the UI
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

async function generateSkill() {
    if (shotsLeft > 0) {
        const button = document.getElementById('action-btn');
        const resultBox = document.getElementById('result-box');
        const category = document.getElementById('category').value;
        
        // Show loading state
        button.innerText = "Consulting AI...";
        button.disabled = true;

        // --- THE AI MAGIC HAPPENS HERE ---
        try {
            // This is where we will call the Google Gemini API later.
            // Simulating a 1.5 second delay to feel like AI is thinking
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            const aiResponse = `Here is your random ${category} skill: <strong>The Feynman Technique</strong>. <br><br>Learn to explain complex concepts simply. Are you ready to commit to the 3-day course?`;
            
            // Deduct a shot
            shotsLeft--;
            localStorage.setItem('dailyShots', shotsLeft);
            
            // Show the result
            resultBox.style.display = "block";
            resultBox.innerHTML = aiResponse;
            
            // Update the button based on remaining shots
            updateUI();

        } catch (error) {
            resultBox.style.display = "block";
            resultBox.innerHTML = "Oops! The AI is taking a nap. Try again.";
            button.innerText = "Give Me a Skill";
        }

        button.disabled = false;
    }
}

function startCourse() {
    const resultBox = document.getElementById('result-box');
    resultBox.innerHTML = "Generating your custom 3-day syllabus... (Course logic coming soon!)";
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
         // Remove the old onclick and add the new one
         button.onclick = startCourse;
    } else if (button && shotsLeft < 2) {
         button.innerText = "Give Me Another Skill";
    }
}
