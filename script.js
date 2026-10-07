/* =====================================================
   LIFE CITY
   COMPLETE 3D BROWSER GAME FOUNDATION
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
     playerAnimations: {},
  currentAnimation: null,

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
   PLAYER CHARACTER
===================================================== */

async function loadPlayerCharacter() {
   async function loadPlayerAnimations() {

  try {

    const walking =
      await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "./assets/characters/",
        "walking.glb",
        Game.scene
      );

    const running =
      await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "./assets/characters/",
        "running.glb",
        Game.scene
      );


    if (
      walking.animationGroups &&
      walking.animationGroups.length > 0
    ) {

      Game.playerAnimations.walk =
        walking.animationGroups[0];

      Game.playerAnimations.walk.stop();

    }


    if (
      running.animationGroups &&
      running.animationGroups.length > 0
    ) {

      Game.playerAnimations.run =
        running.animationGroups[0];

      Game.playerAnimations.run.stop();

    }


    /*
      Remove the imported animation models.
      We only want their animation data.
    */

    walking.meshes.forEach(
      mesh => mesh.dispose()
    );

    running.meshes.forEach(
      mesh => mesh.dispose()
    );


    console.log(
      "Player animations loaded."
    );

  } catch (error) {

    console.error(
      "Animation loading failed:",
      error
    );

  }

   }
   function playPlayerAnimation(name) {
  const animation = Game.playerAnimations[name];

  if (!animation || Game.currentAnimation === animation) return;

  if (Game.currentAnimation) {
    Game.currentAnimation.stop();
  }

  Game.currentAnimation = animation;
  animation.start(true);
   }
  if (!Game.scene) return;

  // Remove old character if one exists
  if (Game.playerMesh) {
    Game.playerMesh.dispose();
    Game.playerMesh = null;
  }

  try {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "./assets/characters/",
      "idle.glb",
      Game.scene
    );

    const character = result.meshes[0];

    character.name = "LifeCityPlayer";
    character.position = new BABYLON.Vector3(0, 0, 0);
    character.scaling = new BABYLON.Vector3(1, 1, 1);

    Game.playerMesh = character;

    // Store the skeleton
    if (result.skeletons.length > 0) {
      Game.playerMesh.skeleton = result.skeletons[0];
    }

    // Load idle animation
    if (result.animationGroups.length > 0) {
      Game.playerAnimations.idle = result.animationGroups[0];
      Game.currentAnimation = Game.playerAnimations.idle;

      Game.currentAnimation.start(true);
    }

    console.log("Life City character loaded:", character.name);

  } catch (error) {
    console.error("Character failed to load:", error);
  }
}

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

let player;

let population;

try {
  player =
    JSON.parse(
      localStorage.getItem("lifeCityPlayer")
    ) || structuredClone(defaultPlayer);
} catch (error) {
  console.warn("Could not load saved player.", error);
  player = structuredClone(defaultPlayer);
}

try {
  population =
    JSON.parse(
      localStorage.getItem("lifeCityPopulation")
    ) || {};
} catch (error) {
  console.warn("Could not load population.", error);
  population = {};
}


/* Make old saves compatible */

player = {
  ...structuredClone(defaultPlayer),
  ...player,

  traits: {
    ...defaultPlayer.traits,
    ...(player.traits || {})
  }
};


/* =====================================================
   SAVE GAME
===================================================== */

function saveGame() {
  try {
    localStorage.setItem(
      "lifeCityPlayer",
      JSON.stringify(player)
    );

    localStorage.setItem(
      "lifeCityPopulation",
      JSON.stringify(population)
    );
  } catch (error) {
    console.error("Could not save Life City.", error);
  }
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


/* HUD */

const locationLabel =
  document.getElementById("locationLabel");

const dayLabel =
  document.getElementById("dayLabel");

const moneyDisplay =
  document.getElementById("money");

const hungerBar =
  document.getElementById("hungerBar");

const energyBar =
  document.getElementById("energyBar");

const hygieneBar =
  document.getElementById("hygieneBar");

const wantedPanel =
  document.getElementById("wantedPanel");

const wantedStars =
  document.getElementById("wantedStars");

const worldMessage =
  document.getElementById("worldMessage");


/* PHONE */

const phone =
  document.getElementById("phone");

const phoneOpen =
  document.getElementById("phoneOpen");

const phoneTime =
  document.getElementById("phoneTime");

const phoneHome =
  document.getElementById("phoneHome");

const appPage =
  document.getElementById("appPage");

const appTitle =
  document.getElementById("appTitle");

const appContent =
  document.getElementById("appContent");

const appBack =
  document.getElementById("appBack");

const phoneHomeButton =
  document.getElementById("phoneHomeButton");

const phoneAppsButton =
  document.getElementById("phoneAppsButton");

const phoneCloseButton =
  document.getElementById("phoneCloseButton");

const miniAvatar =
  document.getElementById("miniAvatar");

const miniName =
  document.getElementById("miniName");

const miniIdentity =
  document.getElementById("miniIdentity");


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
}


/* =====================================================
   WORLD MESSAGE
===================================================== */

function showWorldMessage(message) {

  if (!worldMessage) return;

  worldMessage.textContent = message;

  worldMessage.classList.add("show");

  clearTimeout(showWorldMessage.timer);

  showWorldMessage.timer =
    setTimeout(() => {
      worldMessage.classList.remove("show");
    }, 2500);
}


/* =====================================================
   GENDER
===================================================== */

const genderOptions =
  document.querySelectorAll(
    'input[name="gender"]'
  );

genderOptions.forEach(input => {

  input.addEventListener(
    "change",
    function () {

      selectedGender =
        this.value;

      document
        .querySelectorAll(".gender-card")
        .forEach(card => {

          card.classList.remove("selected");

        });

      const card =
        this.closest(".gender-card");

      if (card) {
        card.classList.add("selected");
      }
    }
  );

});


/* =====================================================
   CONTINUE BUTTON
===================================================== */

if (continueBtn) {

  continueBtn.addEventListener(
    "click",
    handleRegistrationContinue
  );

}


function handleRegistrationContinue() {

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

    if (nicknameInput) {
      nicknameInput.focus();
    }

    return;
  }


  if (!age || age < 16 || age > 80) {

    showToast(
      "Enter an age between 16 and 80."
    );

    if (ageInput) {
      ageInput.focus();
    }

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


  questionIndex = 0;


  if (basicInformation) {
    basicInformation.classList.add("hidden");
  }

  if (questionsScreen) {
    questionsScreen.classList.remove("hidden");
  }


  showQuestion();
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
    questions[questionIndex];


  if (!question) {

    determineLife();

    return;
  }


  if (questionNumber) {

    questionNumber.textContent =
      `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  }


  questionText.textContent =
    question.text;


  questionAnswers.innerHTML =
    "";


  question.answers.forEach(answer => {

    const button =
      document.createElement("button");


    button.type =
      "button";

    button.className =
      "question-answer";

    button.textContent =
      answer.text;


    button.addEventListener(
      "click",
      () => {

        applyTraits(answer.traits);

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


    questionAnswers.appendChild(button);

  });

}


/* =====================================================
   APPLY HIDDEN TRAITS
===================================================== */

function applyTraits(traits) {

  if (!traits) return;


  Object.keys(traits)
    .forEach(key => {

      if (
        typeof player.traits[key] !==
        "number"
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
          player.gender ===
          "female"
        ) {

          return position.key.includes(
            "daughter"
          );

        }

        return position.key.includes(
          "son"
        );

      }
    );


  const available = [];


  families.forEach(family => {

    genderPositions.forEach(position => {

      const uniqueKey =
        `${family.id}-${position.key}`;


      if (!population[uniqueKey]) {

        available.push({
          family,
          position,
          uniqueKey
        });

      }

    });

  });


  if (!available.length) {

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


  const scored =
    available.map(life => {

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

    });


  scored.sort(
    (a, b) =>
      b.score - a.score
  );


  const top =
    scored.slice(
      0,
      Math.min(4, scored.length)
    );


  return top[
    Math.floor(
      Math.random() * top.length
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
    questionsScreen.classList.add("hidden");
  }


  showLifeReveal();
}


/* =====================================================
   LIFE REVEAL
===================================================== */

function showLifeReveal() {

  if (lifeReveal) {
    lifeReveal.classList.remove("hidden");
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
    registration.classList.add("hidden");
  }


  Game.gameStarted =
    true;


  saveGame();


  if (!Game.engine) {
    initializeEngine();
  }


  updatePlayerInterface();


  showWorldMessage(
    `Welcome to Life City, ${player.nickname}.`
  );

}


/* =====================================================
   BABYLON INITIALIZATION
===================================================== */

async function initializeEngine() {

  if (!canvas) {

    console.error(
      "gameCanvas was not found."
    );

    return;
  }


  if (
    typeof BABYLON ===
    "undefined"
  ) {

    console.error(
      "Babylon.js did not load."
    );

    showToast(
      "The 3D engine could not load."
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
      }
    );


  Game.scene =
  createScene();

// TEMPORARILY DISABLED
// await loadPlayerCharacter();
// await loadPlayerAnimations();

  Game.engine.runRenderLoop(
    () => {

      const now =
        performance.now();

      const delta =
        Math.min(
          (now - Game.lastTime) / 1000,
          0.05
        );

      Game.lastTime =
        now;


      if (Game.gameStarted) {

        updateGame(delta);

      }


      if (Game.scene) {
        Game.scene.render();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (Game.engine) {
        Game.engine.resize();
      }

    }
  );


  setupKeyboard();
  setupMobileControls();
  setupPhone();

  updatePlayerInterface();

}
/* =====================================================
   CREATE SCENE
===================================================== */

function createScene() {

  const scene =
    new BABYLON.Scene(Game.engine);

  // Make the scene available immediately
  Game.scene = scene;


  scene.clearColor =
    new BABYLON.Color4(
      0.025,
      0.035,
      0.055,
      1
    );


  const camera =
    new BABYLON.FollowCamera(
      "playerCamera",
      new BABYLON.Vector3(
        0,
        8,
        -12
      ),
      scene
    );


  camera.radius = 12;
  camera.heightOffset = 6;
  camera.rotationOffset = 180;
  camera.cameraAcceleration = 0.08;
  camera.maxCameraSpeed = 10;


  Game.camera =
    camera;


  const light =
    new BABYLON.HemisphericLight(
      "cityLight",
      new BABYLON.Vector3(
        0,
        1,
        0
      ),
      scene
    );


  light.intensity =
    0.85;


  const ground =
    BABYLON.MeshBuilder.CreateGround(
      "cityGround",
      {
        width: 100,
        height: 100
      },
      scene
    );


  const groundMaterial =
    new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );


  groundMaterial.diffuseColor =
    new BABYLON.Color3(
      0.055,
      0.075,
      0.08
    );


  ground.material =
    groundMaterial;


  createRoad(
    scene,
    0,
    0,
    100,
    10,
    true
  );


  createRoad(
    scene,
    0,
    0,
    10,
    100,
    false
  );


  createCityBlocks(scene);


  createPlayer(scene);


  createNPCs(scene);


  camera.lockedTarget =
    Game.playerMesh;


  return scene;
}


/* =====================================================
   MATERIAL HELPER
===================================================== */

function createMaterial(
  name,
  color
) {

  const material =
    new BABYLON.StandardMaterial(
      name,
      Game.scene
    );


  material.diffuseColor =
    BABYLON.Color3.FromHexString(
      color
    );


  return material;
}


/* =====================================================
   ROAD
===================================================== */

function createRoad(
  scene,
  x,
  z,
  width,
  depth,
  horizontal
) {

  const road =
    BABYLON.MeshBuilder.CreateBox(
      "road",
      {
        width: horizontal
          ? width
          : depth,

        height: 0.08,

        depth: horizontal
          ? depth
          : width
      },
      scene
    );


  road.position.x =
    x;

  road.position.z =
    z;


  road.material =
    createMaterial(
      "roadMaterial",
      "#20262c"
    );


  return road;
}


/* =====================================================
   CITY BLOCKS
===================================================== */

function createCityBlocks(scene) {

  const blocks = [

    [-25, -25, 16, 12],
    [25, -25, 16, 12],

    [-25, 25, 16, 12],
    [25, 25, 16, 12],

    [-25, -5, 12, 12],
    [25, 5, 12, 12]

  ];


  blocks.forEach(
    (block, index) => {

      createBuilding(
        scene,
        `building-${index}`,
        block[0],
        block[1],
        block[2],
        block[3]
      );

    }
  );


  createPark(
    scene,
    -10,
    20
  );


  createPark(
    scene,
    10,
    -20
  );


  createStreetLights(scene);
}
/* =====================================================
   BUILDING
===================================================== */

function createBuilding(
  scene,
  name,
  x,
  z,
  width,
  depth
) {

  const height =
    4 + Math.random() * 5;


  const building =
    BABYLON.MeshBuilder.CreateBox(
      name,
      {
        width,
        height,
        depth
      },
      scene
    );


  building.position.x =
    x;

  building.position.y =
    height / 2;

  building.position.z =
    z;


  const colors = [
    "#263238",
    "#37474f",
    "#455a64",
    "#334155",
    "#1e293b"
  ];


  building.material =
    createMaterial(
      `${name}-material`,
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ]
    );


  Game.buildings.push(building);


  return building;
}


/* =====================================================
   PARK
===================================================== */

function createPark(
  scene,
  x,
  z
) {

  const park =
    BABYLON.MeshBuilder.CreateBox(
      "park",
      {
        width: 16,
        height: 0.15,
        depth: 16
      },
      scene
    );


  park.position.x =
    x;

  park.position.y =
    0.08;

  park.position.z =
    z;


  park.material =
    createMaterial(
      "parkMaterial",
      "#14532d"
    );


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const tree =
      BABYLON.MeshBuilder.CreateCylinder(
        "tree",
        {
          diameter: 1,
          height: 4
        },
        scene
      );


    tree.position.x =
      x - 6 + Math.random() * 12;

    tree.position.y =
      2;

    tree.position.z =
      z - 6 + Math.random() * 12;


    tree.material =
      createMaterial(
        "treeMaterial",
        "#166534"
      );

  }

}


/* =====================================================
   STREET LIGHTS
===================================================== */

function createStreetLights(scene) {

  const positions = [

    [-7, -7],
    [7, -7],
    [-7, 7],
    [7, 7],
    [-17, 0],
    [17, 0]

  ];


  positions.forEach(
    position => {

      const pole =
        BABYLON.MeshBuilder.CreateCylinder(
          "streetLight",
          {
            diameter: 0.15,
            height: 3.5
          },
          scene
        );


      pole.position.x =
        position[0];

      pole.position.y =
        1.75;

      pole.position.z =
        position[1];


      pole.material =
        createMaterial(
          "poleMaterial",
          "#374151"
        );


      const lamp =
        BABYLON.MeshBuilder.CreateSphere(
          "lamp",
          {
            diameter: 0.35
          },
          scene
        );


      lamp.position.x =
        position[0];

      lamp.position.y =
        3.55;

      lamp.position.z =
        position[1];


      lamp.material =
        createMaterial(
          "lampMaterial",
          "#fef3c7"
        );

    }
  );

}
/* =====================================================
   PLAYER
===================================================== */

function createPlayer(scene) {

  const player =
    new BABYLON.TransformNode(
      "player",
      scene
    );


  player.position =
    new BABYLON.Vector3(
      0,
      0,
      0
    );


  const body =
    BABYLON.MeshBuilder.CreateCylinder(
      "playerBody",
      {
        diameter: 1,
        height: 1.6
      },
      scene
    );


  body.position.y =
    1;


  body.parent =
    player;


  body.material =
    createMaterial(
      "playerBodyMaterial",
      "#14b8a6"
    );


  const head =
    BABYLON.MeshBuilder.CreateSphere(
      "playerHead",
      {
        diameter: 0.8
      },
      scene
    );


  head.position.y =
    2.1;


  head.parent =
    player;


  head.material =
    createMaterial(
      "playerHeadMaterial",
      "#d6a77a"
    );


  const legLeft =
    BABYLON.MeshBuilder.CreateBox(
      "leftLeg",
      {
        width: 0.25,
        height: 0.8,
        depth: 0.25
      },
      scene
    );


  legLeft.position =
    new BABYLON.Vector3(
      -0.22,
      0.2,
      0
    );


  legLeft.parent =
    player;


  legLeft.material =
    createMaterial(
      "legMaterial",
      "#111827"
    );


  const legRight =
    legLeft.clone(
      "rightLeg"
    );


  legRight.position.x =
    0.22;


  Game.playerMesh =
    player;


  Game.playerParts = {
    body,
    head,
    legLeft,
    legRight
  };

}


/* =====================================================
   NPCS
===================================================== */

function createNPCs(scene) {

  const npcNames = [
    "Citizen",
    "Shopper",
    "Worker",
    "Student",
    "Neighbour",
    "Driver"
  ];


  npcNames.forEach(
    (name, index) => {

      const npc =
        BABYLON.MeshBuilder.CreateBox(
          `npc-${index}`,
          {
            width: 0.8,
            height: 1.8,
            depth: 0.8
          },
          scene
        );


      npc.position.x =
        -15 + Math.random() * 30;

      npc.position.y =
        0.9;

      npc.position.z =
        -15 + Math.random() * 30;


      npc.material =
        createMaterial(
          `npcMaterial-${index}`,
          "#64748b"
        );


      npc.metadata = {
        name,
        direction:
          Math.random() * Math.PI * 2,
        speed:
          0.4 + Math.random() * 0.5
      };


      Game.npcs.push(npc);

    }
  );

}


/* =====================================================
   KEYBOARD
===================================================== */

function setupKeyboard() {

  window.addEventListener(
    "keydown",
    event => {

      const key =
        event.key.toLowerCase();

      Game.keys[key] =
        true;


      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " "
        ].includes(key)
      ) {

        event.preventDefault();

      }


      if (key === "e") {
        interact();
      }


      if (key === "r") {
        Game.movement.running = true;
      }


      if (key === "f") {
        performAction();
      }


      if (key === "p") {
        togglePhone();
      }

    }
  );


  window.addEventListener(
    "keyup",
    event => {

      const key =
        event.key.toLowerCase();

      Game.keys[key] =
        false;


      if (key === "r") {
        Game.movement.running = false;
      }

    }
  );

}
/* =====================================================
   MOBILE CONTROLS
===================================================== */

function setupMobileControls() {

  const movementButtons =
    document.querySelectorAll(
      "[data-move]"
    );


  movementButtons.forEach(
    button => {

      const direction =
        button.dataset.move;


      const start =
        event => {

          event.preventDefault();

          setMovementDirection(
            direction,
            true
          );

        };


      const stop =
        event => {

          event.preventDefault();

          setMovementDirection(
            direction,
            false
          );

        };


      button.addEventListener(
        "pointerdown",
        start
      );

      button.addEventListener(
        "pointerup",
        stop
      );

      button.addEventListener(
        "pointercancel",
        stop
      );

      button.addEventListener(
        "pointerleave",
        stop
      );

    }
  );


  const interactButton =
    document.getElementById(
      "interactButton"
    );


  const runButton =
    document.getElementById(
      "runButton"
    );


  const actionButton =
    document.getElementById(
      "actionButton"
    );


  if (interactButton) {

    interactButton.addEventListener(
      "click",
      interact
    );

  }


  if (actionButton) {

    actionButton.addEventListener(
      "click",
      performAction
    );

  }


  if (runButton) {

    runButton.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        Game.movement.running =
          true;

      }
    );


    runButton.addEventListener(
      "pointerup",
      event => {

        event.preventDefault();

        Game.movement.running =
          false;

      }
    );


    runButton.addEventListener(
      "pointercancel",
      () => {

        Game.movement.running =
          false;

      }
    );

  }

}


/* =====================================================
   MOVEMENT
===================================================== */

function setMovementDirection(
  direction,
  active
) {

  if (direction === "up") {
    Game.keys.arrowup = active;
  }

  if (direction === "down") {
    Game.keys.arrowdown = active;
  }

  if (direction === "left") {
    Game.keys.arrowleft = active;
  }

  if (direction === "right") {
    Game.keys.arrowright = active;
  }

}


/* =====================================================
   GET MOVEMENT
===================================================== */

function calculateMovement() {

  let x = 0;
  let z = 0;


  if (
    Game.keys.arrowleft ||
    Game.keys.a
  ) {
    x -= 1;
  }


  if (
    Game.keys.arrowright ||
    Game.keys.d
  ) {
    x += 1;
  }


  if (
    Game.keys.arrowup ||
    Game.keys.w
  ) {
    z += 1;
  }


  if (
    Game.keys.arrowdown ||
    Game.keys.s
  ) {
    z -= 1;
  }


  const length =
    Math.hypot(x, z);


  if (length > 0) {

    x /= length;
    z /= length;

  }


  return {
    x,
    z
  };

       }
/* =====================================================
   UPDATE PLAYER MOVEMENT
===================================================== */

function updatePlayerMovement(delta) {

  if (!Game.playerMesh) {
    return;
  }


  const movement =
    calculateMovement();


  const running =
    Game.movement.running;


  const speed =
    running
      ? 7
      : 3.5;


  Game.playerMesh.position.x +=
    movement.x *
    speed *
    delta;


  Game.playerMesh.position.z +=
    movement.z *
    speed *
    delta;


  const limit = 48;


  Game.playerMesh.position.x =
    Math.max(
      -limit,
      Math.min(
        limit,
        Game.playerMesh.position.x
      )
    );


  Game.playerMesh.position.z =
    Math.max(
      -limit,
      Math.min(
        limit,
        Game.playerMesh.position.z
      )
    );


  if (
    movement.x !== 0 ||
    movement.z !== 0
  ) {

    Game.playerMesh.rotation.y =
      Math.atan2(
        movement.x,
        movement.z
      );


    player.energy =
      Math.max(
        0,
        player.energy -
          delta *
          (running ? 0.8 : 0.25)
      );


    player.hunger =
      Math.max(
        0,
        player.hunger -
          delta *
          0.03
      );

  }


  if (
    running &&
    player.energy <= 0
  ) {

    Game.movement.running =
      false;

  }

}


/* =====================================================
   NPC MOVEMENT
===================================================== */

function updateNPCs(delta) {

  Game.npcs.forEach(
    npc => {

      if (!npc.metadata) {
        return;
      }


      const data =
        npc.metadata;


      data.direction +=
        (Math.random() - 0.5) *
        delta;


      npc.position.x +=
        Math.sin(data.direction) *
        data.speed *
        delta;


      npc.position.z +=
        Math.cos(data.direction) *
        data.speed *
        delta;


      if (
        Math.abs(npc.position.x) >
        45
      ) {

        data.direction =
          Math.PI -
          data.direction;

      }


      if (
        Math.abs(npc.position.z) >
        45
      ) {

        data.direction =
          -data.direction;

      }

    }
  );

}


/* =====================================================
   INTERACTION
===================================================== */

function interact() {

  if (!Game.gameStarted) {
    return;
  }


  if (Game.phoneOpen) {
    return;
  }


  if (!Game.playerMesh) {
    return;
  }


  let nearest =
    null;

  let nearestDistance =
    Infinity;


  Game.npcs.forEach(
    npc => {

      const distance =
        BABYLON.Vector3.Distance(
          Game.playerMesh.position,
          npc.position
        );


      if (
        distance <
        nearestDistance
      ) {

        nearestDistance =
          distance;

        nearest =
          npc;

      }

    }
  );


  if (
    nearest &&
    nearestDistance < 3
  ) {

    const name =
      nearest.metadata
        ?.name ||
      "Citizen";


    showWorldMessage(
      `You spoke with a ${name}.`
    );


    return;
  }


  showWorldMessage(
    "There is nothing nearby to interact with."
  );

}


/* =====================================================
   ACTION
===================================================== */

function performAction() {

  if (!Game.gameStarted) {
    return;
  }


  if (
    Game.combat.cooldown >
    0
  ) {
    return;
  }


  Game.combat.cooldown =
    0.6;


  Game.combat.ammo =
    Math.max(
      0,
      Game.combat.ammo - 1
    );


  Game.combat.wanted =
    Math.min(
      5,
      Game.combat.wanted + 1
    );


  showWorldMessage(
    "Action performed."
  );


  updateWanted();


  if (
    Game.combat.ammo <= 0
  ) {

    showWorldMessage(
      "You are out of ammo."
    );

  }

}


/* =====================================================
   WANTED SYSTEM
===================================================== */

function updateWanted() {

  if (!wantedPanel) {
    return;
  }


  const wanted =
    Math.round(
      Game.combat.wanted
    );


  if (wanted <= 0) {

    wantedPanel.classList.add(
      "hidden"
    );

    return;

  }


  wantedPanel.classList.remove(
    "hidden"
  );


  let stars = "";

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    stars +=
      i < wanted
        ? "★"
        : "☆";

  }


  if (wantedStars) {
    wantedStars.textContent =
      stars;
  }

}

/* =====================================================
   PHONE
===================================================== */

function setupPhone() {

  if (phoneOpen) {

    phoneOpen.addEventListener(
      "click",
      togglePhone
    );

  }


  if (phoneCloseButton) {

    phoneCloseButton.addEventListener(
      "click",
      togglePhone
    );

  }


  if (phoneHomeButton) {

    phoneHomeButton.addEventListener(
      "click",
      showPhoneHome
    );

  }


  if (phoneAppsButton) {

    phoneAppsButton.addEventListener(
      "click",
      showPhoneHome
    );

  }


  if (appBack) {

    appBack.addEventListener(
      "click",
      showPhoneHome
    );

  }


  document
    .querySelectorAll(".app-icon")
    .forEach(
      icon => {

        icon.addEventListener(
          "click",
          () => {

            openPhoneApp(
              icon.dataset.app
            );

          }
        );

      }
    );


  updatePhoneProfile();

}


/* =====================================================
   TOGGLE PHONE
===================================================== */

function togglePhone() {

  if (!phone) {
    return;
  }


  Game.phoneOpen =
    !Game.phoneOpen;


  if (Game.phoneOpen) {

    phone.classList.remove(
      "hidden"
    );

    updatePhoneProfile();

  } else {

    phone.classList.add(
      "hidden"
    );

  }

}


/* =====================================================
   PHONE HOME
===================================================== */

function showPhoneHome() {

  if (phoneHome) {

    phoneHome.classList.remove(
      "hidden"
    );

  }


  if (appPage) {

    appPage.classList.add(
      "hidden"
    );

  }

}


/* =====================================================
   PHONE APP
===================================================== */

function openPhoneApp(app) {

  if (!appPage) {
    return;
  }


  if (phoneHome) {

    phoneHome.classList.add(
      "hidden"
    );

  }


  appPage.classList.remove(
    "hidden"
  );


  const appData = {

    profile: {
      title: "Profile",

      html: `
        <div class="phone-card">
          <h3>${escapeHTML(player.identity || player.nickname)}</h3>
          <p>${escapeHTML(player.position || "Citizen")}</p>
          <p>Age: ${player.age}</p>
          <p>Family: ${escapeHTML(player.family || "Unknown")}</p>
          <p>Health: ${Math.round(player.health)}%</p>
        </div>
      `
    },


    bank: {
      title: "Bank",

      html: `
        <div class="phone-card">
          <h3>Life City Bank</h3>
          <p>Your current cash balance.</p>
          <h2>₦${formatMoney(player.money)}</h2>
        </div>

        <button class="phone-action" data-phone-action="work">
          Earn ₦500
        </button>
      `
    },


    house: {
      title: "House",

      html: `
        <div class="phone-card">
          <h3>${escapeHTML(player.houseType)}</h3>
          <p>This is your current home.</p>
          <p>Your future choices can upgrade your lifestyle.</p>
        </div>
      `
    },


    market: {
      title: "Market",

      html: `
        <div class="phone-card">
          <h3>City Market</h3>
          <p>Food, clothing, furniture and lifestyle items will appear here.</p>
        </div>

        <button class="phone-action" data-phone-action="food">
          Buy Food — ₦300
        </button>
      `
    },


    messages: {
      title: "Messages",

      html: `
        <div class="phone-card">
          <h3>No new messages</h3>
          <p>People you meet around Life City will eventually be able to contact you here.</p>
        </div>
      `
    },


    social: {
      title: "Social",

      html: `
        <div class="phone-card">
          <h3>Social Circle</h3>
          <p>Friends, enemies, family members and relationships will appear here.</p>
        </div>
      `
    },


    jobs: {
      title: "Jobs",

      html: `
        <div class="phone-card">
          <h3>Available Work</h3>
          <p>Take jobs to earn money and build your reputation.</p>
        </div>

        <button class="phone-action" data-phone-action="work">
          Work Shift — Earn ₦500
        </button>
      `
    },


    news: {
      title: "News",

      html: `
        <div class="phone-card">
          <h3>Life City News</h3>
          <p>Nothing major is happening right now.</p>
          <p>The city's story will change as you make decisions.</p>
        </div>
      `
    },


    dessert: {
      title: "Dessert Dash",

      html: `
        <div class="phone-card">
          <h3>Dessert Dash</h3>
          <p>A small game where you collect desserts before time runs out.</p>
        </div>

        <button class="phone-action" data-phone-action="dessert">
          START GAME
        </button>
      `
    },


    training: {
      title: "Training",

      html: `
        <div class="phone-card">
          <h3>Combat Training</h3>
          <p>Practice your skills before entering dangerous situations.</p>
          <p>Ammo: ${Game.combat.ammo}</p>
        </div>

        <button class="phone-action" data-phone-action="train">
          TRAIN
        </button>
      `
    }

  };


  const data =
    appData[app];


  if (!data) {
    return;
  }


  if (appTitle) {
    appTitle.textContent =
      data.title;
  }


  if (appContent) {

    appContent.innerHTML =
      data.html;


    appContent
      .querySelectorAll(
        "[data-phone-action]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            handlePhoneAction(
              button.dataset.phoneAction
            );

          }
        );

      });

  }

   }
/* =====================================================
   PHONE ACTIONS
===================================================== */

function handlePhoneAction(action) {

  if (action === "work") {

    player.money += 500;

    player.energy =
      Math.max(
        0,
        player.energy - 10
      );

    saveGame();

    updatePlayerInterface();

    showToast(
      "You earned ₦500."
    );

    return;
  }


  if (action === "food") {

    if (player.money < 300) {

      showToast(
        "You need ₦300."
      );

      return;

    }


    player.money -= 300;

    player.hunger =
      Math.min(
        100,
        player.hunger + 25
      );


    saveGame();

    updatePlayerInterface();

    showToast(
      "You bought food."
    );

    return;
  }


  if (action === "train") {

    player.energy =
      Math.max(
        0,
        player.energy - 8
      );


    player.health =
      Math.min(
        100,
        player.health + 2
      );


    Game.combat.ammo =
      Math.min(
        30,
        Game.combat.ammo + 2
      );


    saveGame();

    updatePlayerInterface();

    showToast(
      "Training complete."
    );

    return;
  }


  if (action === "dessert") {

    startDessertDash();

    return;
  }

}


/* =====================================================
   PHONE PROFILE
===================================================== */

function updatePhoneProfile() {

  if (miniAvatar) {

    miniAvatar.textContent =
      player.nickname
        ? player.nickname
            .charAt(0)
            .toUpperCase()
        : "?";

  }


  if (miniName) {

    miniName.textContent =
      player.nickname ||
      "Unknown";

  }


  if (miniIdentity) {

    miniIdentity.textContent =
      player.identity ||
      "New in the city";

  }

}


/* =====================================================
   UPDATE PLAYER INTERFACE
===================================================== */

function updatePlayerInterface() {

  if (locationLabel) {

    locationLabel.textContent =
      Game.currentLocation.toUpperCase();

  }


  if (dayLabel) {

    dayLabel.textContent =
      Game.worldDay;

  }


  if (moneyDisplay) {

    moneyDisplay.textContent =
      formatMoney(player.money);

  }


  updateNeeds();

  updateWanted();

  updatePhoneProfile();

}


/* =====================================================
   NEEDS
===================================================== */

function updateNeeds() {

  if (hungerBar) {

    hungerBar.style.width =
      `${clamp(player.hunger, 0, 100)}%`;

  }


  if (energyBar) {

    energyBar.style.width =
      `${clamp(player.energy, 0, 100)}%`;

  }


  if (hygieneBar) {

    hygieneBar.style.width =
      `${clamp(player.hygiene, 0, 100)}%`;

  }

}


/* =====================================================
   GAME UPDATE
===================================================== */

function updateGame(delta) {

  updatePlayerMovement(delta);

  updateNPCs(delta);

  updateNeedsOverTime(delta);

  updateCombat(delta);

  updatePhoneClock();

  updatePlayerInterface();

}


/* =====================================================
   NEEDS OVER TIME
===================================================== */

function updateNeedsOverTime(delta) {

  if (!Game.gameStarted) {
    return;
  }


  player.hunger =
    Math.max(
      0,
      player.hunger -
        delta * 0.015
    );


  player.hygiene =
    Math.max(
      0,
      player.hygiene -
        delta * 0.008
    );


  if (
    player.hunger <= 10 ||
    player.hygiene <= 5
  ) {

    player.health =
      Math.max(
        0,
        player.health -
          delta * 0.2
      );

  }

}


/* =====================================================
   COMBAT UPDATE
===================================================== */

function updateCombat(delta) {

  if (
    Game.combat.cooldown >
    0
  ) {

    Game.combat.cooldown =
      Math.max(
        0,
        Game.combat.cooldown -
          delta
      );

  }


  if (
    Game.combat.wanted >
    0
  ) {

    Game.combat.wanted =
      Math.max(
        0,
        Game.combat.wanted -
          delta * 0.002
      );

  }

}

/* =====================================================
   PHONE CLOCK
===================================================== */

function updatePhoneClock() {

  if (!phoneTime) {
    return;
  }


  const now =
    new Date();


  phoneTime.textContent =
    now.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}


/* =====================================================
   DESSERT DASH
===================================================== */

function startDessertDash() {

  if (
    Game.foodGame.active
  ) {

    showToast(
      "Dessert Dash is already running."
    );

    return;
  }


  Game.foodGame.active =
    true;

  Game.foodGame.score =
    0;

  Game.foodGame.lives =
    3;

  Game.foodGame.time =
    30;


  showToast(
    "Dessert Dash started!"
  );


  clearInterval(
    Game.foodGame.timer
  );


  Game.foodGame.timer =
    setInterval(
      () => {

        Game.foodGame.time--;


        if (
          Game.foodGame.time <= 0
        ) {

          endDessertDash();

        }

      },
      1000
    );

}


/* =====================================================
   END DESSERT DASH
===================================================== */

function endDessertDash() {

  clearInterval(
    Game.foodGame.timer
  );


  Game.foodGame.timer =
    null;


  Game.foodGame.active =
    false;


  const reward =
    Game.foodGame.score *
    100;


  player.money +=
    reward;


  saveGame();

  updatePlayerInterface();


  showToast(
    `Dessert Dash finished. You earned ₦${formatMoney(reward)}.`
  );

}


/* =====================================================
   UTILITY
===================================================== */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function formatMoney(value) {

  return Math.round(
    Number(value) || 0
  ).toLocaleString(
    "en-NG"
  );

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   AUTO SAVE
===================================================== */

setInterval(
  () => {

    if (Game.gameStarted) {
      saveGame();
    }

  },
  15000
);


/* =====================================================
   INITIAL UI
===================================================== */

updatePlayerInterface();


/* =====================================================
   DEBUG MESSAGE
===================================================== */

console.log(
  "Life City script loaded successfully."
);
