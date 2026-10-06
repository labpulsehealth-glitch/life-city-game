/* =========================================
   LIFE CITY
   VERSION 0.1
========================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* =========================================
   GAME STATE
========================================= */

const defaultState = {
  name: "Unknown",
  money: 25000,

  hunger: 100,
  energy: 100,
  hygiene: 100,

  hour: 8,
  minute: 0,

  x: 500,
  y: 400,

  personality: {
    ambition: 0,
    courage: 0,
    kindness: 0,
    intelligence: 0,
    loyalty: 0,
    risk: 0
  },

  origin: "unknown"
};

let state =
  JSON.parse(localStorage.getItem("lifeCitySave")) ||
  structuredClone(defaultState);


/* =========================================
   SAVE
========================================= */

function saveGame() {
  localStorage.setItem(
    "lifeCitySave",
    JSON.stringify(state)
  );
}


/* =========================================
   CHARACTER QUESTIONS
========================================= */

const questions = [
  {
    question:
      "You find a wallet containing ₦50,000 on your way home. What do you do?",

    answers: [
      {
        text: "Try to find the owner.",
        traits: { kindness: 2, loyalty: 1 }
      },
      {
        text: "Keep it. Nobody saw you.",
        traits: { risk: 1, ambition: 1 }
      },
      {
        text: "Take the money but throw away the wallet.",
        traits: { risk: 2 }
      },
      {
        text: "Ask someone you trust what to do.",
        traits: { loyalty: 1, intelligence: 1 }
      }
    ]
  },

  {
    question:
      "Someone insults you publicly. How do you react?",

    answers: [
      {
        text: "Ignore them and walk away.",
        traits: { intelligence: 1, patience: 1 }
      },
      {
        text: "Confront them immediately.",
        traits: { courage: 2, risk: 1 }
      },
      {
        text: "Smile and remember it.",
        traits: { intelligence: 1, ambition: 1 }
      },
      {
        text: "Ask why they feel that way.",
        traits: { kindness: 1, intelligence: 1 }
      }
    ]
  },

  {
    question:
      "You discover that your closest friend has betrayed you.",

    answers: [
      {
        text: "Forgive them.",
        traits: { kindness: 2 }
      },
      {
        text: "Cut them off completely.",
        traits: { loyalty: 1, courage: 1 }
      },
      {
        text: "Find out why they did it first.",
        traits: { intelligence: 2 }
      },
      {
        text: "Plan your revenge.",
        traits: { ambition: 1, risk: 2 }
      }
    ]
  },

  {
    question:
      "You are offered a risky opportunity that could make you rich.",

    answers: [
      {
        text: "Take the chance.",
        traits: { risk: 2, ambition: 2 }
      },
      {
        text: "Research everything first.",
        traits: { intelligence: 2 }
      },
      {
        text: "Ask someone experienced for advice.",
        traits: { loyalty: 1, intelligence: 1 }
      },
      {
        text: "Stay away from it.",
        traits: { patience: 1 }
      }
    ]
  },

  {
    question:
      "Your family is struggling financially. You have a chance to help them, but it could get you into trouble.",

    answers: [
      {
        text: "Do whatever it takes.",
        traits: { loyalty: 2, courage: 1, risk: 1 }
      },
      {
        text: "Find a legal way to help.",
        traits: { intelligence: 2, kindness: 1 }
      },
      {
        text: "Refuse to put yourself in danger.",
        traits: { intelligence: 1 }
      },
      {
        text: "Take the risk, but secretly.",
        traits: { risk: 2, loyalty: 1 }
      }
    ]
  }
];

let currentQuestion = 0;


/* =========================================
   INTRO
========================================= */

function showQuestion() {

  const question = questions[currentQuestion];

  document.getElementById("question").textContent =
    question.question;

  const answers =
    document.getElementById("answers");

  answers.innerHTML = "";

  question.answers.forEach(answer => {

    const button = document.createElement("button");

    button.className = "answer";

    button.textContent = answer.text;

    button.onclick = () => chooseAnswer(answer);

    answers.appendChild(button);

  });

  document.getElementById("introProgress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;
}


function chooseAnswer(answer) {

  Object.entries(answer.traits).forEach(([trait, value]) => {

    if (state.personality[trait] !== undefined) {
      state.personality[trait] += value;
    }

  });

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    finishCharacterCreation();
  } else {
    showQuestion();
  }
}


/* =========================================
   CHARACTER RESULT
========================================= */

function finishCharacterCreation() {

  const traits = state.personality;

  const scores = Object.entries(traits)
    .sort((a, b) => b[1] - a[1]);

  const strongest = scores[0][0];

  const names = {
    ambition: "The Ambitious One",
    courage: "The Fearless One",
    kindness: "The Heart",
    intelligence: "The Strategist",
    loyalty: "The Loyal One",
    risk: "The Wild Card"
  };

  state.origin = names[strongest];

  document.querySelector(".intro-card").innerHTML = `

    <span class="eyebrow">YOUR STORY BEGINS</span>

    <h1>${state.origin}</h1>

    <p>
      You didn't choose this personality.
      Your decisions created it.
    </p>

    <div class="app-card">
      <strong>Your strongest trait</strong>
      <p>${names[strongest]}</p>
    </div>

    <button
      class="app-action"
      id="startGame"
    >
      Enter the City
    </button>

  `;

  document
    .getElementById("startGame")
    .onclick = startGame;

  saveGame();
}


function startGame() {

  document
    .getElementById("introScreen")
    .classList.add("hidden");

  showToast(
    `You are ${state.origin}. Your story begins.`
  );

  updateUI();

  saveGame();
}


/* =========================================
   PLAYER
========================================= */

const player = {
  width: 30,
  height: 40,
  speed: 4
};

const keys = {};

document.addEventListener("keydown", e => {

  keys[e.key.toLowerCase()] = true;

});

document.addEventListener("keyup", e => {

  keys[e.key.toLowerCase()] = false;

});


function movePlayer() {

  let moving = false;

  if (keys["w"] || keys["arrowup"]) {
    state.y -= player.speed;
    moving = true;
  }

  if (keys["s"] || keys["arrowdown"]) {
    state.y += player.speed;
    moving = true;
  }

  if (keys["a"] || keys["arrowleft"]) {
    state.x -= player.speed;
    moving = true;
  }

  if (keys["d"] || keys["arrowright"]) {
    state.x += player.speed;
    moving = true;
  }

  if (moving) {

    state.energy -= 0.006;
    state.hunger -= 0.002;
    state.hygiene -= 0.001;

  }

  state.x = Math.max(25, Math.min(state.x, width - 25));
  state.y = Math.max(80, Math.min(state.y, height - 25));

}


/* =========================================
   MOBILE CONTROLS
========================================= */

document.querySelectorAll(".controls button")
  .forEach(button => {

    const key = button.dataset.key;

    let actualKey = key;

    if (key === "up") actualKey = "arrowup";
    if (key === "down") actualKey = "arrowdown";
    if (key === "left") actualKey = "arrowleft";
    if (key === "right") actualKey = "arrowright";

    button.addEventListener("touchstart", e => {
      e.preventDefault();
      keys[actualKey] = true;
    });

    button.addEventListener("touchend", e => {
      e.preventDefault();
      keys[actualKey] = false;
    });

    button.addEventListener("mousedown", () => {
      keys[actualKey] = true;
    });

    button.addEventListener("mouseup", () => {
      keys[actualKey] = false;
    });

  });


/* =========================================
   WORLD DRAWING
========================================= */

function drawWorld() {

  ctx.clearRect(0, 0, width, height);

  /* GRASS */

  ctx.fillStyle = "#71856b";
  ctx.fillRect(0, 0, width, height);


  /* ROADS */

  ctx.fillStyle = "#4d5050";

  ctx.fillRect(
    0,
    height * .55,
    width,
    120
  );

  ctx.fillRect(
    width * .55,
    58,
    120,
    height
  );


  /* ROAD LINES */

  ctx.strokeStyle = "#c5b76c";
  ctx.lineWidth = 4;
  ctx.setLineDash([25, 20]);

  ctx.beginPath();

  ctx.moveTo(0, height * .61);
  ctx.lineTo(width, height * .61);

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(width * .61, 58);
  ctx.lineTo(width * .61, height);

  ctx.stroke();

  ctx.setLineDash([]);


  /* HOUSE */

  drawHouse(
    110,
    150,
    230,
    150,
    "YOUR HOME"
  );


  /* SHOP */

  drawBuilding(
    width - 300,
    130,
    190,
    140,
    "#8f674f",
    "MARKET"
  );


  /* CAFE */

  drawBuilding(
    100,
    height - 220,
    180,
    120,
    "#7b5367",
    "CAFÉ"
  );


  /* PARK */

  ctx.fillStyle = "#52705a";

  ctx.beginPath();

  ctx.arc(
    width - 180,
    height - 150,
    75,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "#3e5c46";

  ctx.font = "bold 14px Arial";

  ctx.fillText(
    "CITY PARK",
    width - 220,
    height - 145
  );


  /* NPC */

  drawNPC(
    width * .45,
    height * .42
  );


  /* PLAYER */

  drawPlayer(
    state.x,
    state.y
  );

}


function drawHouse(x, y, w, h, label) {

  ctx.fillStyle = "#b99b7d";

  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "#6e4c3d";

  ctx.fillRect(
    x - 10,
    y - 45,
    w + 20,
    50
  );

  ctx.fillStyle = "#26343a";

  ctx.fillRect(
    x + 25,
    y + 35,
    45,
    45
  );

  ctx.fillRect(
    x + w - 70,
    y + 35,
    45,
    45
  );

  ctx.fillStyle = "#4b3025";

  ctx.fillRect(
    x + w / 2 - 20,
    y + h - 60,
    40,
    60
  );

  ctx.fillStyle = "white";

  ctx.font = "bold 13px Arial";

  ctx.fillText(
    label,
    x + 70,
    y + h + 22
  );

}


function drawBuilding(x, y, w, h, color, label) {

  ctx.fillStyle = color;

  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "#d8c38d";

  ctx.fillRect(
    x + 20,
    y + 35,
    40,
    45
  );

  ctx.fillRect(
    x + w - 60,
    y + 35,
    40,
    45
  );

  ctx.fillStyle = "#352a25";

  ctx.fillRect(
    x + w / 2 - 25,
    y + h - 55,
    50,
    55
  );

  ctx.fillStyle = "white";

  ctx.font = "bold 13px Arial";

  ctx.fillText(
    label,
    x + 15,
    y - 10
  );

}


function drawNPC(x, y) {

  /* shadow */

  ctx.fillStyle = "rgba(0,0,0,.2)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y + 22,
    18,
    7,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* body */

  ctx.fillStyle = "#3e5974";

  ctx.fillRect(
    x - 12,
    y,
    24,
    28
  );


  /* head */

  ctx.fillStyle = "#a96f4d";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 8,
    12,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* hair */

  ctx.fillStyle = "#221914";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 13,
    10,
    Math.PI,
    Math.PI * 2
  );

  ctx.fill();

}


function drawPlayer(x, y) {

  /* shadow */

  ctx.fillStyle = "rgba(0,0,0,.25)";

  ctx.beginPath();

  ctx.ellipse(
    x,
    y + 23,
    18,
    7,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* body */

  ctx.fillStyle = "#242b3a";

  ctx.fillRect(
    x - 13,
    y,
    26,
    30
  );


  /* head */

  ctx.fillStyle = "#a96f4d";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 9,
    13,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* hair */

  ctx.fillStyle = "#211a18";

  ctx.beginPath();

  ctx.arc(
    x,
    y - 14,
    11,
    Math.PI,
    Math.PI * 2
  );

  ctx.fill();


  /* eyes */

  ctx.fillStyle = "#111";

  ctx.fillRect(
    x - 6,
    y - 9,
    2,
    2
  );

  ctx.fillRect(
    x + 4,
    y - 9,
    2,
    2
  );

}


/* =========================================
   GAME CLOCK
========================================= */

let lastTime = Date.now();

function updateTime() {

  const now = Date.now();

  if (now - lastTime > 5000) {

    state.minute += 10;

    if (state.minute >= 60) {
      state.minute = 0;
      state.hour++;
    }

    if (state.hour >= 24) {
      state.hour = 0;
    }

    lastTime = now;

    state.hunger -= .2;
    state.energy -= .1;
    state.hygiene -= .1;

    updateUI();

    saveGame();

  }

}


/* =========================================
   UI
========================================= */

function updateUI() {

  document.getElementById("money").textContent =
    Math.floor(state.money).toLocaleString();

  document.getElementById("gameTime").textContent =
    formatTime();

  document.getElementById("phoneTime").textContent =
    formatTime();

  document.getElementById("playerName").textContent =
    state.name;

  document.getElementById("playerStatus").textContent =
    state.origin;

  document.getElementById("hungerBar").style.width =
    `${Math.max(0, state.hunger)}%`;

  document.getElementById("energyBar").style.width =
    `${Math.max(0, state.energy)}%`;

  document.getElementById("hygieneBar").style.width =
    `${Math.max(0, state.hygiene)}%`;

}


function formatTime() {

  return String(state.hour).padStart(2, "0")
    + ":" +
    String(state.minute).padStart(2, "0");

}


/* =========================================
   PHONE
========================================= */

const phone = document.getElementById("phone");

document
  .getElementById("phoneToggle")
  .onclick = () => {

    phone.classList.remove("hidden");

  };


document
  .getElementById("phoneButton")
  .onclick = () => {

    phone.classList.toggle("hidden");

  };


document
  .getElementById("homeButton")
  .onclick = () => {

    document
      .getElementById("phoneHome")
      .classList.remove("hidden");

    document
      .getElementById("appWindow")
      .classList.add("hidden");

  };


document
  .getElementById("appsButton")
  .onclick = () => {

    document
      .getElementById("phoneHome")
      .classList.remove("hidden");

  };


document
  .getElementById("closeApp")
  .onclick = () => {

    document
      .getElementById("appWindow")
      .classList.add("hidden");

    document
      .getElementById("phoneHome")
      .classList.remove("hidden");

  };


/* =========================================
   APPS
========================================= */

document.querySelectorAll(".app")
  .forEach(button => {

    button.addEventListener("click", () => {

      openApp(button.dataset.app);

    });

  });


function openApp(app) {

  const title =
    document.getElementById("appTitle");

  const content =
    document.getElementById("appContent");

  document
    .getElementById("phoneHome")
    .classList.add("hidden");

  document
    .getElementById("appWindow")
    .classList.remove("hidden");


  const apps = {

    profile: {
      title: "Profile",
      html: `
        <div class="app-card">
          <strong>${state.name}</strong>
          <p>${state.origin}</p>
        </div>

        <div class="app-card">
          <strong>Personality</strong>
          <p>
            Ambition: ${state.personality.ambition}<br>
            Courage: ${state.personality.courage}<br>
            Intelligence: ${state.personality.intelligence}<br>
            Loyalty: ${state.personality.loyalty}
          </p>
        </div>
      `
    },

    bank: {
      title: "Bank",
      html: `
        <div class="app-card">
          <strong>Available Balance</strong>
          <p>₦${state.money.toLocaleString()}</p>
        </div>
      `
    },

    house: {
      title: "House",
      html: `
        <div class="app-card">
          <strong>Your Home</strong>
          <p>
            A small starter house.
            Later you will be able to buy larger
            properties and completely furnish them.
          </p>

          <button class="app-action" onclick="enterHouse()">
            Enter House
          </button>
        </div>
      `
    },

    market: {
      title: "Market",
      html: `
        <div class="app-card">
          <strong>Food</strong>
          <p>Buy food and restore hunger.</p>

          <button
            class="app-action"
            onclick="buyFood()"
          >
            Buy Meal — ₦1,000
          </button>
        </div>

        <div class="app-card">
          <strong>Soap</strong>
          <p>Improve your hygiene.</p>

          <button
            class="app-action"
            onclick="buySoap()"
          >
            Buy Soap — ₦500
          </button>
        </div>
      `
    },

    messages: {
      title: "Messages",
      html: `
        <div class="app-card">
          <strong>Unknown Number</strong>
          <p>
            "Welcome to the city. We should talk."
          </p>
        </div>
      `
    },

    social: {
      title: "Social",
      html: `
        <div class="app-card">
          <strong>People Around You</strong>
          <p>
            The city is full of people.
            Some will become friends.
            Some will become enemies.
            Some may completely change your life.
          </p>
        </div>
      `
    },

    jobs: {
      title: "Jobs",
      html: `
        <div class="app-card">
          <strong>Part-time Café Worker</strong>
          <p>Earn ₦5,000.</p>

          <button
            class="app-action"
            onclick="workJob()"
          >
            Work
          </button>
        </div>
      `
    },

    news: {
      title: "City News",
      html: `
        <div class="app-card">
          <strong>City Morning Report</strong>
          <p>
            Life in the city continues as normal...
            for now.
          </p>
        </div>
      `
    }

  };


  const selected = apps[app];

  if (!selected) return;

  title.textContent = selected.title;

  content.innerHTML = selected.html;

}


/* =========================================
   MARKET ACTIONS
========================================= */

function buyFood() {

  if (state.money < 1000) {
    showToast("You don't have enough money.");
    return;
  }

  state.money -= 1000;

  state.hunger =
    Math.min(100, state.hunger + 30);

  updateUI();

  saveGame();

  showToast("You bought a meal.");

}


function buySoap() {

  if (state.money < 500) {
    showToast("You don't have enough money.");
    return;
  }

  state.money -= 500;

  state.hygiene =
    Math.min(100, state.hygiene + 25);

  updateUI();

  saveGame();

  showToast("You bought soap.");

}


function workJob() {

  state.money += 5000;

  state.energy -= 15;
  state.hunger -= 8;

  updateUI();

  saveGame();

  showToast("You earned ₦5,000.");

}


/* =========================================
   HOUSE
========================================= */

function enterHouse() {

  showToast(
    "House interior coming next..."
  );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


/* =========================================
   GAME LOOP
========================================= */

function gameLoop() {

  movePlayer();

  drawWorld();

  updateTime();

  requestAnimationFrame(gameLoop);

}


/* =========================================
   START
========================================= */

updateUI();

if (
  localStorage.getItem("lifeCitySave")
) {

  document
    .getElementById("introScreen")
    .classList.add("hidden");

} else {

  showQuestion();

}

gameLoop();
