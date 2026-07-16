// ===========================
// ClipCentral
// library.js
// Optimized Video Preview Version
// ===========================


const params = new URLSearchParams(
    window.location.search
);


const player = params.get("player");


const title = document.getElementById("playerTitle");

const container = document.getElementById("clipContainer");


let playerClips = [];







// Search box

const searchBox = document.createElement("input");


searchBox.placeholder = "Search clips...";


searchBox.className = "clip-search";


container.parentElement.insertBefore(
    searchBox,
    container
);







// Format name

function formatName(name){


    return name
    .replaceAll("-", " ")
    .replace(/\b\w/g, letter =>
        letter.toUpperCase()
    );


}







if(player && title){


    title.innerHTML =
    formatName(player)
    +
    " Clips";


}









// Load clips

async function loadClips(){


    try{


        const response =
        await fetch("data/clips.json");



        const allClips =
        await response.json();




        playerClips =
        allClips.filter(clip =>

            clip.player === player

        );




        displayClips(playerClips);



    }


    catch(error){


        console.error(error);


        container.innerHTML =
        "Failed loading clips.";


    }


}









// Search delay

let searchTimer;



searchBox.addEventListener(
"input",
()=>{


    clearTimeout(searchTimer);



    searchTimer = setTimeout(()=>{


        searchClips();



    },300);



});









function searchClips(){



    const text =
    searchBox.value
    .toLowerCase()
    .trim();





    if(text === ""){


        displayClips(playerClips);


        return;


    }








    const filtered =

    playerClips.filter(clip=>{


        const data = [

            clip.title,

            clip.playerName,

            ...(clip.tags || [])

        ]
        .join(" ")
        .toLowerCase();




        return data.includes(text);



    });






    displayClips(filtered);



}











// Display clips

function displayClips(clips){





    container
    .querySelectorAll("video")
    .forEach(video=>{


        video.pause();


        video.removeAttribute("src");


    });





    container.innerHTML="";




    const fragment =
    document.createDocumentFragment();






    if(clips.length === 0){


        container.innerHTML = `

        <div class="loading">

        No clips found.

        </div>

        `;


        return;


    }








    clips.forEach(clip=>{



        const card =
        document.createElement("div");



        card.className =
        "library-card";







        card.innerHTML = `



        <div class="video-box">


            <video

            muted

            loop

            playsinline

            preload="metadata">



                <source

                src="${clip.file}"

                type="video/mp4">



            </video>





            <div class="play-overlay">

                ▶

            </div>



        </div>








        <div class="clip-info">


            <h2>

            ${clip.title}

            </h2>




            <p>

            ${clip.playerName || ""}

            </p>






            <div class="tags">


            ${
                (clip.tags || [])
                .map(tag=>`

                    <span>

                    ${tag}

                    </span>

                `)
                .join("")
            }


            </div>






            <button class="download-btn">

            Download

            </button>




        </div>



        `;









        const video =
        card.querySelector("video");



        const videoBox =
        card.querySelector(".video-box");



        const overlay =
        card.querySelector(".play-overlay");








        // Load first frame

        video.addEventListener(
            "loadedmetadata",
            ()=>{


                video.currentTime = 0.1;


            }
        );




        video.addEventListener(
            "loadeddata",
            ()=>{


                video.pause();


            }
        );








        // Hover ONLY video area


        videoBox.addEventListener(
        "mouseenter",
        ()=>{


            video.play();


            overlay.style.opacity="0";


        });







        videoBox.addEventListener(
        "mouseleave",
        ()=>{


            video.pause();


            video.currentTime = 0;


            overlay.style.opacity="1";


        });









        // Download


        card.querySelector(".download-btn")
        .onclick = ()=>{


            const a =
            document.createElement("a");



            a.href =
            clip.file;



            a.download =
            clip.file.split("/").pop();



            a.click();



        };







        fragment.appendChild(card);



    });






    container.appendChild(fragment);





    // Force browser to load previews after search

    const videos =
    container.querySelectorAll("video");



    videos.forEach(video=>{


        video.load();


    });



}









loadClips();