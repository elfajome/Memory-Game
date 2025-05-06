// Variable Declarations
// --------------------------------
// Select DOM elements for game controls and display
const controlButtons = document.querySelector(".control-buttons");
const myName = document.querySelector(".info-container .name span");
const tries = document.querySelector(".info-container .tries span");
const timer = document.querySelector(".timer span");
const score = document.querySelector(".score span");
const memoryGameBlocks = document.querySelector(".memory-game-blocks");
const restartGame = document.querySelector(".container-rest .restart-game");

// Game settings and state variables
let duration = 1000; // Duration for flipping animations in milliseconds
let time = 60; // Initial game time in seconds
let timerInterval = 0; // Interval ID for the timer
let arrayImg = ['bg.png', 'img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png', 'img6.png', 'kxp_fav.png', 'arab.png', 'egypt.png']; // Array of image filenames
const totalPairs = arrayImg.length; // Total number of unique pairs
let correctPairs = 0; // Counter for matched pairs

// Initial Game Setup
// --------------------------------
// Function to shuffle and create game blocks
function shuffle() {
    // Loop twice to create pairs of each image
    for (let r = 0; r < 2; r++) {
        let RandomIndex = getRandomUniqueValues(arrayImg.length);
        // console.log(RandomIndex); // For debugging
        for (let i = 0; i < arrayImg.length; i++) {
            // console.log(arrayImg[RandomIndex[i]]); // For debugging
            let block = `
                        <div class="game-block" data-technology="${arrayImg[RandomIndex[i]]}">
                            <div class="face front"></div>
                            <div class="face back">
                                <img decoding="async" loading="lazy" src="./imgs/${arrayImg[RandomIndex[i]]}" alt="photo">
                            </div>
                        </div>
                    `;
            memoryGameBlocks.insertAdjacentHTML('beforeend', block);
        }
    }
}

shuffle(); // Initialize the game with shuffled blocks

let blocks = document.querySelectorAll(".game-block"); // Select all game blocks

// Event Listeners
// --------------------------------
// Restart game button event
restartGame.addEventListener('click', () => {
    location.reload(); // Reload the page to reset the game
});

// Start game button event
document.querySelector(".control-buttons span").onclick = function () {
    let yourName = prompt("What's Your Name?"); // Prompt for player name
    const backgroundSound = document.getElementById('backgroundSound');
    backgroundSound.play(); // Start background music
    showBlocksPreview(); // Show preview of blocks
    funTimer(); // Start the game timer
    if (yourName == null || yourName == "") {
        myName.textContent = "Unknown"; // Set default name if none provided
    } else {
        myName.textContent = yourName; // Set player name
    }
    controlButtons.style.display = "none"; // Hide splash screen
};

// Game Functions
// --------------------------------
// Function to show a preview of all blocks for 3 seconds
function showBlocksPreview() {
    memoryGameBlocks.classList.add('no-clicking'); // Prevent interaction during preview
    blocks.forEach(block => {
        block.classList.add('is-flipped'); // Flip all blocks
    });
    setTimeout(() => {
        blocks.forEach(block => {
            block.classList.remove('is-flipped'); // Unflip all blocks
        });
        memoryGameBlocks.classList.remove('no-clicking'); // Allow interaction after preview
    }, 3000); // 3 seconds preview
}

// Function to generate unique random indices
function getRandomUniqueValues(max) {
    if (max < 0) return [];
    const values = new Set();
    while (values.size < max) {
        const randomValue = Math.floor(Math.random() * max); // Generate random value from 0 to max
        values.add(randomValue);
    }
    return [...values]; // Return array of unique values
}

// Add click event to each block
blocks.forEach(block => {
    block.addEventListener('click', () => {
        flipBlock(block); // Handle block flip on click
    });
});

// Function to handle flipping a block
function flipBlock(selectedBlock) {
    selectedBlock.classList.add('is-flipped'); // Flip the selected block
    let allFlippedBlocks = Array.from(blocks).filter(flippedBlock => flippedBlock.classList.contains('is-flipped'));
    if (allFlippedBlocks.length === 2) {
        stopClicking(); // Prevent further clicks
        checkMathedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]); // Check for match
    }
}

// Function to temporarily stop clicking
function stopClicking() {
    memoryGameBlocks.classList.add('no-clicking');
    setTimeout(() => {
        memoryGameBlocks.classList.remove('no-clicking');
    }, duration); // Restore clicking after duration
}

// Function to check if two blocks match
function checkMathedBlocks(firstBlock, secondBlock) {
    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");
        firstBlock.classList.add("has-match");
        secondBlock.classList.add("has-match");
        document.getElementById('success').play(); // Play success sound

        correctPairs++;
        score.textContent = (correctPairs * 5); // Update score

        if (correctPairs === totalPairs) {
            document.getElementById('win').play(); // Play win sound
            backgroundSound.pause(); // Stop background music
            alert('مبروك! لقد فزت!'); // Show win message
        }
    } else {
        tries.textContent = parseInt(tries.textContent) + 1; // Increment tries
        setTimeout(() => {
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
            document.getElementById('fail').play(); // Play fail sound
        }, duration);
    }
}

// Function to manage the game timer
function funTimer() {
    if (timerInterval) clearInterval(timerInterval); // Clear existing timer
    timerInterval = setInterval(() => {
        if (time > 0) {
            time--;
            time >= 10 ? timer.textContent = time : timer.textContent = `0${time}`; // Format time
        } else {
            clearInterval(timerInterval); // Stop timer
            backgroundSound.pause(); // Stop background music
            document.getElementById('failed').play(); // Play failed sound
            setTimeout(() => {
                blocks.forEach(block => {
                    block.classList.remove('is-flipped'); // Unflip all blocks
                });
            }, 500);
            memoryGameBlocks.classList.add('no-clicking'); // Prevent further interaction
            alert("انتهى الوقت! حاول مرة أخرى"); // Show game over message
        }
    }, 1000); // Update every second
}