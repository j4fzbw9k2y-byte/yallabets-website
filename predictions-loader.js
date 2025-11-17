// YallaBets Predictions Loader
// Loads predictions dynamically from predictions.json

async function loadPredictions() {
    try {
        const response = await fetch('predictions.json');
        const predictions = await response.json();
        
        const container = document.getElementById('predictions-container');
        if (!container) return;
        
        if (predictions.length === 0) {
            container.innerHTML = '<p class="no-predictions">No predictions available at the moment. Check back soon!</p>';
            return;
        }
        
        container.innerHTML = predictions.map(pred => {
            const stars = '⭐'.repeat(pred.confidence);
            const vipBadge = pred.is_vip ? '<span class="vip-badge">💎 VIP</span>' : '<span class="free-badge">📱 FREE</span>';
            
            return `
                <div class="prediction-card ${pred.is_vip ? 'vip' : 'free'}">
                    <div class="prediction-header">
                        ${vipBadge}
                        <span class="prediction-league">${pred.league || 'N/A'}</span>
                    </div>
                    <h3 class="prediction-match">⚽ ${pred.match_name}</h3>
                    <div class="prediction-time">🕐 ${pred.match_time}</div>
                    <div class="prediction-details">
                        <div class="prediction-item">
                            <span class="label">Prediction:</span>
                            <span class="value">${pred.prediction}</span>
                        </div>
                        <div class="prediction-item">
                            <span class="label">Odds:</span>
                            <span class="value odds">${pred.odds}</span>
                        </div>
                        <div class="prediction-item">
                            <span class="label">Confidence:</span>
                            <span class="value">${stars} ${pred.confidence}/5</span>
                        </div>
                    </div>
                    ${pred.analysis ? `
                        <div class="prediction-analysis">
                            <strong>📝 Analysis:</strong>
                            <p>${pred.analysis}</p>
                        </div>
                    ` : ''}
                    <div class="prediction-footer">
                        <small>Posted: ${new Date(pred.created_at).toLocaleString()}</small>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading predictions:', error);
        const container = document.getElementById('predictions-container');
        if (container) {
            container.innerHTML = '<p class="error">Failed to load predictions. Please try again later.</p>';
        }
    }
}

async function loadResults() {
    try {
        const response = await fetch('results.json');
        const results = await response.json();
        
        const container = document.getElementById('results-container');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">No results available yet.</p>';
            return;
        }
        
        // Calculate statistics
        const totalPredictions = results.length;
        const wonPredictions = results.filter(r => r.result === 'won').length;
        const lostPredictions = results.filter(r => r.result === 'lost').length;
        const winRate = ((wonPredictions / totalPredictions) * 100).toFixed(2);
        const totalProfit = results.reduce((sum, r) => sum + (r.profit_loss || 0), 0).toFixed(2);
        
        // Display statistics
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${totalPredictions}</div>
                        <div class="stat-label">Total Predictions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${wonPredictions}</div>
                        <div class="stat-label">Won</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${lostPredictions}</div>
                        <div class="stat-label">Lost</div>
                    </div>
                    <div class="stat-card highlight">
                        <div class="stat-value">${winRate}%</div>
                        <div class="stat-label">Win Rate</div>
                    </div>
                    <div class="stat-card ${totalProfit >= 0 ? 'positive' : 'negative'}">
                        <div class="stat-value">${totalProfit >= 0 ? '+' : ''}${totalProfit}</div>
                        <div class="stat-label">Total Profit (units)</div>
                    </div>
                </div>
            `;
        }
        
        // Display results
        container.innerHTML = results.map(result => {
            const statusEmoji = result.result === 'won' ? '✅' : result.result === 'lost' ? '❌' : '➖';
            const statusClass = result.result === 'won' ? 'won' : result.result === 'lost' ? 'lost' : 'void';
            const profitClass = result.profit_loss >= 0 ? 'profit' : 'loss';
            
            return `
                <div class="result-card ${statusClass}">
                    <div class="result-header">
                        <span class="result-status">${statusEmoji} ${result.result.toUpperCase()}</span>
                        <span class="result-league">${result.league || 'N/A'}</span>
                    </div>
                    <h3 class="result-match">⚽ ${result.match_name}</h3>
                    <div class="result-time">🕐 ${result.match_time}</div>
                    <div class="result-details">
                        <div class="result-item">
                            <span class="label">Prediction:</span>
                            <span class="value">${result.prediction}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Odds:</span>
                            <span class="value">${result.odds}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Profit/Loss:</span>
                            <span class="value ${profitClass}">
                                ${result.profit_loss >= 0 ? '+' : ''}${result.profit_loss} units
                            </span>
                        </div>
                    </div>
                    <div class="result-footer">
                        <small>Result posted: ${new Date(result.result_date).toLocaleString()}</small>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading results:', error);
        const container = document.getElementById('results-container');
        if (container) {
            container.innerHTML = '<p class="error">Failed to load results. Please try again later.</p>';
        }
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('predictions-container')) {
        loadPredictions();
    }
    if (document.getElementById('results-container')) {
        loadResults();
    }
});

// Auto-refresh every 5 minutes
setInterval(() => {
    if (document.getElementById('predictions-container')) {
        loadPredictions();
    }
    if (document.getElementById('results-container')) {
        loadResults();
    }
}, 300000); // 5 minutes
