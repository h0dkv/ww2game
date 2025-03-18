const leaders = [
    { name: "Winston Churchill", country: "United Kingdom", img: "https://example.com/churchill.jpg", hp: 100, resources: 50, abilities: [{name: "Inspire", effect: "heal", value: 20, cost: 10, cooldown: 3, currentCooldown: 0, voiceLine: "We shall never surrender."}] },
    { name: "Franklin D. Roosevelt", country: "United States", img: "https://example.com/roosevelt.jpg", hp: 100, resources: 50, abilities: [{name: "New Deal", effect: "heal", value: 15, cost: 10, cooldown: 2, currentCooldown: 0, voiceLine: "The only thing we have to fear is fear itself."}] },
    { name: "Joseph Stalin", country: "Soviet Union", img: "https://example.com/stalin.jpg", hp: 100, resources: 50, abilities: [{name: "Iron Fist", effect: "damage", value: 25, cost: 15, cooldown: 4, currentCooldown: 0, voiceLine: "The death of one man is a tragedy, the death of millions is a statistic."}] },
    { name: "Adolf Hitler", country: "Germany", img: "https://example.com/hitler.jpg", hp: 100, resources: 50, abilities: [{name: "Blitzkrieg", effect: "damage", value: 30, cost: 20, cooldown: 5, currentCooldown: 0, voiceLine: "I will make Germany great again."}] },
    { name: "Benito Mussolini", country: "Italy", img: "https://example.com/mussolini.jpg", hp: 100, resources: 50, abilities: [{name: "Propaganda", effect: "heal", value: 10, cost: 5, cooldown: 1, currentCooldown: 0, voiceLine: "It is better to live one day as a lion than 100 years as a sheep."}] },
    { name: "Hideki Tojo", country: "Japan", img: "https://example.com/tojo.jpg", hp: 100, resources: 50, abilities: [{name: "Kamikaze", effect: "damage", value: 35, cost: 25, cooldown: 6, currentCooldown: 0, voiceLine: "Duty is heavier than a mountain, death is lighter than a feather."}] }
];

const choices = ["Attack", "Defend", "Use Ability"];
const leaderSelection = document.getElementById("leaders");
const battleSection = document.getElementById("battle");
const pickedLeaders = document.getElementById("picked-leaders");
const playerLeaderDiv = document.getElementById("player-leader");
const enemyLeaderDiv = document.getElementById("enemy-leader");
const resultText = document.getElementById("result");
const restartButton = document.getElementById("restart");

let playerLeader;
let enemyLeader;
let isPlayerTurn = true;

// Display leader selection buttons with images
leaders.forEach((leader, index) => {
    let leaderDiv = document.createElement("div");
    leaderDiv.classList.add("leader");
    leaderDiv.innerHTML = `
        <img src="${leader.img}" alt="${leader.name}">
        <p>${leader.name} (${leader.country})</p>
    `;
    leaderDiv.onclick = () => startGame(index);
    leaderSelection.appendChild(leaderDiv);
});

function startGame(playerIndex) {
    playerLeader = leaders[playerIndex];
    enemyLeader = leaders[Math.floor(Math.random() * leaders.length)];

    playVoiceLine(playerLeader);

    document.getElementById("leader-selection").style.display = "none";
    pickedLeaders.style.display = "block";
    battleSection.style.display = "block";

    updateLeaderDisplay(playerLeader, playerLeaderDiv);
    updateLeaderDisplay(enemyLeader, enemyLeaderDiv);

    resultText.innerHTML = `<strong>You are playing as ${playerLeader.name}.</strong><br> Your opponent is <strong>${enemyLeader.name}</strong>. Choose your strategy!`;

    document.querySelectorAll(".choice").forEach(button => {
        button.onclick = () => playRound(button.dataset.choice);
    });

    // Start background music
    backgroundMusic.play();
}

function updateLeaderDisplay(leader, element) {
    element.innerHTML = `
        <div class="picked-leader">
            <img src="${leader.img}" alt="${leader.name}">
            <p>${leader.name} (${leader.country})</p>
            <p>HP: ${leader.hp}</p>
            <p>Resources: ${leader.resources}</p>
            <p>Ability: ${leader.abilities[0].name} (${leader.abilities[0].currentCooldown > 0 ? leader.abilities[0].currentCooldown + ' turns left' : 'Ready'})</p>
        </div>
    `;
}

function playRound(playerChoice) {
    if (isPlayerTurn) {
        // Player's turn logic
        const outcome = getBattleOutcome(playerChoice, enemyLeader);
        isPlayerTurn = false;
        resultText.innerHTML = outcome;
    } else {
        // Enemy's turn logic
        enemyTurn();
    }
    updateTurnDisplay();
    // Other logic

    if (playerLeader.hp <= 0 || enemyLeader.hp <= 0) {
        restartButton.style.display = "block";
        if (playerLeader.hp <= 0) {
            resultText.classList.add("defeat");
            resultText.classList.remove("victory");
            playSoundEffect('defeat_sound.mp3');
        } else {
            resultText.classList.add("victory");
            resultText.classList.remove("defeat");
            playSoundEffect('victory_sound.mp3');
        }
    } else {
        restartButton.style.display = "none";
        resultText.classList.remove("victory", "defeat");
    }

    updateLeaderDisplay(playerLeader, playerLeaderDiv);
    updateLeaderDisplay(enemyLeader, enemyLeaderDiv);

    // Regenerate resources
    regenerateResources(playerLeader);
    regenerateResources(enemyLeader);
}

function updateTurnDisplay() {
    if (isPlayerTurn) {
        resultText.innerHTML += `<br>It's your turn!`;
    } else {
        resultText.innerHTML += `<br>It's the enemy's turn!`;
    }
}

function getBattleOutcome(playerChoice, enemyChoice) {
    if (playerChoice === "Use Ability" && playerLeader.abilities[0].currentCooldown === 0) {
        return useAbility(playerLeader, enemyLeader);
    } else if (enemyChoice === "Use Ability" && enemyLeader.abilities[0].currentCooldown === 0) {
        return useAbility(enemyLeader, playerLeader);
    } else {
        const outcomes = {
            "Attack": "Defend",
            "Defend": "Ambush",
            "Ambush": "Attack"
        };

        if (playerChoice === enemyChoice) {
            return "It's a stalemate! Both sides hold their ground.";
        } else if (outcomes[playerChoice] === enemyChoice) {
            enemyLeader.hp -= 10;
            return "Victory! Your strategy outmaneuvered the enemy.";
        } else {
            playerLeader.hp -= 10;
            return "Defeat! The enemy anticipated your move.";
        }
    }
}

function useAbility(user, target) {
    const ability = user.abilities[0];
    if (user.resources >= ability.cost) {
        user.resources -= ability.cost;
        if (ability.effect === "damage") {
            target.hp -= ability.value;
        } else if (ability.effect === "heal") {
            user.hp += ability.value;
        }
        ability.currentCooldown = ability.cooldown;
        user.abilities[0].currentCooldown--;
        return `${user.name} used ${ability.name}! ${user.name} now has ${user.resources} resources left.`;
    } else {
        return `${user.name} does not have enough resources to use ${ability.name}!`;
    }
}

function regenerateResources(leader) {
    leader.resources += 5; // Example regeneration rate
    if (leader.resources > 50) { // Max resources
        leader.resources = 50;
    }
}

function enemyTurn() {
    const enemyChoice = (enemyLeader.resources >= enemyLeader.abilities[0].cost) ? "Use Ability" : choices[Math.floor(Math.random() * choices.length)];
    const outcome = getBattleOutcome(enemyChoice, playerLeader);
    resultText.innerHTML = outcome;
    isPlayerTurn = true;
    updateTurnDisplay();
    // Other logic
}

const backgroundMusic = new Audio('background_music.mp3');
backgroundMusic.loop = true;

function playSoundEffect(effect) {
    const sound = new Audio(effect);
    sound.play();
}

function playVoiceLine(leader) {
    const voiceLine = new Audio(leader.abilities[0].voiceLine);
    voiceLine.play();
}

// Restart game
restartButton.onclick = () => location.reload();
