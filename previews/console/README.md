<p align="center">
  <img src="./assets/terminal.svg" alt="Console — Zane Wang's terminal session" width="100%" />
</p>

&nbsp;

This is the **Console** preview of Zane Wang's profile —
one of three vibe-coded README directions explored in this repo.
([← back to the showcase index](../../README.md))

&nbsp;

```text
$ zane help

  whatis zane          → who I am, what I work on
  ls projects/         → public work, by directory
  man <project>        → deep documentation per project
  show stack           → the working set
  cat philosophy.txt   → operating doctrine
  zane query "..."     → ask the sidekick (~30s reply)
```

&nbsp;

[`whatis`](#whatis) &nbsp;·&nbsp; [`ls projects`](#ls-projects) &nbsp;·&nbsp;
[`man`](#man-pages) &nbsp;·&nbsp; [`show stack`](#show-stack) &nbsp;·&nbsp;
[`cat philosophy.txt`](#cat-philosophy) &nbsp;·&nbsp;
[`zane query`](#zane-query)

&nbsp;

---

<a id="whatis"></a>
## `$ whatis zane`

```text
zane(1)                    User Manual                    zane(1)

NAME
       zane — builds useful systems for fuzzy problems

DESCRIPTION
       Operates at the intersection of AI agent systems, agent
       memory, geographic data, and hardware-aware software.
       Treats design quality as a non-optional load-bearing
       concern, not a polish phase.

       Strong preference for: less is more.
       Weak preference for: anything that pretends to be magic.

SEE ALSO
       constellix(1), claudemem(1), dev-orchestrator(1)
```

&nbsp;

---

<a id="ls-projects"></a>
## `$ ls -la projects/`

```text
drwx  constellix         multi-agent orchestration protocol
drwx  claudemem          persistent memory for AI agents
drwx  dev-orchestrator   one-command AI development lifecycle
drwx  FireSight          wildfire intelligence + NASA satellite data
drwx  PulseConnect       computer-using AI outreach concept
drwx  santorini          board-game logic, clean state machines
```

`man <project>` for detail; sources at `github.com/zelinewang/<project>`.

&nbsp;

---

<a id="man-pages"></a>
## `$ man <project>`

<details>
<summary><code>man constellix</code></summary>

```text
constellix(1)              Project Manual              constellix(1)

NAME
       constellix — multi-agent orchestration protocol

SYNOPSIS
       Each agent specializes (planner, implementer, reviewer,
       designer, conductor). The constellation does the work.

DESCRIPTION
       Two-phase Designer pipeline (spec → re-verify) catches
       bugs that three same-method reviewers miss. Documented at
       ~/.claude/skills/fleet/SKILL.md.

EXAMPLES
       /fleet propose "redesign the chrome of slice C"
            → Designer writes a verification-method spec
            → Nova implements
            → Sentinel audits with computed-style assertions
            → Maestro post-mortems

BUGS
       Workspace allowlist gap on the underlying runner; agents
       fall back to gh repo clone for unregistered repos.

SEE ALSO
       https://github.com/zelinewang/constellix
```

</details>

<details>
<summary><code>man claudemem</code></summary>

```text
claudemem(1)               Project Manual               claudemem(1)

NAME
       claudemem — persistent searchable memory for AI agents

SYNOPSIS
       claudemem note add <category> --title <t> --content <c>
       claudemem search "<q>" [--compact] [--limit N]
       claudemem note get <id>
       claudemem session report

DESCRIPTION
       SQLite + FTS5 + optional embeddings. Survives compaction,
       machine moves, process restarts. Bidirectional sync via
       union merge. Hybrid search when an embedding provider is
       configured, pure FTS5 when not.

DATA
       ~570 notes, ~123 sessions across daily use.

SEE ALSO
       https://github.com/zelinewang/claudemem
```

</details>

<details>
<summary><code>man dev-orchestrator</code></summary>

```text
dev-orchestrator(1)        Project Manual        dev-orchestrator(1)

NAME
       /dev — end-to-end AI development protocol

SYNOPSIS
       /dev "<task>" [--quick|--standard|--deep]
                     [--research|--cicd]

DESCRIPTION
       Receives a task, classifies type and tier, runs investigate
       → brainstorm → plan → execute (TDD) → verify → ship. Zero
       approval checkpoints between phases — anomaly escalation
       only when a decision needs human judgment.

       Cross-session continuity via git log + claudemem (not via
       self-reported state files).

EXAMPLES
       /dev --deep "rewrite the README as a vibe-coded showcase"
       /dev --quick "fix the broken icon in section 04"
       /dev --research "what's the state-of-the-art for Y"

SEE ALSO
       https://github.com/zelinewang/dev-orchestrator
```

</details>

<details>
<summary><code>man firesight</code></summary>

```text
firesight(1)               Project Manual               firesight(1)

NAME
       FireSight — wildfire intelligence layered on satellite data

DESCRIPTION
       Stitches NASA FIRMS satellite passes, weather feeds, and a
       small classifier into a map view that explains why a hotspot
       looks the way it does. Hobby project; the kind that keeps
       AI, maps, and a real-world signal in the same room.

SEE ALSO
       https://github.com/zelinewang/FireSight
```

</details>

<details>
<summary><code>man pulseconnect</code></summary>

```text
pulseconnect(1)            Project Manual            pulseconnect(1)

NAME
       PulseConnect — computer-using AI outreach concept

DESCRIPTION
       Personalized outreach via computer-use AI, with the human
       firmly in the approval loop. Built to feel like a deliberate
       assistant rather than a spam tool.

SEE ALSO
       https://github.com/zelinewang/PulseConnect
```

</details>

<details>
<summary><code>man santorini</code></summary>

```text
santorini(1)               Project Manual               santorini(1)

NAME
       santorini — board game implementation

DESCRIPTION
       Tiny ruleset on the surface, deep strategic structure
       underneath. The right shape for practicing clean state
       machines and turn validation.

SEE ALSO
       https://github.com/zelinewang/santorini
```

</details>

&nbsp;

---

<a id="show-stack"></a>
## `$ show stack`

```text
LANG     Python  Go  TypeScript  JavaScript  C++
WEB      React  Node.js
INFRA    Docker  Linux
SPATIAL  QGIS
HARD     Raspberry Pi
```

Tool fit over logo walls. Quick prototypes when the idea is unstable;
durable systems when the shape is clear; automation when the same task
appears twice.

&nbsp;

---

<a id="cat-philosophy"></a>
## `$ cat philosophy.txt`

```text
# Operating doctrine — partial extract

cut the noise.            consolidate what overlaps;
                          simplify what is tangled.
sharpen the tools first.  leverage beats brute force.
prove before you argue.   replace debate with experiment.
let reality disprove.     never defend a position; update it.
solve the bottleneck.     defer everything else.
hold the line.            especially alone.
think in probabilities.   never deal in absolutes.
keep it simple.           elegance comes from restraint.
leave leverage behind.    every delivery deposits something reusable.
design for absence.       the end state of good design
                          is your disappearance.
```

`man agent-dao` for the full set.

&nbsp;

---

<a id="zane-query"></a>
## `$ zane query "..."`

The sidekick lives on the [main profile](../../README.md). Issue title prefilled
as `zane query "<your question>"`; a workflow with DeepSeek V4 Flash on the
other end replies in your issue thread. Round-trip about thirty seconds.

```text
$ exit
logout
[← Return to showcase index](../../README.md)
```
