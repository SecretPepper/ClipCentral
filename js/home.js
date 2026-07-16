// ===========================
// ClipCentral
// Home Latest Uploads
// ===========================

const latestContainer = document.getElementById("latestUploads");

async function loadLatest() {

    if (!latestContainer) return;

    try {

        const response = await fetch("data/clips.json");

        if (!response.ok) {
            throw new Error("Failed to load clips.");
        }

        const clips = await response.json();

        // Show the 6 most recently added clips
        const latest = clips.slice(-6).reverse();

        latestContainer.innerHTML = "";

        latest.forEach(clip => {

            const card = document.createElement("div");

            card.className = "preview-card";
            card.style.cursor = "pointer";

            card.innerHTML = `
                <video muted preload="metadata">
                    <source src="${clip.file}" type="video/mp4">
                </video>

                <p>${clip.title}</p>
            `;

            // Go directly to that player's library
            card.addEventListener("click", () => {
                window.location.href = `library.html?player=${clip.player}`;
            });

            latestContainer.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        latestContainer.innerHTML = `
            <div class="preview-card">
                Failed loading uploads.
            </div>
        `;

    }

}

loadLatest();