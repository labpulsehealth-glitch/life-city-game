/* =====================================================
   LIFE CITY
   PHASE 2
   LIFE REGISTRATION + UNIQUE ORIGIN SYSTEM
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

let width = 0;
let height = 0;


function resizeCanvas() {

  const dpr =
    Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}


resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);


/* =====================================================
   DEFAULT PLAYER
===================================================== */

const defaultPlayer = {

  id: null,

  nickname: "",

  age: 19,

  gender: "",

  surname: "",

  family: "",

  familyType: "",

  familyDescription: "",

  position: "",

  father: "",

  mother: "",

  identity: "",

  money: 0,

  hunger: 100,

  energy: 100,

  hygiene: 100,

  x: 500,

  y: 400,

  day: 1,

  hiddenTraits: {

    ambition: 0,
    courage: 0,
    kindness: 0,
    intelligence: 0,
    loyalty: 0,
    risk: 0
    patience: 0
}

};


/* =====================================================
   SAVE / LOAD
===================================================== */

let player =
  JSON.parse(
    localStorage.getItem("lifeCityPlayer")
  ) ||
  structuredClone(defaultPlayer);


let registeredWorld =
  JSON.parse(
    localStorage.getItem("lifeCityPopulation")
  ) || {};


/*
  IMPORTANT:

  This is the prototype population registry.

  Later, when we add multiplayer,
  this exact structure will move to
  the server/database.

  The browser should NEVER be trusted
  as the final authority for uniqueness.
*/


function savePlayer() {

  localStorage.setItem(
    "lifeCityPlayer",
    JSON.stringify(player)
  );
}


function savePopulation() {

  localStorage.setItem(
    "lifeCityPopulation",
    JSON.stringify(registeredWorld)
  );
}


/* =====================================================
   FAMILY DATABASE
===================================================== */

const families = [

  {
    id: "russo",

    surname: "Russo",

    name: "THE RUSSO FAMILY",

    type: "Mafia Family",

    description:
      "A powerful Mafia dynasty known for territory, loyalty and enforcement. Their influence reaches deep into the city's criminal underworld.",

    father:
      "Don Russo",

    mother:
      "Elena Russo",

    positions: {

      female: [
        {
          key: "eldest-daughter",
          title: "Eldest Daughter"
        },
        {
          key: "second-daughter",
          title: "Second Daughter"
        },
        {
          key: "youngest-daughter",
          title: "Youngest Daughter"
        }
      ],

      male: [
        {
          key: "eldest-son",
          title: "Eldest Son"
        },
        {
          key: "second-son",
          title: "Second Son"
        },
        {
          key: "youngest-son",
          title: "Youngest Son"
        }
      ]

    },

    startingMoney: 75000
  },


  {
    id: "varelli",

    surname: "Varelli",

    name: "THE VARELLI FAMILY",

    type: "Mafia Family",

    description:
      "An old and influential Mafia dynasty built around information, connections and secrets. Very few things happen in the city without the Varelli family hearing about them.",

    father:
      "Don Varelli",

    mother:
      "Lucia Varelli",

    positions: {

      female: [
        {
          key: "eldest-daughter",
          title: "Eldest Daughter"
        },
        {
          key: "second-daughter",
          title: "Second Daughter"
        },
        {
          key: "youngest-daughter",
          title: "Youngest Daughter"
        }
      ],

      male: [
        {
          key: "eldest-son",
          title: "Eldest Son"
        },
        {
          key: "second-son",
          title: "Second Son"
        },
        {
          key: "youngest-son",
          title: "Youngest Son"
        }
      ]

    },

    startingMoney: 85000
  },


  {
    id: "moretti",

    surname: "Moretti",

    name: "THE MORETTI FAMILY",

    type: "Mafia Family",

    description:
      "A wealthy dynasty with legitimate businesses, powerful connections and a hidden criminal network operating behind respectable doors.",

    father:
      "Don Moretti",

    mother:
      "Sofia Moretti",

    positions: {

      female: [
        {
          key: "eldest-daughter",
          title: "Eldest Daughter"
        },
        {
          key: "second-daughter",
          title: "Second Daughter"
        },
        {
          key: "youngest-daughter",
          title: "Youngest Daughter"
        }
      ],

      male: [
        {
          key: "eldest-son",
          title: "Eldest Son"
        },
        {
          key: "second-son",
          title: "Second Son"
        },
        {
          key: "youngest-son",
          title: "Youngest Son"
        }
      ]

    },

    startingMoney: 100000
  },


  {
    id: "bellini",

    surname: "Bellini",

    name: "THE BELLINI FAMILY",

    type: "Mafia Family",

    description:
      "A sophisticated dynasty whose power is built through influence, politics, business and relationships with the city's most important people.",

    father:
      "Don Bellini",

    mother:
      "Isabella Bellini",

    positions: {

      female: [
        {
          key: "eldest-daughter",
          title: "Eldest Daughter"
        },
        {
          key: "second-daughter",
          title: "Second Daughter"
        },
        {
          key: "youngest-daughter",
          title: "Youngest Daughter"
        }
      ],

      male: [
        {
          key: "eldest-son",
          title: "Eldest Son"
        },
        {
          key: "second-son",
          title: "Second Son"
        },
        {
          key: "youngest-son",
          title: "Youngest Son"
        }
      ]

    },

    startingMoney: 90000
  }

];


/* =====================================================
   QUESTIONS
===================================================== */

const questions = [

  {
    text:
      "Someone you love is in trouble. Helping them could put you in trouble too. What do you do?",

    answers: [

      {
        text:
          "I help them. I won't leave them alone.",

        traits: {
          loyalty: 3,
          courage: 1
        }
      },

      {
        text:
          "I find a safe way to help.",

        traits: {
          intelligence: 2,
          kindness: 1
        }
      },

      {
        text:
          "I need to know exactly what happened first.",

        traits: {
          intelligence: 3
        }
      },

      {
        text:
          "If they are family, I'm taking the risk.",

        traits: {
          loyalty: 2,
          risk: 2
        }
      }

    ]
  },


  {
    text:
      "You discover that someone has been secretly talking about you.",

    answers: [

      {
        text:
          "Confront them immediately.",

        traits: {
          courage: 2,
          risk: 1
        }
      },

      {
        text:
          "Find out exactly what they said first.",

        traits: {
          intelligence: 2
        }
      },

      {
        text:
          "Ignore it. I have more important things to worry about.",

        traits: {
          patience: 2
        }
      },

      {
        text:
          "Remember it. I don't forget betrayal.",

        traits: {
          loyalty: 1,
          ambition: 2
        }
      }

    ]
  },


  {
    text:
      "You suddenly receive an opportunity that could completely change your life.",

    answers: [

      {
        text:
          "Take it. Opportunities don't wait.",

        traits: {
          ambition: 3,
          risk: 2
        }
      },

      {
        text:
          "Study it carefully before deciding.",

        traits: {
          intelligence: 3
        }
      },

      {
        text:
          "Ask someone I trust.",

        traits: {
          loyalty: 2,
          intelligence: 1
        }
      },

      {
        text:
          "I'd rather stay with what I know.",

        traits: {
          patience: 2
        }
      }

    ]
  },


  {
    text:
      "Someone weaker than you is being treated unfairly.",

    answers: [

      {
        text:
          "Step in immediately.",

        traits: {
          courage: 2,
          kindness: 2
        }
      },

      {
        text:
          "Look for a smarter way to help.",

        traits: {
          intelligence: 2,
          kindness: 1
        }
      },

      {
        text:
          "Stay out of it unless they ask for help.",

        traits: {
          patience: 1
        }
      },

      {
        text:
          "It depends on who is causing the problem.",

        traits: {
          intelligence: 1,
          risk: 1
        }
      }

    ]
  },


  {
    text:
      "You could become extremely successful, but your success might create enemies.",

    answers: [

      {
        text:
          "I still want the success.",

        traits: {
          ambition: 3
        }
      },

      {
        text:
          "I want success, but I need to protect myself.",

        traits: {
          intelligence: 2,
          ambition: 1
        }
      },

      {
        text:
          "I don't want unnecessary enemies.",

        traits: {
          patience: 2
        }
      },

      {
        text:
          "Let them come.",

        traits: {
          courage: 3,
          risk: 1
        }
      }

    ]
  }

];


/* =====================================================
   REGISTRATION STATE
===================================================== */

let selectedGender = "";
let questionIndex = 0;


/* =====================================================
   ELEMENTS
===================================================== */

const registration =
  document.getElementById("registration");

const basicInformation =
  document.getElementById("basicInformation");

const questionsScreen =
  document.getElementById("questions");

const lifeReveal =
  document.getElementById("lifeReveal");

const continueBtn =
  document.getElementById("continueBtn");


/* =====================================================
   GENDER
===================================================== */

document
  .querySelectorAll('input[name="gender"]')
  .forEach(input => {

    input.addEventListener("change", () => {

      selectedGender = input.value;

    });

  });


/* =====================================================
   BASIC REGISTRATION
===================================================== */

if (continueBtn) {

  continueBtn.addEventListener(
    "click",
    startQuestions
  );

}


function startQuestions() {

  const nickname =
    document
      .getElementById("nicknameInput")
      .value
      .trim();

  const age =
    Number(
      document
        .getElementById("ageInput")
        .value
    );


  /* -----------------------------
     CHECK NICKNAME
  ----------------------------- */

  if (!nickname) {

    showToast(
      "Enter the name people will call you."
    );

    return;

  }


  /* -----------------------------
     CHECK AGE
  ----------------------------- */

  if (
    !age ||
    age < 16 ||
    age > 80
  ) {

    showToast(
      "Enter an age between 16 and 80."
    );

    return;

  }


  /* -----------------------------
     CHECK GENDER
  ----------------------------- */

  const selected =
    document.querySelector(
      'input[name="gender"]:checked'
    );


  if (!selected) {

    showToast(
      "Choose how the city knows you."
    );

    return;

  }


  selectedGender =
    selected.value;


  /* -----------------------------
     SAVE BASIC INFORMATION
  ----------------------------- */

  player.nickname =
    nickname;

  player.age =
    age;

  player.gender =
    selectedGender;


  questionIndex =
    0;


  /* -----------------------------
     MOVE TO QUESTIONS
  ----------------------------- */

  basicInformation
    .classList.add("hidden");

  questionsScreen
    .classList.remove("hidden");


  showQuestion();

}


/* =====================================================
   GENDER CARD CLICK SUPPORT
===================================================== */

document
  .querySelectorAll(".gender-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const radio =
          card.querySelector(
            'input[type="radio"]'
          );

        if (radio) {

          radio.checked = true;

          selectedGender =
            radio.value;

        }

      }
    );

  });

/* =====================================================
   QUESTIONS
===================================================== */

function showQuestion() {

  const question =
    questions[questionIndex];


  document
    .getElementById("questionNumber")
    .textContent =
      `QUESTION ${questionIndex + 1} OF ${questions.length}`;


  document
    .getElementById("questionText")
    .textContent =
      question.text;


  const answers =
    document
      .getElementById("questionAnswers");


  answers.innerHTML = "";


  question.answers.forEach(
    answer => {

      const button =
        document.createElement("button");

      button.className =
        "question-answer";

      button.textContent =
        answer.text;


      button.addEventListener(
        "click",
        () => {

          applyTraits(
            answer.traits
          );

          questionIndex++;


          if (
            questionIndex >=
            questions.length
          ) {

            determineLife();

          } else {

            showQuestion();

          }

        }
      );


      answers.appendChild(button);

    }
  );

}


function applyTraits(traits) {

  Object.entries(traits)
    .forEach(
      ([trait, value]) => {

        if (
          player.hiddenTraits[trait] !==
          undefined
        ) {

          player.hiddenTraits[trait] +=
            value;

        }

      }
    );

}


/* =====================================================
   UNIQUE POSITION SYSTEM
===================================================== */

function getPopulationKey(
  familyId,
  positionKey
) {

  return `${familyId}:${positionKey}`;

}


/*
  This quietly checks which positions
  already exist in the current world.

  The player NEVER sees this process.
*/

function positionIsOccupied(
  familyId,
  positionKey
) {

  const key =
    getPopulationKey(
      familyId,
      positionKey
    );

  return Boolean(
    registeredWorld[key]
  );

}


/* =====================================================
   FIND AVAILABLE LIFE
===================================================== */

function findAvailableLife() {

  const possibleLives = [];


  families.forEach(
    family => {

      const positions =
        family.positions[player.gender];


      positions.forEach(
        position => {

          if (
            !positionIsOccupied(
              family.id,
              position.key
            )
          ) {

            possibleLives.push({

              family,

              position

            });

          }

        }
      );

    }
  );


  if (!possibleLives.length) {

    /*
      This is extremely unlikely
      in this prototype.

      Later the server will have
      a much larger population system.
    */

    return null;

  }


  /*
    The player's hidden answers influence
    which life is more likely, without
    directly exposing the mechanism.
  */

  const traits =
    player.hiddenTraits;


  let weights =
    possibleLives.map(
      life => {

        let weight = 1;


        if (
          traits.ambition >= 4
        ) {

          weight +=
            life.family.startingMoney /
            50000;

        }


        if (
          traits.risk >= 3
        ) {

          weight +=
            life.family.type ===
            "Mafia Family"
              ? 2
              : 0;

        }


        if (
          traits.loyalty >= 4
        ) {

          weight += 1;

        }


        return weight;

      }
    );


  const total =
    weights.reduce(
      (sum, value) =>
        sum + value,
      0
    );


  let random =
    Math.random() * total;


  for (
    let i = 0;
    i < possibleLives.length;
    i++
  ) {

    random -= weights[i];

    if (random <= 0) {

      return possibleLives[i];

    }

  }


  return possibleLives[0];

}


/* =====================================================
   DETERMINE LIFE
===================================================== */

function determineLife() {

  questionsScreen
    .classList.add("hidden");


  const life =
    findAvailableLife();


  if (!life) {

    showToast(
      "The city population is full."
    );

    return;

  }


  const family =
    life.family;

  const position =
    life.position;


  player.surname =
    family.surname;

  player.family =
    family.name;

  player.familyType =
    family.type;

  player.familyDescription =
    family.description;

  player.position =
    position.title;

  player.father =
    family.father;

  player.mother =
    family.mother;

  player.identity =
    `${player.nickname} ${player.surname}`;

  player.money =
    family.startingMoney;


  /*
    Reserve the position.

    In multiplayer this reservation
    will happen on the server/database.
  */

  const key =
    getPopulationKey(
      family.id,
      position.key
    );


  registeredWorld[key] = {

    playerId:
      player.id ||
      createPlayerId(),

    nickname:
      player.nickname,

    surname:
      player.surname,

    gender:
      player.gender,

    position:
      player.position

  };


  player.id =
    registeredWorld[key].playerId;


  savePopulation();

  savePlayer();


  showLifeReveal();

}


/* =====================================================
   PLAYER ID
===================================================== */

function createPlayerId() {

  return (
    "player-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );

}


/* =====================================================
   LIFE REVEAL
===================================================== */

function showLifeReveal() {

  lifeReveal
    .classList.remove("hidden");


  document
    .getElementById("revealFamily")
    .textContent =
      player.family;


  document
    .getElementById("revealDescription")
    .textContent =
      player.familyDescription;


  document
    .getElementById("revealFather")
    .textContent =
      player.father;


  document
    .getElementById("revealPosition")
    .textContent =
      player.position;

}


/* =====================================================
   ENTER CITY
===================================================== */

document
  .getElementById("enterCity")
  .addEventListener(
    "click",
    enterCity
  );


function enterCity() {

  registration
    .classList.add("hidden");


  updateUI();

  savePlayer();

  showToast(
    `Welcome to ${player.surname} territory.`
  );

}


/* =====================================================
   DEVICE TIME
===================================================== */

function updateDeviceTime() {

  const now =
    new Date();


  const hours =
    String(
      now.getHours()
    ).padStart(2, "0");


  const minutes =
    String(
      now.getMinutes()
    ).padStart(2, "0");


  const time =
    `${hours}:${minutes}`;


  document
    .getElementById("deviceTime")
    .textContent =
      time;


  document
    .getElementById("phoneTime")
    .textContent =
      time;

}


updateDeviceTime();

setInterval(
  updateDeviceTime,
  1000
);


/* =====================================================
   UI
===================================================== */

function updateUI() {

  document
    .getElementById("money")
    .textContent =
      Number(player.money)
        .toLocaleString();


  document
    .getElementById("dayLabel")
    .textContent =
      `DAY ${player.day}`;


  document
    .getElementById("hungerBar")
    .style.width =
      `${Math.max(
        0,
        player.hunger
      )}%`;


  document
    .getElementById("energyBar")
    .style.width =
      `${Math.max(
        0,
        player.energy
      )}%`;


  document
    .getElementById("hygieneBar")
    .style.width =
      `${Math.max(
        0,
        player.hygiene
      )}%`;


  document
