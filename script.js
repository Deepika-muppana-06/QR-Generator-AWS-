let currentQR = "";

// 🚀 Generate QR Code
async function generateQR() {
    let text = document.getElementById("text").value;

    if (!text) {
        alert("Please enter text or URL");
        return;
    }

    try {
        let response = await fetch("https://of7jvk0lnb.execute-api.ap-south-1.amazonaws.com/qr-stage/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        let data = await response.json();

        // Lambda response handling (string or object both cases)
        let result = typeof data.body === "string"
            ? JSON.parse(data.body)
            : data;

        currentQR = result.imageUrl || result.url;

        document.getElementById("qrImage").src = currentQR;

        document.getElementById("downloadBtn").style.display = "inline-block";

        saveHistory(text, currentQR);
        loadHistory();

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while generating QR");
    }
}

// 📥 Download QR Code
function downloadQR() {
    if (!currentQR) {
        alert("No QR to download");
        return;
    }

    let a = document.createElement("a");
    a.href = currentQR;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 🕒 Save to History (localStorage)
function saveHistory(text, url) {
    let history = JSON.parse(localStorage.getItem("qrHistory")) || [];

    history.push({
        text: text,
        url: url,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("qrHistory", JSON.stringify(history));
}

// 📜 Load History on Page
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("qrHistory")) || [];

    let container = document.getElementById("historyList");
    container.innerHTML = "";

    history.reverse().forEach(item => {
        container.innerHTML += `
            <div style="border-bottom:1px solid #ddd; padding:5px;">
                <b>${item.text}</b><br>
                <img src="${item.url}" width="80"><br>
                <small>${item.time}</small>
            </div>
        `;
    });
}

// Auto load history when page opens
window.onload = loadHistory;