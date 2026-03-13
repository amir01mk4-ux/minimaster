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
