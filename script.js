/* =====================================================
   LIFE CITY
   3D BROWSER GAME FOUNDATION
   Babylon.js
===================================================== */


/* =====================================================
   GLOBAL GAME STATE
===================================================== */

const Game = {

  engine: null,
  scene: null,
  camera: null,

  playerMesh: null,
  playerParts: {},

  npcs: [],
  enemies: [],
  bullets: [],
  buildings: [],
  furniture: [],

  mode: "city",
  houseMode: false,
  phoneOpen: false,
  gameStarted: false,

  currentLocation: "Your Street",

  lastTime: performance.now(),

  keys: {},

  movement: {
    x: 0,
    z: 0,
    running: false
  },

  combat: {
    health: 100,
    ammo: 12,
    wanted: 0,
    cooldown: 0
  },

  foodGame: {
    active: false,
    score: 0,
    lives: 3,
    time: 30,
    objects: [],
    timer: null
  },

  worldDay: 1

};


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
  health: 100,

  houseType: "Apartment",

  traits: {

    ambition: 0,
    courage: 0,
    kindness: 0,
    intelligence: 0,
    loyalty: 0,
    risk: 0,
    patience: 0

  }

};


/* =====================================================
   LOAD SAVED DATA
===================================================== */

let player =
  JSON.parse(
    localStorage.getItem("lifeCityPlayer")
  ) || structuredClone(defaultPlayer);


let population =
  JSON.parse(
    localStorage.getItem("lifeCityPopulation")
  ) || {};


/*
   Make sure older saved players don't break
   the new version.
*/

player.traits = {

  ...defaultPlayer.traits,

  ...(player.traits || {})

};


/* =====================================================
   SAVE GAME
===================================================== */

function saveGame() {

  localStorage.setItem(
    "lifeCityPlayer",
    JSON.stringify(player)
  );

  localStorage.setItem(
    "lifeCityPopulation",
    JSON.stringify(population)
  );

}


/* =====================================================
   REGISTRATION STATE
===================================================== */

let selectedGender = "";
let questionIndex = 0;


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

    father: "Don Russo",

    mother: "Elena Russo",

    money: 75000,

    color: "#991b1b"
  },


  {
    id: "varelli",

    surname: "Varelli",

    name: "THE VARELLI FAMILY",

    type: "Mafia Family",

    description:
      "An old dynasty built around information, connections and secrets. Very few things happen in the city without the Varelli family hearing about them.",

    father: "Don Varelli",

    mother: "Lucia Varelli",

    money: 85000,

    color: "#4338ca"
  },


  {
    id: "moretti",

    surname: "Moretti",

    name: "THE MORETTI FAMILY",

    type: "Mafia Family",

    description:
      "A wealthy dynasty with legitimate businesses and a hidden criminal network operating behind respectable doors.",

    father: "Don Moretti",

    mother: "Sofia Moretti",

    money: 100000,

    color: "#92400e"
  },


  {
    id: "bellini",

    surname: "Bellini",

    name: "THE BELLINI FAMILY",

    type: "Mafia Family",

    description:
      "A sophisticated dynasty whose power is built through influence, politics, business and relationships with the city's most important people.",

    father: "Don Bellini",

    mother: "Isabella Bellini",

    money: 90000,

    color: "#7e22ce"
  }

];


/* =====================================================
   LIFE QUESTIONS
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
   DOM ELEMENTS
===================================================== */

const canvas =
  document.getElementById("gameCanvas");

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

const enterCity =
  document.getElementById("enterCity");

const nicknameInput =
  document.getElementById("nicknameInput");

const ageInput =
  document.getElementById("ageInput");

const questionNumber =
  document.getElementById("questionNumber");

const questionText =
  document.getElementById("questionText");

const questionAnswers =
  document.getElementById("questionAnswers");

const revealFamily =
  document.getElementById("revealFamily");

const revealDescription =
  document.getElementById("revealDescription");

const revealFather =
  document.getElementById("revealFather");

const revealPosition =
  document.getElementById("revealPosition");

const toast =
  document.getElementById("toast");


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;

  toast.classList.remove("hidden");

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(() => {

      toast.classList.add("hidden");

    }, 3000);

}


/* =====================================================
   GENDER
===================================================== */

const genderOptions =
  document.querySelectorAll(
    'input[name="gender"]'
  );


genderOptions.forEach(
  input => {

    input.addEventListener(
      "change",
      function () {

        selectedGender =
          this.value;

        document
          .querySelectorAll(
            ".gender-card"
          )
          .forEach(card => {

            card.classList.remove(
              "selected"
            );

          });


        const card =
          this.closest(
            ".gender-card"
          );


        if (card) {

          card.classList.add(
            "selected"
          );

        }

      }
    );

  }
);


/* =====================================================
   CONTINUE BUTTON
===================================================== */

if (continueBtn) {

  continueBtn.addEventListener(
    "click",
    function () {

      const nickname =
        nicknameInput
          ? nicknameInput.value.trim()
          : "";

      const age =
        ageInput
          ? Number(ageInput.value)
          : 0;


      const chosenGender =
        document.querySelector(
          'input[name="gender"]:checked'
        );


      if (!nickname) {

        showToast(
          "Enter the name people will call you."
        );

        return;

      }


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


      if (!chosenGender) {

        showToast(
          "Please select your gender."
        );

        return;

      }


      selectedGender =
        chosenGender.value;


      player.nickname =
        nickname;

      player.age =
        age;

      player.gender =
        selectedGender;


      if (basicInformation) {

        basicInformation
          .classList
          .add("hidden");

      }


      if (questionsScreen) {

        questionsScreen
          .classList
          .remove("hidden");

      }


      questionIndex = 0;

      showQuestion();

    }
  );

}


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuestion() {

  if (
    !questionsScreen ||
    !questionText ||
    !questionAnswers
  ) {
    return;
  }


  const question =
    questions[
      questionIndex
    ];


  if (!question) {

    determineLife();

    return;

  }


  if (questionNumber) {

    questionNumber.textContent =
      `QUESTION ${
        questionIndex + 1
      } OF ${
        questions.length
      }`;

  }


  questionText.textContent =
    question.text;


  questionAnswers.innerHTML =
    "";


  question.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "answer-button";


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


      questionAnswers.appendChild(
        button
      );

    }
  );

}


/* =====================================================
   APPLY HIDDEN TRAITS
===================================================== */

function applyTraits(traits) {

  if (!traits) {
    return;
  }


  Object.keys(traits)
    .forEach(key => {

      if (
        typeof player.traits[key]
        !== "number"
      ) {

        player.traits[key] = 0;

      }


      player.traits[key] +=
        Number(traits[key]);

    });

}


/* =====================================================
   FIND AVAILABLE LIFE
===================================================== */

function findAvailableLife() {

  const gender =
    player.gender;


  const possiblePositions = [

    {
      key: "eldest-daughter",
      label: "ELDEST DAUGHTER"
    },

    {
      key: "second-daughter",
      label: "SECOND DAUGHTER"
    },

    {
      key: "youngest-daughter",
      label: "YOUNGEST DAUGHTER"
    },

    {
      key: "eldest-son",
      label: "ELDEST SON"
    },

    {
      key: "second-son",
      label: "SECOND SON"
    },

    {
      key: "youngest-son",
      label: "YOUNGEST SON"
    }

  ];


  const genderPositions =
    possiblePositions.filter(
      position => {

        if (
          gender === "female"
        ) {

          return position.key
            .includes("daughter");

        }

        return position.key
          .includes("son");

      }
    );


  const available = [];


  families.forEach(
    family => {

      genderPositions.forEach(
        position => {

          const uniqueKey =
            `${family.id}-${position.key}`;


          if (
            !population[uniqueKey]
          ) {

            available.push({

              family,

              position,

              uniqueKey

            });

          }

        }
      );

    }
  );


  if (!available.length) {

    /*
      If all six slots of every family
      are occupied, create a normal
      civilian life instead of breaking
      the registration.
    */

    return {

      family: {

        id: "civilian",

        surname: "Walker",

        name: "THE CITY",

        type: "Civilian",

        description:
          "You were born outside the powerful families. Your story begins with an ordinary life, but the city is full of opportunities.",

        father: "Unknown",

        mother: "Unknown",

        money: 5000,

        color: "#475569"

      },

      position: {

        key: "civilian",

        label: "ORDINARY CITIZEN"

      },

      uniqueKey:
        `civilian-${Date.now()}`

    };

  }


  /*
    Score lives using hidden traits.

    The player never sees these calculations.
  */

  const scored =
    available.map(
      life => {

        let score =
          Math.random() * 10;


        const traits =
          player.traits;


        score +=
          traits.ambition * 2;

        score +=
          traits.courage * 1.5;

        score +=
          traits.intelligence * 1.5;

        score +=
          traits.loyalty * 1.5;

        score +=
          traits.risk;


        /*
          Family tendencies.
        */

        if (
          life.family.id ===
          "varelli"
        ) {

          score +=
            traits.intelligence * 2;

        }


        if (
          life.family.id ===
          "russo"
        ) {

          score +=
            traits.courage;

          score +=
            traits.loyalty;

        }


        if (
          life.family.id ===
          "moretti"
        ) {

          score +=
            traits.ambition * 2;

        }


        if (
          life.family.id ===
          "bellini"
        ) {

          score +=
            traits.intelligence;

          score +=
            traits.ambition;

        }


        return {

          ...life,

          score

        };

      }
    );


  scored.sort(
    (a, b) =>
      b.score - a.score
  );


  /*
    Add a little randomness so that
    identical answers don't always create
    identical lives.
  */

  const top =
    scored.slice(
      0,
      Math.min(4, scored.length)
    );


  return top[
    Math.floor(
      Math.random() *
      top.length
    )
  ];

}


/* =====================================================
   DETERMINE LIFE
===================================================== */

function determineLife() {

  const life =
    findAvailableLife();


  if (!life) {

    showToast(
      "The city could not create your life."
    );

    return;

  }


  const family =
    life.family;


  player.surname =
    family.surname;


  player.family =
    family.name;


  player.familyType =
    family.type;


  player.familyDescription =
    family.description;


  player.position =
    life.position.label;


  player.father =
    family.father;


  player.mother =
    family.mother;


  player.money =
    family.money;


  player.identity =
    `${player.nickname} ${player.surname}`;


  player.id =
    `LC-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;


  /*
    Reserve this family position.
  */

  population[
    life.uniqueKey
  ] = {

    playerId:
      player.id,

    nickname:
      player.nickname,

    gender:
      player.gender,

    position:
      player.position,

    family:
      player.family

  };


  saveGame();


  if (questionsScreen) {

    questionsScreen
      .classList
      .add("hidden");

  }


  showLifeReveal();

}


/* =====================================================
   LIFE REVEAL
===================================================== */

function showLifeReveal() {

  if (lifeReveal) {

    lifeReveal
      .classList
      .remove("hidden");

  }


  if (revealFamily) {

    revealFamily.textContent =
      player.family;

  }


  if (revealDescription) {

    revealDescription.textContent =
      player.familyDescription;

  }


  if (revealFather) {

    revealFather.textContent =
      player.father;

  }


  if (revealPosition) {

    revealPosition.textContent =
      player.position;

  }

}


/* =====================================================
   ENTER CITY
===================================================== */

if (enterCity) {

  enterCity.addEventListener(
    "click",
    enterTheCity
  );

}


function enterTheCity() {

  if (registration) {

    registration
      .classList
      .add("hidden");

  }


  Game.gameStarted =
    true;


  saveGame();


  if (!Game.engine) {

    initializeEngine();

  }


  updatePlayerInterface();


  showToast(
    `Welcome to Life City, ${player.nickname}.`
  );

}


/* =====================================================
   BABYLON INITIALIZATION
===================================================== */

function initializeEngine() {

  if (!canvas) {

    console.error(
      "gameCanvas was not found."
    );

    return;

  }


  Game.engine =
    new BABYLON.Engine(
      canvas,
      true,
      {
        preserveDrawingBuffer: true,
        stencil: true
     
