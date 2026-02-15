/**
 * DevInsight - AI-Powered GitHub Repo Analyzer
 * Uses ONLY free GitHub Public API - No Paid APIs Required
 * Rule-based scoring with smart heuristics
 */

// ============================================
// Configuration & Constants
// ============================================

const GITHUB_API_BASE = 'https://api.github.com';

// Loading steps for progress indication
const LOADING_STEPS = [
    { status: 'Validating repository URL...', progress: 10 },
    { status: 'Fetching repository metadata...', progress: 25 },
    { status: 'Analyzing repository metrics...', progress: 45 },
    { status: 'Fetching contributor data...', progress: 65 },
    { status: 'Calculating scores...', progress: 85 },
    { status: 'Generating recommendations...', progress: 95 }
];

// Language colors for the chart
const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Shell: '#89e051',
    Vue: '#41b883',
    JSX: '#61dafb'
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    // Inputs
    repoUrl: document.getElementById('repo-url'),
    analyzeBtn: document.getElementById('analyze-btn'),
    
    // Sections
    errorSection: document.getElementById('error-section'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    loadingSection: document.getElementById('loading-section'),
    loadingStatus: document.getElementById('loading-status'),
    progressFill: document.getElementById('progress-fill'),
    resultsSection: document.getElementById('results-section'),
    
    // Repo Info
    repoName: document.getElementById('repo-name'),
    repoLink: document.getElementById('repo-link'),
    repoDescription: document.getElementById('repo-description'),
    repoStars: document.getElementById('repo-stars'),
    repoForks: document.getElementById('repo-forks'),
    repoWatchers: document.getElementById('repo-watchers'),
    repoIssues: document.getElementById('repo-issues'),
    repoLanguage: document.getElementById('repo-language'),
    
    // Metrics
    metricLastUpdate: document.getElementById('metric-last-update'),
    metricContributors: document.getElementById('metric-contributors'),
    metricCommits: document.getElementById('metric-commits'),
    metricBranch: document.getElementById('metric-branch'),
    metricLicense: document.getElementById('metric-license'),
    metricLanguages: document.getElementById('metric-languages'),
    
    // Scores
    scoreHealth: document.getElementById('score-health'),
    scoreMaintenance: document.getElementById('score-maintenance'),
    scorePopularity: document.getElementById('score-popularity'),
    
    // Recommendations
    recommendationsContent: document.getElementById('recommendations-content'),
    
    // Languages
    languagesChart: document.getElementById('languages-chart')
};

// ============================================
// State Management
// ============================================

let state = {
    repoData: null,
    contributors: null,
    languages: null,
    commits: null,
    scores: {
        health: 0,
        maintenance: 0,
        popularity: 0
    }
};

// ============================================
// Utility Functions
// ============================================

/**
 * Extract owner and repo from GitHub URL
 */
function parseGitHubUrl(url) {
    url = url.trim().replace(/\/$/, '');
    
    const patterns = [
        /github\.com\/([^\/]+)\/([^\/\s]+)/,
        /github\.com\/([^\/]+)\/([^\/\s]+)\/.*/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
        }
    }
    
    return null;
}

/**
 * Show error message
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorSection.classList.remove('hidden');
    elements.loadingSection.classList.add('hidden');
    elements.resultsSection.classList.add('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorSection.classList.add('hidden');
}

/**
 * Update loading status
 */
function updateLoadingStatus(stepIndex) {
    if (stepIndex >= 0 && stepIndex < LOADING_STEPS.length) {
        const step = LOADING_STEPS[stepIndex];
        elements.loadingStatus.textContent = step.status;
        elements.progressFill.style.width = `${step.progress}%`;
    }
}

/**
 * Show loading section
 */
function showLoading() {
    hideError();
    elements.loadingSection.classList.remove('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.progressFill.style.width = '0%';
    updateLoadingStatus(0);
}

/**
 * Hide loading section
 */
function hideLoading() {
    elements.loadingSection.classList.add('hidden');
}

/**
 * Show results section
 */
function showResults() {
    hideLoading();
    hideError();
    elements.resultsSection.classList.remove('hidden');
}

/**
 * Set button loading state
 */
function setButtonLoading(isLoading) {
    elements.analyzeBtn.disabled = isLoading;
    elements.analyzeBtn.querySelector('.btn-text').textContent = isLoading ? 'Analyzing...' : 'Analyze Repository';
}

/**
 * Format number with K/M suffix
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Format date to relative time
 */
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ============================================
// GitHub API Functions
// ============================================

/**
 * Fetch repository metadata
 */
async function fetchRepoMetadata(owner, repo) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Repository not found. Please check the URL and try again.');
        } else if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else {
            throw new Error(`Failed to fetch repository: ${response.statusText}`);
        }
    }
    
    return response.json();
}

/**
 * Fetch repository contributors
 */
async function fetchContributors(owner, repo) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=30`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        return [];
    }
    
    return response.json();
}

/**
 * Fetch repository languages
 */
async function fetchLanguages(owner, repo) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        return {};
    }
    
    return response.json();
}

/**
 * Fetch commit count (GitHub API doesn't give total directly, we estimate)
 */
async function fetchCommitActivity(owner, repo) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/commit_activity`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        return null;
    }
    
    const data = await response.json();
    if (!data || data.length === 0) {
        return null;
    }
    
    // Calculate total commits in last year
    let totalCommits = 0;
    for (const week of data) {
        totalCommits += week.total;
    }
    
    return totalCommits;
}

// ============================================
// Scoring Algorithms
// ============================================

/**
 * Calculate Code Health Score (0-100)
 * Based on: open issues, last update, open PRs ratio
 */
function calculateHealthScore(repoData) {
    let score = 100;
    
    // Factor 1: Open Issues (lower is better, but some is healthy)
    const issues = repoData.open_issues_count || 0;
    const stars = repoData.stargazers_count || 1;
    const issueRatio = issues / stars;
    
    if (issueRatio > 1) score -= 30;
    else if (issueRatio > 0.5) score -= 20;
    else if (issueRatio > 0.2) score -= 10;
    
    // Factor 2: Last update (recent is better)
    const lastUpdate = new Date(repoData.updated_at);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceUpdate > 365) score -= 40;
    else if (daysSinceUpdate > 180) score -= 25;
    else if (daysSinceUpdate > 90) score -= 15;
    else if (daysSinceUpdate > 30) score -= 5;
    
    // Factor 3: Has description (good practice)
    if (!repoData.description) score -= 10;
    
    // Factor 4: Has license (indicates maintained project)
    if (!repoData.license) score -= 10;
    
    return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Maintenance Score (0-100)
 * Based on: commit frequency, contributors, branch management
 */
function calculateMaintenanceScore(repoData, commitActivity, contributors) {
    let score = 50; // Start with medium score
    
    // Factor 1: Commit activity (last year)
    if (commitActivity) {
        if (commitActivity > 500) score += 25;
        else if (commitActivity > 200) score += 20;
        else if (commitActivity > 100) score += 15;
        else if (commitActivity > 50) score += 10;
        else if (commitActivity > 20) score += 5;
    }
    
    // Factor 2: Contributors (more is better for maintenance)
    const contributorCount = contributors?.length || 0;
    if (contributorCount > 20) score += 20;
    else if (contributorCount > 10) score += 15;
    else if (contributorCount > 5) score += 10;
    else if (contributorCount > 1) score += 5;
    
    // Factor 3: Default branch protection (if repo is mature)
    // We can't check directly, but we can infer from fork count
    const forks = repoData.forks_count || 0;
    if (forks > 100) score += 5;
    
    // Factor 4: Has topics (indicates maintained project)
    if (repoData.topics && repoData.topics.length > 0) score += 5;
    
    return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Popularity Score (0-100)
 * Based on: stars, forks, watchers
 */
function calculatePopularityScore(repoData) {
    let score = 0;
    
    // Factor 1: Stars (most important)
    const stars = repoData.stargazers_count || 0;
    if (stars >= 50000) score += 50;
    else if (stars >= 10000) score += 40;
    else if (stars >= 5000) score += 35;
    else if (stars >= 1000) score += 30;
    else if (stars >= 500) score += 25;
    else if (stars >= 100) score += 20;
    else if (stars >= 50) score += 15;
    else if (stars >= 10) score += 10;
    else score += 5;
    
    // Factor 2: Forks
    const forks = repoData.forks_count || 0;
    if (forks >= 10000) score += 30;
    else if (forks >= 5000) score += 25;
    else if (forks >= 1000) score += 20;
    else if (forks >= 500) score += 15;
    else if (forks >= 100) score += 10;
    else if (forks >= 10) score += 5;
    else score += 2;
    
    // Factor 3: Watchers
    const watchers = repoData.watchers_count || 0;
    if (watchers >= 1000) score += 20;
    else if (watchers >= 500) score += 15;
    else if (watchers >= 100) score += 10;
    else if (watchers >= 10) score += 5;
    else score += 1;
    
    return Math.max(0, Math.min(100, score));
}

// ============================================
// Recommendation Generation (Smart Heuristics)
// ============================================

/**
 * Generate AI-style recommendations based on repository data
 */
function generateRecommendations(repoData, contributors, languages, scores) {
    const recommendations = [];
    
    // Health-based recommendations
    if (scores.health < 40) {
        recommendations.push({
            type: 'warning',
            title: '⚠️ Project May Be Abandoned',
            text: `This repository hasn't been updated in a while. The last update was ${formatRelativeTime(repoData.updated_at)}. Consider checking if the project is still actively maintained before investing time in it.`
        });
    } else if (scores.health > 70) {
        recommendations.push({
            type: 'positive',
            title: '✅ Healthy Project',
            text: `This repository appears to be well-maintained with regular updates and a reasonable number of open issues. Good sign for long-term use!`
        });
    }
    
    // Issues-based recommendations
    const issues = repoData.open_issues_count || 0;
    const stars = repoData.stargazers_count || 1;
    if (issues > stars * 0.5) {
        recommendations.push({
            type: 'warning',
            title: '📋 High Issue Count',
            text: `There are ${formatNumber(issues)} open issues. This could indicate a complex project or potential bugs. Check the issue tracker to understand the nature of these issues.`
        });
    }
    
    // Popularity-based recommendations
    if (scores.popularity > 80) {
        recommendations.push({
            type: 'positive',
            title: '🌟 Very Popular Project',
            text: `With ${formatNumber(stars)} stars, this is a highly popular project! It's likely well-documented and has a strong community. Great choice for learning or production use.`
        });
    } else if (scores.popularity < 30 && stars > 0) {
        recommendations.push({
            type: 'info',
            title: '💡 Growing Project',
            text: `This is a smaller or newer project with ${formatNumber(stars)} stars. It might be a good opportunity to contribute and shape its direction.`
        });
    }
    
    // Contributor-based recommendations
    const contributorCount = contributors?.length || 0;
    if (contributorCount > 20) {
        recommendations.push({
            type: 'positive',
            title: '👥 Strong Community',
            text: `This project has ${contributorCount} contributors, indicating a healthy community. You'll likely find good support and quick responses to issues.`
        });
    } else if (contributorCount <= 1) {
        recommendations.push({
            type: 'info',
            title: '🤝 Solo/Maintained Project',
            text: `This appears to be maintained by a single person or small team. Contributions may have slower response times, but you could make a big impact!`
        });
    }
    
    // Language-based recommendations
    const langKeys = Object.keys(languages || {});
    if (langKeys.includes('JavaScript') || langKeys.includes('TypeScript')) {
        recommendations.push({
            type: 'info',
            title: '📜 JavaScript/TypeScript Project',
            text: `This is a JavaScript-based project. Great for web developers! Check if it uses modern frameworks like React, Vue, or Node.js.`
        });
    }
    if (langKeys.includes('Python')) {
        recommendations.push({
            type: 'info',
            title: '🐍 Python Project',
            text: `This is a Python project. Python is beginner-friendly and widely used in data science, AI, and web development.`
        });
    }
    if (langKeys.length > 5) {
        recommendations.push({
            type: 'info',
            title: '🔧 Multi-Language Project',
            text: `This project uses ${langKeys.length} different languages. It's likely a full-stack application or uses multiple technologies.`
        });
    }
    
    // License recommendations
    if (!repoData.license) {
        recommendations.push({
            type: 'warning',
            title: '📄 No License',
            text: `This project doesn't have a license. Be careful about using it in production as the legal terms are unclear.`
        });
    } else {
        recommendations.push({
            type: 'positive',
            title: '✅ Licensed Project',
            text: `This project uses the ${repoData.license.name} license, which means you can use it with clear legal terms.`
        });
    }
    
    // README recommendations
    // We can't check directly, but we can infer from description
    if (!repoData.description) {
        recommendations.push({
            type: 'warning',
            title: '📝 Missing Description',
            text: `The repository doesn't have a description. This might make it harder to understand the project's purpose at a glance.`
        });
    }
    
    // Add default recommendation if none added
    if (recommendations.length === 0) {
        recommendations.push({
            type: 'info',
            title: '📊 Balanced Project',
            text: `This project has a good balance of activity, community, and popularity. It should be a solid choice for your needs!`
        });
    }
    
    return recommendations;
}

// ============================================
// UI Rendering Functions
// ============================================

/**
 * Update all UI elements with repository data
 */
function updateUI(repoData, contributors, languages, commitActivity) {
    // Basic info
    elements.repoName.textContent = repoData.full_name;
    elements.repoLink.href = repoData.html_url;
    elements.repoDescription.textContent = repoData.description || 'No description available';
    
    // Stats
    elements.repoStars.querySelector('span').textContent = formatNumber(repoData.stargazers_count);
    elements.repoForks.querySelector('span').textContent = formatNumber(repoData.forks_count);
    elements.repoWatchers.querySelector('span').textContent = formatNumber(repoData.watchers_count);
    elements.repoIssues.querySelector('span').textContent = formatNumber(repoData.open_issues_count);
    elements.repoLanguage.querySelector('span').textContent = repoData.language || 'Unknown';
    
    // Metrics
    elements.metricLastUpdate.textContent = formatRelativeTime(repoData.updated_at);
    elements.metricContributors.textContent = formatNumber(contributors?.length || 0);
    elements.metricCommits.textContent = commitActivity ? formatNumber(commitActivity) : 'N/A';
    elements.metricBranch.textContent = repoData.default_branch || 'main';
    elements.metricLicense.textContent = repoData.license?.name || 'None';
    elements.metricLanguages.textContent = Object.keys(languages || {}).length.toString();
    
    // Calculate scores
    const scores = {
        health: calculateHealthScore(repoData),
        maintenance: calculateMaintenanceScore(repoData, commitActivity, contributors),
        popularity: calculatePopularityScore(repoData)
    };
    
    state.scores = scores;
    
    // Animate score displays
    animateScore('score-health', scores.health);
    animateScore('score-maintenance', scores.maintenance);
    animateScore('score-popularity', scores.popularity);
    
    // Generate and render recommendations
    const recommendations = generateRecommendations(repoData, contributors, languages, scores);
    renderRecommendations(recommendations);
    
    // Render languages chart
    renderLanguagesChart(languages);
}

/**
 * Animate score display
 */
function animateScore(elementId, score) {
    const element = document.getElementById(elementId);
    const numberElement = element.querySelector('.score-number');
    const fillElement = element.querySelector('.score-fill');
    
    let current = 0;
    const duration = 1000;
    const increment = score / (duration / 16);
    
    const animate = () => {
        current += increment;
        if (current < score) {
            numberElement.textContent = Math.round(current);
            fillElement.style.width = `${current}%`;
            requestAnimationFrame(animate);
        } else {
            numberElement.textContent = score;
            fillElement.style.width = `${score}%`;
        }
    };
    
    animate();
}

/**
 * Render recommendations
 */
function renderRecommendations(recommendations) {
    let html = '';
    
    for (const rec of recommendations) {
        html += `
            <div class="recommendation-item ${rec.type}">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-text">${rec.text}</div>
            </div>
        `;
    }
    
    elements.recommendationsContent.innerHTML = html;
}

/**
 * Render languages chart
 */
function renderLanguagesChart(languages) {
    if (!languages || Object.keys(languages).length === 0) {
        elements.languagesChart.innerHTML = '<p class="empty">No language data available</p>';
        return;
    }
    
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    let html = '';
    
    for (const [name, bytes] of sortedLangs) {
        const percent = ((bytes / total) * 100).toFixed(1);
        const color = LANGUAGE_COLORS[name] || '#8b949e';
        
        html += `
            <div class="language-bar-item">
                <span class="language-name">${name}</span>
                <div class="language-bar">
                    <div class="language-fill" style="width: ${percent}%; background-color: ${color};">
                        <span class="language-percent">${percent}%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    elements.languagesChart.innerHTML = html;
}

// ============================================
// Main Analysis Function
// ============================================

/**
 * Main analysis flow
 */
async function analyzeRepository() {
    const url = elements.repoUrl.value.trim();
    
    // Validate inputs
    if (!url) {
        showError('Please enter a GitHub repository URL');
        return;
    }
    
    // Parse URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
        showError('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
        return;
    }
    
    const { owner, repo } = parsed;
    
    // Start analysis
    setButtonLoading(true);
    showLoading();
    hideError();
    
    try {
        // Step 1: Validate URL and fetch metadata
        updateLoadingStatus(0);
        const repoData = await fetchRepoMetadata(owner, repo);
        state.repoData = repoData;
        
        // Step 2: Fetch additional data
        updateLoadingStatus(1);
        const [contributors, languages, commitActivity] = await Promise.all([
            fetchContributors(owner, repo).catch(() => []),
            fetchLanguages(owner, repo).catch(() => ({})),
            fetchCommitActivity(owner, repo).catch(() => null)
        ]);
        
        state.contributors = contributors;
        state.languages = languages;
        
        // Step 3: Calculate scores
        updateLoadingStatus(3);
        
        // Step 4: Update UI
        updateLoadingStatus(4);
        updateUI(repoData, contributors, languages, commitActivity);
        
        // Show results
        updateLoadingStatus(5);
        setTimeout(() => {
            showResults();
            setButtonLoading(false);
        }, 300);
        
    } catch (error) {
        console.error('Analysis error:', error);
        showError(error.message || 'An error occurred during analysis. Please try again.');
        setButtonLoading(false);
    }
}

// ============================================
// Event Listeners
// ============================================

// Analyze button click
elements.analyzeBtn.addEventListener('click', analyzeRepository);

// Enter key on inputs
elements.repoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeRepository();
    }
});

// Retry button
elements.retryBtn.addEventListener('click', () => {
    hideError();
    elements.repoUrl.focus();
});

// Initialize
console.log('📊 DevInsight initialized - AI-Powered GitHub Repo Analyzer');

