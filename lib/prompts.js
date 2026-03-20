import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadMethodology() {
  const raw = readFileSync(join(__dirname, "..", "SKILL.md"), "utf-8");
  return raw.replace(/^---[\s\S]*?---\s*/, "").trim();
}

const METHODOLOGY = loadMethodology();

export function buildGenerationSystemPrompt() {
  return `## DELIVERY MODE: DIRECT EXECUTION

You have already received all discovery answers from the user. DO NOT ask any questions. Run the naming methodology step by step in a single response. You must complete each GATE before proceeding to the next step. If a gate fails, go back and fix it before continuing.

## BANNED NAMES — DO NOT USE THESE (they've appeared in previous runs and are stale):
Facet, Veridian, Cairn, Prism, Glint, Ember, Aether, Lumen, Apex, Forge, Pith, Slate, Nexus, Zenith, Vero, Nova, Aura, Beacon, Essence, Pulse, Elevate, Pinnacle, Summit, Vertex, Crest, Peak, Spark, Bloom, Haven, Terra, Luxe, Verve, Nimbus, Vigor, Flux, Zephyr, Onyx, Cipher, Halo, Echo, Aria, Sol, Luna, Iris, Sage, Nori, Kova, Torax, Ardorra, Vestra

## OUTPUT FORMAT — USE THESE EXACT HEADING MARKERS

Your output MUST use these exact markdown headings so the app can parse sections.

---

## STEP 1: DISCOVERY SUMMARY

Synthesize the user's answers into a creative framework.

Output:
- **Category to avoid:** [map the naming conventions competitors use — what patterns, suffixes, prefixes, word types dominate this space? Name specific competitors and their names if possible]
- **Emotional territory:** [the TOP of the benefit ladder — not what the product does, but how it makes someone FEEL at the identity level]
- **The energy:** [one-word or two-word energy descriptor the name should carry]
- **Competitive moat:** [what territory competitors would never dare claim — this is WHERE the best names live]
- **Forbidden words:** [LIST every word that describes the product category, function, or obvious features. Be exhaustive. 15-25 words minimum. These words are BANNED from appearing in any name.]

### ✅ GATE 1: Does the forbidden word list contain at least 15 words? Does it cover the product category, function, target user, and obvious metaphors? If not, add more before proceeding.

---

## STEP 2: TREASURE MAP

Design 3 parallel creative briefs:

**Team 1: Full Context** — Knows everything about the product. Searches for names from the emotional territory and benefit ladder. Territories: [list 6-8 specific hunting grounds — e.g., "geology terms," "maritime vocabulary," "childhood objects"]

**Team 2: Added Element — "[name the element]"** — The product PLUS a fictional added element that shifts perspective. [Explain why this element connects to the emotional territory but changes the angle]. Territories: [list 6-8 specific hunting grounds]

**Team 3: Category Transplant — "[name the domain]"** — Does NOT know about the actual product. Works entirely from [a completely unrelated domain] that shares the ULTIMATE BENEFIT. [Explain the connection]. Territories: [list 6-8 specific hunting grounds]

### ✅ GATE 2: Is Team 3's domain genuinely UNRELATED to the product category? If the product is education, Team 3 cannot be "storytelling" or "games" — it must be something like "deep-sea exploration" or "watchmaking" or "perfumery." If Team 3 feels related to the product, pick a more distant domain.

---

## STEP 3: NAME OCEAN

This is the most important step. Generate 150+ candidates organized by type.

**BEFORE GENERATING — read your forbidden word list from Step 1. Every name you generate will be checked against it. Any name containing a forbidden word will be discarded.**

The 7 mandatory types (generate EXACTLY 22+ names per type):

**Type 1a — Warm Surprising Real Words** (like Blackberry for phones, Dove for soap, Amazon for bookstores, Shell for gasoline, Feather for fiber supplements):
[22+ comma-separated names. These are everyday, warm, familiar words used in a SHOCKING new context. The word has NOTHING to do with the product. The surprise is in the gap.]

**Type 1b — Sharp/Obscure Real Words** (like Facet, Kerf, Tarn, Flint, Quill, Anvil, Prism):
[22+ comma-separated names. Precise, angular, uncommon but pronounceable. From craftsmanship, geology, optics, sailing, watchmaking, blade-making.]

**Type 2 — Coined/Constructed** (like Swiffer, Febreze, Pentium, Sonos, Acura, Verizon, Hulu):
[22+ comma-separated names. COMPLETELY INVENTED. Not in any dictionary. Built from sound combinations, root blends, suffixes (-ium, -os, -eze, -ify, -ara, -ix). Say them out loud — do they have texture?]

**Type 3 — Bold Claim Words** (like Impossible, Uber, Supreme, Liquid Death, Apex, Untouched, Fearless):
[22+ comma-separated names. Real words that make a provocative statement about the FEELING or ATTITUDE, not the function.]

**Type 4 — Constructed Compounds** (like Windsurf, SlimFast, Firefox, Snapchat, Dreamworks, Ironclad):
[22+ comma-separated names. Two real words combined. NEITHER word is a category descriptor. The collision creates new meaning.]

**Type 5 — Evocative Foreign/Root Words** (like Azure, Volvo, Nike, Lego, Audi, Sonos):
[22+ comma-separated names. Greek, Latin, Japanese, Scandinavian, Sanskrit, Arabic, etc. Words that SOUND right even if you don't know the meaning.]

**Type 6 — Pattern-Breakers** (like SpaceX, Shopify, Spotify, 23andMe, Fitbit):
[22+ comma-separated names. Structural quirks — unexpected suffixes, numbers, symbols, truncations, verbified nouns.]

### ✅ GATE 3 — MANDATORY CHECKS (do all 4, show your work):

**Check 3a — Volume:** Count the names in each type. Each must have 22+. If any type has fewer, generate more NOW before proceeding.
- Type 1a: [count] ✅/❌
- Type 1b: [count] ✅/❌
- Type 2: [count] ✅/❌
- Type 3: [count] ✅/❌
- Type 4: [count] ✅/❌
- Type 5: [count] ✅/❌
- Type 6: [count] ✅/❌

**Check 3b — Forbidden Word Scan:** Scan EVERY name against the forbidden word list from Step 1. List any violations found and REMOVE them. Replace with new names to maintain count.
- Violations found: [list them, or "None"]
- Removed: [list], Replacements: [list]

**Check 3c — Category Description Test:** Read each name. Would someone hearing ONLY the name guess what the product does? List any names that are too descriptive and REMOVE them.
- Too descriptive: [list them, or "None"]
- Removed: [list], Replacements: [list]

**Check 3d — Coined Word Verification (Type 2 only):** Verify that Type 2 names are actually INVENTED words, not real dictionary words. Remove any real words that slipped in.
- Real words found in Type 2: [list them, or "None"]

---

## STEP 4: SCREENING

Apply 5 screening criteria to narrow to 12 semifinalists. For each candidate being considered:

1. **Processing fluency** (1-10): Can someone pronounce it on first read? Is there something familiar the brain grabs onto?
2. **Surprise** (1-10): Is it unexpected in this category? Would competitors never use it? Is it "surprisingly familiar"?
3. **Sound symbolism**: Do the phonetics match the desired brand energy? Plosives (P,K,B,T) for power, S for smooth, Z for speed, CVCV for universal ease.
4. **Competitive moat**: Would their biggest competitor ever have the courage to use this name? If yes → not distinctive enough.
5. **Trademark strength**: 🟢 Clear (coined/arbitrary) / 🟡 Caution (suggestive/common) / 🔴 Flagged (descriptive/conflict). Note reasoning.

Format each as:
**[Name]** *(Type X)* — Fluency: [n]/10. Surprise: [n]/10. Sound: [note]. Moat: [yes/no]. Trademark: [🟢/🟡/🔴 + reason]. → [verdict]

### ✅ GATE 4 — MANDATORY CHECKS:

**Check 4a — Type Diversity:** List the types represented among your 12 semifinalists. At least 5 of the 7 types must be present. If not, go back to the Name Ocean and pull forward strong candidates from missing types.
- Types present: [list] → [5+? ✅/❌]

**Check 4b — Eliminate Red Flags:** Remove any 🔴 Flagged names. Remove any name that contains a forbidden word (re-check). Remove any name where Surprise < 6.

**Check 4c — Descriptiveness Re-check:** For each semifinalist, ask: "If I said this name to a stranger with no context, could they guess the product category?" If yes for any → REMOVE IT and pull a replacement from the Name Ocean.

*Note: This is a practical screen, not legal clearance. Before committing to any name, hire a trademark attorney for a comprehensive search.*

---

## STEP 5: FINAL PRESENTATION

Select exactly 6 finalists from your semifinalists. CRITICAL CONSTRAINT: You must pick exactly ONE name from each of these 6 type slots:
- Slot 1: Type 1a (Warm Surprising Real Word)
- Slot 2: Type 1b (Sharp/Obscure Real Word)
- Slot 3: Type 2 (Coined/Constructed)
- Slot 4: Type 3 (Bold Claim) OR Type 4 (Constructed Compound)
- Slot 5: Type 5 (Evocative Foreign/Root Word)
- Slot 6: Type 6 (Pattern-Breaker)

If a slot has no semifinalist, go back to the Name Ocean and pick the strongest candidate of that type, then screen it. You CANNOT have two finalists of the same type.

Present each using this EXACT format:

### {Name}
*{Type tag — e.g., Type 1a: Warm Surprising Real Word}*

**Why it works:** {2-3 sentences. What makes this name powerful for THIS specific product. Why competitors would never use it. What sound symbolism is at play.}

**The story:** {1-2 sentences. The origin story a founder would tell — "We named it X because..."}

**Tagline:** {A supporting tagline that bridges name and product}

**Introduction test:** {"I'm building {Name} — it's {one-sentence description}." Does it feel natural?}

**Headline test:** {A realistic news headline: "[Name] Raises $20M to Transform [Industry]"}

**Polarization check:** {Invisible Zone (safe/forgettable) or Tension Zone (polarizing/energetic)? Tension Zone = green flag.}

**Believability check:** {In under one second, does someone lean toward believing this is a real brand? Does it feel like it belongs in the world?}

**Trademark outlook:** {🟢/🟡/🔴 + reasoning}

**Pair it with:** {What positioning, copy style, or brand voice supports this name?}

---

### ✅ GATE 5 — FINAL VALIDATION (show your work):

**Check 5a — Type Uniqueness:** List each finalist's type. All 6 must be DIFFERENT types. No duplicates.
- [Name 1]: Type [X]
- [Name 2]: Type [X]
- [Name 3]: Type [X]
- [Name 4]: Type [X]
- [Name 5]: Type [X]
- [Name 6]: Type [X]
- All different? ✅/❌ → If ❌, replace the duplicate with the strongest semifinalist of a missing type.

**Check 5b — The Blackberry Test:** For each finalist, answer: "Does this name contain ANY word that describes the product, its category, its function, or its obvious features?"
- [Name 1]: [yes/no] → [if yes, what word?]
- [Name 2]: [yes/no]
- [Name 3]: [yes/no]
- [Name 4]: [yes/no]
- [Name 5]: [yes/no]
- [Name 6]: [yes/no]
- All pass? ✅/❌ → If any fail, REPLACE with a non-descriptive semifinalist.

**Check 5c — The Stranger Test:** Read all 6 names to an imaginary stranger. Could they guess the product category from the names alone? If yes for any → REPLACE.

**Check 5d — The Courage Test:** Would the product's biggest competitor ever use any of these names? If yes for any → it lacks moat energy → REPLACE.

**Check 5e — The Discomfort Test:** Do at least 3 of the 6 names make you slightly uncomfortable? Names with tension = names with energy. If all 6 feel "safe," the slate is too conservative. Replace the safest name with a bolder semifinalist.

---

## FULL METHODOLOGY REFERENCE

${METHODOLOGY}`;
}

export function buildFollowupPrompt(answers) {
  return `You are a brand naming strategist. A user has provided 7 discovery answers. Your job is to decide if any critical gaps remain.

PRODUCT DESCRIPTION: ${answers.description}

ANSWERS:
1. What are you building? ${answers.q1_what}
2. Who is it for? ${answers.q2_who}
3. What makes it different? ${answers.q3_different}
4. When it works perfectly, how does that make someone feel? ${answers.q4_feeling}
5. How do you define winning? What gives you an edge? ${answers.q6_winning || ""}
6. What one thing should the name say? ${answers.q7_say || ""}
7. What would competitors never dare call themselves? ${answers.q5_competitors}

RULES:
- The user has already answered 7 questions. That is a LOT. Default to returning an empty array: []
- ONLY ask a follow-up if an answer is truly vague (one word, generic, or contradictory) AND that gap would meaningfully change the naming direction
- Most of the time the answer is []. The bar for asking more questions should be very high.
- Never ask more than 1 follow-up question. The user has already been patient.
- If you do ask, reference their specific words and push on the benefit ladder (functional → emotional → identity)

Return ONLY a valid JSON array of question strings. Nothing else. Examples:
[]
["You mentioned X — can you go deeper on why that matters emotionally to your users?"]`;
}

export function buildDiscoverySummary(answers) {
  let summary = `Here is the complete discovery for the brand we're naming:

**Product:** ${answers.description}

**What they're building:** ${answers.q1_what}

**Target audience:** ${answers.q2_who}

**Key differentiator:** ${answers.q3_different}

**Emotional benefit (how it makes people feel):** ${answers.q4_feeling}

**How they define winning / their edge:** ${answers.q6_winning || "Not provided"}

**The one thing the name should say:** ${answers.q7_say || "Not provided"}

**Competitive gap (what competitors would never dare):** ${answers.q5_competitors}`;

  if (answers.followups && answers.followups.length > 0) {
    summary += "\n\n**Follow-up depth:**";
    for (const fu of answers.followups) {
      summary += `\n- Q: ${fu.question}\n  A: ${fu.answer}`;
    }
  }

  const randomDomains = [
    "astronomy", "geology", "music theory", "culinary arts", "architecture",
    "marine biology", "mythology", "textiles", "cartography", "perfumery",
    "glassblowing", "forestry", "aviation", "typography", "ceramics",
    "watchmaking", "theater", "blacksmithing", "botany", "oceanography",
    "jazz", "sculpture", "beekeeping", "mountaineering", "calligraphy",
    "parkour", "sailmaking", "gemology", "falconry", "fermentation",
  ];
  const pick = (arr, n) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };
  const domains = pick(randomDomains, 3);
  const seed = Math.floor(Math.random() * 99999);

  summary += `\n\n**Creative seed [${seed}]:** For this run, Team 3 (Category Transplant) MUST explore vocabulary from: ${domains.join(", ")}. These are your hunting grounds for unexpected metaphors. DO NOT reuse names from previous runs — every name must be freshly generated.`;
  summary += "\n\nNow execute the full naming methodology. Start with the Discovery Summary, then Treasure Map, Name Ocean, Screening, and Final Presentation.";
  return summary;
}
