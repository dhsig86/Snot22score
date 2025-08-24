
function getScoreColor(score) {
    if (score >= 0 && score <= 36) {
        return { fontColor: 'green', backgroundColor: '#d4edda' };
    } else if (score >= 37 && score <= 74) {
        return { fontColor: 'darkgoldenrod', backgroundColor: '#fff3cd' };
    } else if (score >= 75 && score <= 110) {
        return { fontColor: 'red', backgroundColor: '#f8d7da' };
    }
    return { fontColor: 'black', backgroundColor: 'transparent' };
}

if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', function() {

    const startButton = document.getElementById('startButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const calculateButton = document.getElementById('calculateButton');
    const exportButton = document.getElementById('exportButton');
    const backButton = document.getElementById('backButton');
    const resetButton = document.getElementById('resetButton');
    const spinner = document.getElementById('spinner');
    const resultContainer = document.getElementById('resultContainer');
    const form = document.getElementById('snot-22-form');
    const resultElement = document.getElementById('result');
    const nameInput = document.getElementById('patientName');
    const ageInput = document.getElementById('patientAge');
    const nameError = document.getElementById('nameError');
    const ageError = document.getElementById('ageError');
    const REQUIRE_PATIENT_NAME = false;
    const REQUIRE_PATIENT_AGE = false;
    nameInput.required = REQUIRE_PATIENT_NAME;
    ageInput.required = REQUIRE_PATIENT_AGE;
    let patientName = '';
    let patientAge = '';
    let lastScore = 0;
    let lastTopSymptoms = [];
    let lastFontColor = 'black';
    let currentGroup = 1;
    const totalGroups = 6;

    function updateButtonVisibility() {
        if (prevButton) prevButton.style.display = currentGroup === 1 ? 'none' : 'inline-block';
        if (nextButton) nextButton.style.display = currentGroup === totalGroups ? 'none' : 'inline-block';
        if (calculateButton) calculateButton.style.display = currentGroup === totalGroups ? 'block' : 'none';
    }

    function navigate(direction) {
        document.getElementById(`group${currentGroup}`).style.display = 'none';
        currentGroup += direction;
        currentGroup = Math.max(1, Math.min(currentGroup, totalGroups));
        showGroup(currentGroup);
        updateButtonVisibility();
    }

    function showGroup(groupNumber) {
        document.querySelectorAll('.question-group').forEach(group => {
            group.style.display = 'none';
        });
        document.getElementById(`group${groupNumber}`).style.display = 'block';
        // Garantir que a navegação e resultado estão escondidos inicialmente
        document.querySelectorAll('.navigation-buttons, #resultContainer').forEach(el => {
            el.style.display = 'none';
        });
        if(groupNumber > 1) {
            document.querySelector('.navigation-buttons').style.display = 'flex';
        }
        updateProgressBar(groupNumber);
    }

    function updateProgressBar(currentGroup) {
        // O número total de grupos deve corresponder ao número de grupos de perguntas que você tem.
        const totalGroups = document.querySelectorAll('.question-group').length;
        // A porcentagem de progresso deve ser calculada com base no grupo atual dividido pelo total de grupos.
        // Note que estamos usando currentGroup - 1 porque queremos começar com 0% no grupo 1.
        const progressPercentage = ((currentGroup - 1) / (totalGroups - 1)) * 100;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    }

    startButton.addEventListener('click', function() {
        nameError.textContent = '';
        ageError.textContent = '';
        document.getElementById('introduction').style.display = 'none';
        form.style.display = 'block';
        showGroup(currentGroup);
        updateButtonVisibility();
        document.querySelector('.navigation-buttons').style.display = 'flex';
    });
    

    prevButton.addEventListener('click', function() { navigate(-1); });
    nextButton.addEventListener('click', function() { navigate(1); });

    const checkboxes = document.querySelectorAll('.importance-rating');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('.importance-rating:checked');
            console.log(checkedBoxes);
            if (checkedBoxes.length > 5) {
                alert('Você só pode selecionar até 5 sintomas como os mais impactantes.');
                checkbox.checked = false;
            }
        });
    });
        
    document.getElementById('snot-22-form').addEventListener('submit', function(e) {
        e.preventDefault();

        patientName = nameInput.value.trim();
        patientAge = ageInput.value.trim();
        nameError.textContent = '';
        ageError.textContent = '';
        if (REQUIRE_PATIENT_NAME && !patientName) {
            nameError.textContent = 'O nome é obrigatório.';
            nameInput.focus();
            return;
        }
        if (REQUIRE_PATIENT_AGE && !patientAge) {
            ageError.textContent = 'A idade é obrigatória.';
            ageInput.focus();
            return;
        }
        if (patientAge) {
            const ageNumber = parseInt(patientAge, 10);
            if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 120) {
                ageError.textContent = 'Por favor, insira uma idade válida entre 0 e 120.';
                ageInput.focus();
                return;
            }
            patientAge = ageNumber;
        }

        form.style.display = 'none';
        resultContainer.style.display = 'block';
        spinner.style.display = 'block';
        resultElement.style.display = 'none';
        exportButton.style.display = 'none';
        backButton.style.display = 'none';
        resetButton.style.display = 'none';

        setTimeout(() => {
            const responses = Array.from(document.querySelectorAll('select[name^="question"]'))
                                   .map(select => parseInt(select.value, 10));

            const sum = responses.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            const topSymptomsLabels = Array.from(document.querySelectorAll('.importance-rating:checked'))
                                   .map(checkbox => checkbox.value);

            displayResult(sum, topSymptomsLabels);
            spinner.style.display = 'none';
        }, 500);
    });
    
    // Função para exibir o resultado e ajustar a cor do texto baseado na pontuação
    
    function displayResult(score, top5SymptomsLabels) {

        const colors = getScoreColor(score);
        resultElement.style.color = colors.fontColor;
        resultElement.style.backgroundColor = colors.backgroundColor;
        resultElement.style.borderLeft = `5px solid ${colors.fontColor}`;
        lastScore = score;
        lastTopSymptoms = top5SymptomsLabels;
        lastFontColor = colors.fontColor;

    
        const scoreHtml = `<h2 style="margin-top: 0;">Pontuação SNOT-22: <strong>${score}</strong></h2>`;
        const impactHtml = `<p>Uma pontuação mais alta indica uma pior qualidade de vida.</p>`;
        let symptomsListHtml = '<h3>Piores Sintomas:</h3><ul>';
        for (let symptom of top5SymptomsLabels) {
            symptomsListHtml += `<li>${symptom}</li>`;
        }
        symptomsListHtml += '</ul>';
    
        resultElement.innerHTML = `${scoreHtml}${impactHtml}${symptomsListHtml}`;
        resultElement.style.display = 'block';
        exportButton.style.display = 'inline-block';
        backButton.style.display = 'inline-block';
        resetButton.style.display = 'inline-block';

        // Ajuste para melhor visualização do resultado
        window.scrollTo(0, 0); // Opcional: rola a página para o topo para exibir o resultado
    }

    exportButton.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(12);
        doc.text('Relatório Médico SNOT-22', 10, y);
        y += 10;
        if (patientName) {
            doc.text(`Nome: ${patientName}`, 10, y);
            y += 10;
        }
        if (patientAge !== '') {
            doc.text(`Idade: ${patientAge}`, 10, y);
            y += 10;
        }
        const date = new Date().toLocaleDateString();
        doc.text(`Data: ${date}`, 10, y);
        y += 10;
        doc.setTextColor(lastFontColor);
        doc.text(`Pontuação SNOT-22: ${lastScore}`, 10, y);
        y += 10;
        doc.setTextColor(0, 0, 0);
        doc.text('Sintomas mais impactantes:', 10, y);
        y += 10;
        lastTopSymptoms.forEach(symptom => {
            doc.text(`- ${symptom}`, 10, y);
            y += 10;
        });
        doc.text('Referência: SNOT-22: Adaptação cultural e propriedades psicométricas para a língua portuguesa falada no Brasil', 10, y, {maxWidth: 180});
        doc.save('relatorio_snot22.pdf');
    });

    backButton.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        form.style.display = 'block';
        showGroup(currentGroup);
        updateButtonVisibility();
    });

    resetButton.addEventListener('click', function() {
        form.reset();
        currentGroup = 1;
        showGroup(currentGroup);
        updateButtonVisibility();
        nameError.textContent = '';
        ageError.textContent = '';
        document.getElementById('introduction').style.display = 'block';
        form.style.display = 'none';
        resultContainer.style.display = 'none';
    });
        

});
}

if (typeof module !== 'undefined') {
    module.exports = { getScoreColor };
}

