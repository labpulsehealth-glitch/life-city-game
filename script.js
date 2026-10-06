/* =====================================================
   LIFE CITY
   COMPLETE 3D BROWSER GAME FOUNDATION

   Engine:
   Babylon.js

   Systems:
   - 3D world
   - character
   - movement
   - registration
   - hidden traits
   - family generation
   - house
   - furniture
   - phone
   - market
   - food
   - jobs
   - social
   - news
   - Dessert Dash
   - fictional combat/training
   - wanted system
   - saving
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
   GENDER + CONTINUE
===================================================== */

const genderOptions = document.querySelectorAll(
  'input[name="gender"]'
);

genderOptions.forEach(input => {
  input.addEventListener("change", function () {
    selectedGender = this.value;

    document
      .querySelectorAll(".gender-card")
      .forEach(card => {
        card.classList.remove("selected");
      });

    this.closest(".gender-card")
      .classList.add("selected");
  });
});


const continueBtn =
  document.getElementById("continueBtn");


continueBtn.addEventListener("click", function () {

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


  if (!age || age < 16 || age > 80) {
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


  /* SAVE BASIC INFORMATION */

  player.nickname = nickname;
  player.age = age;
  player.gender = chosenGender.value;


  /* MOVE TO QUESTIONS */

  basicInformation.classList.add("hidden");

  questionsScreen.classList.remove("hidden");

  questionIndex = 0;

  showQuestion();

});
/* =====================================================
   PLAYER
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


let player =
  JSON.parse(
    localStorage.getItem(
      "lifeCityPlayer"
    )
  ) ||
  structuredClone(defaultPlayer);


let population =
  JSON.parse(
    localStorage.getItem(
      "lifeCityPopulation"
    )
  ) ||
  {};


/* =====================================================
   SAVE
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
   DOM
===================================================== */

const canvas =
  document.getElementById(
    "gameCanvas"
  );

const registration =
  document.getElementById(
    "registration"
  );

const basicInformation =
  document.getElementById(
    "basicInformation"
  );

const questionsScreen =
  document.getElementById(
    "questions"
  );

const lifeReveal =
  document.getElementById(
    "lifeReveal"
  );

const continueBtn =
  document.getElementById(
    "continueBtn"
  );

const enterCity =
  document.getElementById(
    "enterCity"
  );


/* =====================================================
   BABYLON INITIALIZATION
===================================================== */

function initializeEngine() {

  Game.engine =
    new BABYLON.Engine(
      canvas,
      true,
      {
        preserveDrawingBuffer: true,
        stencil: true
      },
      true
    );


  Game.scene =
    new BABYLON.Scene(
      Game.engine
    );


  Game.scene.clearColor =
    new BABYLON.Color4(
      0.035,
      0.05,
      0.07,
      1
    );


  createCamera();

  createLighting();

  createCity();

  createPlayer();

  createNPCs();

  setupInput();

  setupMobileControls();

  Game.engine.runRenderLoop(
    gameLoop
  );


  window.addEventListener(
    "resize",
    () => {
      Game.engine.resize();
    }
  );

}


/* =====================================================
   CAMERA
===================================================== */

function createCamera() {

  Game.camera =
    new BABYLON.FollowCamera(
      "followCamera",
      new BABYLON.Vector3(
        0,
        8,
        -12
      ),
      Game.scene
    );


  Game.camera.radius = 11;

  Game.camera.heightOffset = 7;

  Game.camera.rotationOffset = 180;

  Game.camera.cameraAcceleration = .05;

  Game.camera.maxCameraSpeed = 15;

  Game.camera.fov = .8;

}


/* =====================================================
   LIGHT
===================================================== */

function createLighting() {

  const light =
    new BABYLON.HemisphericLight(
      "cityLight",
      new BABYLON.Vector3(
        0,
        1,
        0
      ),
      Game.scene
    );

  light.intensity = 1.15;


  const sun =
    new BABYLON.DirectionalLight(
      "sun",
      new BABYLON.Vector3(
        -0.5,
        -1,
        -0.5
      ),
      Game.scene
    );

  sun.intensity = .8;

}


/* =====================================================
   MATERIAL
===================================================== */

function material(
  name,
  color
) {

  const mat =
    new BABYLON.StandardMaterial(
      name,
      Game.scene
    );

  mat.diffuseColor =
    BABYLON.Color3.FromHexString(
      color
    );

  return mat;

}


/* =====================================================
   CITY
===================================================== */

function createCity() {

  const ground =
    BABYLON.MeshBuilder.CreateGround(
      "cityGround",
      {
        width: 120,
        height: 120
      },
      Game.scene
    );

  ground.material =
    material(
      "groundMat",
      "#24352d"
    );


  /* ROAD */

  createBox(
    "mainRoad",
    120,
    .15,
    10,
    0,
    .05,
    0,
    "#252a32"
  );


  createBox(
    "crossRoad",
    10,
    .16,
    120,
    0,
    .06,
    0,
    "#252a32"
  );


  /* CITY BLOCKS */

  createBuilding(
    "Market",
    -25,
    4,
    -25,
    14,
    8,
    14,
    "#7c3aed"
  );


  createBuilding(
    "Cafe",
    25,
    3,
    -25,
    12,
    6,
    12,
    "#92400e"
  );


  createBuilding(
    "Police Station",
    -25,
    4,
    25,
    15,
    8,
    12,
    "#334155"
  );


  createBuilding(
    "Hospital",
    25,
    5,
    25,
    15,
    10,
    13,
    "#e5e7eb"
  );


  createBuilding(
    "City Hall",
    0,
    5,
    38,
    20,
    10,
    12,
    "#64748b"
  );


  /* HOUSES */

  createHouse(
    -42,
    -40,
    "Russo Estate",
    "#7f1d1d",
    "Mansion"
  );


  createHouse(
    42,
    -40,
    "Varelli Estate",
    "#312e81",
    "Mansion"
  );


  createHouse(
    -42,
    40,
    "Moretti Estate",
    "#78350f",
    "Luxury Estate"
  );


  createHouse(
    42,
    40,
    "Bellini Estate",
    "#581c87",
    "Luxury Estate"
  );


  /* PARK */

  createPark(
    0,
    -35
  );

}


/* =====================================================
   BOX
===================================================== */

function createBox(
  name,
  width,
  height,
  depth,
  x,
  y,
  z,
  color
) {

  const mesh =
    BABYLON.MeshBuilder.CreateBox(
      name,
      {
        width,
        height,
        depth
      },
      Game.scene
    );

  mesh.position =
    new BABYLON.Vector3(
      x,
      y,
      z
    );

  mesh.material =
    material(
      name + "Material",
      color
    );

  return mesh;

}


/* =====================================================
   BUILDING
===================================================== */

function createBuilding(
  name,
  x,
  y,
  z,
  width,
  height,
  depth,
  color
) {

  const building =
    createBox(
      name,
      width,
      height,
      depth,
      x,
      y,
      z,
      color
    );

  Game.buildings.push(
    building
  );


  const sign =
    BABYLON.MeshBuilder.CreatePlane(
      name + "Sign",
      {
        width: 6,
        height: 1.5
      },
      Game.scene
    );

  sign.position =
    new BABYLON.Vector3(
      x,
      height + 1,
      z - depth / 2 - .1
    );

  const signMat =
    new BABYLON.StandardMaterial(
      name + "SignMaterial",
      Game.scene
    );

  signMat.diffuseColor =
    BABYLON.Color3.FromHexString(
      "#111827"
    );

  sign.material =
    signMat;


  return building;

}


/* =====================================================
   HOUSE
===================================================== */

function createHouse(
  x,
  z,
  name,
  color,
  type
) {

  const house =
    createBuilding(
      name,
      x,
      4,
      z,
      type === "Luxury Estate"
        ? 18
        : 15,
      8,
      type === "Luxury Estate"
        ? 18
        : 15,
      color
    );


  house.metadata = {

    house: true,

    houseName: name,

    houseType: type

  };

}


/* =====================================================
   PARK
===================================================== */

function createPark(
  x,
  z
) {

  const grass =
    createBox(
      "Park",
      25,
      .2,
      20,
      x,
      .1,
      z,
      "#166534"
    );


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const tree =
      BABYLON.MeshBuilder.CreateCylinder(
        "TreeTrunk",
        {
          diameter: .7,
          height: 3
        },
        Game.scene
      );

    tree.position =
      new BABYLON.Vector3(
        x + Math.random() * 20 - 10,
        1.5,
        z + Math.random() * 16 - 8
      );

    tree.material =
      material(
        "trunk" + i,
        "#78350f"
      );


    const leaves =
      BABYLON.MeshBuilder.CreateSphere(
        "TreeLeaves",
        {
          diameter: 3
        },
        Game.scene
      );

    leaves.position =
      tree.position.clone();

    leaves.position.y = 3.5;

    leaves.material =
      material(
        "leaves" + i,
        "#15803d"
      );

  }

}


/* =====================================================
   3D PLAYER
===================================================== */

function createPlayer() {

  const root =
    new BABYLON.TransformNode(
      "Player",
      Game.scene
    );


  const skin =
    material(
      "playerSkin",
      player.gender === "male"
        ? "#a86f52"
        : "#9a6249"
    );


  const clothes =
    material(
      "playerClothes",
      "#0f766e"
    );


  const head =
    BABYLON.MeshBuilder.CreateSphere(
      "PlayerHead",
      {
        diameter: 1.1
      },
      Game.scene
    );

  head.parent = root;

  head.position.y = 2.65;

  head.material = skin;


  const body =
    createBox(
      "PlayerBody",
      1.05,
      1.45,
      .65,
      0,
      1.65,
      0,
      "#0f766e"
    );

  body.parent = root;

  body.position =
    new BABYLON.Vector3(
      0,
      1.65,
      0
    );


  const leftLeg =
    createBox(
      "LeftLeg",
      .35,
      1.25,
      .4,
      0,
      0,
      0,
      "#172033"
    );

  leftLeg.parent = root;

  leftLeg.position =
    new BABYLON.Vector3(
      -.27,
      .55,
      0
    );


  const rightLeg =
    createBox(
      "RightLeg",
      .35,
      1.25,
      .4,
      0,
      0,
      0,
      "#172033"
    );

  rightLeg.parent = root;

  rightLeg.position =
    new BABYLON.Vector3(
      .27,
      .55,
      0
    );


  Game.playerMesh =
    root;

  Game.playerParts = {

    head,

    body,

    leftLeg,

    rightLeg

  };


  Game.camera.lockedTarget =
    root;


  root.position =
    new BABYLON.Vector3(
      0,
      0,
      0
    );

}


/* =====================================================
   NPC
===================================================== */

function createNPC(
  x,
  z,
  name
) {

  const root =
    new BABYLON.TransformNode(
      "NPC_" + name,
      Game.scene
    );


  const skin =
    material(
      "npcSkin" + name,
      "#a56a4e"
    );


  const head =
    BABYLON.MeshBuilder.CreateSphere(
      "npcHead" + name,
      {
        diameter: .9
      },
      Game.scene
    );

  head.parent = root;

  head.position.y = 2.3;

  head.material = skin;


  const body =
    createBox(
      "npcBody" + name,
      .9,
      1.3,
      .6,
      0,
      1.35,
      0,
      "#475569"
    );

  body.parent = root;


  root.position =
    new BABYLON.Vector3(
      x,
      0,
      z
    );


  Game.npcs.push({

    mesh: root,

    name,

    direction:
      Math.random() * Math.PI * 2,

    timer: 0

  });

}


/* =====================================================
   NPCS
===================================================== */

function createNPCs() {

  const names = [

    "Ayo",
    "Maya",
    "David",
    "Lena",
    "Marcus",
    "Tobi",
    "Nora",
    "Daniel"

  ];


  names.forEach(
    (name, index) => {

      createNPC(
        Math.random() * 50 - 25,
        Math.random() * 50 - 25,
        name + index
      );

    }
  );

}


/* =====================================================
   INPUT
===================================================== */

function setupInput() {

  window.addEventListener(
    "keydown",
    event => {

      Game.keys[
        event.key.toLowerCase()
      ] = true;


      if (
        event.key.toLowerCase() === "e"
      ) {

        interact();

      }


      if (
        event.key.toLowerCase() === "f"
      ) {

        fireWeapon();

      }


      if (
        event.key.toLowerCase() === "p"
      ) {

        togglePhone();

      }

    }
  );


  window.addEventListener(
    "keyup",
    event => {

      Game.keys[
        event.key.toLowerCase()
      ] = false;

    }
  );

}


/* =====================================================
   MOBILE CONTROLS
===================================================== */

function setupMobileControls() {

  document
    .querySelectorAll(
      "[data-move]"
    )
    .forEach(button => {

      const direction =
        button.dataset.move;


      const start =
        event => {

          event.preventDefault();

          if (
            direction === "up"
          ) Game.movement.z = 1;

          if (
            direction === "down"
          ) Game.movement.z = -1;

          if (
            direction === "left"
          ) Game.movement.x = -1;

          if (
            direction === "right"
          ) Game.movement.x = 1;

        };


      const stop =
        event => {

          event.preventDefault();

          if (
            direction === "up" ||
            direction === "down"
          ) {

            Game.movement.z = 0;

          }

          if (
            direction === "left" ||
            direction === "right"
          ) {

            Game.movement.x = 0;

          }

        };


      button.addEventListener(
        "pointerdown",
        start
      );

      button.addEventList
