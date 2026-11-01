# Product Requirements Document (PRD)

## Project Title
**The One With The Interactive Presentation**

## 1. Project Overview
Build a nostalgic, interactive, browser-based presentation inspired by the TV series *Friends*. The project will demonstrate planning, AI-assisted development, frontend programming, Python-based data processing, 3D animation, live editing, and version control.

## 2. Objectives
- Deliver at least 10 slides; target **12 slides**.
- Recreate the feel of the 1990s *Friends* aesthetic without requiring copyrighted media assets.
- Demonstrate working JavaScript interactions and one Three.js 3D animation.
- Use Python to generate meaningful data consumed by the presentation.
- Demonstrate direct content editing in the browser.
- Document iterative development through Git commits and pushes.
- Publish an accessible GitHub repository with professional English documentation.

## 3. Audience and Constraints
- Audience: course instructor and fellow students.
- Team: two students.
- Time budget: approximately four hours of collaborative work.
- Language: presentation and all documentation in English.
- Platform: desktop browser, with responsive fallback for mobile.
- Main deliverable: `index.html`, supported by local CSS/JS, data and documentation files as needed.

## 4. Visual Design
- Theme: **Classic Friends**.
- Palette: purple (#674A83), warm yellow (#F4C542), orange (#D98748), cream (#FFF4DE), dark brown (#302820).
- Motifs: purple apartment door, yellow frame, orange cafe sofa, coffee mugs, warm retro typography.
- Style: nostalgic but polished, accessible contrast, restrained motion.
- Consistent slide numbering, transitions, and navigation.

## 5. Slide Plan
| # | Slide | Content | Interactive / Technical Feature |
|---|---|---|---|
| 1 | Welcome to Friends | Project title and introduction | Five-second rotating 3D coffee mug using Three.js |
| 2 | The One Where It All Began | Series overview and timeline | Clickable timeline |
| 3 | Meet the Six Friends | Character introductions | Flip cards and editable descriptions |
| 4 | Welcome to Central Perk | Cafe setting | Clickable objects and information panels |
| 5 | Monica's Apartment | Iconic apartment setting | Animated door opening (CSS/3D) |
| 6 | The Relationships | Character connections | Interactive relationship map |
| 7 | Iconic Moments | Memorable scenes described in original text | Animated gallery |
| 8 | Who Said That? | Character quote quiz | JavaScript scoring and feedback |
| 9 | Which Friend Are You? | Personality quiz | JavaScript result calculation |
| 10 | Friends by the Numbers | Series statistics | Python-generated JSON and JavaScript charts |
| 11 | Behind the Scenes | Production facts | Interactive reveal cards |
| 12 | The Last One | Summary and closing | Closing animation and restart control |

## 6. Functional Requirements
- [ ] 12 distinct slides, each reachable by navigation.
- [ ] Previous/Next buttons and keyboard arrow navigation.
- [ ] Current slide indicator and clickable progress navigation.
- [ ] Functional 3D coffee mug on slide 1; animation lasts five seconds and stops.
- [ ] At least one fully functioning quiz with scoring.
- [ ] Editable text on slide 3, with immediate visible changes and a reset option.
- [ ] Python script processes a small, documented dataset and outputs JSON.
- [ ] JavaScript loads and visualizes the generated data.
- [ ] Responsive layout and usable keyboard focus states.
- [ ] Respect reduced-motion preferences where practical.

## 7. Technical Approach
- HTML5 and CSS3 for layout and visuals.
- Vanilla JavaScript for navigation, interaction and content editing.
- Three.js for 3D graphics (document dependency and offline limitations).
- Python 3 for data transformation into `data/friends_stats.json`.
- Git and GitHub for version control and hosting.
- Prefer original CSS/SVG illustrations; use externally sourced assets only with appropriate rights and attribution.

## 8. Repository Structure
```text
friends-interactive-presentation/
├── index.html
├── styles.css
├── script.js
├── python/
│   └── generate_stats.py
├── data/
│   └── friends_stats.json
├── images/
│   └── screenshots/
├── PRD.md
├── README.md
└── AI_CONVERSATION.md
```
The final structure may be simplified if that improves reliability.

## 9. Workflow and Team Responsibilities
**Student A:** slide content, layout, retro visual design, content editing feature, screenshots, and README.

**Student B:** navigation, quiz interactions, Three.js animation, Python data processing, and technical testing.

**Both:** PRD review, integration, testing, documentation of prompts and changes, Git commits and pushes.

### Four-Hour Plan
| Time | Milestone |
|---|---|
| 0:00–0:30 | Approve PRD, initialize repository, create slide skeleton |
| 0:30–1:30 | Build all slides, navigation, and visual theme |
| 1:30–2:30 | Add Three.js, quizzes, live editing, and Python-generated data |
| 2:30–3:15 | Integration, content review, responsive checks, bug fixes |
| 3:15–4:00 | Screenshots, README, conversation log, final Git pushes, submission |

## 10. Version Control Plan
Use meaningful incremental commits and push them to GitHub after completed milestones:
1. `docs: add initial PRD and project scope`
2. `feat: create 12-slide layout and navigation`
3. `style: implement Classic Friends theme`
4. `feat: add 3D mug and interactive quizzes`
5. `feat: add Python statistics and live text editing`
6. `docs: add screenshots, README and AI conversation log`
7. `fix: complete testing and final polish`

Each commit should reflect actual completed changes. The AI conversation log must accurately reflect real prompts, decisions, revisions, and outcomes; do not fabricate development history.

## 11. Documentation Requirements
### README.md
- Project summary and learning goals.
- Screenshots of several actual slides.
- Feature list and technology stack.
- Instructions to run locally and regenerate Python data.
- Repository structure and team contributions.
- Development workflow and selected Git milestones.
- Known limitations and asset attributions.

### AI_CONVERSATION.md
- Chronological record of actual prompts and important responses.
- What changed after each iteration.
- Issues encountered, fixes, and what the team learned.

## 12. Acceptance Criteria
- [ ] At least 10 slides; target 12 complete slides.
- [ ] Navigation works without console errors.
- [ ] 3D animation visibly renders and stops after five seconds.
- [ ] At least one quiz produces correct feedback and scoring.
- [ ] Text can be edited live and reset without editing source code.
- [ ] Python-generated data is used in a slide and can be regenerated.
- [ ] English documentation is accurate and complete.
- [ ] README contains at least three genuine presentation screenshots.
- [ ] Repository is public or explicitly shared with the instructor.
- [ ] Git history shows meaningful development iterations and pushes.
- [ ] Both students can explain and demonstrate the implemented features.

## 13. Risks and Mitigations
- **Time pressure:** finish all slide skeletons before advanced features.
- **Three.js availability:** test CDN access and provide a graceful fallback.
- **Copyright:** avoid unlicensed screenshots and logos; use original illustrations or properly licensed assets.
- **Data accuracy:** document the source and methodology of all statistics; do not invent figures.
- **GitHub Pages compatibility:** pre-generate JSON using Python; no server-side Python at runtime.
