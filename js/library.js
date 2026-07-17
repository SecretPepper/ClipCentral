// ===========================
// ClipCentral
// library.js
// Optimized Video Loading Version
// + Fast ZIP Download All Clips
// ===========================


const params = new URLSearchParams(
    window.location.search
);


const player = params.get("player");



const title =
document.getElementById("playerTitle");


const container =
document.getElementById("clipContainer");


const downloadAllBtn =
document.getElementById("downloadAllBtn");



let playerClips = [];




// ===========================
// Search Box
// ===========================

const searchBox =
document.createElement("input");


searchBox.placeholder =
"Search clips...";


searchBox.className =
"clip-search";


const downloadWrapper =
document.querySelector(".download-all-wrapper");


if(downloadWrapper){

    downloadWrapper.insertAdjacentElement(
        "afterend",
        searchBox
    );

}
else{

    container.parentElement.insertBefore(
        searchBox,
        container
    );

}





// ===========================
// Format Name
// ===========================


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







// ===========================
// Load Clips
// ===========================


async function loadClips(){


    try{


        const response =
        await fetch(
            "data/clips.json"
        );



        const allClips =
        await response.json();





        // remove duplicate files automatically
        playerClips =
        [
            ...new Map(

                allClips

                .filter(clip =>
                    clip.player === player
                )

                .map(clip =>
                    [
                        clip.file,
                        clip
                    ]
                )

            ).values()

        ];




        displayClips(
            playerClips
        );


    }


    catch(error){


        console.error(error);


        container.innerHTML =
        "Failed loading clips.";


    }


}







// ===========================
// Search
// ===========================


let searchTimer;



searchBox.addEventListener(
"input",
()=>{


    clearTimeout(searchTimer);



    searchTimer =
    setTimeout(()=>{


        searchClips();



    },300);



});






function searchClips(){


    const text =
    searchBox.value
    .toLowerCase()
    .trim();




    if(text === ""){


        displayClips(
            playerClips
        );


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




    displayClips(
        filtered
    );


}
// ===========================
// Display Clips
// ===========================


function displayClips(clips){


    container.innerHTML = "";


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




        let playing = false;






        // ===========================
        // Hover Preview
        // ===========================


        videoBox.addEventListener(
        "mouseenter",
        async ()=>{


            try{


                document

                .querySelectorAll(
                    ".library-card video"
                )

                .forEach(other=>{


                    if(other !== video){


                        other.pause();


                        other.currentTime = 0;



                        const otherOverlay =
                        other

                        .closest(".video-box")

                        .querySelector(
                            ".play-overlay"
                        );



                        if(otherOverlay){

                            otherOverlay.style.opacity =
                            "1";

                        }


                    }


                });





                await video.play();



                overlay.style.opacity =
                "0";



                playing = true;



            }


            catch(error){


                console.log(
                    "Video waiting..."
                );


            }



        });










        videoBox.addEventListener(
        "mouseleave",
        ()=>{


            if(playing){


                video.pause();


                video.currentTime = 0;



                overlay.style.opacity =
                "1";



                playing = false;


            }


        });









        // ===========================
        // Single Clip Download
        // ===========================


        card

        .querySelector(".download-btn")

        .onclick = async ()=>{


            try{


                const response =
                await fetch(
                    clip.file
                );



                const blob =
                await response.blob();




                const url =
                URL.createObjectURL(
                    blob
                );





                const a =
                document.createElement(
                    "a"
                );



                a.href =
                url;



                a.download =
                clip.file

                .split("/")

                .pop();





                document.body.appendChild(
                    a
                );



                a.click();



                document.body.removeChild(
                    a
                );



                URL.revokeObjectURL(
                    url
                );


            }


            catch(error){


                console.error(error);



                alert(
                    "Download failed."
                );


            }


        };




        fragment.appendChild(
            card
        );



    });




    container.appendChild(
        fragment
    );


}
// ===========================
// Download All Clips ZIP
// ===========================


if(downloadAllBtn){


downloadAllBtn.onclick = async ()=>{


    if(playerClips.length === 0){


        alert(
            "No clips found."
        );


        return;


    }



    try{


        downloadAllBtn.disabled = true;



        const total =
        playerClips.length;



        downloadAllBtn.textContent =
        `Preparing 0/${total}`;



        const zip =
        new JSZip();




        let completed = 0;



        // Number of simultaneous downloads
        const workers = 10;



        async function downloadWorker(queue){


            while(queue.length > 0){


                const clip =
                queue.shift();



                try{


                    const response =
                    await fetch(
                        clip.file
                    );



                    if(!response.ok){

                        throw new Error(
                            "Failed: " + clip.file
                        );

                    }




                    const blob =
                    await response.blob();




                    const filename =
                    clip.file
                    .split("/")
                    .pop();




                    zip.file(
                        filename,
                        blob
                    );




                    completed++;



                    downloadAllBtn.textContent =
                    `Adding ${completed}/${total}`;



                }


                catch(error){


                    console.error(
                        error
                    );


                }


            }


        }





        const queue =
        [...playerClips];





        const workerArray = [];



        for(
            let i = 0;
            i < workers;
            i++
        ){


            workerArray.push(
                downloadWorker(queue)
            );


        }




        await Promise.all(
            workerArray
        );






        downloadAllBtn.textContent =
        "Creating ZIP...";







        const zipBlob =
        await zip.generateAsync({


            type:"blob",



            compression:"DEFLATE",



            compressionOptions:{


                level:3


            }



        });






        downloadAllBtn.textContent =
        "Starting download...";






        const url =
        URL.createObjectURL(
            zipBlob
        );





        const a =
        document.createElement(
            "a"
        );




        a.href =
        url;




        a.download =
        `${player}-clips.zip`;





        document.body.appendChild(
            a
        );



        a.click();



        document.body.removeChild(
            a
        );




        setTimeout(()=>{


            URL.revokeObjectURL(
                url
            );


        },1000);






        downloadAllBtn.textContent =
        "Download All Clips ZIP";



        downloadAllBtn.disabled =
        false;



    }



    catch(error){


        console.error(
            error
        );



        alert(
            "ZIP creation failed."
        );



        downloadAllBtn.textContent =
        "Download All Clips ZIP";



        downloadAllBtn.disabled =
        false;


    }



};


}







// ===========================
// Start
// ===========================


loadClips();