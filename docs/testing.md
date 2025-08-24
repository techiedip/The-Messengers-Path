# Tester Notes — CLI Save/Load

This document describes **CLI-only tester shortcuts** for *The Messenger’s Path*.  
These are not available in the Web UI (for players).

## Commands
At any choice prompt in the CLI, type one of these instead of a number:

- `:s` or `:save` → Save to `saves/last_save.json`
- `:s myfile.json` → Save to `saves/myfile.json`
- `:l` or `:load` → Load from `saves/last_save.json`
- `:l myfile.json` → Load from `saves/myfile.json`
- `:q` or `:quit` → Exit the game immediately

## Example
```bash
npm run dev
# play some scenes...
:s          # save progress
:q          # quit game
npm run dev
:l          # load progress
```

Saves are written to the `saves/` directory at the project root as plain JSON.  
You can edit them manually if needed (stats, flags, etc.), though this may cause unpredictable story flow.

---
*Reminder: Do not mention these shortcuts in any player-facing instructions or the Web UI.*
