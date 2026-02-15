# DevInsight - Requirements Document

## Project Overview

**Project Name:** DevInsight  
**Project Type:** Single-Page Web Application  
**Core Functionality:** AI-Powered GitHub Repo Analyzer that uses free GitHub Public API with rule-based scoring and smart heuristics - no paid APIs required.  
**Target Users:** Developers, technical recruiters, open-source contributors, and anyone wanting to quickly understand a codebase.

---

## 1. Technical Requirements

### 1.1 Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **APIs**: GitHub REST API v3 (Free, no authentication required for public repos)
- **External Dependencies**: None (pure vanilla JS)
- **Fonts**: Google Fonts (Inter, JetBrains Mono)

### 1.2 Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile, tablet, and desktop

---

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Repository Input
- Accept GitHub repository URL in multiple formats:
  - `https://github.com/owner/repo`
  - `github.com/owner/repo`
  - `owner/repo`
- Validate URL format before processing
- Extract owner and repository name automatically

#### 2.1.2 GitHub API Integration
Fetch and display the following data from GitHub:
- Repository metadata (name, description, default branch)
- Star count
- Fork count
- Watcher count
- Open issues count
- Primary language
- License information
- Last updated timestamp
- Contributor count
- Commit activity (last year)
- Languages breakdown (bytes per language)

#### 2.1.3 Score Calculations (Rule-Based)

**Code Health Score (0-100)**
- Based on:
  - Open issues ratio to stars (lower is better)
  - Last update frequency (recent is better)
  - Presence of description
  - Presence of license

**Maintenance Score (0-100)**
- Based on:
  - Commit frequency in the last year
  - Number of contributors
  - Fork count (indicates community interest)
  - Presence of topics

**Popularity Score (0-100)**
- Based on:
  - Star count (primary factor)
  - Fork count (secondary factor)
  - Watcher count (tertiary factor)

#### 2.1.4 AI-Style Recommendations
Generate smart recommendations based on heuristics:
- Project health warnings
- Community strength analysis
- Language-specific insights
- License information
- Documentation status

### 2.2 User Interface Requirements

#### 2.2.1 Layout Structure
- Single-column centered layout
- Maximum width: 1100px
- Dark theme matching GitHub's design language

#### 2.2.2 Page Sections
1. **Header**: Logo, title, tagline
2. **Input Section**: Repository URL input, analyze button
3. **Loading Section**: Animated progress indicator with status text
4. **Results Dashboard**:
   - Repository info header
   - Score cards (3 cards in a row)
   - Metrics grid (6 metrics)
   - AI recommendations section
   - Languages chart
5. **Footer**: Credits

#### 2.2.3 Visual Design
- Background: #0d1117 (GitHub dark)
- Card Background: #161b22
- Primary Accent: #58a6ff (GitHub blue)
- Secondary Accent: #238636 (GitHub green)
- Warning: #d29922 (amber)
- Error: #f85149 (red)
- Text Primary: #c9d1d9
- Text Secondary: #8b949e
- Border: #30363d

---

## 3. Feature Specifications

### 3.1 Score Card Component
- Display score number (0-100)
- Animated progress bar
- Color-coded based on score category:
  - Health: Green gradient (#238636 → #3fb950)
  - Maintenance: Blue gradient (#1f6feb → #58a6ff)
  - Popularity: Amber gradient (#d29922 → #e3b341)

### 3.2 Metrics Cards
Display six key metrics:
1. Last Updated - relative time
2. Contributors - count
3. Total Commits - count (estimated from activity)
4. Branch - default branch name
5. License - license name or "None"
6. Languages - count of languages used

### 3.3 Recommendations System
- Color-coded recommendation cards:
  - Positive (green border): Good signs about the project
  - Warning (amber border): Potential concerns
  - Info (purple border): Informational insights
- Each recommendation includes:
  - Title with icon
  - Descriptive text

### 3.4 Languages Chart
- Horizontal bar chart
- Top 8 languages by byte count
- Show percentage for each language
- Color-coded by language type

---

## 4. Error Handling

### 4.1 Error Cases
- Invalid URL format → Show validation error
- Repository not found (404) → Show "not found" message
- API rate limit (403) → Show rate limit message
- Network errors → Show retry option

### 4.2 Edge Cases
- Empty repository → Show appropriate message
- Very large repository → Limit data fetching
- Missing metadata → Show "N/A" or skip gracefully

---

## 5. Acceptance Criteria

### 5.1 Functional Criteria
- [x] User can input any public GitHub repository URL
- [x] App successfully fetches and displays repository data
- [x] All three scores (Health, Maintenance, Popularity) calculate correctly
- [x] Recommendations generate based on repository characteristics
- [x] Languages chart displays top languages
- [x] Error handling works for invalid inputs and API failures
- [x] Loading states show progress during analysis

### 5.2 Visual Criteria
- [x] Dark theme matches GitHub's design language
- [x] Input form is prominently displayed
- [x] Score cards show animated progress bars
- [x] Recommendations display with color-coded borders
- [x] Languages chart shows horizontal bars with percentages
- [x] Responsive design works on mobile devices
- [x] Loading animation visible during analysis

### 5.3 Performance Criteria
- [x] Page loads instantly (no external dependencies except fonts)
- [x] API calls complete in reasonable time
- [x] Animations are smooth (60fps)

---

## 6. API Endpoints Used

The application uses the following GitHub API endpoints (all free, no auth required):

1. `GET /repos/{owner}/{repo}` - Repository metadata
2. `GET /repos/{owner}/{repo}/contributors` - Contributor list
3. `GET /repos/{owner}/{repo}/languages` - Language breakdown
4. `GET /repos/{owner}/{repo}/stats/commit_activity` - Commit activity

---

## 7. Future Enhancements (Optional)

- Add commit history visualization
- Include README content parsing
- Add "similar projects" recommendations
- Support for private repositories (with auth)
- Export analysis as PDF
- Add dark/light theme toggle

---

## 8. License

This project is open source and available under the MIT License.

