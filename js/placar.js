// placar.js - Funcionalidades do placar ao vivo
(function() {
    "use strict";
    
    let timerSeconds = 105; // 1:45 em segundos
    let timerInterval;
    
    function iniciarTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        timerInterval = setInterval(function() {
            timerSeconds--;
            
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = '00:00';
                timerElement.style.color = '#dc3545';
                return;
            }
            
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Mudar cor para amarelo nos últimos 30 segundos
            if (timerSeconds <= 30) {
                timerElement.style.color = '#ffc107';
            }
        }, 1000);
    }
    
    // Simular atualização de stats (apenas demonstração)
    function simularAtualizacao() {
        setInterval(function() {
            // Encontrar um jogador aleatório para atualizar
            const playerRows = document.querySelectorAll('.player-row');
            if (playerRows.length === 0) return;
            
            const randomPlayer = playerRows[Math.floor(Math.random() * playerRows.length)];
            const killCell = randomPlayer.querySelector('td:nth-child(2)');
            const deathCell = randomPlayer.querySelector('td:nth-child(4)');
            
            if (killCell && deathCell) {
                // Pequena chance de atualizar estatísticas
                if (Math.random() < 0.3) {
                    const currentKills = parseInt(killCell.textContent) || 0;
                    const currentDeaths = parseInt(deathCell.textContent) || 0;
                    
                    // Simular kill ou death
                    if (Math.random() < 0.6) {
                        killCell.textContent = currentKills + 1;
                        killCell.classList.add('stat-highlight');
                        setTimeout(() => killCell.classList.remove('stat-highlight'), 1000);
                    } else {
                        deathCell.textContent = currentDeaths + 1;
                    }
                    
                    // Atualizar +/- 
                    const diffCell = randomPlayer.querySelector('td:nth-child(5)');
                    if (diffCell) {
                        const newDiff = (parseInt(killCell.textContent) || 0) - (parseInt(deathCell.textContent) || 0);
                        diffCell.textContent = (newDiff >= 0 ? '+' : '') + newDiff;
                        diffCell.className = newDiff >= 0 ? 'stat-positive' : 'stat-negative';
                    }
                }
            }
        }, 5000); // Atualizar a cada 5 segundos
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Placar inicializado');
        iniciarTimer();
        simularAtualizacao();
        
        // Adicionar tooltips para equipamentos
        const equipmentCells = document.querySelectorAll('.equipment');
        equipmentCells.forEach(cell => {
            cell.title = 'Equipamento atual do jogador';
        });
    });
    
})();