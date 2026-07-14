/**
 * Dream Note Architecture Core Engine State
 * Hydrates state metrics directly from client browser non-volatile cache arrays
 */
let dreamMemoryStore = JSON.parse(localStorage.getItem('dream_note_vault')) || [];

// Execute UI synchronization as soon as elements register securely
document.addEventListener('DOMContentLoaded', () => {
    refreshArchiveManifest();
});

/**
 * Orchestrates the acquisition pipeline, triggering backend proxy configurations
 */
async function processDreamSubmission() {
    const titleDOM = document.getElementById('dream-title');
    const textDOM = document.getElementById('dream-text');
    const viewportDOM = document.getElementById('analysis-viewport');
    const triggerBtn = document.getElementById('action-trigger');

    const cleanTitle = titleDOM.value.trim() || "Uncharted Memory Fragment";
    const cleanDreamText = textDOM.value.trim();

    // Contextual Data Guard Checks
    if (!cleanDreamText) {
        alert("The dream state layer is currently blank. Please record your impressions before analyzing.");
        return;
    }

    // Lock interaction structures and enter processing loading states
    triggerBtn.disabled = true;
    viewportDOM.innerHTML = `
        <div class="telemetry-loader">
            <div class="telemetry-pulse"></div>
            <p>Deconstructing subconscious core files...</p>
        </div>
    `;

    try {
        // Query internal Cloudflare Worker proxy route. Notice NO keys are exposed here.
        const structuralAnalysis = await dispatchToInternalEngine(cleanDreamText);
        
        // Assemble transactional record file
        const dreamSnapshot = {
            id: Date.now(),
            title: cleanTitle,
            text: cleanDreamText,
            analysis: structuralAnalysis,
            timestamp: new Date().toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            })
        };

        // Commit to non-volatile local storage systems arrays
        dreamMemoryStore.unshift(dreamSnapshot);
        localStorage.setItem('dream_note_vault', JSON.stringify(dreamMemoryStore));

        // Refresh rendering trees
        renderActiveAnalysisView(structuralAnalysis);
        refreshArchiveManifest();
        
        // Wipe interactive workspace targets cleanly
        titleDOM.value = '';
        textDOM.value = '';

    } catch (fault) {
        console.error("Pipeline Communication Error: ", fault);
        viewportDOM.innerHTML = `
            <div class="empty-state-notice" style="color: #f87171;">
                Unable to query secure internal analysis engines. Verification details: ${fault.message}
            </div>
        `;
    } finally {
        triggerBtn.disabled = false;
    }
}

/**
 * Fires request parameters safely into the hidden Cloudflare Worker proxy
 */
async function dispatchToInternalEngine(rawDreamText) {
    // ⚠️ REPLACE THIS STRING WITH YOUR ACTUAL DEPLOYED CLOUDFLARE WORKER URL
    const PROXY_URL = "https://dream-note-proxy.chinninnigarikartheek.workers.dev"; 

    const communicationResponse = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dreamText: rawDreamText }) // Sending variable securely
    });

    if (!communicationResponse.ok) {
        const errorDiagnostic = await communicationResponse.json();
        throw new Error(errorDiagnostic.error || "Proxy verification layer rejected processing.");
    }

    const compiledData = await communicationResponse.json();
    return compiledData.analysis; // Dynamic markdown string response returned from Gemini
}

/**
 * Renders active processed data to output visualization boards
 */
function renderActiveAnalysisView(analysisText) {
    const viewportDOM = document.getElementById('analysis-viewport');
    viewportDOM.innerHTML = `<div class="analysis-wrapper">${analysisText}</div>`;
}

/**
 * Processes state matrices into physical responsive visual lists
 */
function refreshArchiveManifest() {
    const manifestDOM = document.getElementById('manifest-container');
    manifestDOM.innerHTML = '';

    if (dreamMemoryStore.length === 0) {
        manifestDOM.innerHTML = '<p class="empty-state-notice">Your manifest is currently empty.</p>';
        return;
    }

    dreamMemoryStore.forEach(record => {
        const itemElement = document.createElement('div');
        itemElement.className = 'manifest-card';
        itemElement.onclick = () => hotReloadHistoricalEntry(record.id);
        itemElement.innerHTML = `
            <h3>${record.title}</h3>
            <span>${record.timestamp}</span>
        `;
        manifestDOM.appendChild(itemElement);
    });
}

/**
 * Pulls historical files from arrays to show them instantly without charging network overheads
 */
function hotReloadHistoricalEntry(targetID) {
    const targetMatch = dreamMemoryStore.find(item => item.id === targetID);
    if (!targetMatch) return;

    const viewportDOM = document.getElementById('analysis-viewport');
    document.getElementById('analysis-deck').scrollIntoView({ behavior: 'smooth' });
    
    viewportDOM.innerHTML = `
        <div class="analysis-wrapper">
            <h4 style="color: var(--neon-cyan); margin-bottom: 0.5rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Raw Dream Sequence Log</h4>
            <p style="margin-bottom: 2rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border); font-style: italic;">"${targetMatch.text}"</p>
            
            <h4 style="color: var(--neon-violet); margin-bottom: 0.5rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Psychological Translation Matrix</h4>
            <div>${targetMatch.analysis}</div>
        </div>
    `;
}