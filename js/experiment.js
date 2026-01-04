var jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.displayData();
    }
});

var timeline = [];

var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: "Welcome to the study!<br><br>Press the <span class=kbd>SPACE</span> bar to begin."
};
timeline.push(welcome);

var task1_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <div style="max-width:800px; margin:auto; line-height:1.3;">

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

  <p>To decide which variety a bag belongs to, you may <strong>randomly draw up to 20 corn seeds</strong> through a little opening in the bag. 
  You will receive a reward for each label you attach correctly, and no reward for labels attached incorrectly.</p>
  <p>Let’s look at an example!</p>
  <p>Press the <span class="kbd">SPACE</span> bar to proceed.</p>

  </div>

  <!-- RIGHT COLUMN: image -->
  <div style="flex:0 0 auto; display:flex; align-items:center;">
  <img src='img/ex_1.png' style='width:150px;'>
  </div>

  </div>
  </div>
  `
};

timeline.push(task1_instructions);


var example_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <p>Here’s an example of the type of a task you will be doing.</p>
  <p>Press the <span class="kbd">SPACE</span> bar to proceed.</p>
  `
};

timeline.push(example_intro);

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
  <img src='img/bag.png' style='width:1800px; display:block; margin:20px auto;'>

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
  For demonstration, press <span class="btn-inline">Draw a seed from the bag</span>
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
                document.getElementById("demo_text").innerHTML = `<p>Press <span class="btn-inline">Guess the label now</span> to see what that screen looks like.</p>`;
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
                document.getElementById("demo_text").innerHTML =
                    `<p>The seed you randomly drew from the bag is yellow and it appears at the bottom of the screen.
        Press <span class="btn-inline">Draw a seed from the bag</span> again to proceed.</p>`;
            }

            if (seedCount === 2) {
                document.getElementById("demo_text").innerHTML =
                    `<p>The second seed you drew randomly from the bag is again yellow, and it appears next to the yellow seed you drew before.
        Press <span class="btn-inline">Guess the label now</span> to see what that screen looks like.</p>
        `;
            }
        });

        guessButton.addEventListener("click",
            function () {

                if (seedCount < 2) {
                    document.getElementById("demo_text").innerHTML =
                        `<p>That's a valid choice for the actual task but for demonstration purposes let’s see what happens when you press
          <span class="btn-inline">Draw a seed from the bag</span>`;
                } else {

                    document.getElementById("choice_prompt").textContent =
                        "Which corn variety is likely to be in this bag based on the seeds you saw? Choose one of the labels to finish this demonstration";
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

timeline.push(example_trial);

var trial_intro_text = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `Thank you!<br>Remember, in the actual task, you can randomly draw up to 20 seeds before choosing a label.<br><br>
  You will get a reward for each correctly chosen label, but no reward for incorrectly chosen labels.<br><br>
  Now let’s move on to the actual task!<br><br>Press the <span class="kbd">SPACE</span> bar to start.`
}

timeline.push(trial_intro_text)

function makeSeedTrial(config) {

    // unpack config with defaults
    const {
        trial_id,
        gridsImage = null,
        seedImages = {
            yellow: "img/yellow_seed.png",
            blue: "img/blue_seed.png",
            red: "img/red_seed.png"
        },
        seedSequence = ["yellow", "blue", "red", "yellow"],
        labelA = "A",
        labelB = "B",
        introText = `You know that this bag is.`,
        promptText = `Choose what to do next`,
        finalPromptText = "What variety is this bag of corn seeds? Choose the label."
    } = config;

    return {
        type: jsPsychHtmlKeyboardResponse,
        choices: [],
        data: {
            trial_id: trial_id,
            trial_type: "seed"
        },
        stimulus: `
    <div style="max-width:800px; margin:auto; line-height:1.3; padding-bottom:120px;">

    <img src='img/bag.png'
    style='width:180px; display:block; margin:20px auto;'>

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
            let chosenLabel = null;
            let guessRT = null;
            const trialStartTime = performance.now();
            const seedArea = document.getElementById("seed-area");
            const drawButton = document.getElementById("draw-btn");
            const guessButton = document.getElementById("guess-btn");
            const promptText = document.getElementById("prompt_text");

            drawButton.addEventListener("click",
                function () {
                    if (seedCount >= seedSequence.length) {
                        promptText.innerHTML = `You've reached the maximum number of seeds. Press <span class="btn-inline">Guess the label now</span> to choose a label.`;
                        return;
                    }
                    const color = seedSequence[seedCount];
                    const seedSrc = seedImages[color];

                    seedCount++;

                    promptText.innerHTML = `Drawing a seed...`;
                    drawButton.disabled = true;
                    drawButton.style.opacity = 0.6;
                    drawButton.style.cursor = "default";
                    setTimeout(() => {
                        const seedImg = document.createElement("img");
                        seedImg.src = seedSrc;
                        seedImg.style.width = "30px";
                        seedImg.style.margin = "5px";
                        seedArea.appendChild(seedImg);

                        promptText.innerHTML =
                            `The seed you drew appears at the bottom of the screen.<br>Choose what to do next.`;

                        // Re-enable button if draws remain
                        if (seedCount < seedSequence.length) {
                            drawButton.disabled = false;
                            drawButton.style.opacity = 1;
                            drawButton.style.cursor = "pointer";
                        }
                    }, 2000);
                });

            // --- guess behavior ---
            guessButton.addEventListener("click",
                function () {

                    promptText.textContent = finalPromptText;
                    document.getElementById("intro_text").textContent = "";
                    drawButton.textContent = labelA;
                    guessButton.textContent = labelB;

                    drawButton.onclick = () => finishTrial(labelA);
                    guessButton.onclick = () => finishTrial(labelB);
                });
            function finishTrial(label) {
                chosenLabel = label;
                guessRT = performance.now() - trialStartTime;

                jsPsych.finishTrial({
                    trial_id: trial_id,
                    trial_type: "seed",
                    n_draws: seedCount,
                    choice: chosenLabel,
                    decision_rt: guessRT
                });
            }
        }
    };
}

var trial_conditions = [{
    trial_id: "b75_y05_r20",
    introText: `You know that this bag is either <strong>SHADESEED or SUNMAIZE</strong> variety. <strong>SHADESEED</strong> are about
  <strong>75% blue and 5% yellow. SUNMAIZE</strong> are the opposite – about <strong>5% blue and 75% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
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
    <strong>70% yellow and 10% blue. SUNDRIFT</strong> are the opposite – about <strong>10% yellow and 70% blue.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b70_y10_r20.png",
    seedSequence: ["blue", "red", "blue", "red", "blue", "yellow", "blue", "blue", "blue", "blue", "blue", "red", "blue", "blue", "blue", "blue", "yellow", "red", "blue", "blue"],
    labelA: "WAKESOIL",
    labelB: "SUNDRIFT"
},
{
    trial_id: "b15_y65_r20",
    introText: `You know that this bag is either <strong>DEEPSTEM or GOLDLEAF</strong> variety. <strong>DEEPSTEM</strong> are about
    <strong>65% blue and 15% yellow. GOLDLEAF</strong> are the opposite – about <strong>15% blue and 65% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b15_y65_r20.png",
    seedSequence: ["yellow", "red", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "yellow", "blue", "yellow", "yellow", "yellow", "yellow", "yellow", "red", "yellow", "yellow", "yellow"],
    labelA: "DEEPSTEM",
    labelB: "GOLDLEAF"
},
{
    trial_id: "b20_y60_r20",
    introText: `You know that this bag is either <strong>TALLGRAIN or WILDLEAF</strong> variety. <strong>TALLGRAIN</strong> are about
    <strong>20% blue and 60% yellow. WILDLEAF</strong> are the opposite – about <strong>60% blue and 20% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b20_y60_r20.png",
    seedSequence: ["red", "yellow", "blue", "yellow", "red", "red", "yellow", "red", "yellow", "yellow", "yellow", "blue", "red", "yellow", "yellow", "red", "yellow", "yellow", "yellow", "blue"],
    labelA: "TALLGRAIN",
    labelB: "WILDLEAF"
},
{
    trial_id: "b25_y55_r20",
    introText: `You know that this bag is either <strong>FAIRMAIZE or STRONGLEAF</strong> variety. <strong>FAIRMAIZE</strong> are about
    <strong>55% blue and 25% yellow. STRONGLEAF</strong> are the opposite – about <strong>25% blue and 55% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b25_y55_r20.png",
    seedSequence: ["red", "yellow", "blue", "yellow", "blue", "yellow", "yellow", "red", "yellow", "blue", "yellow", "yellow", "red", "yellow", "red", "yellow", "yellow", "red", "yellow", "blue"],
    labelA: "FAIRMAIZE",
    labelB: "STRONGLEAF"
},
{
    trial_id: "b50_y30_r20",
    introText: `You know that this bag is either <strong>SUNKERNEL or HARVESTWELL</strong> variety. <strong>SUNKERNEL</strong> are about
    <strong>30% blue and 50% yellow. HARVESTWELL</strong> are the opposite – about <strong>50% blue and 30% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b50_y30_r20.png",
    seedSequence: ["yellow", "blue", "red", "blue", "yellow", "blue", "blue", "yellow", "red", "blue", "blue", "yellow", "blue", "blue", "red", "blue", "yellow", "blue", "red", "yellow"],
    labelA: "SUNKERNEL",
    labelB: "HARVESTWELL"
},
{
    trial_id: "b35_y45_r20",
    introText: `You know that this bag is either <strong>PUREGRAIN or MAIZELEAF</strong> variety. <strong>PUREGRAIN</strong> are about
    <strong>45% blue and 35% yellow. MAIZELEAF</strong> are the opposite – about <strong>35% blue and 45% yellow.<br>About 20% of all bags are red seeds</strong> - so you can’t
    tell varieties apart based on those. Red seeds don’t give you any information for choosing the right label.
    `,
    gridsImage: "img/b35_y45_r20.png",
    seedSequence: ["blue", "yellow", "red", "blue", "yellow", "red", "blue", "yellow", "yellow", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "blue", "yellow", "yellow", "yellow"],
    labelA: "PUREGRAIN",
    labelB: "MAIZELEAF"
}];

const itiTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:24px; text-align:center;">
  Thank you<br><br>Next task will start in a second.
  </div>`,
    choices: "NO_KEYS",
    trial_duration: 1500
};

const sliderQs = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div style="font-size:25px; margin-bottom:15px; max-width:800px">
    Before moving on, answer a couple of questions <strong>about the choice you just made</strong>.
    </div>
    <div class="slider-question">
      <p>How certain do you feel about your answer?</p>
      <input type="range" min="0" max="100" value="50" id="conf" class="confidence-slider inactive">
      <div class="slider-labels">
        <span>Not certain at all</span>
        <span>Completely certain</span>
      </div>
    </div>

    <div class="slider-question">
      <p>How unpleasant did it feel to decide about a label in this last task?</p>
      <input type="range" min="0" max="100" value="50" id="unpl" class="confidence-slider inactive">
      <div class="slider-labels">
        <span>Not unpleasant at all</span>
        <span>Very unpleasant</span>
      </div>
    </div>

    <div class="slider-question">
      <p>At most, how confident could a reasonable person have been in choosing a label in this last task?</p>
      <input type="range" min="0" max="100" value="50" id="conf_reas" class="confidence-slider inactive">
      <div class="slider-labels">
        <span>Not confident at all</span>
        <span>Completely confident</span>
      </div>
    </div>
  `,
    choices: ["Continue"],
    on_load: function () {
        const touched = { conf: true, unpl: true, conf_reas: true };
        const responses = {};
        document.querySelector(".jspsych-btn").disabled = true;
        document.querySelectorAll(".confidence-slider").forEach(slider => {
            slider.addEventListener("input", () => {
                slider.classList.remove("inactive");
                touched[slider.id] = true;
                responses[slider.id] = slider.value;
                if (Object.values(touched).every(Boolean)) {
                    document.querySelector(".jspsych-btn").disabled = false;
                }
            });
        });
        this.responses = responses;
    },
    on_finish: function (data) {
        const lastTrial = jsPsych.data.get().last(2).values()[0];
        data.trial_type = "ratings";
        data.seed_trial_id = lastTrial.trial_id;
        data.confidence = this.responses.conf;
        data.unpleasantness = this.responses.unpl;
        data.confidence_reasonable = this.responses.conf_reas;
    }
};

const randomized_conditions =
    jsPsych.randomization.shuffle(trial_conditions);

/*randomized_conditions.forEach(cond => {
    timeline.push(makeSeedTrial(cond));
    timeline.push(sliderQs);
    timeline.push(itiTrial);
});*/

var task2_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    response_ends_trial: false,
    stimulus: `
  <div style="text-align:center; font-size:20px;">
  <div id="gen-prompt">Now we need your help with a different task!<br><br>You will use a random number generator in this task.<br>Press the button below twice to try it out.</div>
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
            [1, 5, 12], // first reveal
            [3, 2, 2] // second reveal
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
                if (pressCount === 1) {
                    promptText.innerHTML =
                        `Press the button again to see a different set of random numbers.`;
                };

                if (pressCount === 2) {
                    btn.disabled = true;
                    btn.style.opacity = 0.6;
                    btn.style.cursor = "default";

                    promptText.innerHTML =
                        `Great, now press the <span class="kbd">SPACE</span> bar to proceed to the task.`;

                    // Make sure SPACE doesn't "click" the focused button
                    btn.blur();

                    const onSpace = (e) => {
                        if (e.code === "Space" || e.key === " ") {
                            e.preventDefault();
                            document.removeEventListener("keydown", onSpace);
                            jsPsych.finishTrial();
                        }
                    };

                    document.addEventListener("keydown", onSpace);
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
  Press the <span class="kbd">SPACE</span> bar to proceed.
  </p>
  </div>
  `
};

//timeline.push(task2_instructions)

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

//timeline.push(task2_trial_intro)

var task2_alt_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [],

    stimulus: `
  <div style="max-width:1000px; margin:0 auto;">

  <!-- TOP: centered instruction text -->
  <div style="
  text-align:center;
  margin-bottom:20px;
  ">Let's try it out first.</div>
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
  <input type="number" class="robot-input" min="1">
  </div>
  <div class="robot-num-box" id="box2">
  <input type="number" class="robot-input" min="1">
  </div>
  <div class="robot-num-box" id="box3">
  <input type="number" class="robot-input" min="1"> 
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
        const testedSets = [];
        const t2TrialStartTime = [];
        const inputs = Array.from(
            document.querySelectorAll(".robot-input")
        );
        const testedSetsDiv = document.getElementById("tested-sets");
        const theoryInput = document.getElementById("theory-input");

        const testBtn = document.getElementById("test-robot-btn");
        const guessBtn = document.getElementById("guess-rule-btn")
        const robotImg = document.getElementById("robot-img");
        const resultText = document.getElementById("result-text");

        function renderTestedSet(numbers, result) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "6px";

            row.innerHTML = `
    <span>${numbers.join(" – ")}</span>
    <span style="font-weight:bold;">${result ? "Yes" : "No"}</span>
  `;

            testedSetsDiv.appendChild(row);
        }


        const initialSet = {
            numbers: [2, 4, 6],
            theory: "Given example",
            result: "yes"
        };
        testedSets.push(initialSet);
        renderTestedSet(initialSet.numbers, true);
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
            const theoryText = theoryInput.value.trim();
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
            testedSets.push({
                numbers: values,
                theory: theoryText,
                result: isAscending ? "yes" : "no"
            });
            // --- add entry to tested sets column ---

            renderTestedSet(values, isAscending);

            // --- RESET inputs for next test ---
            setTimeout(() => {
                inputs.forEach(inp => inp.value = "");
                theoryInput.value = "";
                robotImg.src = "img/rob_deact.png";
                resultText.textContent = "";
                checkInputsFilled();
            }, 2000);
        });
        guessBtn.addEventListener("click",
            () => {
                const decisionTime = performance.now() - trialStartTime;

                jsPsych.finishTrial({
                    trial_type: "rule_task",
                    tested_sets: testedSets,
                    n_tests: testedSets.length,
                    rule_guess_rt: decisionTime
                });
            });
    }
};

var task2_trial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [],

    stimulus: `
  <div style="max-width:1000px; margin:0 auto;">

  <!-- TOP: centered instruction text -->
  <div style="
  text-align:center;
  margin-bottom:20px;
">
  Now it’s your turn to figure out the rule. To test a set:
</div>

<ul style="
  list-style-position: inside;
  text-align: center;
  max-width: 500px;
  margin: 0 auto 20px auto;
  padding: 0;
">
  <li>
    Put in three numbers in the robot's dials.
  </li>
  <li>
    Briefly explain why you are testing that set.
  </li>
  <li>
    Press <span class="btn-inline">Test the robot</span> to see if that set activates the robot.
  </li>
  </ul>
  <div style="
  text-align:center;
  margin-bottom:20px;
">
 All previously tested sets and results will appear on the left. <strong>When you feel very confident about the rule</strong>, press
    <span class="btn-inline">Guess the rule</span> to submit your guess.
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
  <input type="number" class="robot-input" min="1">
  </div>
  <div class="robot-num-box" id="box2">
  <input type="number" class="robot-input" min="1">
  </div>
  <div class="robot-num-box" id="box3">
  <input type="number" class="robot-input" min="1"> 
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
        const testedSets = [];
        const t2TrialStartTime = [];
        const inputs = Array.from(
            document.querySelectorAll(".robot-input")
        );
        const testedSetsDiv = document.getElementById("tested-sets");
        const theoryInput = document.getElementById("theory-input");

        const testBtn = document.getElementById("test-robot-btn");
        const guessBtn = document.getElementById("guess-rule-btn")
        const robotImg = document.getElementById("robot-img");
        const resultText = document.getElementById("result-text");

        function renderTestedSet(numbers, result) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "6px";

            row.innerHTML = `
    <span>${numbers.join(" – ")}</span>
    <span style="font-weight:bold;">${result ? "Yes" : "No"}</span>
  `;

            testedSetsDiv.appendChild(row);
        }


        const initialSet = {
            numbers: [2, 4, 6],
            theory: "Given example",
            result: "yes"
        };
        testedSets.push(initialSet);
        renderTestedSet(initialSet.numbers, true);
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
            const theoryText = theoryInput.value.trim();
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
            testedSets.push({
                numbers: values,
                theory: theoryText,
                result: isAscending ? "yes" : "no"
            });
            // --- add entry to tested sets column ---

            renderTestedSet(values, isAscending);

            // --- RESET inputs for next test ---
            setTimeout(() => {
                inputs.forEach(inp => inp.value = "");
                theoryInput.value = "";
                robotImg.src = "img/rob_deact.png";
                resultText.textContent = "";
                checkInputsFilled();
            }, 2500);
        });
        guessBtn.addEventListener("click",
            () => {
                const decisionTime = performance.now() - t2TrialStartTime;

                jsPsych.finishTrial({
                    trial_type: "rule_task",
                    tested_sets: testedSets,
                    n_tests: testedSets.length,
                    rule_guess_rt: decisionTime
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
  right: 200px;
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

const rule_conf = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div class="slider-question">
      <p>How certain are you that your rule correctly explains how this robot operates?</p>
      <input type="range" min="0" max="100" value="50" id="cert" class="confidence-slider inactive">
      <div class="slider-labels">
        <span>Not certain at all</span>
        <span>Completely certain</span>
      </div>
    </div>
  `,
    choices: ["Continue"],
    on_load: function () {
        const btn = document.querySelector(".jspsych-btn");
        const slider = document.getElementById("cert");
        btn.disabled = true;

        this.rule_certainty = null;

        slider.addEventListener("input", () => {
            slider.classList.remove("inactive");
            btn.disabled = false;
            this.rule_certainty = Number(slider.value);
        });
    },
    on_finish: function (data) {
        data.trial_type = "rule_cert_rating";
        data.rule_certainty = this.rule_certainty;
    }
};

timeline.push(rule_conf)

var submit_alt_rule = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: false,
    stimulus: `
  <p>Thank you for submitting the rule!<br>In the boxes below, please provide as many alterntive rules as you can.<br>
  What else could have been the robot's rule?</p>
  <div>
 <div id="alt-rules">
  ${[1, 2, 3, 4, 5, 6].map(i => `
    <input
      type="text"
      class="alt-rule-input"
      placeholder="Alternative rule ${i}"
      style="
        width:500px;
        font-size:14px;
        padding:8px;
        margin-bottom:10px;
      "
    />
  `).join("")}
</div>
  </div>
  <button
  id="submit-rule-btn"
  disabled
  style="
  position: fixed;
  bottom: 200px;
  right: 200px;
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
        const ruleInputs = Array.from(
            document.querySelectorAll(".alt-rule-input")
        );

        function checkInput() {
            const anyFilled = ruleInputs.some(inp => inp.value.trim() !== "");
            subBtn.disabled = !anyFilled;
            subBtn.style.opacity = anyFilled ? 1 : 0.5;
            subBtn.style.cursor = anyFilled ? "pointer" : "default";
        }

        ruleInputs.forEach(inp =>
            inp.addEventListener("input", checkInput)
        );

        checkInput();

        subBtn.addEventListener("click", () => {
            const alternative_rules = ruleInputs
                .map(inp => inp.value.trim())
                .filter(v => v !== "");

            jsPsych.finishTrial({
                alternative_rules: alternative_rules
            });
        });
    }
}

timeline.push(submit_alt_rule)

var att_check = {
    type: jsPsychSurvey,

    survey_json: {
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "att_check_instructions",
                        html: `
              <p><strong>What is your favorite hobby?</strong><br><br>
              In psychology studies, researchers are sometimes interested in participants' personal preferences,
              such as hobbies. In this question, instead of asking about your hobbies, we want to make sure that
              you are taking the time to read the questions in their entirety. If not, the results of our study
              would not be reliable or useful for answering our research questions. Therefore, please select the
              option "Other" among the responses below and write "I have read this" to indicate that you are paying attention.</p>
              `
                    },
                    {
                        type: "radiogroup",
                        name: "att_check",
                        title: " ",
                        choices: ["Cooking", "Running", "Listening to music", "Watching TV/movies"],
                        showOtherItem: true,
                        isRequired: true,
                        otherPlaceholder: "Type your response here"
                    }
                ]
            }
        ]
    },

    on_finish: function (data) {
        const response = data.response.att_check;
        const otherText = data.response["att_check-Other"];

        data.attention_passed =
            response === "Other" &&
            otherText &&
            otherText.trim().toLowerCase() === "i have read this";
    }
};

timeline.push(att_check)

var scales_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Thank you for completing the task. Your final reward amount is being calculated. <br>
    Please answer some survey questions before finishing the study.<br>
    Press the <span class="kbd">SPACE</span> bar to proceed</p>`,
    choices: [" "]
}

timeline.push(scales_intro)

const char = [
    "Not at all characteristic of me",
    "",
    "",
    "",
    "Entirely characteristic of me"
];

const ius = [
    "Unforeseen events upset me greatly.",
    "It frustrates me not having all the information I need.",
    "One should always look ahead so as to avoid surprises.",
    "A small, unforeseen event can spoil everything, even with the best of planning.",
    "I always want to know what the future has in store for me.",
    "I can’t stand being taken by surprise.",
    "I should be able to organize everything in advance.",
    "Uncertainty keeps me from living a full life.",
    "When it’s time to act, uncertainty paralyses me.",
    "When I am uncertain I can’t function very well.",
    "The smallest doubt can stop me from acting.",
    "I must get away from all uncertain situations."
];

var ius_scale = {
    type: jsPsychSurveyLikert,
    preamble: `<p style="font-size: 20px; max-width: 800px"><strong>These statements describe how people may react to the uncertainties of life.<br>
    Please use the scale below to describe to what extent each item is characteristic of you.</strong></p>`,
    questions: ius.map(item => ({
        prompt: item,
        labels: char,
        required: false
    })),
    css_classes: ["narrow-likert"]
}

timeline.push(ius_scale)

const reg_strat_1 = [
    { id: "PRG_1", subscale: "Positive reinterpretation and growth", text: "I try to grow as a person as a result of the experience." },
    { id: "MD_1", subscale: "Mental disengagement", text: "I turn to work or other substitute activities to take my mind off things." },
    { id: "AC_1", subscale: "Active coping", text: "I concentrate my efforts on doing something about it." },
    { id: "D_1", subscale: "Denial", text: `I say to myself "this isn't real."` },
    { id: "BD_1", subscale: "Behavioral disengagement", text: "I admit to myself that I can't deal with it, and quit trying." },
    { id: "MD_2", subscale: "Mental disengagement", text: "I daydream about things other than this." },
    { id: "P_1", subscale: "Planning", text: "I make a plan of action." },
    { id: "BD_2", subscale: "Behavioral disengagement", text: "I just give up trying to reach my goal." },
    { id: "AC_2", subscale: "Active coping", text: "I take additional action to try to get rid of the problem." },
    { id: "D_2", subscale: "Denial", text: "I refuse to believe that it has happened." },
    { id: "PRG_2", subscale: "Positive reinterpretation and growth", text: "I try to see it in a different light, to make it seem more positive." },
    { id: "MD_3", subscale: "Mental disengagement", text: "I sleep more than usual." },
    { id: "P_2", subscale: "Planning", text: "I try to come up with a strategy about what to do." }
]

const reg_strat_2 = [
    { id: "BD_3", subscale: "Behavioral disengagement", text: "I give up the attempt to get what I want." },
    { id: "PRG_3", subscale: "Positive reinterpretation and growth", text: "I look for something good in what is happening." },
    { id: "P_3", subscale: "Planning", text: "I think about how I might best handle the problem." },
    { id: "D_3", subscale: "Denial", text: "I pretend that it hasn't really happened." },
    { id: "MD_4", subscale: "Mental disengagement", text: "I go to movies or watch TV, to think about it less." },
    { id: "AC_3", subscale: "Active coping", text: "I take direct action to get around the problem." },
    { id: "BD_4", subscale: "Behavioral disengagement", text: "I reduce the amount of effort I'm putting into solving the problem." },
    { id: "P_4", subscale: "Planning", text: "I think hard about what steps to take." },
    { id: "D_4", subscale: "Denial", text: "I act as though it hasn't even happened." },
    { id: "AC_4", subscale: "Active coping", text: "I do what has to be done, one step at a time." },
    { id: "PRG_4", subscale: "Positive reinterpretation and growth", text: "I learn something from the experience." },
    { id: "CERQ_1", subscale: "Rumination", text: "I often think about how I feel about what I have experienced." },
    { id: "CERQ_2", subscale: "Rumination", text: "I am preoccupied with what I think and feel about what I have experienced." },
    { id: "CERQ_3", subscale: "Rumination", text: "I want to understand why I feel the way I do about what I have experienced." },
    { id: "CERQ_4", subscale: "Rumination", text: "I dwell upon the feelings the situation has evoked in me." }
]

const how_often = [
    "I usually don't do this at all",
    "I usually do this a little bit",
    "I usually do this a medium amount",
    "I usually do this a lot"
]

var reg_scale_1 = {
    type: jsPsychSurveyLikert,
    preamble: `<p style="font-size: 20px; max-width: 800px"><strong>Please indicate how often you engage in the 
    following ways of thinking or behavior when facing stressful situations.</strong></p>`,
    questions: reg_strat_1.map(item => ({
        prompt: item.text,
        name: item.id,
        labels: how_often,
        required: false
    })),
    css_classes: ["narrow-likert"],
    data: {
        scale: "coping strategies",
        item_meta: reg_strat_1.map(({ id, subscale }) => ({ id, subscale }))
    }
}

timeline.push(reg_scale_1)

var reg_scale_2 = {
    type: jsPsychSurveyLikert,
    preamble: `<p style="font-size: 20px; max-width: 800px"><strong>Please indicate how often you engage in the 
    following ways of thinking or behavior when facing stressful situations.</strong></p>`,
    questions: reg_strat_2.map(item => ({
        prompt: item.text,
        name: item.id,
        labels: how_often,
        required: false
    })),
    css_classes: ["narrow-likert"],
    data: {
        scale: "coping strategies",
        item_meta: reg_strat_2.map(({ id, subscale }) => ({ id, subscale }))
    }
}

timeline.push(reg_scale_2)

var end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Thank you for completing the study! Your final reward amount is 7.5$. Press <span class="btn-inline">Submit</span>
    to submit your response.</p>`,
    choices: ["Submit"]
}

timeline.push(end_screen)

var redirect_back = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Thank you for completing the study! Your final reward amount is 7.5$. Press <span class="btn-inline">Submit</span>
    to submit your response.</p>`,
    choices: ["Submit"],
    on_finish: function () {
        window.location.href =
            "https://youruni.qualtrics.com/jfe/form/SV_XXXXXXXXXX?finished=1";
    }
};


jsPsych.run(timeline);