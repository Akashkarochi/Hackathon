# DevInsight - Design Document

## 1. Design Philosophy

DevInsight follows the **GitHub-inspired dark theme** design language, creating a familiar experience for developers. The design emphasizes:
- **Clarity**: Clean, readable typography with good contrast
- **Hierarchy**: Clear visual hierarchy using color and spacing
- **Feedback**: Smooth animations and loading states
- **Simplicity**: Single-page, no-nonsense interface

---

## 2. Color Palette

### 2.1 Primary Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Background Primary | `#0d1117` | Main page background |
| Background Card | `#161b22` | Card and section backgrounds |
| Background Input | `#0d1117` | Input field backgrounds |
| Border | `#30363d` | Borders and dividers |

### 2.2 Accent Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Blue (Primary) | `#58a6ff` | Links, active states, primary actions |
| Green (Success) | `#238636` | Success states, positive recommendations |
| Amber (Warning) | `#d29922` | Warnings, medium scores |
| Red (Error) | `#f85149` | Errors, high concern items |
| Purple (Info) | `#a371f7` | Informational elements |

### 2.3 Text Colors
| Color | Hex Code | Usage |
|-------|----------|-------|
| Text Primary | `#c9d1d9` | Main text content |
| Text Secondary | `#8b949e` | Labels, hints, secondary info |

### 2.4 Score Gradient Colors
| Score Type | Start Color | End Color |
|------------|-------------|------------|
| Health | `#238636` | `#3fb950` |
| Maintenance | `#1f6feb` | `#58a6ff` |
| Popularity | `#d29922` | `#e3b341` |

---

## 3. Typography

### 3.1 Font Families
- **UI Font**: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
- **Code Font**: 'JetBrains Mono', 'Fira Code', monospace

### 3.2 Font Sizes
| Element | Size | Weight |
|---------|------|--------|
| H1 (Logo) | 2.25rem | 700 |
| H2 (Section) | 1.5rem | 700 |
| H3 (Card Title) | 1.1rem | 600 |
| Body | 1rem | 400 |
| Small/Labels | 0.875rem | 400-500 |
| Code | 0.875rem | 400 |

### 3.3 Line Heights
- Headings: 1.3
- Body: 1.6
- Code: 1.5

---

## 4. Spacing System

### 4.1 Base Unit
- Base unit: 8px

### 4.2 Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon margins |
| md | 16px | Standard gaps |
| lg | 24px | Section padding |
| xl | 32px | Large gaps |
| xxl | 48px | Section margins |

### 4.3 Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| sm | 6px | Buttons, small elements |
| md | 12px | Cards, inputs |
| lg | 16px | Sections, large cards |

---

## 5. Layout Structure

### 5.1 Page Layout
```
┌─────────────────────────────────────────┐
│              HEADER                      │
│  Logo + Title + Tagline                │
├─────────────────────────────────────────┤
│            INPUT SECTION                │
│  URL Input + Analyze Button            │
├─────────────────────────────────────────┤
│           LOADING SECTION               │
│  Animated dots + Progress bar          │
├─────────────────────────────────────────┤
│          RESULTS SECTION                │
│  ┌─────────────────────────────────┐   │
│  │       REPO INFO HEADER          │   │
│  │   Name, Link, Description       │   │
│  └─────────────────────────────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ HEALTH │ │MAINTEN │ │POPULAR │     │
│  │ SCORE  │ │ANCE    │ │ITY     │     │
│  └────────┘ └────────┘ └────────┘     │
│  ┌─────────────────────────────────┐   │
│  │       METRICS GRID              │   │
│  │  6 metric cards in 3x2 grid    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   AI RECOMMENDATIONS            │   │
│  │  List of recommendation cards │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │     LANGUAGES CHART             │   │
│  │  Horizontal bar chart           │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│              FOOTER                     │
└─────────────────────────────────────────┘
```

### 5.2 Responsive Breakpoints
| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, stacked cards |
| Tablet | 768-1024px | 2-column grids |
| Desktop | > 1024px | Full 3-column layout |

---

## 6. Components

### 6.1 Input Section
- **Background**: Card background with border
- **Input Field**:
  - Height: 48px
  - Padding: 14px 16px
  - Border: 1px solid border color
  - Focus state: Blue border with glow
- **Button**:
  - Height: 52px
  - Full width
  - Green gradient background
  - Hover: Lift effect with shadow

### 6.2 Score Card
- **Structure**:
  - Header with icon and title
  - Large score number
  - Progress bar
  - Label text
- **Animation**: Count-up animation on load (1 second)
- **Hover**: Subtle glow effect

### 6.3 Metric Card
- **Layout**: Icon + vertical stack (label + value)
- **Icon Box**: 40x40px, rounded, light blue background
- **Hover**: Border color change to blue

### 6.4 Recommendation Card
- **Border**: 4px left border (color-coded)
- **Colors**:
  - Positive: Green (#238636)
  - Warning: Amber (#d29922)
  - Info: Purple (#a371f7)
- **Content**: Title + description text

### 6.5 Language Bar
- **Layout**: Name (100px) + flexible bar
- **Bar**: Rounded, color-coded by language
- **Label**: Percentage inside bar (right-aligned)

---

## 7. Visual Effects

### 7.1 Shadows
```css
--shadow-glow: 0 0 20px rgba(88, 166, 255, 0.15);
```

### 7.2 Animations
| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Fade in | 0.3s | ease | Tab content |
| Slide up | 0.4s | ease-out | Results section |
| Pulse | 1.4s | ease-in-out | Loading dots |
| Score fill | 1s | ease-out | Score bars |

### 7.3 Transitions
```css
--transition: all 0.2s ease;
```

Applied to:
- Button hover states
- Card hover states
- Input focus states
- Tab transitions

---

## 8. Iconography

### 8.1 Icon Style
- Stroke-based SVG icons
- 2px stroke width
- Rounded line caps and joins

### 8.2 Key Icons
- **Search**: Magnifying glass for analyze button
- **Star**: Forks repository stats
- **Fork**: Fork icon for forks count
- **Eye**: Watchers count
- **Alert**: Issues count
- **Code**: Languages
- **Calendar**: Last updated
- **Users**: Contributors
- **Git-commit**: Commits
- **Git-branch**: Default branch
- **Shield**: License

---

## 9. Accessibility

### 9.1 Color Contrast
- All text meets WCAG AA standards (4.5:1 for body, 3:1 for large text)
- Score colors distinguishable for colorblind users (also use icons/labels)

### 9.2 Keyboard Navigation
- Tab order: Input → Button → Results
- Focus states visible on all interactive elements

### 9.3 Screen Reader Support
- Semantic HTML structure
- ARIA labels where appropriate
- Alt text for icons (when meaningful)

---

## 10. File Structure

```
DevInsight/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── app.js              # Application logic
├── requirements.md     # Requirements document
├── design.md           # This design document
└── README.md          # Project readme (optional)
```

---

## 11. Design Credits

- Inspired by GitHub's dark theme
- Typography: Inter (UI) and JetBrains Mono (code)
- Icons: Custom SVG stroke icons

