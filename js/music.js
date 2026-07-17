// ==========================
// ClipCentral
// music.js
// Instant Download Version
// ==========================


let songs = [];


const container =
document.getElementById("musicContainer");


const searchInput =
document.getElementById("searchInput");


const genreFilter =
document.getElementById("genreFilter");


const sortFilter =
document.getElementById("sortFilter");






// ==========================
// Load Music
// ==========================


async function loadMusic(){


    try{


        const response =
        await fetch(
            "data/music.json?update=" + Date.now()
        );



        if(!response.ok){

            throw new Error(
                "Music JSON failed"
            );

        }



        songs =
        await response.json();



        displayMusic(
            songs
        );



    }


    catch(error){


        console.error(
            error
        );



        container.innerHTML = `

        <div class="no-results">

        Could not load music.

        </div>

        `;


    }


}








// ==========================
// Display Music
// ==========================


function displayMusic(list){


    container.innerHTML = "";



    if(list.length === 0){


        container.innerHTML = `

        <div class="no-results">

        No music found.

        </div>

        `;


        return;


    }






    list.forEach(song=>{



        const card =
        document.createElement(
            "div"
        );



        card.className =
        "clip-card";





        card.innerHTML = `


        <div class="clip-info">



            <h2>

            ${song.title}

            </h2>





            <div class="category">

            ${song.genre}

            </div>






            <div class="tags">


                <div class="duration">

                Duration: Loading...

                </div>


            </div>






            <audio preload="metadata">


                <source

                src="${song.file}"

                type="audio/mpeg">


            </audio>







            <progress

            class="song-progress"

            value="0"

            max="100">

            </progress>







            <div class="card-buttons">



                <button class="preview-btn">

                Play

                </button>





                <button class="download-btn">

                Download

                </button>



            </div>




        </div>



        `;







        const audio =
        card.querySelector(
            "audio"
        );


        const playButton =
        card.querySelector(
            ".preview-btn"
        );


        const progress =
        card.querySelector(
            ".song-progress"
        );


        const durationText =
        card.querySelector(
            ".duration"
        );










        // ==========================
        // Duration
        // ==========================


        audio.addEventListener(
        "loadedmetadata",
        ()=>{


            const minutes =
            Math.floor(
                audio.duration / 60
            );


            const seconds =
            Math.floor(
                audio.duration % 60
            )
            .toString()
            .padStart(
                2,
                "0"
            );



            durationText.textContent =
            `Duration: ${minutes}:${seconds}`;


        });









        // ==========================
        // Progress
        // ==========================


        audio.addEventListener(
        "timeupdate",
        ()=>{


            if(audio.duration){


                progress.value =
                (
                    audio.currentTime /
                    audio.duration
                )
                *
                100;


            }



        });










        audio.addEventListener(
        "ended",
        ()=>{


            playButton.textContent =
            "Play";


            progress.value =
            0;


        });









        // ==========================
        // Play / Pause
        // ==========================


        playButton.onclick =
        ()=>{


            document
            .querySelectorAll(
                "#musicContainer audio"
            )
            .forEach(other=>{


                if(other !== audio){


                    other.pause();


                    other.currentTime =
                    0;



                    const otherCard =
                    other.closest(
                        ".clip-card"
                    );



                    otherCard
                    .querySelector(
                        ".preview-btn"
                    )
                    .textContent =
                    "Play";



                    otherCard
                    .querySelector(
                        ".song-progress"
                    )
                    .value =
                    0;


                }


            });







            if(audio.paused){


                audio.play();



                playButton.textContent =
                "Pause";



            }

            else{


                audio.pause();



                playButton.textContent =
                "Play";


            }



        };









        // ==========================
        // Instant Download
        // ==========================


        const downloadButton =
        card.querySelector(
            ".download-btn"
        );




        downloadButton.onclick =
        async ()=>{


            try{


                downloadButton.textContent =
                "Downloading...";




                const response =
                await fetch(
                    song.file
                );




                const blob =
                await response.blob();





                const url =
                window.URL.createObjectURL(
                    blob
                );





                const a =
                document.createElement(
                    "a"
                );




                a.style.display =
                "none";




                a.href =
                url;




                a.download =
                song.file
                .split("/")
                .pop();





                document.body.appendChild(
                    a
                );





                a.click();





                document.body.removeChild(
                    a
                );





                window.URL.revokeObjectURL(
                    url
                );





                downloadButton.textContent =
                "Download";



            }



            catch(error){



                console.error(
                    "Download failed:",
                    error
                );



                window.open(
                    song.file,
                    "_blank"
                );



                downloadButton.textContent =
                "Download";



            }



        };






        container.appendChild(
            card
        );



    });



}









// ==========================
// Search + Filters
// ==========================


function filterMusic(){



    let filtered =
    [...songs];



    const search =
    searchInput.value
    .toLowerCase();





    filtered =
    filtered.filter(song=>{


        const searchable = [

            song.title,

            song.genre,

            ...(song.tags || [])

        ]
        .join(" ")
        .toLowerCase();



        return searchable.includes(
            search
        );


    });







    if(
        genreFilter.value !== "All"
    ){


        filtered =
        filtered.filter(song=>

            song.genre.toLowerCase()
            ===
            genreFilter.value.toLowerCase()

        );


    }







    if(
        sortFilter.value === "A-Z"
    ){


        filtered.sort(
            (a,b)=>
            a.title.localeCompare(
                b.title
            )
        );


    }







    if(
        sortFilter.value === "Z-A"
    ){


        filtered.sort(
            (a,b)=>
            b.title.localeCompare(
                a.title
            )
        );


    }







    displayMusic(
        filtered
    );



}







searchInput.addEventListener(
"input",
filterMusic
);


genreFilter.addEventListener(
"change",
filterMusic
);


sortFilter.addEventListener(
"change",
filterMusic
);






// ==========================
// Start
// ==========================


loadMusic();