const leaders = [
    { name: "Winston Churchill", country: "United Kingdom", img: "https://media.gettyimages.com/id/3432929/photo/prime-minister-of-great-britain-winston-churchill-makes-his-ve-day-broadcast-to-the-world.jpg?s=612x612&w=0&k=20&c=4Wmkd4fxTBCwv17FAa2RO0c0ztemY7BoFJAqZK9M8I8=", voiceline: "Adolf will fall in sigma juice" },
    { name: "Franklin D. Roosevelt", country: "United States", img: "https://media.gettyimages.com/id/3252562/photo/franklin-delano-roosevelt-the-32nd-president-of-the-united-states-from-1933-45-a-democrat-he-led.jpg?s=612x612&w=0&k=20&c=eemysMqyxdzX1Y4d0ktUlyAltVl9gFaXNp9j99FUSGQ=", voiceline: "United States of America, unite!" },
    { name: "Joseph Stalin", country: "Soviet Union", img: "https://media.gettyimages.com/id/527191260/photo/portrait-of-joseph-stalin.jpg?s=612x612&w=0&k=20&c=GI9AdVXamVUKYU2O772iDdkxp0vOmWiQa0gg2LwLtMY=", voiceline: "I,Joseph Stalin will conquer the lands." },
    { name: "Adolf Hitler", country: "Germany", img: "https://media.gettyimages.com/id/119505258/photo/adolf-hitler-in-munich-in-the-spring-of-1932.jpg?s=612x612&w=0&k=20&c=SPyMava8n_tHW4Dm5ygM1GNYZwjC-gv4tEejHV_1GrQ=", voiceline: " They assure us: We cannot take them unless Germany is prepared to allow them a certain amount of capital to bring with them as immigrants." },
    { name: "Benito Mussolini", country: "Italy", img: "https://media.gettyimages.com/id/107708027/photo/italy-a-portrait-of-the-duce-benito-mussolini-between-1937-and-1940-portrait-of-the-duce.jpg?s=612x612&w=0&k=20&c=oIlr_n25KE3Oi36S8xTxc3adcdpvNlBahI-5GNY3qL4=", voiceline: "Mamma mia." },
    { name: "Hideki Tojo", country: "Japan", img: "https://media.gettyimages.com/id/515361304/photo/former-japanese-premier-hideki-tojo-shot-himself-on-september-11-inflicting-a-serious-wound.jpg?s=612x612&w=0&k=20&c=4MHlZ6BhSHVCVD4mQzvCqEexhOCYE2QHYR1SQ18G0qo=", voiceline: "everybody was kung-fu fighting." }
];

const choices = ["Attack", "Defend", "Ambush"];
const leaderSelection = document.getElementById("leaders");
const battleSection = document.getElementById("battle");
const pickedLeaders = document.getElementById("picked-leaders");
const playerLeaderDiv = document.getElementById("player-leader");
const enemyLeaderDiv = document.getElementById("enemy-leader");
const resultText = document.getElementById("result");
const restartButton = document.getElementById("restart");

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
    const playerLeader = leaders[playerIndex];
    const enemyLeader = leaders[Math.floor(Math.random() * leaders.length)];

    speakVoiceline(playerLeader.voiceline);

    document.getElementById("leader-selection").style.display = "none";
    pickedLeaders.style.display = "block";
    battleSection.style.display = "block";

    playerLeaderDiv.innerHTML = `
        <div class="picked-leader">
            <img src="${playerLeader.img}" alt="${playerLeader.name}">
            <p>${playerLeader.name} (${playerLeader.country})</p>
        </div>
    `;

    enemyLeaderDiv.innerHTML = `
        <div class="picked-leader">
            <img src="${enemyLeader.img}" alt="${enemyLeader.name}">
            <p>${enemyLeader.name} (${enemyLeader.country})</p>
        </div>
    `;

    resultText.innerHTML = `<strong>You are playing as ${playerLeader.name}.</strong><br> Your opponent is <strong>${enemyLeader.name}</strong>. Choose your strategy!`;

    document.querySelectorAll(".choice").forEach(button => {
        button.onclick = () => playRound(button.dataset.choice, enemyLeader);
    });
}

function playRound(playerChoice, enemyLeader) {
    const enemyChoice = choices[Math.floor(Math.random() * choices.length)];
    const outcome = getBattleOutcome(playerChoice, enemyChoice);

    resultText.innerHTML = `
        You chose <strong>${playerChoice}</strong>.<br>
        ${enemyLeader.name} chose <strong>${enemyChoice}</strong>.<br>
        <strong>${outcome}</strong>
    `;

    restartButton.style.display = "block";
}

function getBattleOutcome(playerChoice, enemyChoice) {
    const outcomes = {
        "Attack": "Defend",
        "Defend": "Ambush",
        "Ambush": "Attack"
    };

    if (playerChoice === enemyChoice) {
        return "It's a stalemate! Both sides hold their ground.";
    } else if (outcomes[playerChoice] === enemyChoice) {
        return "Victory! Your strategy outmaneuvered the enemy.";
    } else {
        return "Defeat! The enemy anticipated your move.";
    }
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
