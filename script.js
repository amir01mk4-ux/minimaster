async function generateSkill() {
    if (shotsLeft > 0) {
        const button = document.getElementById('action-btn');
        const resultBox = document.getElementById('result-box');
        const categorySelect = document.getElementById('category');
        const category = categorySelect ? categorySelect.value : "General Knowledge";
        
        // https://amir01mk4--a3a958c41f1011f1ae3842dde27851f2.web.val.run
        const valTownURL = "https://amir01mk4-untitled_463.web.val.run"; 

        button.innerText = "Consulting AI...";
        button.disabled = true;

        try {
            const response = await fetch(valTownURL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ category: category })
            });
            
            const data = await response.json();
            
            // Check if Val Town sent an error
            if (data.error) {
                throw new Error(data.error);
            }

            // Deduct a shot
            shotsLeft--;
            localStorage.setItem('dailyShots', shotsLeft);
            
            // Display the result (matching your Val Town output)
            resultBox.style.display = "block";
            resultBox.innerHTML = data.result; 
            
            updateUI();

        } catch (error) {
            console.error("Error:", error);
            resultBox.style.display = "block";
            resultBox.innerHTML = `Error: ${error.message}`;
            button.innerText = "Try Again";
        }

        button.disabled = false;
    }
}
