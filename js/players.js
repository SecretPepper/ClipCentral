// ===========================
// ClipCentral
// players.js
// ===========================


// Get club from URL

const params = new URLSearchParams(window.location.search);

const club = params.get("club");


const title = document.getElementById("clubTitle");

const container = document.getElementById("playerContainer");




// Player database

const players = {


    "barcelona":[


        {
            name:"Pau Cubarsí",
            image:"images/football/barcelona/pau-cubarsi.png",
            value:"pau-cubarsi"
        },


        {
            name:"Lamine Yamal",
            image:"images/football/barcelona/lamine-yamal.png",
            value:"lamine-yamal"
        },


    ],

    "real-madrid":[


        {
            name:"Aurélien Tchouaméni",
            image:"images/football/real-madrid/aurelien-tchouameni.png",
            value:"aurelien-tchouameni"
        },

    ],

    "athletic-club":[


        {
            name:"Nico Williams",
            image:"images/football/athletic-club/nico-williams.png",
            value:"nico-williams"
        },

    ],

    "levante":[


        {
            name:"Iván Romero",
            image:"images/football/levante/ivan-romero.png",
            value:"ivan-romero"
        },

    ],




    "elche":[


        {
            name:"John Donald",
            image:"images/football/elche/john-donald.png",
            value:"john-donald"
        },

    ],

    "osasuna":[


        {
            name:"Ante Budimir",
            image:"images/football/osasuna/ante-budimir.png",
            value:"ante-budimir"
        },

    ]


};




// Change title

if(club){


    title.innerHTML =

    club
    .replaceAll("-", " ")
    .replace(/\b\w/g, letter=>letter.toUpperCase())

    +

    " Players";


}






// Load players

function loadPlayers(){


    const selectedPlayers = players[club];



    if(!selectedPlayers){


        container.innerHTML = `

            <div class="loading">

                No players found.

            </div>

        `;


        return;


    }




    selectedPlayers.forEach(player=>{


        const card=document.createElement("a");



        card.className="player-card";



        card.href =

        `library.html?player=${player.value}`;





        card.innerHTML = `



            <div class="player-image">


                ${
                    player.image

                    ?

                    `<img src="${player.image}" alt="${player.name}">`

                    :

                    "⚽"

                }


            </div>





            <h2>

                ${player.name}

            </h2>





            <p>

                View clips

            </p>




        `;



        container.appendChild(card);



    });



}





loadPlayers();