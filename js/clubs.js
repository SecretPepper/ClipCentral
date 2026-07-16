// ===========================
// ClipCentral
// clubs.js
// ===========================


// Get category from URL
const params = new URLSearchParams(window.location.search);

// Default to football if no category is provided
const category = params.get("category") || "football";

const title = document.getElementById("categoryTitle");
const container = document.getElementById("clubContainer");


// Club database
const clubs = {

    football: [

        {
            name: "Barcelona",
            logo: "images/football/barcelona/club-logo.png",
            value: "barcelona"
        },

        {
            name: "Real Madrid",
            logo: "images/football/real-madrid/club-logo.png",
            value: "real-madrid"
        },

        {
            name: "Athletic Club",
            logo: "images/football/athletic-club/club-logo.png",
            value: "athletic-club"
        },

        {
            name: "Levante",
            logo: "images/football/levante/club-logo.png",
            value: "levante"
        },

        {
            name: "Elche",
            logo: "images/football/elche/club-logo.png",
            value: "elche"
        },

        {
            name: "Osasuna",
            logo: "images/football/osasuna/club-logo.png",
            value: "osasuna"
        },
    ]

};


// Change page title
if (title) {

    title.innerHTML = "Football Clubs";

}


// Load clubs
function loadClubs() {

    container.innerHTML = "";

    const selected = clubs[category];

    if (!selected) {

        container.innerHTML = `
            <div class="loading">
                No clubs found.
            </div>
        `;

        return;

    }

    selected.forEach(club => {

        const card = document.createElement("a");

        card.className = "club-card";

        card.href = `players.html?club=${club.value}`;

        card.innerHTML = `

            <div class="club-logo">

                <img src="${club.logo}" alt="${club.name}">

            </div>

            <h2>

                ${club.name}

            </h2>

            <p>

                View players and clips

            </p>

        `;

        container.appendChild(card);

    });

}


loadClubs();