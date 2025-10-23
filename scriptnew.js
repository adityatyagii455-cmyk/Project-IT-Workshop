// Global variables
let currentFramework = '';
let analysisData = {};

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load dashboard data if showing dashboard
    if (sectionId === 'dashboard') {
        loadDashboardData();
    }
}

// Framework selection
function selectFramework(framework) {
    currentFramework = framework;
    
    // Hide all analysis forms
    const forms = document.querySelectorAll('.analysis-form');
    forms.forEach(form => form.classList.add('hidden'));
    
    // Show selected form
    const selectedForm = document.getElementById(`${framework}-form`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }
    
    // Update analysis title
    const title = document.getElementById('analysis-title');
    const titles = {
        'swot': 'SWOT Analysis',
        'pest': 'PEST Analysis',
        'porter': "Porter's 5 Forces Analysis",
        'canvas': 'Business Model Canvas'
    };
    title.textContent = titles[framework] || 'Business Analysis';
    
    // Show analysis section
    showSection('analysis');
}

// SWOT Analysis functions
function addSWOTItem(category) {
    const input = document.querySelector(`#${category}-form .input-group input`);
    const value = input.value.trim();
    
    if (value) {
        const list = document.getElementById(`${category}-list`);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${value}</span>
            <button class="remove-item" onclick="removeSWOTItem(this, '${category}')">×</button>
        `;
        list.appendChild(li);
        input.value = '';
    }
}

function removeSWOTItem(button, category) {
    button.parentElement.remove();
}

// PEST Analysis functions
function addPESTItem(category) {
    const input = document.querySelector(`#${category}-list`).previousElementSibling.querySelector('input');
    const value = input.value.trim();
    
    if (value) {
        const list = document.getElementById(`${category}-list`);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${value}</span>
            <button class="remove-item" onclick="removePESTItem(this, '${category}')">×</button>
        `;
        list.appendChild(li);
        input.value = '';
    }
}

function removePESTItem(button, category) {
    button.parentElement.remove();
}

// Analysis generation
function generateAnalysis(type) {
    const data = collectAnalysisData(type);
    
    if (validateAnalysisData(data, type)) {
        analysisData[type] = data;
        displayAnalysisResults(type, data);
        showAlert('Analysis generated successfully!', 'success');
        
        // Update dashboard dropdown
        const select = document.getElementById('analysis-type');
        const option = select.querySelector(`option[value="${type}"]`);
        if (option) {
            option.selected = true;
        }
        
        // Show dashboard
        showSection('dashboard');
    } else {
        showAlert('Please fill in all required fields.', 'error');
    }
}

function collectAnalysisData(type) {
    const data = {
        timestamp: new Date().toISOString(),
        businessInfo: {}
    };
    
    if (type === 'swot') {
        // Collect business info
        data.businessInfo.name = document.getElementById('business-name').value;
        data.businessInfo.description = document.getElementById('business-description').value;
        
        // Collect SWOT items
        data.strengths = getListItems('strengths-list');
        data.weaknesses = getListItems('weaknesses-list');
        data.opportunities = getListItems('opportunities-list');
        data.threats = getListItems('threats-list');
    } else if (type === 'pest') {
        // Collect business info
        data.businessInfo.name = document.getElementById('pest-business-name').value;
        data.businessInfo.description = document.getElementById('pest-business-description').value;
        
        // Collect PEST items
        data.political = getListItems('political-list');
        data.economic = getListItems('economic-list');
        data.social = getListItems('social-list');
        data.technological = getListItems('technological-list');
    }
    
    return data;
}

function getListItems(listId) {
    const list = document.getElementById(listId);
    const items = [];
    list.querySelectorAll('li span').forEach(span => {
        items.push(span.textContent);
    });
    return items;
}

function validateAnalysisData(data, type) {
    if (!data.businessInfo.name.trim()) {
        return false;
    }
    
    if (type === 'swot') {
        return data.strengths.length > 0 || data.weaknesses.length > 0 || 
               data.opportunities.length > 0 || data.threats.length > 0;
    } else if (type === 'pest') {
        return data.political.length > 0 || data.economic.length > 0 || 
               data.social.length > 0 || data.technological.length > 0;
    }
    
    return true;
}

function displayAnalysisResults(type, data) {
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (type === 'swot') {
        dashboardContent.innerHTML = generateSWOTResults(data);
    } else if (type === 'pest') {
        dashboardContent.innerHTML = generatePESTResults(data);
    }
    
    // Initialize charts after content is loaded
    setTimeout(() => {
        if (type === 'swot') {
            createSWOTChart(data);
        } else if (type === 'pest') {
            createPESTChart(data);
        }
    }, 100);
}

function generateSWOTResults(data) {
    return `
        <div class="analysis-results">
            <div class="result-section">
                <h3><i class="fas fa-building"></i> ${data.businessInfo.name}</h3>
                <p><strong>Description:</strong> ${data.businessInfo.description}</p>
                <p><strong>Analysis Date:</strong> ${new Date(data.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div class="chart-container">
                <h4>SWOT Analysis Overview</h4>
                <canvas id="swotChart" width="400" height="300"></canvas>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-plus-circle text-green"></i> Strengths (${data.strengths.length})</h4>
                <ul>
                    ${data.strengths.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-minus-circle text-red"></i> Weaknesses (${data.weaknesses.length})</h4>
                <ul>
                    ${data.weaknesses.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-arrow-up text-blue"></i> Opportunities (${data.opportunities.length})</h4>
                <ul>
                    ${data.opportunities.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-exclamation-triangle text-orange"></i> Threats (${data.threats.length})</h4>
                <ul>
                    ${data.threats.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-lightbulb"></i> Strategic Recommendations</h4>
                <ul>
                    ${generateSWOTRecommendations(data)}
                </ul>
            </div>
        </div>
    `;
}

function generatePESTResults(data) {
    return `
        <div class="analysis-results">
            <div class="result-section">
                <h3><i class="fas fa-building"></i> ${data.businessInfo.name}</h3>
                <p><strong>Description:</strong> ${data.businessInfo.description}</p>
                <p><strong>Analysis Date:</strong> ${new Date(data.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div class="chart-container">
                <h4>PEST Analysis Overview</h4>
                <canvas id="pestChart" width="400" height="300"></canvas>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-landmark text-blue"></i> Political Factors (${data.political.length})</h4>
                <ul>
                    ${data.political.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-chart-line text-green"></i> Economic Factors (${data.economic.length})</h4>
                <ul>
                    ${data.economic.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-users text-purple"></i> Social Factors (${data.social.length})</h4>
                <ul>
                    ${data.social.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-microchip text-orange"></i> Technological Factors (${data.technological.length})</h4>
                <ul>
                    ${data.technological.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="result-section">
                <h4><i class="fas fa-lightbulb"></i> Market Environment Insights</h4>
                <ul>
                    ${generatePESTRecommendations(data)}
                </ul>
            </div>
        </div>
    `;
}

function generateSWOTRecommendations(data) {
    const recommendations = [];
    
    if (data.strengths.length > 0 && data.opportunities.length > 0) {
        recommendations.push('<li><strong>Leverage Strengths:</strong> Use your internal strengths to capitalize on external opportunities</li>');
    }
    
    if (data.weaknesses.length > 0) {
        recommendations.push('<li><strong>Address Weaknesses:</strong> Develop strategies to minimize or eliminate internal weaknesses</li>');
    }
    
    if (data.threats.length > 0) {
        recommendations.push('<li><strong>Mitigate Threats:</strong> Create contingency plans for external threats</li>');
    }
    
    if (data.strengths.length > 0 && data.threats.length > 0) {
        recommendations.push('<li><strong>Defensive Strategy:</strong> Use your strengths to defend against external threats</li>');
    }
    
    return recommendations.length > 0 ? recommendations.join('') : '<li>Continue monitoring your business environment and adapt strategies accordingly</li>';
}

function generatePESTRecommendations(data) {
    const recommendations = [];
    
    const totalFactors = data.political.length + data.economic.length + data.social.length + data.technological.length;
    
    if (totalFactors > 0) {
        recommendations.push('<li><strong>Monitor Changes:</strong> Regularly track changes in all four PEST categories</li>');
        recommendations.push('<li><strong>Adapt Strategy:</strong> Adjust your business strategy based on environmental changes</li>');
        recommendations.push('<li><strong>Risk Management:</strong> Develop plans to address negative environmental factors</li>');
        recommendations.push('<li><strong>Opportunity Identification:</strong> Look for ways to capitalize on positive environmental trends</li>');
    }
    
    return recommendations.length > 0 ? recommendations.join('') : '<li>Continue monitoring your business environment and adapt strategies accordingly</li>';
}

// Chart creation functions
function createSWOTChart(data) {
    const ctx = document.getElementById('swotChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
            datasets: [{
                data: [data.strengths.length, data.weaknesses.length, data.opportunities.length, data.threats.length],
                backgroundColor: ['#28a745', '#dc3545', '#007bff', '#fd7e14'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function createPESTChart(data) {
    const ctx = document.getElementById('pestChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Political', 'Economic', 'Social', 'Technological'],
            datasets: [{
                label: 'Number of Factors',
                data: [data.political.length, data.economic.length, data.social.length, data.technological.length],
                backgroundColor: ['#007bff', '#28a745', '#6f42c1', '#fd7e14'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Dashboard functions
function loadDashboardData() {
    const select = document.getElementById('analysis-type');
    const selectedType = select.value;
    
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (selectedType && analysisData[selectedType]) {
        displayAnalysisResults(selectedType, analysisData[selectedType]);
    } else {
        dashboardContent.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-chart-line"></i>
                <h3>Welcome to Idealyze Dashboard</h3>
                <p>Complete a business analysis to see your insights and recommendations here.</p>
                <button class="btn btn-primary" onclick="showSection('frameworks')">
                    Start Your Analysis
                </button>
            </div>
        `;
    }
}

// Export functionality
function exportAnalysis() {
    const select = document.getElementById('analysis-type');
    const selectedType = select.value;
    
    if (!selectedType || !analysisData[selectedType]) {
        showAlert('Please select a completed analysis to export.', 'error');
        return;
    }
    
    const data = analysisData[selectedType];
    const exportData = {
        type: selectedType.toUpperCase(),
        businessName: data.businessInfo.name,
        description: data.businessInfo.description,
        analysisDate: new Date(data.timestamp).toLocaleDateString(),
        data: data
    };
    
    // Create and download CSV
    const csvContent = generateCSV(exportData);
    downloadFile(csvContent, `${data.businessInfo.name}_${selectedType}_analysis.csv`, 'text/csv');
    
    showAlert('Analysis exported successfully!', 'success');
}

function generateCSV(data) {
    let csv = `Business Analysis Report\n`;
    csv += `Type,${data.type}\n`;
    csv += `Business Name,${data.businessName}\n`;
    csv += `Description,${data.description}\n`;
    csv += `Analysis Date,${data.analysisDate}\n\n`;
    
    if (data.type === 'SWOT') {
        csv += `Category,Item\n`;
        csv += data.data.strengths.map(item => `Strengths,"${item}"`).join('\n') + '\n';
        csv += data.data.weaknesses.map(item => `Weaknesses,"${item}"`).join('\n') + '\n';
        csv += data.data.opportunities.map(item => `Opportunities,"${item}"`).join('\n') + '\n';
        csv += data.data.threats.map(item => `Threats,"${item}"`).join('\n') + '\n';
    } else if (data.type === 'PEST') {
        csv += `Category,Item\n`;
        csv += data.data.political.map(item => `Political,"${item}"`).join('\n') + '\n';
        csv += data.data.economic.map(item => `Economic,"${item}"`).join('\n') + '\n';
        csv += data.data.social.map(item => `Social,"${item}"`).join('\n') + '\n';
        csv += data.data.technological.map(item => `Technological,"${item}"`).join('\n') + '\n';
    }
    
    return csv;
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Utility functions
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    // Insert alert at the top of the main content
    const main = document.querySelector('main');
    main.insertBefore(alert, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Sample data for demonstration
function loadSampleData() {
    const sampleSWOT = {
        timestamp: new Date().toISOString(),
        businessInfo: {
            name: "TechStart Solutions",
            description: "A startup providing AI-powered business automation tools for small businesses"
        },
        strengths: [
            "Strong technical team with AI expertise",
            "First-mover advantage in niche market",
            "Scalable cloud-based architecture",
            "Strong customer support"
        ],
        weaknesses: [
            "Limited marketing budget",
            "Small team size",
            "Dependency on external APIs",
            "Limited brand recognition"
        ],
        opportunities: [
            "Growing demand for automation tools",
            "Government incentives for AI adoption",
            "Partnership opportunities with established companies",
            "Expansion to international markets"
        ],
        threats: [
            "Competition from established tech giants",
            "Rapid technological changes",
            "Economic downturn affecting small businesses",
            "Regulatory changes in AI space"
        ]
    };
    
    analysisData.swot = sampleSWOT;
    showAlert('Sample data loaded successfully!', 'success');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    showSection('home');
    
    // Add sample data button for demo purposes
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        const sampleButton = document.createElement('button');
        sampleButton.className = 'btn btn-secondary';
        sampleButton.innerHTML = '<i class="fas fa-flask"></i> Load Sample Data';
        sampleButton.onclick = loadSampleData;
        heroButtons.appendChild(sampleButton);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('add-item')) {
                activeElement.click();
            }
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        showSection(targetId);
    });
});
