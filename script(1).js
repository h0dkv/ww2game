const leaders = [
    { name: "Winston Churchill", country: "United Kingdom", img: "https://media.gettyimages.com/id/3432929/photo/prime-minister-of-great-britain-winston-churchill-makes-his-ve-day-broadcast-to-the-world.jpg?s=612x612&w=0&k=20&c=GI9AdVXamVUKYU2O772iDdkxp0vOmWiQa0gg2LwLpVQ=", hp: 100, abilities: [{name: "Inspire", effect: "heal", value: 20, cooldown: 3, currentCooldown: 0}] },
    { name: "Franklin D. Roosevelt", country: "United States", img: "https://media.gettyimages.com/id/3252562/photo/franklin-delano-roosevelt-the-32nd-president-of-the-united-states-from-1933-45-a-democrat.jpg?s=612x612&w=0&k=20&c=8F8kLhS7mDVO8zVq1i3mXyupf5g8y5EzJfrRzK7GOWU=", hp: 100, abilities: [{name: "New Deal", effect: "heal", value: 15, cooldown: 2, currentCooldown: 0}] },
    { name: "Joseph Stalin", country: "Soviet Union", img: "https://media.gettyimages.com/id/527191260/photo/portrait-of-joseph-stalin.jpg?s=612x612&w=0&k=20&c=GI9AdVXamVUKYU2O772iDdkxp0vOmWiQa0gg2LwLpVQ=", hp: 100, abilities: [{name: "Iron Fist", effect: "damage", value: 25, cooldown: 4, currentCooldown: 0}] },
    { name: "Adolf Hitler", country: "Germany", img: "https://media.gettyimages.com/id/119505258/photo/adolf-hitler-in-munich-in-the-spring-of-1932.jpg?s=612x612&w=0&k=20&c=SPyMava8n_tHW4Dm5ygM1GNYZwjIv0V-jw9Nm7m0G6g=", hp: 100, abilities: [{name: "Blitzkrieg", effect: "damage", value: 30, cooldown: 5, currentCooldown: 0}] },
    { name: "Benito Mussolini", country: "Italy", img: "https://media.gettyimages.com/id/107708027/photo/italy-a-portrait-of-the-duce-benito-mussolini-between-1937-and-1940-portrait-of-the-duce.jpg?s=612x612&w=0&k=20&c=GJ9XhEFm5OQzPZyV_KnM5L6Xz5FZk7G4n0zNfZ5oXkM=", hp: 100, abilities: [{name: "Propaganda", effect: "heal", value: 10, cooldown: 1, currentCooldown: 0}] },
    { name: "Hideki Tojo", country: "Japan", img: "https://media.gettyimages.com/id/515361304/photo/former-japanese-premier-hideki-tojo-shot-himself-on-september-11-inflicting-a-serious-wound.jpg?s=612x612&w=0&k=20&c=GI9AdVXamVUKYU2O772iDdkxp0vOmWiQa0gg2LwLpVQ=", hp: 100, abilities: [{name: "Kamikaze", effect: "damage", value: 35, cooldown: 6, currentCooldown: 0}] }
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

    speakVoiceline(playerLeader.voiceline);

    document.getElementById("leader-selection").style.display = "none";
    pickedLeaders.style.display = "block";
    battleSection.style.display = "block";

    updateLeaderDisplay(playerLeader, playerLeaderDiv);
    updateLeaderDisplay(enemyLeader, enemyLeaderDiv);

    resultText.innerHTML = `<strong>You are playing as ${playerLeader.name}.</strong><br> Your opponent is <strong>${enemyLeader.name}</strong>. Choose your strategy!`;

    document.querySelectorAll(".choice").forEach(button => {
        button.onclick = () => playRound(button.dataset.choice);
    });
}

function updateLeaderDisplay(leader, element) {
    element.innerHTML = `
        <div class="picked-leader">
            <img src="${leader.img}" alt="${leader.name}">
            <p>${leader.name} (${leader.country})</p>
            <p>HP: ${leader.hp}</p>
            <p>Ability: ${leader.abilities[0].name} (${leader.abilities[0].currentCooldown > 0 ? leader.abilities[0].currentCooldown + ' turns left' : 'Ready'})</p>
        </div>
    `;
}

function playRound(playerChoice) {
    const enemyChoice = choices[Math.floor(Math.random() * choices.length)];
    const outcome = getBattleOutcome(playerChoice, enemyChoice);

    resultText.innerHTML = `
        You chose <strong>${playerChoice}</strong>.<br>
        ${enemyLeader.name} chose <strong>${enemyChoice}</strong>.<br>
        <strong>${outcome}</strong>
    `;

    restartButton.style.display = playerLeader.hp <= 0 || enemyLeader.hp <= 0 ? "block" : "none";

    updateLeaderDisplay(playerLeader, playerLeaderDiv);
    updateLeaderDisplay(enemyLeader, enemyLeaderDiv);
}

function getBattleOutcome(playerChoice, enemyChoice) {
    if (playerChoice === "Use Ability" && playerLeader.abilities[0].currentCooldown === 0) {
        useAbility(playerLeader, enemyLeader);
    } else if (enemyChoice === "Use Ability" && enemyLeader.abilities[0].currentCooldown === 0) {
        useAbility(enemyLeader, playerLeader);
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

    return playerLeader.hp <= 0 ? "Defeat! Your leader has fallen." : enemyLeader.hp <= 0 ? "Victory! The enemy leader has fallen." : "The battle continues...";
}

function useAbility(user, target) {
    const ability = user.abilities[0];
    if (ability.effect === "damage") {
        target.hp -= ability.value;
    } else if (ability.effect === "heal") {
        user.hp += ability.value;
    }
    ability.currentCooldown = ability.cooldown;
    user.abilities[0].currentCooldown--;

    return `${user.name} used ${ability.name}!`;
}

// Restart game
restartButton.onclick = () => location.reload();

function speakVoiceline(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported in this browser.');
    }
}