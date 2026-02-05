

// ---------- Prolific helpers ----------
function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

const prolificInfo = {
    prolific_pid: getUrlParam("PROLIFIC_PID"),
    study_id: getUrlParam("STUDY_ID"),
    session_id: getUrlParam("SESSION_ID")
};


async function saveDataToServer(payload, prolificInfo = {}, meta = {}) {
    const SAVE_URL = "https://decisiontask.gse.harvard.edu/api/save.php";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        const res = await fetch(SAVE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prolificInfo, meta, payload }),
            signal: controller.signal
        });

        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = null; }

        if (!res.ok) throw new Error(`Save failed: HTTP ${res.status}. Body: ${text}`);
        if (!json || json.ok !== true) throw new Error(`Save failed: unexpected response: ${text}`);

        return json;
    } finally {
        clearTimeout(timeoutId);
    }
}

var jsPsych = initJsPsych({});

let study_completed = false;

var timeline = [];

var consent_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
     <div style="max-width: 800px; margin: auto; text-align: left; font-size: 16px; line-height: 1.6;">
      <h2 style="text-align: center;">Consent form</h2>
      <p style="text-align: left;">Study Title: Online studies of causal cognition</p>
      <p style="text-align: left;">Researcher: Elizabeth Bonawitz, Ph.D</p>
      
      <p>Dear Participants,</p>
      
      <h3>Key Information</h3>
      <p>The following is a short summary of this study to help you decide whether or not to be a part of this study. More detailed information is listed later on in this form.</p>
      
      <h4>Why am I being invited to take part in a research study?</h4>
      <p>We invite you to take part in a research study because you are among the eligible participants for this study, which includes adults age 18 or older.</p>
      
      <h4>What should I know about a research study?</h4>
      <ul>
        <li>The research study will be explained to you via online instructions or survey information.</li>
        <li>Whether or not you take part is up to you.</li>
        <li>Your participation is completely voluntary.</li>
        <li>You can choose not to take part.</li>
        <li>You can agree to take part and later change your mind.</li>
        <li>Your decision will not be held against you.</li>
        <li>Your refusal to participate will not result in any consequences or any loss of benefits that you are otherwise entitled to receive.</li>
        <li>You can ask all the questions you want before you decide.</li>
      </ul>
      
      <h4>Why is this research being done?</h4>
      <p>The purpose of this research is to understand how people are able to learn from their interactions with objects, events, and other people. We are currently studying individuals' learning and development in multiple domains, including causal, visual, language and memory.</p>
      
      <h4>How long will the research last and what will I need to do?</h4>
      <p>This session will take approximately 20 minutes (including filling out this consent form).</p>
      <p>During the self-guided session, you may be presented with objects or images or watch a video clip and answer questions. There are no "right or wrong" responses to any of these questions—we simply want to find out how people approach objects and situations. Please note that you are NOT being evaluated academically or psychologically, we are simply conducting basic research.</p>
      
      <h4>Is there any way being in this study could be bad for me?</h4>
      <p>We don't believe there are any risks from participating in this research.</p>
      
      <h4>Will being in this study help me in any way?</h4>
      <p>There are no benefits to you from your taking part in this research. We cannot promise any benefits to others from your taking part in this research. However, possible benefits to others include furthering the field's understanding of cognitive development.</p>
      
      <h3>Detailed Information</h3>
      <p>The following is more detailed information about this study in addition to the information listed above.</p>
      
      <h4>What is the purpose of this research?</h4>
      <p>This research asks four specific questions in learning: (1) How do evidence and prior beliefs interact in children's causal learning? (2) What are the early developmental origins of construing and understanding events? (3) What are learning algorithms that include appropriate cognitive developmental constraints? (4) What is the role of social information in learning? This research examines the cognitive components and learning systems underlying the development and structure of both the response and detection of novel stimuli and the formation and revision of causal belief in humans across the lifespan and how these experiences may change reasoning.</p>
      
      <h4>What happens if I say yes, but I change my mind later?</h4>
      <p>You can leave the research at any time; it will not be held against you. If you wish to stop, we will end the session without penalty.</p>
      
      <h4>Audio/Video Recording</h4>
      <p>We will NOT video and/or audio record the session.</p>
      
      <h4>If I take part in this research, how will my privacy be protected? What happens to the information you collect?</h4>
      <p>Efforts will be made to limit the use and disclosure of your Personal Information, including research participation and information on this form, to people who have a need to review this information. We cannot promise complete secrecy. Organizations that may inspect and copy your information include the IRB and other representatives of this organization. If identifiers are removed from your identifiable private information that is collected during this research, that information could be used for future research studies or distributed to another investigator for future research studies without your additional informed consent.</p>
      
      <h4>Can I be removed from the research without my OK?</h4>
      <p>The person in charge of the research study or the sponsor can remove you from the research study without your approval. Possible reasons for removal include instances when the participant does not meet the eligibility criteria for the study, which may be determined by their responses to one or more of our questions during the research.</p>
      
      <h4>What else do I need to know?</h4>
      <p>This research is being funded by the Templeton Foundation, the Caplan Foundation for Early Childhood, NSF, the James F. McDonnell Foundation, the Jacobs Foundation, and funds awarded to Elizabeth Bonawitz from the Harvard Graduate School of Education and the Mind, Brain, and Behavior initiative at Harvard.</p>
      
      <h4>Compensation</h4>
      <p>If you agree to take part in this research study, you will receive compensation for your time and effort. Amazon Mechanical Turk and Prolific participants will be compensated through their respective platforms.</p>
      
      <h4>Who can I talk to?</h4>
      <p>If you have questions, concerns, or complaints, you can contact our Principal Investigator, Dr. Elizabeth Bonawitz [elizabeth_bonawitz@gse.harvard.edu].</p>
      <p>This research has been reviewed and approved by the Harvard University Area Institutional Review Board ("IRB"). You may talk to them at (617) 496-2847 or cuhs@harvard.edu if:</p>
      <ul>
        <li>Your questions, concerns, or complaints are not being answered by the research team.</li>
        <li>You cannot reach the research team.</li>
        <li>You want to talk to someone besides the research team.</li>
        <li>You have questions about your rights as a research subject.</li>
        <li>You want to get information or provide input about this research.</li>
      </ul>
    </div>
  `,
    choices: ["I consent", "I do NOT consent"],
    on_finish: function (data) {
        data.trial_cat = "consent";
        data.consented = (data.response === 0);
    }
};

timeline.push(consent_trial);

var consent_check = {
    timeline: [{
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
      <p>You have chosen not to participate.</p>
      <p>You may now close this window.</p>
    `,
        choices: [" "],
        on_finish: function () {
            jsPsych.endExperiment("No consent.");
        }
    }],
    conditional_function: function () {
        const last = jsPsych.data.get().last(1).values()[0];
        return last.consented === false;
    }
};

timeline.push(consent_check);


var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `Welcome to the study!<br><br>
    This study must be completed on a desktop or laptop computer. Mobile phones and tablets are not supported.<br><br>
    Press the <span class=kbd>SPACE</span> bar to begin.`
};
timeline.push(welcome);

var study_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
    <div style="max-width:800px"><strong>We need your help with three kinds of tasks</strong>
    <ul style="max-width:600px; text-align:left; padding-left:220px">
    <li>In the first, you will learn about a robot</li>
    <li>In the second, you will choose labels for bags</li>
    <li>Lastly, you will fill out two questionnaires about how you usually behave in different life situations.</li>
    </ul>
    <p>The whole study should take about 20 minutes.</p>
    <p><strong>Your final reward will depend on your performance in the tasks, but you will receive at least $4.50 for participating in this study.</strong></p>
    <p>Thank you for your help!</p>
    <p>Press the <span class=kbd>SPACE</span> bar to start.</p>
    `
}

timeline.push(study_intro)


var task2_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    response_ends_trial: false,
    stimulus: `
  <div style="text-align:center; font-size:20px;">
  <div id="gen-prompt" style="max-width:500px;"><strong>We need your help with a task!</strong><br><br>You will use a random number 
  generator in this task.<br>Press the button below to try it out.</div>
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
                        `Great, this is how the random number generator works. Now press the 
                        <span class="kbd">SPACE</span> bar to proceed to the task.`;

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

var task2_instructions1 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <div style="margin: 0 250px;">

  <p>This is a special robot that gets activated when its number dials
  are set according to a rule.<br><strong>Your task is to figure out the rule that makes this robot go.</strong>
  </p>
  <img src="img/rob_deact.webp" style="width: 220px;">
  <p>Press the <span class="kbd">SPACE</span> bar to see the instructions.</p>
  </div>
  `
};

timeline.push(task2_instructions1)

var task2_instructions2 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <div style="margin: 0 250px;">
  <img src="img/rob_deact.webp" style="width: 220px;">
  <div style="text-align:left; max-width:700px">
  <p style="margin-bottom:10px"><strong>The rule is not about specific numbers but a relation between three
  numbers</strong> appearing on the robot's dials.</p>
  <p style="margin-bottom:15px"> To guess the rule, you can test out different sets of numbers to 
  see which sets activate it. You can test as many number sets as you want.</p>
  <p>When you feel <strong>very confident</strong> that you have discovered the rule, click <span class="btn-inline">guess the rule</span>.</p>
  <p><strong>You will get a reward only if you guess the rule correctly</strong>, tests don't generate rewards.</p>
  </div>
  <p>Press the <span class="kbd">SPACE</span> bar to start.</p>
  </div>
  `
};

timeline.push(task2_instructions2)

var task2_trial_intro = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: `
  <div id="rob-gen-prompt" style="margin-bottom:20px;">
  <strong>The first set of test numbers will be chosen for you randomly</strong> using the random number generator you saw before.<br>
  Press the generator button to see the numbers.
  </div>

  <button id="reveal-btn" class="gen-btn" style="margin-bottom:10px;" aria-label="Reveal numbers"></button>

  <div class="robot-container">
  <img src="img/rob_deact.webp" id="robot-img" alt="Robot">

  <div class="robot-num-box" id="box1"></div>
  <div class="robot-num-box" id="box2"></div>
  <div class="robot-num-box" id="box3"></div>
  </div>

  <!-- Test button (initially hidden) -->
  <button
  id="test-robot-btn" style=" position: fixed; bottom: 300px; right: 300px; display: none; padding: 12px 18px; font-size: 16px; cursor: pointer;">
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
                    robotImg.src = "img/rob_act.webp";
                    promptText.innerHTML =
                        `This set fits the robot's rule, so it got activated!<br>Now it’s your turn to test new sets of numbers to guess this robot's rule.<br>Press the <span class="kbd">SPACE</span> bar to start.
          `
                    document.activeElement?.blur?.();
                    document.addEventListener(
                        "keydown",
                        (e) => {
                            if (e.code === "Space" || e.key === " ") {
                                e.preventDefault();
                                jsPsych.finishTrial();
                            }
                        },
                        {
                            once: true, capture: true
                        }
                    );
                }, 400);
                testBtn.disabled = true;
                testBtn.style.opacity = 0.6;
            });
    }
};

timeline.push(task2_trial_intro)

// Helper function to display tested sets
function renderTestedSetsHTML(testedSets) {
    if (!testedSets || testedSets.length === 0) {
        return `<div style="font-family:monospace;">(No sets tested yet)</div>`;
    }
    return testedSets.map(s => `
    <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-family:monospace; font-size:16px;">
      <span>${s.numbers.join(" – ")}</span>
      <span style="font-weight:bold;">${(s.result === "yes") ? "Yes" : "No"}</span>
    </div>
  `).join("");
}

const deepCopy = (x) => JSON.parse(JSON.stringify(x));

const currentAttempt = () => task2_state.attempts[task2_state.attempt_index];

const allTestedSets = () => task2_state.attempts.flatMap(a => a.tested_sets);

const task2_state = {
    attempts: [
        { tested_sets: [], rule_guess: null, rule_guess_rt: null, certainty: null },
        { tested_sets: [], rule_guess: null, rule_guess_rt: null, certainty: null }
    ],
    attempt_index: 0
};

let showed_task2_retry = false;

function ensureGivenExample() {
    const a = currentAttempt();
    if (task2_state.attempt_index === 0 && a.tested_sets.length === 0) {
        a.tested_sets.push({ numbers: [2, 4, 6], theory: "Given example", result: "yes" });
    }
}

function makeTask2TestTrial({ attemptLabel, showKnownExampleText }) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        stimulus: `
      <div style="max-width:1000px; margin:0 auto;">
        <div style="text-align:left; margin:0 auto 10px; max-width:800px;">
          <strong>Your task is to figure out the rule</strong> that makes this robot go. To test a set:
        </div>
        <ul style="list-style-position: inside; text-align: left; max-width: 500px; margin: 0 auto 10px auto; padding: 0;">
        <li>Put in three numbers in the robot's dials.</li>
        <li>Briefly explain why you are testing that set.</li>
        <li>Press <span class="btn-inline">Test the robot</span> to see if that set activates the robot.</li>
        </ul>
        <div style="text-align:left; margin: 0 auto 20px auto; max-width:800px">
        All tested sets and results will appear on the left. <strong>When you feel very confident about the rule</strong>, press
        <span class="btn-inline">Guess the rule</span> to submit your guess.
        </div>

        <div style="display:flex; gap:40px; align-items:flex-start; justify-content:center;">
        <div id="tested-sets" style="min-width:220px; font-size:16px;">
        <div style="font-weight:bold; margin-bottom:10px;">Tested sets</div>
        </div>

          <div class="robot-container">
            <img src="img/rob_deact.webp" id="robot-img" alt="Robot">
            <div class="robot-num-box" id="box1"><input class="robot-input" type="number" min="0" step="1" inputmode="numeric"></div>
            <div class="robot-num-box" id="box2"><input class="robot-input" type="number" min="0" step="1" inputmode="numeric"></div>
            <div class="robot-num-box" id="box3"><input class="robot-input" type="number" min="0" step="1" inputmode="numeric"></div>
          </div>

          <div style="min-width:260px;">
            <div style="font-weight:bold; margin-bottom:6px;">Why are you testing this set?</div>
            <textarea id="theory-input" placeholder="Write the rule you have in mind here"
              style="width:100%; height:120px; font-size:14px; padding:8px; resize:none;"></textarea>
          </div>
        </div>

        <div id="result-text" style="position:fixed; bottom:50px; right:300px; font-size:20px; text-align:center;"></div>

        <button id="test-robot-btn" disabled
          style="position:fixed; bottom:220px; right:350px; padding:12px 18px; font-size:16px; opacity:0.5; cursor:default;">
          Test the robot
        </button>

        <button id="guess-rule-btn"
          style="position:fixed; bottom:30px; right:30px; padding:12px 18px; font-size:16px; cursor:pointer;">
          Guess the rule
        </button>
      </div>
    `,

        on_load: function () {
            const tStart = performance.now();
            const attempt = currentAttempt();

            ensureGivenExample();

            const inputs = Array.from(document.querySelectorAll(".robot-input"));
            const testedSetsDiv = document.getElementById("tested-sets");
            const theoryInput = document.getElementById("theory-input");
            const testBtn = document.getElementById("test-robot-btn");
            const guessBtn = document.getElementById("guess-rule-btn");
            const robotImg = document.getElementById("robot-img");
            const resultText = document.getElementById("result-text");

            const isValidDial = (v) => /^\d+$/.test(String(v)) && Number(v) >= 0;

            inputs.forEach((inp) => {
                // Block characters that can create invalid/odd number strings in type="number"
                inp.addEventListener("keydown", (e) => {
                    if (e.key === "+" || e.key === "-" || e.key === "e" || e.key === "E" || e.key === ".") {
                        e.preventDefault();
                    }
                });

                // Reject paste if it contains anything other than digits
                inp.addEventListener("paste", (e) => {
                    const text = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(text)) {
                        e.preventDefault();
                    }
                });
            });


            const render = () => {
                testedSetsDiv.innerHTML = `
          <div style="font-weight:bold; margin-bottom:10px;">Tested sets</div>
          ${renderTestedSetsHTML(allTestedSets())}
        `;
            };

            const updateTestEnabled = () => {
                const allNumbersValid = inputs.every((inp) => isValidDial(inp.value));
                const theoryFilled = theoryInput.value.trim() !== "";
                const canTest = allNumbersValid && theoryFilled;
                testBtn.disabled = !canTest;
                testBtn.style.opacity = canTest ? 1 : 0.5;
                testBtn.style.cursor = canTest ? "pointer" : "default";
            };

            inputs.forEach(inp => inp.addEventListener("input", updateTestEnabled));
            theoryInput.addEventListener("input", updateTestEnabled);

            render();
            updateTestEnabled();

            testBtn.addEventListener("click", () => {
                const values = inputs.map(inp => Number(inp.value));
                const theoryText = theoryInput.value.trim();
                const isAscending = values[0] < values[1] && values[1] < values[2];


                const test_index = attempt.tested_sets.length + 1;

                jsPsych.data.get().push({
                    trial_cat: "robot_task",
                    attempt: attemptLabel,
                    test_index: test_index,
                    numbers: values,
                    theory: theoryText,
                    result: isAscending ? "yes" : "no",
                    ts: new Date().toISOString()
                });


                robotImg.src = isAscending ? "img/rob_act.webp" : "img/rob_deact.webp";
                resultText.textContent = isAscending
                    ? "This set fits the robot's rule!"
                    : "This set does not fit the robot's rule";

                attempt.tested_sets.push({
                    numbers: values,
                    theory: theoryText,
                    result: isAscending ? "yes" : "no"
                });

                render();

                setTimeout(() => {
                    inputs.forEach(inp => (inp.value = ""));
                    theoryInput.value = "";
                    robotImg.src = "img/rob_deact.webp";
                    resultText.textContent = "";
                    updateTestEnabled();
                }, 2500);
            });

            guessBtn.addEventListener("click", () => {
                const rt = performance.now() - tStart;
                attempt.rule_guess_rt = rt;

                jsPsych.finishTrial({
                    trial_cat: "robot_task",
                    attempt: attemptLabel, // 1 or 2
                    tested_sets_attempt: deepCopy(attempt.tested_sets),
                    tested_sets_all: deepCopy(allTestedSets()),
                    n_tests_attempt: attempt.tested_sets.length,
                    n_tests_all: allTestedSets().length,
                    rule_guess_rt: rt
                });
            });
        }
    };
}

const task2_trial1 = makeTask2TestTrial({ attemptLabel: 1, showKnownExampleText: true });
const task2_trial2 = makeTask2TestTrial({ attemptLabel: 2, showKnownExampleText: false });

function makeRuleConfidenceTrial(attemptLabel) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
       <div class="slider-question">
        <div style="font-size:20px"><strong>How confident are you that your rule correctly explains how this robot operates?</strong></div>
        <div style="font-size:15px; margin-bottom:10px">Click anywhere on the slider to indicate your answer.</div>
        <div class="slider-container">
        <input type="range" min="0" max="100" value="50" id="cert" class="confidence-slider inactive">
        <div class="slider-value">50</div>
        </div>     
        <div class="slider-labels">
          <span>Not confident at all</span>
          <span>Completely confident</span>
        </div>
       </div>
    `,
        choices: ["Continue"],
        on_load: function () {
            const btn = document.querySelector(".jspsych-btn");
            const slider = document.getElementById("cert");
            const valueLabel = slider.nextElementSibling;
            btn.disabled = true;
            this.rule_certainty = null;

            const updateValue = () => {
                const min = Number(slider.min) || 0;
                const max = Number(slider.max) || 100;
                const val = Number(slider.value);
                const percent = (val - min) / (max - min);

                valueLabel.textContent = slider.value;
                valueLabel.style.left = `${percent * 100}%`;
            };

            slider.addEventListener("input", () => {
                slider.classList.remove("inactive");
                btn.disabled = false;
                this.rule_certainty = Number(slider.value);
                updateValue();
            });
        },
        on_finish: function (data) {
            const attempt = currentAttempt();
            attempt.certainty = this.rule_certainty;

            data.trial_cat = "robot_task";
            data.attempt = attemptLabel;
            data.rule_certainty = this.rule_certainty;
        }
    };
}

const rule_conf1 = makeRuleConfidenceTrial(1);
const rule_conf2 = makeRuleConfidenceTrial(2);


function makeSubmitRuleTrial(attemptLabel) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",
        response_ends_trial: false,

        stimulus: () => `
      <div style="display:flex; gap:50px; align-items:flex-start; justify-content:center; max-width:1000px; margin:0 auto;">
        <div style="min-width:260px;">
          <div style="font-weight:bold; margin-bottom:10px;">Tested sets</div>
          <div id="tested-sets-submit">
            ${renderTestedSetsHTML(allTestedSets())}
          </div>
        </div>

        <div style="min-width:520px;">
          <p id="rule-prompt">What rule activates this robot? Write your guess here.</p>
          <textarea id="rule-input" style="width:500px; height:200px; font-size:14px; padding:8px; resize:none;"></textarea>
          <button id="submit-rule-btn" disabled
            style="position: fixed; bottom: 150px; right: 150px; padding: 12px 18px; font-size: 16px; opacity: 0.5; cursor: default;">
            Submit
          </button>
        </div>
      </div>
    `,

        on_load: function () {
            const subBtn = document.getElementById("submit-rule-btn");
            const ruleInput = document.getElementById("rule-input");
            const rulePrompt = document.getElementById("rule-prompt");

            let waitingForContinue = false;
            let stored_guess_raw = "";
            let stored_evenRule = false;

            const setBtnEnabled = (enabled) => {
                subBtn.disabled = !enabled;
                subBtn.style.opacity = enabled ? 1 : 0.5;
                subBtn.style.cursor = enabled ? "pointer" : "default";
            };

            const checkInput = () => setBtnEnabled(ruleInput.value.trim() !== "");
            ruleInput.addEventListener("input", checkInput);

            subBtn.addEventListener("click", () => {
                // If we're in the "Continue" state, finish with the stored values
                if (waitingForContinue) {
                    // store guess in attempt state (already done below, but safe)
                    const attempt = currentAttempt();
                    attempt.rule_guess = stored_guess_raw;

                    jsPsych.finishTrial({
                        trial_cat: "robot_task",
                        attempt: attemptLabel,
                        rule_guess: stored_guess_raw,
                        even_rule: stored_evenRule,

                        tested_sets_attempt: deepCopy(attempt.tested_sets),
                        tested_sets_all: deepCopy(allTestedSets())
                    });
                    return;
                }

                // First click: evaluate guess
                const guess_raw = ruleInput.value.trim();
                const guess_lc = guess_raw.toLowerCase();

                const evenRule = guess_lc !== "";

                // Store in attempt state immediately
                const attempt = currentAttempt();
                attempt.rule_guess = guess_raw;

                // If "wrong guess" AND we haven't shown retry yet → switch UI to Continue
                if (evenRule && !showed_task2_retry) {
                    showed_task2_retry = true;

                    stored_guess_raw = guess_raw;
                    stored_evenRule = true;
                    waitingForContinue = true;

                    rulePrompt.innerHTML = `
                    <p>Thank you for submitting your guess.<br>This rule might be incorrect.<br>You have another 
                    chance to try out other number sets and guess the rule again.<br>Press <span class="btn-inline">Continue</span> to proceed.</p>`;

                    subBtn.textContent = "Continue";

                    // lock input so they can't edit the submitted guess
                    ruleInput.disabled = true;

                    // enable Continue button
                    setBtnEnabled(true);
                    return;
                }

                // Otherwise: finish immediately
                jsPsych.finishTrial({
                    trial_cat: "robot_task",
                    attempt: attemptLabel,
                    rule_guess: guess_raw,
                    even_rule: evenRule,
                });
            });
        }
    };
}

const submit_rule1 = makeSubmitRuleTrial(1);
const submit_rule2 = makeSubmitRuleTrial(2);

var submit_alt_rule = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    response_ends_trial: false,

    stimulus: () => {
        ensureGivenExample();
        return `

    <div style="max-width:1100px; margin:0 auto;">

      <!-- TOP centered text -->
      <div style="text-align:center;  margin:0 auto 30px auto; line-height:1.5; max-width:800px;">
        <div style="font-size: 20px; margin-bottom:15px">
         Before you begin testing to discover the rule, use the boxes below to list <strong>as many possible rules as you can think of</strong>.
         What might the robot’s rule be?
         <br><br>You know that <span class="btn-inline" style="font-family: Orbitron">2-4-6</span> activated the robot.
         This set appears on the left with "yes" next to it.
        </div>
      </div>

      <!-- TWO-COLUMN layout -->
      <div style="display:flex; gap:40px; align-items:flex-start; justify-content:center; flex-wrap:wrap;">

        <!-- LEFT: tested sets -->
        <div style="flex:0 0 320px;">
          <div style="font-weight:bold; margin-bottom:10px;">Tested sets</div>
          <div id="tested-sets-alt"
               style="border:1px solid #ddd; border-radius:8px; padding:12px; max-height:360px; overflow:auto;">
            ${renderTestedSetsHTML(allTestedSets())}
          </div>
        </div>

        <!-- RIGHT: alternative rules -->
        <div style="flex:1; min-width:360px; max-width:560px;">
          <div id="alt-rules">
            ${[1, 2, 3, 4, 5, 6].map(i => `
              <input type="text" class="alt-rule-input"
                placeholder="Possible rule ${i}"
                style="width:100%; font-size:14px; padding:10px; margin-bottom:10px; box-sizing:border-box;" />
            `).join("")}
          </div>

          <div style="text-align:right; margin-top:8px;">
            <button id="submit-rule-btn" disabled
              style="padding:12px 18px; font-size:16px; opacity:0.5; cursor:default;">
              Submit
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
    },

    on_load: function () {
        const subBtn = document.getElementById("submit-rule-btn");
        const ruleInputs = Array.from(document.querySelectorAll(".alt-rule-input"));

        function checkInput() {
            const anyFilled = ruleInputs.some(inp => inp.value.trim() !== "");
            subBtn.disabled = !anyFilled;
            subBtn.style.opacity = anyFilled ? 1 : 0.5;
            subBtn.style.cursor = anyFilled ? "pointer" : "default";
        }

        ruleInputs.forEach(inp => inp.addEventListener("input", checkInput));
        checkInput();

        subBtn.addEventListener("click", () => {
            const alternative_rules = ruleInputs
                .map(inp => inp.value.trim())
                .filter(v => v !== "");

            jsPsych.finishTrial({
                alternative_rules,
                trial_cat: "robot_task"
            });
        });
    }
};

timeline.push(submit_alt_rule)

// Attempt 1: test → confidence → submit
const attempt1_timeline = {
    timeline: [task2_trial1, rule_conf1, submit_rule1]
};


// Attempt 2: test → confidence → submit
const attempt2_timeline = {
    timeline: [task2_trial2, rule_conf2, submit_rule2]
};


const even_rule_branch = {
    timeline: [attempt2_timeline],
    conditional_function: function () {
        const last = jsPsych.data.get().last(1).values()[0];
        const should_run = last.trial_cat === "robot_task" &&
            last.attempt === 1 &&
            last.even_rule === true;

        if (should_run) task2_state.attempt_index = 1;
        return should_run;
    }
};

timeline.push(attempt1_timeline);


timeline.push(even_rule_branch);


var robot_correct_rule = ["The correct rule for the robot is: Even number increasing by 2"]

var robot_thanks = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `<div style="max-width:800px">Thank you!<br><br>Your response is being evaluted and you will see the result on the final feedback screen.
    <br><br>Press the <span class="kbd">SPACE</span> bar to proceed.</div>`
}

timeline.push(robot_thanks)

var task1_instructions1 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <div style="max-width:800px; margin:auto; line-height:1.3;">

  <div style="display:flex; align-items:flex-start; gap:20px;">

  <!-- LEFT COLUMN: -->
  <div style="flex:1; text-align:left;">
  <p style="margin:4px 0; text-align:center">
  We need your help with another decision task!</p>
  <p>In this task, you are a helper in a barn. Your job is to prepare bags of multicolored corn seeds for sale. Unfortunately, some of the bags have lost their labels and cannot be sold as they are. Your task is to figure out which type of corn seeds is in each bag and attach the correct label.
  </p>
  <p>The only way you can tell corn types apart is the amount of yellow and blue seeds they contain. For example, in <strong>Variety A, 40% of the seeds might be blue and 60% yellow</strong>, whereas in <strong>Variety B the amounts could be 60% blue and 40% yellow</strong>.
  </p>
  <p>The bags are sealed, but each has a small opening in one corner. To figure out the corn type, you can draw seeds from this opening and use the colors you see to decide which label to attach.
  </p>
  <p style="text-align:center">Press the <span class="kbd">SPACE</span> bar to proceed.</p>
  </div>

  <!-- RIGHT COLUMN: image -->
  <div style="flex:0 0 auto; display:flex; align-items:center;">
  <img src='img/ex_1.webp' style='width:150px;'>
  </div>

  </div>
  </div>
  `
};

timeline.push(task1_instructions1);

var task1_instructions2 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [" "],
    stimulus: `
  <div style="max-width:800px; margin:auto; line-height:1.3;">
  <p>
  In this task, you may <strong>draw up to 20 corn seeds</strong> from a bag to figure out what label to put on it.
  </p>
  <p><strong>You will receive a reward for each label you attach correctly, and no reward for labels that are attached incorrectly.</strong>
  </p>
  <p>Let’s look at an example!</p>
  <p>Press the <span class="kbd">SPACE</span> bar to proceed.</p>
  </div>
  `
};

timeline.push(task1_instructions2)

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
  <div style="flex:1; padding-top:1px; display:flex; flex-direction:column; justify-content:center;">
  <style> #intro_text, #choice_prompt, #demo_text {margin: 0;}
  </style>
  <p style="margin:5px 0 2px; text-align:center;"><strong>EXAMPLE ONLY</strong></p>
  <img src='img/bag.png' style='width:180px; display:block; margin:20px auto;'>

  <div id="intro_text">You know that this bag is either <strong>LIGHTKERNEL</strong> or <strong>BRIGHTLEAF</strong> variety, but you have no idea which
  one it is. 
  <ul style="text-align:left; max-width=400px;  padding-left: 60px; list-style-position: outside;">
  <li><strong>LIGHTKERNEL</strong> seeds are about <strong>78% yellow and 2% blue.</li>
  <li>BRIGHTLEAF</strong> are the opposite – about <strong>2% yellow and 78% blue.</li>
  </ul>
  <p style="text-align:left">There are also equal small amounts of red seeds mixed in in all bags – about 20%</strong>, so you can’t tell varieties apart based on those.
  <br><strong>Red seeds don’t give you any information for choosing the right label</strong>.</p>
</div>
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
  <img src='img/ex_2.webp' style='width:150px;'>
  </div>

  </div>

  <div id="seed-area"
  style="position:fixed; bottom:0; left:0; width:100%;
  padding:10px 0; display:flex; flex-wrap:wrap; justify-content:center;
  z-index:10; border-top:1px solid #ccc;">
  </div>

  </div>
  `,
    choices: "NO_KEYS",

    on_load: function () {
        // prevent Space/Enter from activating focused buttons
        document.addEventListener("keydown", function (e) {
            if ((e.code === "Space" || e.code === "Enter") &&
                (document.activeElement && document.activeElement.tagName === "BUTTON")) {
                e.preventDefault();
            }
        }, true);

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
                ? "img/yellow_seed.webp" : "img/yellow_seed.webp";

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
                        `<p>That's a valid choice for the actual task, but for demonstration purposes, let’s see what happens when you press
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
    stimulus: `<div style="max-width:800px">Thank you!<br><br>Remember, in the actual task, <strong>you can draw up to 20 seeds from the bag before choosing a label</strong>.<br><br>
  You will get a reward for each correctly chosen label, but no reward for incorrect labels.<br><br>You will see feedback on your answers and the amount 
  of your final reward at the end of the study.<br><br>Now let’s move on to the actual task! Press the <span class="kbd">SPACE</span> bar to start.</div>`
}

timeline.push(trial_intro_text)

function makeSeedTrial(config) {
    const {
        trial_id,
        corResponse,
        gridsImage = null,
        seedImages = { yellow: "img/yellow_seed.webp", blue: "img/blue_seed.webp", red: "img/red_seed.webp" },
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
            trial_id: trial_id
        },
        stimulus: `
    <div style="max-width:800px; margin:auto; line-height:1.3; padding-bottom:120px;">

    <img src='img/bag.png'
    style='width:180px; display:block; margin:20px auto;'>

    <div style="display:flex; align-items:center; gap:20px;">

    <!-- LEFT COLUMN: -->
    <div style="flex:1; padding-top:1px; display:flex; flex-direction:column; justify-content:center;">

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
            // prevent Space/Enter from activating focused buttons
            document.addEventListener("keydown", function (e) {
                if ((e.code === "Space" || e.code === "Enter") &&
                    (document.activeElement && document.activeElement.tagName === "BUTTON")) {
                    e.preventDefault();
                }
            }, true);

            let seedCount = 0;
            let chosenLabel = null;
            let guessRT = null;
            const trialStartTime = performance.now();
            const seedArea = document.getElementById("seed-area");
            const drawButton = document.getElementById("draw-btn");
            const guessButton = document.getElementById("guess-btn");
            const promptText = document.getElementById("prompt_text");
            const onDraw = function () {
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
                    if (seedCount >= seedSequence.length) {
                        promptText.innerHTML = `You've reached the maximum number of seeds. Press <span class="btn-inline">Guess the label now</span> to choose a label.`;
                        drawButton.disabled = true;
                        drawButton.style.opacity = 0.6;
                        drawButton.style.cursor = "default";
                        return;
                    } else {
                        drawButton.disabled = false;
                        drawButton.style.opacity = 1;
                        drawButton.style.cursor = "pointer";
                    }
                }, 2000);

            }

            drawButton.addEventListener("click", onDraw);

            // --- guess behavior ---
            guessButton.addEventListener("click",
                function () {
                    drawButton.removeEventListener("click", onDraw);
                    drawButton.disabled = false;
                    drawButton.style.opacity = 1;
                    drawButton.style.cursor = "pointer";
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
                    trial_cat: "ut_task",
                    n_draws: seedCount,
                    choice: chosenLabel,
                    corResponse: corResponse,
                    correct: chosenLabel === corResponse ? 1 : 0,
                    decision_rt: guessRT
                });
            }
        }
    };
}

var trial_conditions = [{
    trial_id: "b75_y05_r20",
    introText: `<div style="text-align:left; padding-left:40px">You know that this bag is either <strong>SHADESEED or SUNMAIZE</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>SHADESEED</strong> are about <strong>75% blue and 5% yellow.</li>
    <li>SUNMAIZE</strong> are the opposite – about <strong>5% blue and 75% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
  `,
    gridsImage: "img/b75_y05_r20.webp",
    seedSequence: ["blue", "red", "blue", "red", "blue", "yellow", "blue", "blue", "red", "blue", "blue", "blue", "blue", "yellow", "red", "blue", "blue", "blue", "blue", "blue"],
    labelA: "SHADESEED",
    labelB: "SUNMAIZE",
    corResponse: "SHADESEED"
},
{
    trial_id: "b70_y10_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>WAKESOIL or SUNDRIFT</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>WAKESOIL</strong> are about <strong>70% blue and 10% yellow.</li>
    <li>SUNDRIFT</strong> are the opposite – about <strong>10% blue and 70% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `
    ,
    gridsImage: "img/b70_y10_r20.webp",
    seedSequence: ["blue", "red", "blue", "yellow", "blue", "yellow", "blue", "red", "blue", "blue", "blue", "red", "blue", "blue", "blue", "blue", "yellow", "red", "blue", "blue"],
    labelA: "WAKESOIL",
    labelB: "SUNDRIFT",
    corResponse: "WAKESOIL"
},
{
    trial_id: "b15_y65_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>DEEPSTEM or GOLDLEAF</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>DEEPSTEM</strong> are about <strong>65% blue and 15% yellow.</li>
    <li>GOLDLEAF</strong> are the opposite – about <strong>15% blue and 65% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `,

    gridsImage: "img/b15_y65_r20.webp",
    seedSequence: ["yellow", "red", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "yellow", "blue", "yellow", "yellow", "red", "yellow", "yellow", "red", "yellow", "blue", "yellow"],
    labelA: "DEEPSTEM",
    labelB: "GOLDLEAF",
    corResponse: "GOLDLEAF"
},
{
    trial_id: "b20_y60_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>TALLGRAIN or WILDLEAF</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>TALLGRAIN</strong> are about <strong>20% blue and 60% yellow.</li>
    <li>WILDLEAF</strong> are the opposite – about <strong>60% blue and 20% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `,
    gridsImage: "img/b20_y60_r20.webp",
    seedSequence: ["red", "yellow", "blue", "yellow", "red", "red", "yellow", "red", "yellow", "yellow", "yellow", "blue", "red", "yellow", "yellow", "red", "yellow", "yellow", "yellow", "blue"],
    labelA: "TALLGRAIN",
    labelB: "WILDLEAF",
    corResponse: "TALLGRAIN"
},
{
    trial_id: "b25_y55_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>FAIRMAIZE or STRONGLEAF</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>FAIRMAIZE</strong> are about <strong>55% blue and 25% yellow.</li>
    <li>STRONGLEAF</strong> are the opposite – about <strong>25% blue and 55% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `,
    gridsImage: "img/b25_y55_r20.webp",
    seedSequence: ["red", "yellow", "blue", "yellow", "blue", "yellow", "yellow", "blue", "yellow", "red", "yellow", "blue", "red", "yellow", "red", "yellow", "blue", "red", "yellow", "blue"],
    labelA: "FAIRMAIZE",
    labelB: "STRONGLEAF",
    corResponse: "STRONGLEAF"
},
{
    trial_id: "b50_y30_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>SUNKERNEL or HARVESTWELL</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>SUNKERNEL</strong> are about <strong>30% blue and 50% yellow.</li>
    <li>HARVESTWELL</strong> are the opposite – about <strong>50% blue and 30% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `,
    gridsImage: "img/b50_y30_r20.webp",
    seedSequence: ["yellow", "blue", "red", "blue", "yellow", "blue", "yellow", "red", "blue", "blue", "yellow", "red", "blue", "blue", "red", "blue", "yellow", "blue", "red", "yellow"],
    labelA: "SUNKERNEL",
    labelB: "HARVESTWELL",
    corResponse: "HARVESTWELL"
},
{
    trial_id: "b35_y45_r20",
    introText: `
    <div style="text-align:left; padding-left:40px">You know that this bag is either <strong>PUREGRAIN or MAIZELEAF</strong> variety.</div>
    <ul style="text-align:left; max-width=400px; padding-left:70px">
    <li><strong>PUREGRAIN</strong> are about <strong>45% blue and 35% yellow.</li>
    <li>MAIZELEAF</strong> are the opposite – about <strong>35% blue and 45% yellow.</strong></li>
    </ul>
    <div style="text-align:left; padding-left:40px; margin-bottom:15px"><strong>Note: About 20% of all bags are red seeds</strong> - so you can’t tell corn types apart based on those. 
    Red seeds don’t give you any information for choosing the right label.</div>
    `,
    gridsImage: "img/b35_y45_r20.webp",
    seedSequence: ["blue", "yellow", "red", "blue", "yellow", "red", "blue", "yellow", "yellow", "blue", "red", "yellow", "blue", "yellow", "red", "yellow", "blue", "blue", "yellow", "yellow"],
    labelA: "PUREGRAIN",
    labelB: "MAIZELEAF",
    corResponse: "MAIZELEAF"
}];

const itiTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:24px; text-align:center;">
  Thank you.<br><br>Next task will start in a second.
  </div>`,
    choices: "NO_KEYS",
    trial_duration: 1500
};

const sliderQs = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div style="font-size:25px; max-width:800px">
    Before moving on, answer a couple of questions <strong>about the choice you just made</strong>.
    </div>
    <div style="font-size:12px; margin-bottom:15px;">
    Click anywhere on each slider to indicate your answer.
    </div>
    <div class="slider-question">
      <p style="margin-bottom:7px"><strong>How confident do you feel about your answer?</strong></p>
      <div style="font-size:12px">0 means "Just guessing", 100 means "Compeletely confident"</div>
      <div class="slider-container">
    <input type="range" min="0" max="100" value="50"
           id="conf" class="confidence-slider inactive">
    <div class="slider-value">50</div>
  </div>  
      <div class="slider-labels">
        <span>Just guessing</span>
        <span>Completely confident</span>
      </div>
    </div>   

    <div class="slider-question">
      <p><strong>How unpleasant did it feel to decide about a label in this last task?</strong></p>
      <div class="slider-container">
    <input type="range" min="0" max="100" value="50"
           id="unpl" class="confidence-slider inactive">
    <div class="slider-value">50</div>
  </div>

      <div class="slider-labels">
        <span>Not unpleasant at all</span>
        <span>Very unpleasant</span>
      </div>
    </div>

    <div class="slider-question">
      <p style="margin-bottom:7px"><strong>What is the highest level of confidence a reasonable person could have achieved when selecting a label in the previous task?</strong></p>
      <div style="font-size:12px">0 means "Just guessing", 100 means "Compeletely confident"</div>  
      <div class="slider-container">
    <input type="range" min="0" max="100" value="50"
           id="conf_reas" class="confidence-slider inactive">
    <div class="slider-value">50</div>
  </div>
      <div class="slider-labels">
        <span>Just guessing</span>
        <span>Completely confident</span>
      </div>
    </div>
  `,


    choices: ["Continue"],
    on_load: function () {
        const touched = { conf: false, unpl: false, conf_reas: false };
        const responses = {};
        document.querySelector(".jspsych-btn").disabled = true;
        document.querySelectorAll(".confidence-slider").forEach(slider => {
            const valueLabel = slider.nextElementSibling; // <div class="slider-value">

            const updateValue = () => {
                const min = Number(slider.min) || 0;
                const max = Number(slider.max) || 100;
                const val = Number(slider.value);
                const percent = (val - min) / (max - min);

                valueLabel.textContent = slider.value;
                valueLabel.style.left = `${percent * 100}%`;
            };

            slider.addEventListener("input", () => {
                slider.classList.remove("inactive");
                touched[slider.id] = true;
                responses[slider.id] = slider.value;

                updateValue();

                if (Object.values(touched).every(Boolean)) {
                    document.querySelector(".jspsych-btn").disabled = false;
                }
            });
        });

        this.responses = responses;
    },
    on_finish: function (data) {
        const lastTrial = jsPsych.data.get().last(2).values()[0];
        data.trial_cat = "ut_task_ratings";
        data.trial_id = lastTrial.trial_id;
        data.ut_confidence = this.responses.conf;
        data.ut_unpleasantness = this.responses.unpl;
        data.ut_confidence_reasonable = this.responses.conf_reas;
    }
};

const randomized_conditions =
    jsPsych.randomization.shuffle(trial_conditions);

randomized_conditions.forEach(cond => {
    timeline.push(makeSeedTrial(cond));
    timeline.push(sliderQs);
    timeline.push(itiTrial);
});


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
        data.trial_cat = "att_check";

        data.attention_passed =
            response === "Other" &&
            otherText &&
            otherText.trim().toLowerCase() === "i have read this";
    }
};

timeline.push(att_check)

var scales_intro = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Thank you for completing the task!<br><br>Your final reward is now being calculated.<br><br>
    Before finishing the study, please answer some survey questions.<br><br>
    Your honest responses are greatly appreciated.<br><br>
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
    { id: "ius_p_1", subscale: "Prospective", text: "Unforeseen events upset me greatly." },
    { id: "ius_p_2", subscale: "Prospective", text: "It frustrates me not having all the information I need." },
    { id: "ius_p_3", subscale: "Prospective", text: "One should always look ahead so as to avoid surprises." },
    { id: "ius_p_4", subscale: "Prospective", text: "A small, unforeseen event can spoil everything, even with the best of planning." },
    { id: "ius_p_5", subscale: "Prospective", text: "I always want to know what the future has in store for me." },
    { id: "ius_p_6", subscale: "Prospective", text: "I can’t stand being taken by surprise." },
    { id: "ius_p_7", subscale: "Prospective", text: "I should be able to organize everything in advance." },
    { id: "ius_i_1", subscale: "Inhibitory", text: "Uncertainty keeps me from living a full life." },
    { id: "ius_i_2", subscale: "Inhibitory", text: "When it’s time to act, uncertainty paralyses me." },
    { id: "ius_i_3", subscale: "Inhibitory", text: "When I am uncertain I can’t function very well." },
    { id: "ius_i_4", subscale: "Inhibitory", text: "The smallest doubt can stop me from acting." },
    { id: "ius_i_5", subscale: "Inhibitory", text: "I must get away from all uncertain situations." }
];

var ius_scale = {
    type: jsPsychSurveyLikert,
    preamble: `<p style="font-size: 20px; max-width: 800px"><strong>These statements describe how people may react to the uncertainties of life.<br>
    Please use the scale below to describe to what extent each item is characteristic of you.</strong></p>`,
    questions: ius.map(item => ({
        prompt: item.text,
        name: item.id,
        labels: char,
        required: true
    })),
    css_classes: ["narrow-likert", "large-likert"],
    data: {
        trial_cat: "questionnaire",
        item_meta: ius.map(({ id, subscale }) => ({ id, subscale }))
    }
}

timeline.push(ius_scale)

const reg_strat_1 = [
    { id: "er_prg_1", subscale: "Positive reinterpretation and growth", text: "I try to grow as a person as a result of the experience." },
    { id: "er_md_1", subscale: "Mental disengagement", text: "I turn to work or other substitute activities to take my mind off things." },
    { id: "er_ac_1", subscale: "Active coping", text: "I concentrate my efforts on doing something about it." },
    { id: "er_d_1", subscale: "Denial", text: `I say to myself "this isn't real."` },
    { id: "er_bd_1", subscale: "Behavioral disengagement", text: "I admit to myself that I can't deal with it, and quit trying." },
    { id: "er_md_2", subscale: "Mental disengagement", text: "I daydream about things other than this." },
    { id: "er_p_1", subscale: "Planning", text: "I make a plan of action." },
    { id: "er_bd_2", subscale: "Behavioral disengagement", text: "I just give up trying to reach my goal." },
    { id: "er_ac_2", subscale: "Active coping", text: "I take additional action to try to get rid of the problem." },
    { id: "er_d_2", subscale: "Denial", text: "I refuse to believe that it has happened." },
    { id: "er_prg_2", subscale: "Positive reinterpretation and growth", text: "I try to see it in a different light, to make it seem more positive." },
    { id: "er_md_3", subscale: "Mental disengagement", text: "I sleep more than usual." },
    { id: "er_p_2", subscale: "Planning", text: "I try to come up with a strategy about what to do." }
]

const reg_strat_2 = [
    { id: "er_bd_3", subscale: "Behavioral disengagement", text: "I give up the attempt to get what I want." },
    { id: "er_prg_3", subscale: "Positive reinterpretation and growth", text: "I look for something good in what is happening." },
    { id: "er_p_3", subscale: "Planning", text: "I think about how I might best handle the problem." },
    { id: "er_d_3", subscale: "Denial", text: "I pretend that it hasn't really happened." },
    { id: "er_md_4", subscale: "Mental disengagement", text: "I go to movies or watch TV, to think about it less." },
    { id: "er_ac_3", subscale: "Active coping", text: "I take direct action to get around the problem." },
    { id: "er_bd_4", subscale: "Behavioral disengagement", text: "I reduce the amount of effort I'm putting into solving the problem." },
    { id: "er_p_4", subscale: "Planning", text: "I think hard about what steps to take." },
    { id: "er_d_4", subscale: "Denial", text: "I act as though it hasn't even happened." },
    { id: "er_ac_4", subscale: "Active coping", text: "I do what has to be done, one step at a time." },
    { id: "er_prg_4", subscale: "Positive reinterpretation and growth", text: "I learn something from the experience." },
    { id: "er_r_1", subscale: "Rumination", text: "I often think about how I feel about what I have experienced." },
    { id: "er_r_2", subscale: "Rumination", text: "I am preoccupied with what I think and feel about what I have experienced." },
    { id: "er_r_3", subscale: "Rumination", text: "I want to understand why I feel the way I do about what I have experienced." },
    { id: "er_r_4", subscale: "Rumination", text: "I dwell upon the feelings the situation has evoked in me." }
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
        required: true
    })),
    css_classes: ["narrow-likert", "large-likert"],
    data: {
        trial_cat: "questionnaire",
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
        required: true
    })),
    css_classes: ["narrow-likert", "large-likert"],
    data: {
        trial_cat: "questionnaire",
        item_meta: reg_strat_2.map(({ id, subscale }) => ({ id, subscale }))
    }
}

timeline.push(reg_scale_2)

const demographics = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Please answer the final questions below",
        showQuestionNumbers: "off",
        pages: [
            {
                elements: [
                    {
                        type: "text",
                        name: "age",
                        title: "What is your age?",
                        inputType: "number",
                        isRequired: true,
                        min: 18,
                        max: 120
                    },
                    {
                        type: "radiogroup",
                        name: "gender",
                        title: "What is your gender?",
                        isRequired: true,
                        choices: ["Female", "Male", "non-binary", "Other / Prefer not to say"]
                    }
                ]
            }
        ]
    }
};


timeline.push(demographics)


var feedback_trial = {
    type: jsPsychHtmlButtonResponse,
    choices: ["Finish"],
    stimulus: function () {
        const seedData = jsPsych.data.get().filter({ trial_cat: "ut_task" }).values();

        const rows = seedData.map((t, i) => {
            const ok = t.correct === true || (Number(t.correct) === 1);
            return `
        <tr>
          <td style="padding:6px 10px; border-bottom:1px solid #ddd;">${i + 1}</td>
          <td style="padding:6px 10px; border-bottom:1px solid #ddd;">${t.choice ?? ""}</td>
          <td style="padding:6px 10px; border-bottom:1px solid #ddd;">${t.corResponse ?? ""}</td>
          <td style="padding:6px 10px; border-bottom:1px solid #ddd; font-weight:600;">
            ${ok ? "Correct" : "Incorrect"}
          </td>
        </tr>
      `;
        }).join("");

        const nCorrect = seedData.filter(t => t.correct === true || (Number(t.correct) === 1)).length;

        return `
        <div style="max-width:900px; margin:0 auto; line-height:1.4;">
        <h3 style="margin-bottom:20px; font-size:20px">Results</h3>
        <div style="display:flex; gap:80px; align-items:center; justify-content:center; flex-wrap:wrap;">
        <div style="max-width:400px">
        <p style="margin-bottom:10px"><strong>The corn seeds task</strong></p>
        <p style="margin-top:0;">You answered <strong>${nCorrect}</strong> out of <strong>${seedData.length}</strong> correctly.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:12px;">
          <thead>
            <tr>
              <th style="text-align:left; padding:6px 10px; border-bottom:2px solid #999;">#</th>
              <th style="text-align:left; padding:6px 10px; border-bottom:2px solid #999;">Your choice</th>
              <th style="text-align:left; padding:6px 10px; border-bottom:2px solid #999;">Correct label</th>
              <th style="text-align:left; padding:6px 10px; border-bottom:2px solid #999;">Result</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        </div>
        <div style="max-width:400px">
        <p style="margin-bottom:10px"><strong>The robot task</strong></p>
        <p style="margin-bottom:20px">In the robot task, the correct rule that operated the robot was: any set of three numbers in ascending order.</p>
        </div>
      </div>
    `;
    }
};

timeline.push(feedback_trial)

const PROLIFIC_COMPLETION_URL =
    "https://app.prolific.com/submissions/complete?cc=C1BAE2DU";

var end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <p>Thank you for completing the study.</p>
        <p>Your final reward amount is <strong>$5.50</strong>.</p>
        <p>You will now be redirected back to Prolific to receive payment.</p>
        <p>Please click <strong>Finish</strong> to complete the study.</p>
    `,
    choices: ["Finish"],
    on_finish: async function () {
        document.body.innerHTML =
            `<p>Saving your data and redirecting you to Prolific…</p>`;

        const payload = jsPsych.data.get().values();

        try {
            await saveDataToServer(
                payload,
                prolificInfo,
                { consented: true, study: "uncertainty_task" }
            );
        } catch (err) {
            console.error("Data save failed:", err);
            // Still redirect — Prolific expects it
        }

        // Redirect to Prolific
        window.location.href = PROLIFIC_COMPLETION_URL;
    }
};


timeline.push(end_screen);


jsPsych.run(timeline);