document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const calculateButton = document.getElementById('calculateButton');
    const restartButton = document.getElementById('restartButton');
    const form = document.getElementById('snot-22-form');
    const resultElement = document.getElementById('result');
    let currentGroup = 1;
    const totalGroups = 6;

    function updateButtonVisibility() {
        if (prevButton) prevButton.style.display = currentGroup === 1 ? 'none' : 'inline-block';
        if (nextButton) nextButton.style.display = currentGroup === totalGroups ? 'none' : 'inline-block';
        if (calculateButton) calculateButton.style.display = currentGroup === totalGroups ? 'block' : 'none';
        if (restartButton) restartButton.style.display = 'none';
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
        document.querySelectorAll('.navigation-buttons, #result').forEach(el => {
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
        document.getElementById('introduction').style.display = 'none';
        form.style.display = 'block';
        showGroup(currentGroup);
        updateButtonVisibility();
        document.querySelector('.navigation-buttons').style.display = 'flex';
    });
    

    prevButton.addEventListener('click', function() { navigate(-1); });
    nextButton.addEventListener('click', function() { navigate(1); });

    restartButton.addEventListener('click', function() {
        form.reset();
        currentGroup = 1;
        showGroup(currentGroup);
        updateButtonVisibility();
        document.getElementById('introduction').style.display = 'block';
        resultElement.style.display = 'none';
    });

    function updateButtonVisibility() {
        if (prevButton) prevButton.style.display = currentGroup === 1 ? 'none' : 'inline-block';
        if (nextButton) nextButton.style.display = currentGroup === totalGroups ? 'none' : 'inline-block';
        
        // Supondo que você tem um botão 'Calcular' que só deve ser mostrado no último grupo
        const calculateButton = document.getElementById('calculateButton');
        if (calculateButton) calculateButton.style.display = currentGroup === totalGroups ? 'block' : 'none';
    }
    
       
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
    
        // Coletar os valores das respostas das 22 questões
        const responses = Array.from(document.querySelectorAll('select[name^="question"]'))
                               .map(select => parseInt(select.value, 10));
        
        // Calcular a soma dos valores (até 110 agora)
        const sum = responses.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
        // Identificar os sintomas mais impactantes baseados no texto do label associado
        const topSymptomsLabels = Array.from(document.querySelectorAll('.importance-rating:checked'))
                               .map(checkbox => checkbox.value);

        
        // Exibir o resultado e os sintomas mais impactantes
        displayResult(sum, topSymptomsLabels);
    });
    
    // Função para exibir o resultado e ajustar a cor do texto baseado na pontuação
    
    function displayResult(score, top5SymptomsLabels) {
        let fontColor, backgroundColor;
        if (score >= 0 && score <= 36) {
            fontColor = 'green';
            backgroundColor = '#d4edda'; // Verde claro para o fundo
        } else if (score >= 37 && score <= 74) {
            fontColor = 'darkgoldenrod';
            backgroundColor = '#fff3cd'; // Amarelo claro para o fundo
        } else if (score >= 75 && score <= 110) {
            fontColor = 'red';
            backgroundColor = '#f8d7da'; // Vermelho claro para o fundo
        }
        resultElement.style.color = fontColor;
        resultElement.style.backgroundColor = backgroundColor;
        resultElement.style.borderLeft = `5px solid ${fontColor}`;
    
        const scoreHtml = `<h2 style="margin-top: 0;">Pontuação SNOT-22: <strong>${score}</strong></h2>`;
        const impactHtml = `<p>Uma pontuação mais alta indica uma pior qualidade de vida.</p>`;
        let symptomsListHtml = '<h3>Piores Sintomas:</h3><ul>';
        for (let symptom of top5SymptomsLabels) {
            symptomsListHtml += `<li>${symptom}</li>`;
        }
        symptomsListHtml += '</ul>';
    
        resultElement.innerHTML = `${scoreHtml}${impactHtml}${symptomsListHtml}`;
        resultElement.style.display = 'block';
        restartButton.style.display = 'block'; // Mostra o botão de reiniciar
    
        // Ajuste para melhor visualização do resultado
        window.scrollTo(0, 0); // Opcional: rola a página para o topo para exibir o resultado
    }
    

    
    // Evento de clique para o botão "Reiniciar"
    restartButton.addEventListener('click', function() {
        form.reset();
        currentGroup = 1;
        showGroup(currentGroup);
        updateButtonVisibility();
        // Mostrar introdução e esconder o formulário e resultado quando reiniciar
        document.getElementById('introduction').style.display = 'block';
        form.style.display = 'none';
        document.getElementById('result').style.display = 'none';
    });
        
   
});

