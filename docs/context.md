# Copilot Context — The Messenger’s Path

**What this is**  
A data-driven text adventure / choice RPG inspired by classic text adventures.

---

## Narrative premise
You are a secret courier. Deliver **3 scrolls** to true allies across **4 isles** before a conqueror arrives.  
One isle (Veilbreak) is treacherous.

---

## Loop
Prologue → Chapter 1 (Crossing; randomized Captain’s Trial) → 3 of 4 Isles (any order) → Convergence (endgame with multiple resolutions).

---

## Core mechanics
- **Stats**: Wit, Charm, Might.  
  - Improved through successful choices and trials.
- **Coins**: Currency to bribe/buy/bargain. Start with 1.
- **Flags**: Track clues and traits.
  - Cultural clues (`Iron_*`, `Whispers_*`, `Ashen_*`, `Veilbreak_*`)  
  - Meta flags (`Suspicion`, `Honorable`, `Greedy`, `Allies_*`)
- **Clues**:  
  - NPC talk/observe options yield *partial hints*.  
  - No single NPC gives the full truth; players must cross-check.  
  - Safe scroll presentation requires **`clueSum(prefix) ≥ 2`** for that isle.
- **One-shot**: Certain encounters (`oneShotKey`) allow only one attempt.
- **UI rules**:
  - Show **friendly scene titles** (e.g. *The Sabotage*).  
  - Show a concise **“Recent:”** line after choices (stat gains, coins, suspicion, etc.).  
  - **Do not** expose raw code flags (Iron_*, Whispers_*, etc.).  
  - Puzzle-like content (e.g., Halric’s stanza) appears directly in **scene text**, not as meta “Decode” options.
- **CLI-only Save/Load (for testers)**:
  - `:s` / `:save` — save to `saves/last_save.json`  
  - `:l` / `:load` — load from `saves/last_save.json`  
  - `:q` / `:quit` — quit game  
  - **Not present in Web UI**.

---

## File structure (expected)
```
src/
  model/        # Types & enums (GameState, Stat, Choice, Scene)
  engine/       # SceneRouter, CheckSystem, ChoiceExecutor, RNG
  io/           # CLI renderer & input
  content/      # JSON chapters
webui/          # Minimal web UI that mimics CLI (no save/load)
docs/
  context.md    # this file
  testing.md    # tester-only CLI Save/Load docs
```

---

## Content JSON schema (simplified)
```json
{
  "id": "chX_name",
  "title": "Chapter Title",
  "scenes": [{
    "id": "scene_id",
    "title": "Friendly Title",
    "text": "Scene text (2–5 sentences, evocative)",
    "npcs": [{ "id": "npc_id", "name": "Name", "desc": "short description" }],
    "choices": [{
      "id": "choice_id",
      "label": "Diegetic text (no meta terms)",
      "requirements": [{ "type": "stat|coins|flagMin|clueSum|item", "stat?": "wit|charm|might", "min?": 2, "prefix?": "Iron_", "flag?": "Suspicion" }],
      "effects": [{ "type": "statGain|coins|addFlag|ally|knowledge|item|goto", "stat?": "wit", "amount?": 1, "delta?": -1, "add?": "Iron", "chapterId?": "ch2_iron", "sceneId?": "arrival" }],
      "onFail": [ { /* same shape */ } ],
      "oneShotKey": "unique_lock",
      "next": "next_scene_id"
    }]
  }]
}
```

---

## Authoring guidance
- Keep **narrative cues in text**, not as “decode” or meta options.  
- Ensure scroll presentation always requires multiple clues.  
- NPC dialogue should sound **natural**, never reveal flag names.  
- Balance stat gates so outcomes are achievable but not trivial.  
- **CLI Save/Load is for testers only.** Never mention it in player-facing text.

---

## Engineering guidance
- Narrative lives in **JSON content files**.  
- Supported requirements/effects as above — prefer reusing.  
- Captain’s Trial is **randomized**.  
- CLI supports `SMOKE=1` env for auto-run ~12 steps.  
- **Save/Load** exists only in CLI; **Web UI has no save/load**.

---

## Acceptance checklist
- `npm run dev` (CLI) runs from Prologue.  
- Web UI mirrors CLI (except Save/Load).  
- “Recent” line shows only stats/coins/honor/suspicion/greed.  
- No raw flags/knowledge printed.  
- Puzzle content appears in **scene text**, not as meta buttons.  
- Isle scrolls gated by `clueSum ≥ 2`.  
- One-shot choices cannot repeat.  
- Save/Load works in CLI only.  
- `npm run smoke` exits cleanly after 12 steps.
