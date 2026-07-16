// ==========================
// ClipCentral
// clips.js
// ==========================

let clips = [];
let filteredClips = [];

const container = document.getElementById("clipsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Load JSON
async function loadClips(){

    try{

        const response = await fetch("data/clips.json");

        clips = await response.json();

        filteredClips = [...clips];

        displayClips(filteredClips);

    }catch(error){

        console.error(error);

        container.innerHTML = `
            <div class="no-results">
                Could not load clips.
            </div>
        `;

    }

}

// Create Cards

function displayClips(list){

    container.innerHTML = "";

    if(list.length === 0){

        container.innerHTML = `
            <div class="no-results">
                No clips found.
            </div>
        `;

        return;
    }

    list.forEach(clip=>{

        const card = document.createElement("div");

        card.className = "clip-card";

        card.innerHTML = `

            <div class="clip-preview">

                <video
                    muted
                    loop
                    preload="metadata"
                >
                    <source src="${clip.file}" type="video/mp4">
                </video>

            </div>

            <div class="clip-info">

                <h2>${clip.title}</h2>

                <div class="category">

                    ${clip.category}

                </div>

                <div class="tags">

                    ${clip.tags.join(" • ")}

                    <br><br>

                    ${clip.duration}

                </div>

                <div class="card-buttons">

                    <button class="preview-btn">

                        Preview

                    </button>

                    <button class="download-btn">

                        Download

                    </button>

                </div>

            </div>

        `;

        const video = card.querySelector("video");

        card.addEventListener("mouseenter",()=>{

            video.play();

        });

        card.addEventListener("mouseleave",()=>{

            video.pause();

            video.currentTime = 0;

        });

        card.querySelector(".preview-btn").onclick=()=>{

            window.open(clip.file);

        };

        card.querySelector(".download-btn").onclick=()=>{

            const a=document.createElement("a");

            a.href=clip.file;

            a.download="";

            a.click();

        };

        container.appendChild(card);

    });

}

// Search + Filters

function filterClips(){

    filteredClips = clips.filter(clip=>{

        const matchesSearch =
            clip.title.toLowerCase().includes(
                searchInput.value.toLowerCase()
            );

        const matchesCategory =
            categoryFilter.value==="All" ||
            clip.category===categoryFilter.value;

        return matchesSearch && matchesCategory;

    });

    if(sortFilter.value==="A-Z"){

        filteredClips.sort((a,b)=>

            a.title.localeCompare(b.title)

        );

    }

    if(sortFilter.value==="Oldest"){

        filteredClips.reverse();

    }

    displayClips(filteredClips);

}

searchInput.addEventListener("input",filterClips);

categoryFilter.addEventListener("change",filterClips);

sortFilter.addEventListener("change",filterClips);

// Start

loadClips();