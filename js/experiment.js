var jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.displayData();
    }
});

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap";
document.head.appendChild(fontLink);

//STYLES
const style = document.createElement("style");
style.textContent = `

.kbd { display: inline-block;
padding: 0.15em 0.5em;
border: 1px solid #555;
border-radius: 4px;
background: #f5f5f5;
font-family: monospace;
box-shadow: 0 2px 0 #aaa;
}

.btn-inline {
display: inline-block;
padding: 2px 6px;
border: 1px solid #333;
border-radius: 3px;
font-weight: 500;
background: #f5f5f5;
}


/* Base style shared by all number boxes */
.num-box {
border: 2px solid #333;
display: flex;
align-items: center;
justify-content: center;
font-size: 24px;
}

/* Demo number boxes (RNG demo, inline) */
.demo-num-box {
width: 40px;
height: 50px;
position: static;
}

/* Robot number boxes (overlayed on image) */
.robot-num-box {
font-family: "Orbitron", "Courier New", monospace;
letter-spacing: 1.5px;
font-weight: 600;
width: 40px;
height: 50px;
position: absolute;
}

.gen-btn {
width: 60px;
height: 60px;
background-color: #666;   /* darker grey */
border: none;
border-radius: 50%;
box-shadow:
0 6px 0 #444,            /* strong bottom edge */
0 10px 14px rgba(0,0,0,0.35); /* deeper shadow */

cursor: pointer;
transition:
transform 0.1s ease,
box-shadow 0.1s ease,
background-color 0.1s ease;
}

.gen-btn:hover {
background-color: #707070;  /* slight lift on hover */
}

.gen-btn:active {
transform: translateY(6px);
box-shadow:
0 2px 0 #444,
0 4px 6px rgba(0,0,0,0.3);
}

box-shadow:{
0 2px 0 #1b3563,
0 3px 6px rgba(0,0,0,0.2);
}

.robot-container {
position: relative;
width: 300px;
margin: 20px auto;
}

.robot-container img {
width: 100%;
display: block;
}

.robot-container .robot-num-box {
position: absolute;
}

/* robot torso panel positions */
.robot-container #box1 {
top: 225px;
left: 83px;
}

.robot-container #box2 {
top: 225px;
left: 130px;
}

.robot-container #box3 {
top: 225px;
left: 177px;
}

.robot-input {
width: 120%;
height: 120%;
border: none;
text-align: center;
font-family: "Orbitron", monospace;
font-size: 16px;
background: transparent;
outline: none;
transform: translateY(-18px);
}

`;
document.head.appendChild(style);

/* create timeline */
var timeline = [];



var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: "Welcome to the study!<br><br>Press the <span class=kbd>SPACE</span> bar to begin."
};
timeline.push(welcome);



/* define instructions trial */
var task1_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
  <div style="max-width:800px; margin:auto; line-height:1.3;">

  <img src='img/intro_bags.png' style='width:200px; display:block; margin:8px auto;'>

  <div style="display:flex; align-items:center; gap:20px;">

  <!-- LEFT COLUMN: -->
  <div style="flex:1;">
  <p style="margin:4px 0; text-align:center;">
  We need your help with a decision task!</p>

  <p>In this task you will be an apprentice working in a barn. Your job is to prepare bags of multicolored corn seeds for sale. However,
  some of the bags are missing their labels. Your task is to determine which variety of corn seeds is in each bag and attach the correct labels.</p>

  <p>Luckily, each corn variety can be recognized by the proportion of yellow and blue seeds it contains. For example, in <strong>the variety A, 40%
  of the seeds might be blue and 60% yellow</strong>, while in the <strong>variety B the proportions could be 60% blue and 40% yellow</strong>. During
  the task, the bars on the right will remind you the shares of colors for each corn variety.</p>

  <p>You can <strong>randomly draw up to 20 corn seeds</strong> from a little hole in the bag to decide which variety it likely belongs to. For each correctly
  attached label you will win a reward but will get no reward for the labels you attach incorrectly.</p>

  <p>Let’s look at an example!</p>

  <p>Press the <span class="kbd">SPACE</span> bar to proceed</p>

  </div>

  <!-- RIGHT COLUMN: image -->
  <div style="flex:0 0 auto; display:flex; align-items:center;">
  <img src='img/ex_1.png' style='width:150px;'>
  </div>

  </div>
  </div>
  `
};
//timeline.push(task1_instructions);


var example_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <p>Here’s an example of the type of a task you will be doing.</p>
  <p>Press the <span class="kbd">SPACE</span> bar to proceed</p>
  `
};
//timeline.push(example_intro);

var example_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `

  <div style="max-width:800px; margin:auto; line-height:1.3; padding-bottom:120px;">

  <div style="display:flex; align-items:center; gap:20px; margin-top:2px;">
  <!-- LEFT COLUMN -->
  <div style="flex:1;
  padding-top:1px;
  display:flex;
  flex-direction:column;
  justify-content:center;">
  <style>
  #intro_text,
  #choice_prompt,
  #demo_text {
  margin: 0;
  }
  </style>
  <p style="margin:5px 0 2px; text-align:center;"><strong>EXAMPLE ONLY</strong></p>
  <img src='img/trial_bag.png' style='width:200px; display:block; margin:0 auto;'>

  <p id="intro_text">You know that this bag is either <strong>LIGHTKERNEL</strong> or <strong>BRIGHTLEAF</strong> variety, but you have no idea which
  one it is. <br><strong>LIGHTKERNEL</strong> seeds are about <strong>78% yellow and 2% blue. <br>BRIGHTLEAF</strong> are the opposite – about <strong>2% yellow
  and 78% blue.<br>There are also equal small amounts of red seeds mixed in in all bags – about 20%</strong>, so you can’t tell varieties apart based on those.
  <br><strong>Red seeds don’t give you any information for choosing the right label</strong>.</p>

  <p id="choice_prompt" style="margin:15px 0;";>In the actual task you will have the following choices:</p>

  <div id="custom-buttons" style="margin-top: 10px;">
  <button id="draw-btn" style="padding:10px 15px; margin: 0 10px;">
  Draw a seed from the bag
  </button>
  <button id="guess-btn" style="padding:10px 15px; margin:0 10px;">
  Guess the label now
  </button>
  </div>

  <p id="demo_text" style="margin-top: 15px;">
  For demonstration, let’s see what happens when you press “Draw a seed from the bag”.
  </p>

  </div>

  <!-- RIGHT COLUMN -->
  <div style=" flex:0 0 auto; display:flex; align-items:center;">
  <img src='img/ex_2.png' style='width:150px;'>
  </div>

  </div>

  <div id="seed-area"
  style="position:fixed; bottom:0; left:0; width:100%;
  padding:10px 0; display:flex; flex-wrap:wrap; justify-content:center;
  z-index:10; border-top:1px solid #ccc;">
  </div>

  </div>
  `,
    choices: [],

    on_load: function () {
        let seedCount = 0;

        const seedArea = document.getElementById("seed-area");
        const drawButton = document.getElementById("draw-btn");
        const guessButton = document.getElementById("guess-btn");

        drawButton.addEventListener("click", function () {
            if (seedCount >= 2) {
                document.getElementById("demo_text").textContent = `Press “Guess the label now” to see what that screen looks like.`;
                return;
            }

            seedCount++;

            let seedSrc = seedCount === 1
                ? "img/yellow_seed.png" : "img/yellow_seed.png";

            const seedImg = document.createElement("img");
            seedImg.src = seedSrc;
            seedImg.style.width = "30px";
            seedImg.style.margin = "5px";
            seedArea.appendChild(seedImg);

            if (seedCount === 1) {
                document.getElementById("demo_text").textContent =
                    `The seed you randomly drew from the bag is yellow and it appears at the bottom of the screen.
        Press <span class="btn-inline“>Draw a seed from the bag</span> again to proceed.`;
            }

            if (seedCount === 2) {
                document.getElementById("demo_text").textContent =
                    `The second seed you drew randomly from the bag is again yellow, and it appears next to the yellow seed you drew before.
        Press <span class="btn-inline“>Guess the label now</span> to see what that screen looks like.
        `;
            }
        });

        guessButton.addEventListener("click",
            function () {

                if (seedCount < 2) {
                    document.getElementById("demo_text").textContent =
                        `That's a valid choice for the actual task but for demonstration purposes let’s see what happens when you press
          “Draw a seed from the bag”`;
                } else {

                    document.getElementById("choice_prompt").textContent =
                        "What corn variety is likely to be in this bag based on the seeds you saw? Choose one of the labels to finish this demonstration";
                    document.getElementById("demo_text").textContent = "";
                    document.getElementById("intro_text").textContent = "";

                    drawButton.textContent = "LIGHTKERNEL";
                    guessButton.textContent = "BRIGHTLEAF";

                    drawButton.onclick = function () {
                        jsPsych.finishTrial();
                    };

                    guessButton.onclick = function () {
                        jsPsych.finishTrial();
                    };
                }
            });
    }
};

//timeline.push(example_trial);

var trial_intro_text = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `Thank you! Remember, in the actual task, you can randomly draw up to 20 seeds before choosing a label.<br><br>
  Now let’s move on to the actual task!<br><br>Press the <span class="kbd">SPACE</span> bar to proceed.`
}

//timeline.push(trial_intro_text)


function makeSeedTrial(config) {

    // unpack config with defaults
    const {
        gridsImage = null,
        seedImages = {
            yellow: "img/yellow_seed.png",
            blue: "img/blue_seed.png",
            red: "img/red_seed.png"
        },
        seedSequence = ["yellow", "blue", "red", "yellow"],
        labelA = "A",
        labelB = "B",
        introText = `You know that these sacks are.`,
        promptText = `Choose what to do next`,
        finalPromptText = "What variety is this bag of corn seeds? Choose the label."
    } = config;

    return {
        type: jsPsychHtmlKeyboardResponse,
        choices: [],

        stimulus: `
    <div style="max-width:800px; margin:auto; line-height:1.3; padding-bottom:120px;">

    <img src='img/trial_bag.png'
    style='width:200px; display:block; margin:0 auto;'>

    <div style="display:flex; align-items:center; gap:20px;">

    <!-- LEFT COLUMN: -->
    <div style="flex:1;
    padding-top:1px;
    display:flex;
    flex-direction:column;
    justify-content:center;">

    <div id="intro_text" style="margin-top:0;">
    ${introText}
    </div>
    <div id="prompt_text" style="margin-top:10px;">
    ${promptText}
    </div>
    <div id="custom-buttons" style="margin-top:15px;">
    <button id="draw-btn" style="padding:10px 15px; margin:0 10px;">Draw a seed from the bag</button>
    <button id="guess-btn" style="padding:10px 15px; margin: 0 10px;">Guess the label now</button>
    </div>
    </div>

    <!-- RIGHT COLUMN: -->
    <div style="flex:0 0 auto; display:flex; align-items:center;">
    <img src='${gridsImage}' style='width:150px;'>
    </div>

    </div>

    <div id="seed-area"
    style="position:fixed; bottom:0; left:0; width:100%;
    padding:10px 0; display:flex; flex-wrap:wrap; justify-content:center;
    z-index:10; border-top:1px solid #ccc;">
    </div>

    </div>
    `,

        on_load: function () {

            let seedCount = 0;

            const seedArea = document.getElementById("seed-area");
            const drawButton = document.getElementById("draw-btn");
            const guessButton = document.getElementById("guess-btn");
            const promptText = document.getElementById("prompt_text");

            // --- draw behavior ---
            drawButton.addEventListener("click",
                function () {
                    if (seedCount >= seedSequence.length) {
                        promptText.textContent = "You've reached the maximum number of seeds. Press Guess the label now to choose a label.";
                        return;
                    }
                    const color = seedSequence[seedCount];
                    const seedSrc = seedImages[color];

                    seedCount++;

                    const seedImg = document.createElement("img");
                    seedImg.src = seedSrc;
                    seedImg.style.width = "30px";
                    seedImg.style.margin = "5px";
                    seedArea.appendChild(seedImg);
                });

            // --- guess behavior ---
            guessButton.addEventListener("click",
                function () {

                    promptText.textContent = finalPromptText;
                    document.getElementById("intro_text").textContent = "";
                    drawButton.textContent = labelA;
                    guessButton.textContent = labelB;

                    drawButton.onclick = () => jsPsych.finishTrial();
                    guessButton.onclick = () => jsPsych.finishTrial();
                });
        }
    };
}



var trial_conditions = [{
    trial_id: "b75_y05_r20",
    introText: `You know that this bag is either <strong>SHADESEED or SUNMAIZE</strong> variety. <strong>SHADESEED</strong> are about
  <strong>75% blue and 5% yellow. SUNMAIZE</strong> are the opposite – about <strong>5% blue and 75% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
  tell varieties apart based on those. <strong>Red seeds don’t give you any information for choosing the right label</strong>.
  `,
    gridsImage: "img/b75_y05_r20.png",
    seedSequence: ["blue", "red", "blue", "red", "blue", "yellow", "blue", "blue", "red", "blue", "blue", "blue", "blue", "blue", "red", "blue", "blue", "blue", "blue", "blue"],
    labelA: "SHADESEED",
    labelB: "SUNMAIZE"
},
{
    trial_id: "b70_y10_r20",
    introText: `You know that this bag is either <strong>WAKESOIL or SUNDRIFT</strong> variety. <strong>WAKESOIL</strong> are about
    <strong>70% yellow and 10% blue. SUNDRIFT</strong> are the opposite – about <strong>10% yellow and 70% blue.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b70_y10_r20.png",
    seedSequence: ["blue", "red", "blue", "red", "blue", "yellow", "blue", "blue", "blue", "blue", "blue", "red", "blue", "blue", "blue", "blue", "yellow", "red", "blue", "blue"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
},
{
    trial_id: "b15_y65_r20",
    introText: `You know that this bag is either <strong>DEEPSTEM or GOLDLEAF</strong> variety. <strong>DEEPSTEM</strong> are about
    <strong>65% blue and 15% yellow. GOLDLEAF</strong> are the opposite – about <strong>15% blue and 65% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b15_y65_r20.png",
    seedSequence: ["yellow", "red", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "yellow", "blue", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "yellow"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
},
{
    trial_id: "b20_y60_r20",
    introText: `You know that this bag is either <strong>TALLGRAIN or WILDLEAF</strong> variety. <strong>TALLGRAIN</strong> are about
    <strong>20% blue and 60% yellow. WILDLEAF</strong> are the opposite – about <strong>60% blue and 20% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b20_y60_r20.png",
    seedSequence: ["red", "yellow", "blue", "yellow", "red", "red", "yellow", "red", "yellow", "yellow", "yellow", "blue", "red", "yellow", "yellow", "red", "yellow", "yellow", "yellow", "blue"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
},
{
    trial_id: "b25_y55_r20",
    introText: `You know that this bag is either <strong>FAIRMAIZE or STRONGLEAF</strong> variety. <strong>FAIRMAIZE</strong> are about
    <strong>55% blue and 25% yellow. STRONGLEAF</strong> are the opposite – about <strong>25% blue and 55% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b25_y55_r20.png",
    seedSequence: ["red", "yellow", "blue", "yellow", "blue", "yellow", "yellow", "red", "yellow", "blue", "yellow", "yellow", "red", "yellow", "red", "yellow", "yellow", "red", "yellow", "blue"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
},
{
    trial_id: "b50_y30_r20",
    introText: `You know that this bag is either <strong>SUNKERNEL or HARVESTWELL</strong> variety. <strong>SUNKERNEL</strong> are about
    <strong>30% blue and 50% yellow. HARVESTWELL</strong> are the opposite – about <strong>50% blue and 30% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b50_y30_r20.png",
    seedSequence: ["yellow", "blue", "red", "blue", "yellow", "blue", "blue", "yellow", "red", "blue", "blue", "yellow", "blue", "blue", "red", "blue", "yellow", "blue", "red", "yellow"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
},
{
    trial_id: "b35_y45_r20",
    introText: `You know that this bag is either <strong>PUREGRAIN or MAIZELEAF</strong> variety. <strong>PUREGRAIN</strong> are about
    <strong>45% blue and 35% yellow. MAIZELEAF</strong> are the opposite – about <strong>35% blue and 45% yellow.<br>About 20% of both bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b35_y45_r20.png",
    seedSequence: ["blue", "yellow", "red", "blue", "yellow", "red", "blue", "yellow", "yellow", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "blue", "yellow", "yellow", "yellow"],
    labelA: "Goldgrain",
    labelB: "Darkstem"
}];

const itiTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:24px; text-align:center;">
  Preparing next trial…
  </div>`,
    choices: "NO_KEYS",
    trial_duration: 2000
};

const confidenceSlider = {
    type: jsPsychHtmlSliderResponse,
    stimulus: "How certain are you about your choice?",
    min: 0,
    max: 100,
    start: null,
    step: 1,
    labels: ["Not certain at all", "Completely certain"],
    require_movement: true,
    data: {
        question: "confidence"
    }
};


//trial_conditions.forEach(cond => {
//  timeline.push(makeSeedTrial(cond));
//  timeline.push(confidenceSlider);
//  timeline.push(itiTrial);
//});

var task2_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "ALL_KEYS",
    response_ends_trial: false,
    stimulus: `
  <div style="text-align:center; font-size:20px;">
  <div id="gen-prompt">Now you will play a different game!<br><br>You will use a random number generator in this game.<br>Press the button below to try it out first.</div>
  <button style="margin-top:30px" id="reveal-btn" class="gen-btn" aria-label="Reveal numbers"></button>
  <div style="margin-top:30px; display:flex; justify-content:center; gap:20px;">

  <div class="num-box demo-num-box" id="box1"></div>
  <div class="num-box demo-num-box" id="box2"></div>
  <div class="num-box demo-num-box" id="box3"></div>

  </div>
  </div>
  `,
    on_load: function () {
        let pressCount = 0;

        const sets = [
            [12, 47, 83], // first reveal
            [5, 29, 64] // second reveal
        ];

        const boxes = [
            document.getElementById("box1"),
            document.getElementById("box2"),
            document.getElementById("box3")
        ];

        const btn = document.getElementById("reveal-btn");
        const promptText = document.getElementById("gen-prompt");
        btn.addEventListener("click",
            () => {
                if (pressCount >= 2) return;

                const currentSet = sets[pressCount];

                boxes.forEach((box, i) => {
                    box.textContent = currentSet[i];
                });

                pressCount++;

                if (pressCount === 2) {
                    btn.disabled = true;
                    btn.style.opacity = 0.6;
                    btn.style.cursor = "default";

                    promptText.innerHTML =
                        `Great, now press the <span class="kbd">SPACE</span> to proceed to the task.`;

                    document.addEventListener(
                        "keydown",
                        () => jsPsych.finishTrial(),
                        {
                            once: true
                        }
                    );
                }
            });
    }
};

timeline.push(task2_intro)

var task2_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
  <div style="margin: 0 250px;">

  <p>
  This is a special robot that gets activated when its number dials
  are set according to a rule.<br>Your task is to figure out the rule that makes this robot go!
  </p>
  <img src="img/rob_deact.png" style="width: 220px;">
  <p>
  The rule is not about specific numbers but <strong>a relation between three
  numbers</strong> appearing on the robot's dials. Before guessing the rule, you can
  test out different sets of numbers to see which sets activate it.
  </p>

  <p>
  You can test as many number sets as you want within the time limit
  of 5 minutes. When you feel confident that you have discovered the
  rule, click <span class="btn-inline">guess the rule</span> at the bottom right.
  </p>
  <p>
  Press the <span class="kbd">SPACE</span> bar to start.
  </p>
  </div>
  `
};

timeline.push(task2_instructions)

var task2_trial_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    response_ends_trial: false,
    stimulus: `
  <div id="rob-gen-prompt" style="margin-bottom:20px;">
  The first set of test numbers will be chosen for you randomly using the random number generator you saw before.<br>
  Press the generator button to see the numbers.
  </div>

  <button id="reveal-btn" class="gen-btn" style="margin-bottom:10px;" aria-label="Reveal numbers"></button>

  <div class="robot-container">
  <img src="img/rob_deact.png" id="robot-img" alt="Robot">

  <div class="robot-num-box" id="box1"></div>
  <div class="robot-num-box" id="box2"></div>
  <div class="robot-num-box" id="box3"></div>
  </div>

  <!-- Test button (initially hidden) -->
  <button
  id="test-robot-btn"
  style="
  position: fixed;
  bottom: 300px;
  right: 300px;
  display: none;
  padding: 12px 18px;
  font-size: 16px;
  cursor: pointer;
  ">
  Test the robot
  </button>
  `,


    on_load: function () {
        let pressCount = 0;

        const sets = [[2, 4, 6]];

        const boxes = [
            document.getElementById("box1"),
            document.getElementById("box2"),
            document.getElementById("box3")
        ];

        const genBtn = document.getElementById("reveal-btn");
        const testBtn = document.getElementById("test-robot-btn");
        const promptText = document.getElementById("rob-gen-prompt");
        const robotImg = document.getElementById("robot-img");

        // --- generator button ---
        genBtn.addEventListener("click",
            () => {
                if (pressCount >= 1) return;

                const currentSet = sets[0];

                boxes.forEach((box, i) => {
                    box.textContent = currentSet[i];
                });

                pressCount++;

                // lock generator
                genBtn.disabled = true;
                genBtn.style.opacity = 0.6;
                genBtn.style.cursor = "default";

                // show test button
                testBtn.style.display = "block";

                promptText.innerHTML =
                    `Now press <span class="btn-inline">Test the robot</span> to see if this set activates it.`;
            });

        // --- test robot button ---
        testBtn.addEventListener("click",
            () => {
                setTimeout(() => {
                    robotImg.src = "img/rob_act.png";
                    promptText.innerHTML =
                        `This set fits the robot's rule, so it got activated.<br>Now it’s your turn to test new sets of numbers to guess the rule.<br>Press the <span class="kbd">SPACE</span> bar to start.
          `
                    document.addEventListener(
                        "keydown",
                        (e) => {
                            if (e.code === "Space") {
                                jsPsych.finishTrial();
                            }
                        },
                        {
                            once: true
                        }
                    );
                }, 400);
                testBtn.disabled = true;
                testBtn.style.opacity = 0.6;
            });
    }
};

timeline.push(task2_trial_intro)


var task2_trial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [],

    stimulus: `
  <div style="max-width:1000px; margin:0 auto;">

  <!-- TOP: centered instruction text -->
  <div style="
  text-align:center;
  margin-bottom:20px;
  ">Now it’s your turn to figure out the rule.</div>
  <div style="
  text-align:center;
  margin-bottom:20px;
  ">To test a set, put in three numbers in the robot's dials, then briefly explain why you are testing that set, and then press
  <span class="btn-inline">Test the robot</span> to see if that set activates the robot.
  All previously tested sets and the results will appear on the left.
  <strong>When you feel very confident about the rule</strong>, press <span class="btn-inline">Guess the rule</span> to submit your guess.
  </div>

  <!-- THREE-COLUMN LAYOUT -->
  <div style="display:flex; gap:40px; align-items:flex-start; justify-content:center;">

  <!-- LEFT: tested sets -->
  <div id="tested-sets"
  style="
  min-width:220px;
  font-family: monospace;
  font-size:16px;
  ">
  <div style="font-weight:bold; margin-bottom:10px;">
  Tested sets
  </div>
  </div>

  <!-- CENTER: robot -->
  <div class="robot-container">
  <img src="img/rob_deact.png" id="robot-img" alt="Robot">

  <div class="robot-num-box" id="box1">
  <input type="number" class="robot-input">
  </div>
  <div class="robot-num-box" id="box2">
  <input type="number" class="robot-input">
  </div>
  <div class="robot-num-box" id="box3">
  <input type="number" class="robot-input">
  </div>
  </div>

  <!-- RIGHT: theory input -->
  <div style="min-width:260px;">
  <div style="font-weight:bold; margin-bottom:6px;">
  Why are you testing this set?
  </div>
  <textarea
  id="theory-input"
  placeholder="Write the rule you have in mind here"
  style="
  width:100%;
  height:120px;
  font-size:14px;
  padding:8px;
  resize:none;
  "></textarea>
  </div>

  </div>
  </div>

 <div id="result-text"
  style="margin-bottom:30px; font-size:20px; text-align:center;">
  </div>

  <button
  id="test-robot-btn"
  disabled
  style="
  position: fixed;
  bottom: 250px;
  right: 350px;
  padding: 12px 18px;
  font-size: 16px;
  opacity: 0.5;
  cursor: default;
  ">
  Test the robot
  </button>

  
  <button
  id="guess-rule-btn"
  style="
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 12px 18px;
  font-size: 16px;
  cursor: pointer;
  ">
  Guess the rule
  </button>
  `,
    on_load: function () {

        const inputs = Array.from(
            document.querySelectorAll(".robot-input")
        );
        const testedSetsDiv = document.getElementById("tested-sets");
        const theoryInput = document.getElementById("theory-input");

        const testBtn = document.getElementById("test-robot-btn");
        const guessBtn = document.getElementById("guess-rule-btn")
        const robotImg = document.getElementById("robot-img");
        const resultText = document.getElementById("result-text");

        // --- enable test button only when all inputs have values ---
        function checkInputsFilled() {
            const allNumbersFilled = inputs.every(inp => inp.value !== "");
            const theoryFilled = theoryInput.value.trim() !== "";
            const canTest = allNumbersFilled && theoryFilled;
            testBtn.disabled = !canTest;
            testBtn.style.opacity = canTest ? 1 : 0.5;
            testBtn.style.cursor = canTest ? "pointer" : "default";
        }

        inputs.forEach(inp => {
            inp.addEventListener("input", checkInputsFilled);
        });
        theoryInput.addEventListener("input", checkInputsFilled);

        // --- test robot logic ---
        testBtn.addEventListener("click", () => {
            const values = inputs.map(inp => Number(inp.value));

            const isAscending =
                values[0] < values[1] && values[1] < values[2];

            // update robot + result text
            if (isAscending) {
                robotImg.src = "img/rob_act.png";
                resultText.textContent = "This set fits the robot's rule!";
            } else {
                robotImg.src = "img/rob_deact.png";
                resultText.textContent = "This set does not fit the robot's rule";
            }

            // --- add entry to tested sets column ---
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "6px";

            const numbersSpan = document.createElement("span");
            numbersSpan.textContent = values.join(" – ");

            const resultSpan = document.createElement("span");
            resultSpan.textContent = isAscending ? "Yes" : "No";
            resultSpan.style.fontWeight = "bold";

            row.appendChild(numbersSpan);
            row.appendChild(resultSpan);
            testedSetsDiv.appendChild(row);

            // --- RESET inputs for next test ---
            inputs.forEach(inp => inp.value = "");
            theoryInput.value = "";
            checkInputsFilled();
        });
        guessBtn.addEventListener("click",
            () => {
                jsPsych.finishTrial({
                    tested_sets: testedSetsDiv.textContent
                });
            });
    }
};

timeline.push(task2_trial)

var submit_rule = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: false,
    stimulus: `
  <p>What rule activates this robot? Write your guess here.</p>
  <div>
  <textarea
  id="rule-input"
  style="
  width:500px;
  height:200px;
  font-size:14px;
  padding:8px;
  resize:none;
  "></textarea>
  </div>
  <button
  id="submit-rule-btn"
  disabled
  style="
  position: fixed;
  bottom: 200px;
  right: 2000px;
  padding: 12px 18px;
  font-size: 16px;
  opacity: 0.5;
  cursor: default;
  ">
  Submit
  </button>
  `,
    on_load: function () {
        const subBtn = document.getElementById("submit-rule-btn");
        const ruleInput = document.getElementById("rule-input");
        function checkInput() {
            const ruleFilled = ruleInput.value.trim() !== "";
            subBtn.disabled = !ruleFilled;
            subBtn.style.opacity = ruleFilled ? 1 : 0.5;
        }
        ruleInput.addEventListener("input",
            checkInput);
        subBtn.addEventListener("click",
            () => {
                jsPsych.finishTrial({
                    rule_guess: ruleInput.value
                });
            })
    }
}

timeline.push(submit_rule)

const agreementScale = [
    "Strongly disagree",
    "Disagree",
    "Neither agree nor disagree",
    "Agree",
    "Strongly agree"
];

const ius = [
    "I am confident that I discovered the correct rule.",
    "The robot’s behavior was easy to understand.",
    "I tested numbers systematically.",
    "I felt uncertain during the task."
];



/* start the experiment */
jsPsych.run(timeline);