// Global variables
let selectedModel = null;
let currentSequence = '';
let isAnalyzing = false;
let proteinCanvas = null;
let animationId = null;

// Model data
const models = {
    'svm': {
        name: 'SVM',
        type: 'Classification',
        F1_score: 82.4,
        description: 'A supervised learning model that finds the best boundary to separate classes.'
    },
    'knn': {
        name: 'KNN',
        type: 'Classification',
        F1_score: 75.8,
        description: 'A simple algorithm that classifies data based on the closest examples in the dataset.'
    },
    'CNN': {
        name: 'CNN',
        type: 'Classification',
        F1_score: 88,
        description: 'A deep learning model ideal for processing grid-like data such as images or sequences.'
    },
    'mCNN': {
        name: 'mCNN',
        type: 'Classification',
        F1_score: 90,
        description: 'A modified convolutional neural network designed to capture specialized features in data.'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    const modelSelect = document.getElementById('modelSelect');
    const sequenceInput = document.getElementById('sequenceInput');

    modelSelect.addEventListener('change', handleModelSelect);
    sequenceInput.addEventListener('input', handleSequenceInput);
}

function handleModelSelect(event) {
    const modelId = event.target.value;
    const modelInfo = document.getElementById('modelInfo');
    const modelDetails = document.getElementById('modelDetails');
    const viewerContainer = document.getElementById('viewerContainer');

    if (modelId && models[modelId]) {
        selectedModel = models[modelId];
        modelDetails.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="color: white; margin: 0;">${selectedModel.name}</h3>
                <span class="badge badge-cyan">${selectedModel.accuracy}% accuracy</span>
            </div>
            <p style="color: #9ca3af; margin-bottom: 12px;">${selectedModel.description}</p>
            <span class="badge badge-cyan">${selectedModel.type}</span>
        `;
        modelInfo.classList.add('active');

        // 插入對應圖片
        viewerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
                <img src="static/op.png" alt="${selectedModel.name} Image" style="max-height: 300px; margin-bottom: 12px;" />
                <div style="color: #9ca3af; font-size: 14px;">${selectedModel.name} visualization</div>
            </div>
        `;
    } else {
        selectedModel = null;
        modelInfo.classList.remove('active');

        // 顯示預設 placeholder
        viewerContainer.innerHTML = `
            <div class="viewer-placeholder">
                <div>Submit a protein sequence to view 3D structure</div>
            </div>
        `;
    }
    console.log("Selected Model:", selectedModel);
    console.log("Current Sequence:", currentSequence);
    


    updateAnalyzeButton();
}


function handleSequenceInput(event) {
    const sequence = event.target.value.replace(/\s+/g, '').toUpperCase();
    const isValid = validateSequence(sequence);
    const sequenceInfo = document.getElementById('sequenceInfo');

    if (sequence.length > 0) {
        if (isValid) {
            sequenceInfo.innerHTML = `✓ Valid protein sequence with ${sequence.length} amino acids`;
            sequenceInfo.style.color = '#10b981';
            currentSequence = sequence;
        } else {
            sequenceInfo.innerHTML = '✗ Invalid sequence. Use only standard amino acid codes (A-Z, excluding B, J, O, U, X, Z)';
            sequenceInfo.style.color = '#ef4444';
            currentSequence = '';
        }
    } else {
        sequenceInfo.innerHTML = '';
        currentSequence = '';
    }
    updateAnalyzeButton();
}

function validateSequence(sequence) {
    const validAAs = /^[ACDEFGHIKLMNPQRSTVWY]+$/;
    return validAAs.test(sequence) && sequence.length > 0;
}

function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = !selectedModel || !currentSequence || isAnalyzing;
}

function loadExample() {
    const exampleSequence = 'MPAGMTKHGSRSTSSLPPEPMEIVRSKACSRRVRLNVGGLAHEVLWRTLDRLPRTRLGKLRDCNTHDSLLQVCDDYSLEDNEYFFDRHPGAFTSILNFYRTGRLHMMEEMCALSFSQELDYWGIDEIYLESCCQARYHQKKEQMNEELKREAETLREREGEEFDNTCCAEKRKKLWDLLEKPNSSVAAKILAIISIMFIVLSTIALSLNTLPELQSLDEFGQSTDNPQLAHVEAVCIAWFTMEYLLRFLSSPKKWKFFKGPLNAIDLLAILPYYVTIFLTESNKSVLQFQNVRRVVQIFRIMRILRILKLARHSTGLQSLGFTLRRSYNELGLLILFLAMGIMIFSSLVFFAEKDEDDTKFKSIPASFWWATITMTTVGYGDIYPKTLLGKIVGGLCCIAGVLVIALPIPIIVNNFSEFYKEQKRQEKAIKRREALERAKRNGSIVSMNMKDAFARSIEMMDIVVEKNGESIAKKDKVQDNHLSPNKWKWTKRALSETSSSKSFETKEQGSPEKARSSSSPQHLNVQQLEDMYSKMAKTQSQPILNTKEMAPQSKPPEELEMSSMPSPVAPLPARTEGVIDMRSMSSIDSFISCATDFPEATRFSHSPLASLSSKAGSSTAPEVGWRGALGASGGRLTETNPIPETSRSGFFVESPRSSMKTNNPLKLRALKVNFVEGDPTPLLPSLGLYHDPLRNRGGAAAAVAGLECASLLDKPVLSPESSIYTTASARTPPRSPEKHTAIAFNFEAGVHHYIDTDTDDEGQLLYSVDSSPPKSLHGSTSPKFSTGARTEKNHFESSPLPTSPKFLRPNCVYSSEGLTGKGPGAQEKCKLENHTPPDVHMLPGGGAHGSTRDQSI';
    document.getElementById('sequenceInput').value = exampleSequence;
    handleSequenceInput({ target: { value: exampleSequence } });
}

function loadExample2() {
    const exampleSequence = 'MTDQAFVTLTTNDAYAKGALVLGSSLKQHRTTRRLVVLATPQVSDSMRKVLETVFDEVIMVDVLDSGDSAHLTLMKRPELGVTLTKLHCWSLTQYSKCVFMDADTLVLANIDDLFDREELSAAPDPGWPDCFNSGVFVYQPSVETYNQLLHLASEQGSFDGGDQGILNTFFSSWATTDIRKHLPFIYNLSSISIYSYLPAFKVFGASAKVVHFLGRVKPWNYTYDPKTKSVKSEAHDPNMTHPEFLILWWNIFTTNVLPLLQQFGLVKDTCSYVNVLSDLVYTLAFSCGFCRKEDVSGAISHLSLGEIPAMAQPFVSSEERKERWEQGQADYMGADSFDNIKRKLDTYLQ';
    document.getElementById('sequenceInput').value = exampleSequence;
    handleSequenceInput({ target: { value: exampleSequence } });
}

async function analyzeSequence() {
    if (!selectedModel || !currentSequence) {
        alert('Please select a model and enter a valid sequence');
        return;
    }

    isAnalyzing = true;
    updateAnalyzeButton();
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.textContent = 'Analyzing...';

    // Show loading in protein viewer
    showProteinViewer(true);

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock results
    const results = await generateMockResults(currentSequence, selectedModel.name);

    
    // Display results
    
    displayResults(results);
    
    isAnalyzing = false;
    analyzeBtn.textContent = 'Analyze Sequence';
    updateAnalyzeButton();
}

function showProteinViewer(loading = false) {
    const container = document.getElementById('viewerContainer');
    
    if (loading) {
        container.innerHTML = `
            <div class="viewer-placeholder">
                <div style="color: #06b6d4; margin-bottom: 16px;">Generating 3D Structure...</div>
                <div style="font-size: 14px;">This may take a few moments</div>
            </div>
        `;
    } else {
        container.innerHTML = '<canvas id="proteinCanvas" class="viewer-canvas"></canvas>';
        initProteinVisualization();
    }
}

function initProteinVisualization() {
    const canvas = document.getElementById('proteinCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let rotation = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let numResidues = Math.min(currentSequence.length, 50);
        if (currentSequence.length < 300) {
            numResidues = Math.min(currentSequence.length, 50);
        }
        else{
            numResidues = currentSequence.length
        }

        const radius = Math.min(centerX, centerY) * 0.6;
        
        rotation += 0.02;
        
        // Draw protein backbone
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < numResidues; i++) {
            const angle = (i / numResidues) * Math.PI * 4 + rotation;
            const x = centerX + Math.cos(angle) * radius * (0.5 + 0.5 * Math.cos(rotation + i * 0.1));
            const y = centerY + Math.sin(angle) * radius * 0.5 + Math.sin(rotation * 2 + i * 0.2) * 20;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw amino acid residues
        for (let i = 0; i < numResidues; i++) {
            const angle = (i / numResidues) * Math.PI * 4 + rotation;
            const x = centerX + Math.cos(angle) * radius * (0.5 + 0.5 * Math.cos(rotation + i * 0.1));
            const y = centerY + Math.sin(angle) * radius * 0.5 + Math.sin(rotation * 2 + i * 0.2) * 20;
            
            const aa = currentSequence[i];
            let color = '#3b82f6';
            
            if ('RKH'.includes(aa)) color = '#ef4444';
            else if ('DE'.includes(aa)) color = '#f59e0b';
            else if ('FWYH'.includes(aa)) color = '#8b5cf6';
            else if ('AILMVF'.includes(aa)) color = '#10b981';
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowColor = color;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

async function fetchPrediction(sequence, modelName) {
    const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence, model: modelName })
    });
    const data = await response.json();
    return data;  // prediction, accuracy, confidence, inference_time
}



async function generateMockResults(sequence, modelId) {
    const functionalClasses = ['Enzyme', 'Structural', 'Transport', 'Signaling', 'Defense'];

    const aaCounts = {};
    for (let aa of sequence) {
        aaCounts[aa] = (aaCounts[aa] || 0) + 1;
    }

    const aaComposition = Object.entries(aaCounts)
        .map(([aa, count]) => ({
            aa,
            count,
            percentage: (count / sequence.length * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count);

    const structures = ['α-helix', 'β-sheet', 'random coil'];
    const secondaryStructure = Array.from({ length: Math.min(sequence.length, 20) }, (_, i) => ({
        position: i + 1,
        structure: structures[Math.floor(Math.random() * 3)],
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2)
    }));

    // 從後端取得結果
    const modelName = modelId.toLowerCase();
    const resultFromAPI = await fetchPrediction(sequence, modelName);

    return {
        prediction: resultFromAPI.prediction,
        confidenceScore: resultFromAPI.confidence,
        modelAccuracy: resultFromAPI.accuracy,
        inferenceTime: resultFromAPI.inference_time,
        structureConfidence: (Math.random() * 20 + 75).toFixed(1),
        functionalClass: functionalClasses[Math.floor(Math.random() * functionalClasses.length)],
        stability: (Math.random() * 3 + 6).toFixed(1),
        solubility: (Math.random() * 4 + 5).toFixed(1),
        aminoAcidComposition: aaComposition,
        secondaryStructure: secondaryStructure
    };
}



function displayResults(results) {
    // Show results section
    const resultsSection = document.getElementById('results');
    resultsSection.classList.add('active');
    // 自訂 SNARE 判斷條件
    // const snareSignature = "MSTGPTAAPGSNRRLQQTQNQVDEVVDIMRVNVDKVLERDQKLSELDDRADALQAGASQFETSAAKLKRKYWWKNCKMWAIGITVLLIFIIIIIVWVVSSMSTGPTAAPGSNRRLQQTQNQVDEVVDIMRVNVDKVLERDQKLSELDDRADALQAGASQFETSAAKLKRKYWWKNCKMWAIGITVLLIFIIIIIVWVVSS";
    // const nonSnareSignature = "MTDQAFVTLTTNDAYAKGALVLGSSLKQHRTTRRLVVLATPQVSDSMRKVLETVFDEVIMVDVLDSGDSAHLTLMKRPELGVTLTKLHCWSLTQYSKCVFMDADTLVLANIDDLFDREELSAAPDPGWPDCFNSGVFVYQPSVETYNQLLHLASEQGSFDGGDQGILNTFFSSWATTDIRKHLPFIYNLSSISIYSYLPAFKVFGASAKVVHFLGRVKPWNYTYDPKTKSVKSEAHDPNMTHPEFLILWWNIFTTNVLPLLQQFGLVKDTCSYVNVLSDLVYTLAFSCGFCRKEDVSGAISHLSLGEIPAMAQPFVSSEERKERWEQGQADYMGADSFDNIKRKLDTYLQ"
    // if (currentSequence === snareSignature) {
    //     document.getElementById('predict').textContent = "SNARE";
    // }
    // else if(currentSequence === nonSnareSignature){
    //     document.getElementById('predict').textContent = "non-SNARE";
    // }
    // else{
    //     document.getElementById('predict').textContent = "non-SNARE";
    // }
    
    // 顯示預測結果
    // 顯示信心值、準確率、推論時間
    // document.getElementById('predict').innerHTML = `
    // ${results.prediction}
    // <div style="font-size: 14px; color: #9ca3af; margin-top: 4px;">
    //     Accuracy: ${results.modelAccuracy}%, Confidence: ${results.confidenceScore}%, Time: ${results.inferenceTime}
    // </div>
    // `;


    document.getElementById('predict').textContent = results.prediction;
    const resultMetric = document.getElementById('predict').closest('.metric');
    const metricsContainer = document.querySelector('.metrics');
    metricsContainer.insertBefore(resultMetric, metricsContainer.firstChild);


    // 顯示模型名稱
    document.getElementById('resultModelName').textContent = selectedModel.name;

    // 顯示各項指標
    document.getElementById('accuracy').textContent = results.modelAccuracy + '%';
    document.getElementById('accuracyProgress').style.width = results.modelAccuracy + '%';
    document.querySelectorAll('.metric')[1].style.display = 'block';

    // document.getElementById('functionalClass').textContent = results.functionalClass;

    document.getElementById('confidenceScore').textContent = results.confidenceScore;
    document.getElementById('confidenceProgress').style.width = (results.confidenceScore * 10) + '%';
    document.querySelectorAll('.metric')[2].style.display = 'block';

    document.getElementById('inferenceTime').textContent = results.inferenceTime;
    document.getElementById('inferenceTimeProgress').style.width = (results.inferenceTime * 10) + '%';
    document.querySelectorAll('.metric')[3].style.display = 'block';

    showProteinViewer(false);
    createCompositionChart(results.aminoAcidComposition);
    createStructureChart(results.secondaryStructure);
}

let compositionChartInstance = null;
function createCompositionChart(composition) {
    const ctx = document.getElementById('compositionChart').getContext('2d');

    // ⚠️ 若圖表已存在，先銷毀舊的 Chart 實例
    if (compositionChartInstance !== null) {
        compositionChartInstance.destroy();
    }

    // 建立新圖表並保存實例
    compositionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: composition.slice(0, 8).map(item => item.aa),
            datasets: [{
                data: composition.slice(0, 8).map(item => item.percentage),
                backgroundColor: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#f97316', '#84cc16'],
                borderColor: '#334155',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#d1d5db',
                        usePointStyle: true,
                        padding: 15
                    }
                }
            }
        }
    });
}

let structureChartInstance = null;
function createStructureChart(structureData) {
    const ctx = document.getElementById('structureChart').getContext('2d');

    // ⚠️ 若圖表已存在，先銷毀舊的 Chart 實例
    if (structureChartInstance !== null) {
        structureChartInstance.destroy();
    }

    // 建立新圖表並保存實例
    structureChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: structureData.map(item => item.position),
            datasets: [{
                label: 'Confidence',
                data: structureData.map(item => item.confidence),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#06b6d4',
                pointRadius: 4,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#d1d5db'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155'
                    }
                },
                y: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#334155'
                    }
                }
            }
        }
    });
}

// Cleanup animation on page unload
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});