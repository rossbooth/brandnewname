// ─── State ───

const state = {
  screen: "landing",
  mode: null, // "user" | "surprise"
  answers: {
    description: "",
    q1_what: "",
    q2_who: "",
    q3_different: "",
    q4_feeling: "",
    q5_competitors: "",
    q6_winning: "",
    q7_say: "",
    followups: [], // [{ question, answer }]
  },
  followupQuestions: [],
  currentStep: 0, // 0-based index into allSteps
  totalSteps: 6,
  generationText: "",
  finalists: [],
  reportSections: {},
};

// ─── Wizard questions ───

const WIZARD_QUESTIONS = [
  {
    id: "q2_who",
    question: "Who is it for?",
    subtext: "Be specific. Not \"everyone.\"",
    context: (a) => a.description ? `You described: "${truncate(a.description, 120)}"` : null,
  },
  {
    id: "q3_different",
    question: "What makes it different?",
    subtext: "What's true about yours that nobody else is claiming? Even if you think you're a commodity — what's your version of \"our cigarettes are toasted\"?",
    context: () => null,
  },
  {
    id: "q4_feeling",
    question: "When it works perfectly, how does that make someone feel?",
    subtext: "Not what it does. How it makes them feel. Push past the first answer — go up the benefit ladder.",
    context: (a) => a.q3_different ? `You said what makes it different: "${truncate(a.q3_different, 80)}"` : null,
  },
  {
    id: "q6_winning",
    question: "How do you define winning?",
    subtext: "Not market share. What does winning actually look like for you? And what do you already have that gives you an edge?",
    context: () => null,
  },
  {
    id: "q7_say",
    question: "If the name could say one thing, what would it be?",
    subtext: "Not a tagline. The single essential message or feeling the name needs to carry.",
    context: (a) => a.q4_feeling ? `The feeling you're going for: "${truncate(a.q4_feeling, 80)}"` : null,
  },
  {
    id: "q5_competitors",
    question: "What would competitors never dare call themselves?",
    subtext: "What territory are they too afraid to claim? That's where the best names live.",
    context: () => null,
  },
];

// ─── Surprise me concepts (full answer sets) ───

const DEMO_CONCEPTS = [
  {
    description: "A premium dog food subscription that uses human-grade ingredients and ships frozen. For millennial dog owners who treat their pets like family members.",
    q1_what: "A frozen, human-grade dog food subscription. Monthly deliveries of pre-portioned meals made from ingredients you'd find in your own kitchen.",
    q2_who: "Millennial and Gen-Z dog owners who call themselves 'dog parents,' spend more on their pet than themselves, and feel guilty about feeding kibble.",
    q3_different: "Actually human-grade — cooked in USDA-certified kitchens, not pet food factories. You could eat it yourself. Shipped frozen, not shelf-stable.",
    q4_feeling: "Like the best dog parent in the room. Peace of mind that they're doing right by their dog. Pride when their dog is visibly healthier.",
    q6_winning: "Winning means being the brand that dog parents trust more than any vet recommendation. We already have USDA certification and a supply chain that no startup can replicate overnight.",
    q7_say: "This is real food, made with love — the way it should have always been.",
    q5_competitors: "None of them would call themselves something warm and personal. They all hide behind clinical nutrition language.",
  },
  {
    description: "A pocket-sized portable espresso maker that uses no electricity — just hand pressure. For hikers, travelers, and coffee snobs who refuse to drink bad coffee on the road.",
    q1_what: "A small, manual espresso maker that fits in a backpack. No batteries, no pods, no electricity — just ground coffee, hot water, and hand pressure.",
    q2_who: "Outdoor enthusiasts and frequent travelers who are also serious about espresso. People who'd rather skip coffee than drink gas station drip.",
    q3_different: "True 9-bar pressure from a hand pump — actual espresso, not just strong coffee. Weighs under 300g. No proprietary pods or capsules.",
    q4_feeling: "Self-reliance. A moment of ritual and control in unpredictable environments. The satisfaction of craft even at 12,000 feet.",
    q6_winning: "Winning means every serious coffee lover owns one. Our edge is the engineering — 9-bar hand pressure in a sub-300g package. Nobody else has solved that physics problem.",
    q7_say: "Your standards don't stop at the trailhead.",
    q5_competitors: "They'd never call themselves something sharp or precise — they're all 'adventure' and 'go' branding.",
  },
  {
    description: "A luxury candle brand where every scent is based on a specific place and time — like 'Paris, 4am' or 'Big Sur after rain.' For design-conscious adults who want their home to tell a story.",
    q1_what: "A luxury candle line where each scent recreates a specific moment in a specific place. Not 'lavender' — 'Kyoto, first snow.'",
    q2_who: "Design-conscious adults 28-45 who curate their home environment. People who buy Aesop, read Kinfolk, and choose objects that say something.",
    q3_different: "We sell moments, not ingredients. Every candle is a place and a time — it transports you. The scent design is narrative, not just aromatic.",
    q4_feeling: "Transported. Nostalgic for something they may never have experienced. A sense that their home contains worlds.",
    q6_winning: "Winning means being the candle brand that people display like art, not hide in a cabinet. We have a perfumer who trained in Grasse and a narrative design process nobody else uses.",
    q7_say: "Every room holds a world you haven't visited yet.",
    q5_competitors: "They'd never name themselves after an emotion or a feeling. They're all French words and botanical Latin.",
  },
  {
    description: "A personal finance app built specifically for freelancers — it tracks irregular income, auto-estimates quarterly taxes, and gives you a daily 'safe to spend' number.",
    q1_what: "A finance app for freelancers. It watches your irregular income, auto-withholds for taxes, and shows you one number every morning: what you can safely spend today.",
    q2_who: "Freelancers, contractors, gig workers — anyone whose paycheck is different every month. 25-40, digitally native, currently using anxiety and spreadsheets.",
    q3_different: "Every other finance app assumes biweekly paychecks. We're built from scratch for irregular income. The daily safe-to-spend number doesn't exist anywhere else.",
    q4_feeling: "The anxiety goes away. They stop doing mental math at the grocery store. They feel as financially stable as someone with a salary.",
    q6_winning: "Winning means every freelancer's first app download after going independent. Our edge is the algorithm — we've modeled 50K+ irregular income patterns to predict cash flow.",
    q7_say: "You can breathe now.",
    q5_competitors: "They'd never call themselves something vulnerable or human. They're all speed and guard and budget.",
  },
  {
    description: "A sparkling water brand sourced from high-altitude natural springs with naturally occurring carbonation. For health-conscious adults who've graduated past LaCroix.",
    q1_what: "Premium sparkling water from springs above 10,000 feet. The carbonation is naturally occurring, not injected. Sold in minimal cans.",
    q2_who: "Health-conscious adults 25-45 who drink sparkling water daily and have outgrown LaCroix. They want something that feels elevated but not pretentious.",
    q3_different: "Altitude. The water is formed under pressure at extreme elevation. Natural carbonation, not added. The mineral content gives it a sharper, crisper bite.",
    q4_feeling: "Sharp. Clean. Clear-headed. Like they've upgraded without trying. An effortless sense of refinement.",
    q6_winning: "Winning means replacing LaCroix in the fridge of every health-conscious household. Our edge is the source — a single high-altitude spring with natural carbonation that can't be replicated.",
    q7_say: "Elevation in every sip.",
    q5_competitors: "They'd never call themselves something precise or architectural. They're all soft pastels and fake-European names.",
  },
  {
    description: "An AI tutor for kids aged 6-12 that teaches math through storytelling and adventure games. The child is the hero of the story and the math is woven into the quest.",
    q1_what: "An app that teaches math to kids through interactive stories. The child is the main character, and solving math problems advances the plot.",
    q2_who: "Parents of 6-12 year olds who want their kids to learn math but are tired of boring drill apps. Kids who love stories but hate worksheets.",
    q3_different: "The math isn't gamified — it's narrativized. The story doesn't work without the math. It's not a reward for doing math; the math IS the adventure.",
    q4_feeling: "Parents feel relief and pride. Kids feel like heroes. The dread around math transforms into anticipation.",
    q6_winning: "Winning means kids asking to do math. Our edge is the narrative engine — stories that adapt to each child's level so they're always in flow state, never bored, never stuck.",
    q7_say: "Math is the adventure, not the obstacle.",
    q5_competitors: "They'd never call themselves something bold or adventurous. They're all 'Learn' and 'Math' and primary colors.",
  },
];

// ─── DOM refs ───

const $ = (id) => document.getElementById(id);
const screens = {
  landing: $("screen-landing"),
  surprise: $("screen-surprise"),
  wizard: $("screen-wizard"),
  loading: $("screen-loading"),
  results: $("screen-results"),
};

// ─── Screen management ───

function showScreen(name) {
  state.screen = name;
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  screens[name].hidden = false;
  Object.entries(screens).forEach(([k, s]) => { if (k !== name) s.hidden = true; });

  // Progress bar
  const progressBar = $("progress-bar");
  if (name === "wizard") {
    progressBar.hidden = false;
    updateProgress();
  } else if (name === "landing" || name === "results") {
    progressBar.hidden = true;
  }

  // Wide layout for results
  if (name === "results") {
    document.body.classList.add("results-mode");
  } else {
    document.body.classList.remove("results-mode");
  }

  window.scrollTo(0, 0);
}

function updateProgress() {
  const pct = ((state.currentStep + 1) / state.totalSteps) * 100;
  $("progress-fill").style.width = `${Math.min(pct, 100)}%`;
}

// ─── Landing ───

$("landing-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = $("landing-textarea").value.trim();
  if (!desc) return;
  state.mode = "user";
  state.answers.description = desc;
  state.answers.q1_what = desc; // Landing textarea IS the "what are you building" answer
  state.currentStep = 0;
  showWizardStep();
});

$("btn-surprise").addEventListener("click", () => {
  const concept = DEMO_CONCEPTS[Math.floor(Math.random() * DEMO_CONCEPTS.length)];
  state.mode = "surprise";
  state.answers.description = concept.description;
  state.answers.q1_what = concept.q1_what;
  state.answers.q2_who = concept.q2_who;
  state.answers.q3_different = concept.q3_different;
  state.answers.q4_feeling = concept.q4_feeling;
  state.answers.q6_winning = concept.q6_winning;
  state.answers.q7_say = concept.q7_say;
  state.answers.q5_competitors = concept.q5_competitors;

  $("surprise-description").textContent = concept.description;
  showScreen("surprise");
});

$("btn-surprise-go").addEventListener("click", () => {
  state.currentStep = 0;
  showWizardStep();
});

// ─── Wizard ───

function showWizardStep() {
  const allSteps = getAllSteps();
  const step = allSteps[state.currentStep];
  if (!step) return;

  state.totalSteps = allSteps.length;

  const ctx = step.context ? step.context(state.answers) : null;
  $("wizard-context").textContent = ctx || "";
  $("wizard-context").hidden = !ctx;
  $("wizard-question").textContent = step.question;
  $("wizard-subtext").textContent = step.subtext || "";
  $("wizard-subtext").hidden = !step.subtext;

  const ta = $("wizard-textarea");
  ta.value = state.mode === "surprise" ? (state.answers[step.id] || step.prefill || "") : (state.answers[step.id] || "");
  ta.placeholder = "Your response...";
  if (state.mode === "user") ta.focus();

  // Skip button: surprise mode, step >= 1 (Q3+ i.e. second wizard step since Q1 is skipped)
  $("btn-skip").hidden = !(state.mode === "surprise" && state.currentStep >= 1);

  // Back button: hide on first step
  $("btn-back").hidden = state.currentStep === 0;

  showScreen("wizard");
}

function getAllSteps() {
  const steps = [...WIZARD_QUESTIONS];
  // Add follow-up questions if they exist
  for (let i = 0; i < state.followupQuestions.length; i++) {
    steps.push({
      id: `followup_${i}`,
      question: state.followupQuestions[i],
      subtext: "",
      context: () => null,
      isFollowup: true,
      followupIndex: i,
    });
  }
  return steps;
}

$("btn-next").addEventListener("click", () => {
  const allSteps = getAllSteps();
  const step = allSteps[state.currentStep];
  const ta = $("wizard-textarea");
  const value = ta.value.trim();

  if (!value && state.mode === "user") {
    ta.focus();
    return;
  }

  // Save answer
  if (step.isFollowup) {
    if (!state.answers.followups) state.answers.followups = [];
    state.answers.followups[step.followupIndex] = {
      question: step.question,
      answer: value,
    };
  } else {
    state.answers[step.id] = value;
  }

  // Next step
  state.currentStep++;

  if (state.currentStep < allSteps.length) {
    showWizardStep();
  } else if (state.followupQuestions.length === 0 && state.currentStep === WIZARD_QUESTIONS.length) {
    // Just finished base questions — get follow-ups
    fireFollowupCall();
  } else {
    // Finished all steps (including follow-ups) — generate
    fireGenerateCall();
  }
});

$("btn-back").addEventListener("click", () => {
  if (state.currentStep > 0) {
    state.currentStep--;
    showWizardStep();
  }
});

$("btn-skip").addEventListener("click", () => {
  // Save current answer if filled
  const allSteps = getAllSteps();
  const step = allSteps[state.currentStep];
  const value = $("wizard-textarea").value.trim();
  if (value && step) {
    if (step.isFollowup) {
      state.answers.followups[step.followupIndex] = { question: step.question, answer: value };
    } else {
      state.answers[step.id] = value;
    }
  }
  // Skip straight to generation
  fireGenerateCall();
});

// ─── Follow-up call ───

async function fireFollowupCall() {
  showScreen("loading");
  $("loading-text").textContent = "Reviewing your answers...";

  try {
    const res = await fetch("/api/followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: state.answers }),
    });
    const data = await res.json();

    if (data.questions && data.questions.length > 0) {
      state.followupQuestions = data.questions.slice(0, 2);
      state.totalSteps = WIZARD_QUESTIONS.length + state.followupQuestions.length;
      // currentStep is already at WIZARD_QUESTIONS.length, which is the first follow-up
      showWizardStep();
    } else {
      // No follow-ups needed — go straight to generation
      fireGenerateCall();
    }
  } catch (err) {
    console.error("Follow-up call failed:", err);
    // Graceful degradation — skip follow-ups
    fireGenerateCall();
  }
}

// ─── Generation call (streaming) ───

async function fireGenerateCall() {
  showScreen("loading");
  $("loading-text").textContent = "Step 1 of 5 — Synthesizing discovery";
  $("loading-subtext").textContent = "";
  $("loading-bar").style.width = "5%";
  state.generationText = "";
  startLoadingTips();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: state.answers }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            $("loading-text").textContent = `Error: ${parsed.error}`;
            return;
          }
          if (parsed.text) {
            state.generationText += parsed.text;
            updateLoadingPhase(state.generationText);
          }
        } catch {}
      }
    }

    // Done streaming — parse and show results
    parseAndShowResults();
  } catch (err) {
    console.error("Generation failed:", err);
    $("loading-text").textContent = "Something went wrong. Please try again.";
  }
}

// Rotating loading tips
const LOADING_TIPS = [
  "Analyzing your competitive landscape...",
  "Building a list of forbidden words — names competitors would use...",
  "The best brand names are surprisingly familiar. Easy to say, hard to forget.",
  "Blackberry was named for a phone because it looked like one. The best names have a story.",
  "Mapping the emotional territory your name needs to own...",
  "Swiffer was coined to sound fast, clean, and effortless. Sound matters.",
  "We generate 150+ candidates before cutting a single one.",
  "Setting up 3 parallel creative teams hunting in different territories...",
  "A great name makes competitors uncomfortable. Comfort is the enemy.",
  "Processing fluency + surprise = the magic formula.",
  "Pentium was built from 'penta' (five) — simple roots, powerful names.",
  "Checking sound symbolism: plosives for power, sibilants for speed...",
  "The right name is polarizing. If everyone likes it, it's probably boring.",
];

let tipInterval = null;
let tipIndex = 0;

function startLoadingTips() {
  stopLoadingTips();
  tipIndex = Math.floor(Math.random() * LOADING_TIPS.length);
  $("loading-subtext").textContent = LOADING_TIPS[tipIndex];
  tipInterval = setInterval(() => {
    tipIndex = (tipIndex + 1) % LOADING_TIPS.length;
    const sub = $("loading-subtext");
    sub.style.opacity = "0";
    setTimeout(() => {
      sub.textContent = LOADING_TIPS[tipIndex];
      sub.style.opacity = "1";
    }, 300);
  }, 4000);
}

function stopLoadingTips() {
  if (tipInterval) { clearInterval(tipInterval); tipInterval = null; }
}

function updateLoadingPhase(text) {
  const el = $("loading-text");
  const sub = $("loading-subtext");
  const bar = $("loading-bar");
  if (text.includes("## STEP 5") || text.includes("## FINAL PRESENTATION")) {
    stopLoadingTips();
    el.textContent = "Step 5 of 5 — Presenting your finalists";
    sub.textContent = "Almost there...";
    bar.style.width = "92%";
  } else if (text.includes("GATE 4") || text.includes("## STEP 4") || text.includes("## SCREENING")) {
    stopLoadingTips();
    el.textContent = "Step 4 of 5 — Screening & validation";
    sub.textContent = "Applying processing fluency, surprise, sound symbolism, competitive moat, and trademark checks";
    bar.style.width = "75%";
  } else if (text.includes("GATE 3") || text.includes("Check 3")) {
    stopLoadingTips();
    el.textContent = "Step 3 of 5 — Validating name ocean";
    sub.textContent = "Checking volume and diversity across all 7 name types";
    bar.style.width = "60%";
  } else if (text.includes("## STEP 3") || text.includes("## NAME OCEAN")) {
    stopLoadingTips();
    el.textContent = "Step 3 of 5 — Generating 150+ candidates";
    sub.textContent = "Hunting across 7 name types: warm words, sharp words, coined, bold claims, compounds, foreign roots, pattern-breakers";
    bar.style.width = "40%";
  } else if (text.includes("## STEP 2") || text.includes("## TREASURE MAP")) {
    stopLoadingTips();
    el.textContent = "Step 2 of 5 — Designing the treasure map";
    sub.textContent = "Setting up 3 parallel creative teams with different hunting territories";
    bar.style.width = "20%";
  } else if (text.includes("## STEP 1") || text.includes("## DISCOVERY")) {
    el.textContent = "Step 1 of 5 — Synthesizing discovery";
    bar.style.width = "10%";
  }
}

// ─── Parse results ───

function parseAndShowResults() {
  const text = state.generationText;

  // Parse sections by ## headings — handle both "## STEP X: NAME" and "## NAME" formats
  const sections = {};
  const sectionOrder = [
    { key: "DISCOVERY SUMMARY", patterns: ["DISCOVERY SUMMARY", "STEP 1"] },
    { key: "TREASURE MAP", patterns: ["TREASURE MAP", "STEP 2"] },
    { key: "NAME OCEAN", patterns: ["NAME OCEAN", "STEP 3"] },
    { key: "SCREENING", patterns: ["SCREENING", "STEP 4"] },
    { key: "FINAL PRESENTATION", patterns: ["FINAL PRESENTATION", "STEP 5"] },
  ];
  for (const { key, patterns } of sectionOrder) {
    for (const pat of patterns) {
      const regex = new RegExp(`## ${pat}[^\\n]*\\n([\\s\\S]*?)(?=\\n## (?:STEP|DISCOVERY|TREASURE|NAME OCEAN|SCREENING|FINAL|FULL METHODOLOGY)|$)`, "i");
      const match = text.match(regex);
      if (match && match[1].trim()) {
        sections[key] = match[1].trim();
        break;
      }
    }
    if (!sections[key]) sections[key] = "";
  }
  state.reportSections = sections;

  // Parse finalists
  state.finalists = parseFinalists(sections["FINAL PRESENTATION"] || text);

  if (state.finalists.length === 0) {
    // Fallback — try parsing from full text
    state.finalists = parseFinalists(text);
  }

  renderResults();
}

function parseFinalists(text) {
  const finalists = [];
  const skipWords = ["final presentation", "phase", "discovery", "generation", "screening", "narrowing", "treasure map", "name ocean", "team 1", "team 2", "team 3", "full context", "added element", "category transplant", "here are", "your names", "conclusion", "guidance", "summary", "non-negotiable", "gate ", "check ", "✅", "❌", "mandatory", "validation", "forbidden", "volume", "self-check", "final self", "violations", "replacements"];

  const sections = text.split(/^#{3,4} /gm);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split("\n");
    const name = lines[0].trim().replace(/^\d+\.\s*/, "");

    if (!name || name.length < 2 || name.length > 30) continue;
    if (skipWords.some((s) => name.toLowerCase().includes(s))) continue;

    const rest = lines.slice(1).join("\n").trim();

    // Extract type tag
    let type = "";
    const typeMatch = rest.match(/^\*([^*]+)\*/);
    if (typeMatch) type = typeMatch[1].trim();

    // Extract specific fields using bold labels
    const extract = (label) => {
      const re = new RegExp(`\\*\\*${label}:?\\*\\*\\s*(.+?)(?=\\n\\*\\*|\\n---|\n#{2,}|$)`, "s");
      const m = rest.match(re);
      return m ? m[1].trim() : "";
    };

    const tagline = extract("Tagline");
    const story = extract("The story") || extract("Why it works");
    const headline = extract("Headline test");
    const intro = extract("Introduction test");
    const polarization = extract("Polarization check");
    const trademark = extract("Trademark outlook");
    const pairWith = extract("Pair it with");

    if (name) finalists.push({ name, type, story, tagline, headline, intro, polarization, trademark, pairWith });
  }

  return finalists;
}

// ─── Render results ───

function renderResults() {
  showScreen("results");

  // Gallery
  const gallery = $("results-gallery");
  gallery.innerHTML = "";

  const productDesc = state.answers.description;

  state.finalists.forEach((f, idx) => {
    const card = document.createElement("div");
    card.className = "gallery-card";

    // Color header with name
    const header = document.createElement("div");
    header.className = "gallery-card-header";
    const palette = getNamePalette(f.name, idx);
    header.style.background = palette.bg;
    const nameDisplay = document.createElement("span");
    nameDisplay.className = "gallery-card-header-name";
    nameDisplay.textContent = f.name;
    nameDisplay.style.color = palette.text;
    header.appendChild(nameDisplay);

    // Color swatches
    const swatches = document.createElement("div");
    swatches.className = "gallery-card-swatches";
    palette.swatches.forEach(color => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = color;
      swatches.appendChild(swatch);
    });
    header.appendChild(swatches);
    card.appendChild(header);

    // Body
    const body = document.createElement("div");
    body.className = "gallery-card-body";

    const nameEl = document.createElement("div");
    nameEl.className = "gallery-card-name";
    nameEl.textContent = f.name;
    body.appendChild(nameEl);

    if (f.type) {
      const typeEl = document.createElement("div");
      typeEl.className = "gallery-card-type";
      typeEl.textContent = f.type;
      body.appendChild(typeEl);
    }

    if (f.story) {
      const storyEl = document.createElement("div");
      storyEl.className = "gallery-card-story";
      storyEl.textContent = f.story;
      body.appendChild(storyEl);
    }

    if (f.tagline) {
      const tagEl = document.createElement("div");
      tagEl.className = "gallery-card-tagline";
      tagEl.textContent = `"${f.tagline.replace(/^["']|["']$/g, "")}"`;
      body.appendChild(tagEl);
    }

    // Key details visible
    const visibleDetails = [];
    if (f.headline) visibleDetails.push({ label: "Headline", text: f.headline });
    if (f.intro) visibleDetails.push({ label: "Intro", text: f.intro });
    if (f.polarization) visibleDetails.push({ label: "Polarization", text: f.polarization });
    if (f.trademark) visibleDetails.push({ label: "Trademark", text: f.trademark });

    if (visibleDetails.length > 0) {
      const detailsEl = document.createElement("details");
      detailsEl.className = "gallery-card-details";
      detailsEl.open = true;
      const summary = document.createElement("summary");
      summary.textContent = "More details";
      detailsEl.appendChild(summary);
      visibleDetails.forEach(d => {
        const row = document.createElement("div");
        row.className = "detail-row";
        row.innerHTML = `<span class="detail-label">${d.label}</span> ${d.text}`;
        detailsEl.appendChild(row);
      });
      body.appendChild(detailsEl);
    }

    card.appendChild(body);
    gallery.appendChild(card);
  });

  // Report
  renderReport();
}

// ─── Name-derived color palettes ───

// 6 distinct palettes guaranteed to look different from each other
const FIXED_PALETTES = [
  { // Deep navy / electric blue
    bg: "linear-gradient(135deg, #0f1b2d, #1a3a5c)",
    text: "#e8f0ff",
    swatches: ["#2563eb", "#60a5fa", "#0f1b2d", "#dbeafe", "#1e40af"],
  },
  { // Warm terracotta / sand
    bg: "linear-gradient(135deg, #5c2e0e, #a0522d)",
    text: "#fef3e2",
    swatches: ["#d97706", "#fbbf24", "#92400e", "#fef3c7", "#451a03"],
  },
  { // Forest green / moss
    bg: "linear-gradient(135deg, #0b2e1a, #2d5a3d)",
    text: "#e6f5ec",
    swatches: ["#16a34a", "#86efac", "#14532d", "#bbf7d0", "#052e16"],
  },
  { // Deep plum / violet
    bg: "linear-gradient(135deg, #2e1065, #5b21b6)",
    text: "#f3e8ff",
    swatches: ["#8b5cf6", "#c4b5fd", "#3b0764", "#ede9fe", "#1e1b4b"],
  },
  { // Charcoal / warm grey
    bg: "linear-gradient(135deg, #1c1917, #44403c)",
    text: "#f5f5f4",
    swatches: ["#a8a29e", "#e7e5e4", "#292524", "#d6d3d1", "#0c0a09"],
  },
  { // Ocean teal / coral accent
    bg: "linear-gradient(135deg, #0c2a2a, #155e63)",
    text: "#e0f7fa",
    swatches: ["#0891b2", "#67e8f9", "#f97316", "#164e63", "#ecfdf5"],
  },
];

function getNamePalette(name, idx) {
  return FIXED_PALETTES[idx % FIXED_PALETTES.length];
}

function renderReport() {
  const container = $("report-content");
  container.innerHTML = "";

  const sectionConfigs = [
    { key: "DISCOVERY SUMMARY", label: "Discovery Summary", open: true },
    { key: "TREASURE MAP", label: "Treasure Map", open: false },
    { key: "NAME OCEAN", label: "Name Ocean", open: false },
    { key: "SCREENING", label: "Screening & Semifinalists", open: false },
    { key: "FINAL PRESENTATION", label: "Final Analysis", open: true },
  ];

  for (const cfg of sectionConfigs) {
    const content = state.reportSections[cfg.key];
    if (!content) continue;

    const details = document.createElement("details");
    details.className = "report-section";
    if (cfg.open) details.open = true;

    const summary = document.createElement("summary");
    summary.textContent = cfg.label;
    details.appendChild(summary);

    const inner = document.createElement("div");
    inner.className = "report-section-content";
    inner.innerHTML = renderMarkdown(content);
    details.appendChild(inner);

    container.appendChild(details);
  }
}

// ─── Start over ───

$("btn-start-over").addEventListener("click", () => {
  state.mode = null;
  state.answers = { description: "", q1_what: "", q2_who: "", q3_different: "", q4_feeling: "", q5_competitors: "", q6_winning: "", q7_say: "", followups: [] };
  state.followupQuestions = [];
  state.currentStep = 0;
  state.totalSteps = 6;
  state.generationText = "";
  state.finalists = [];
  state.reportSections = {};
  $("landing-textarea").value = "";
  $("results-gallery").innerHTML = "";
  $("report-content").innerHTML = "";
  showScreen("landing");
});

// ─── Utilities ───

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (/^<[hulo]|^<hr|^<li|^<table|^<details/.test(block)) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
  return html;
}

// ─── Init ───

showScreen("landing");
