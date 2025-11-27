// customizar.js - Lógica da página de criação
(function() {
    "use strict";
    
    let modoSelecionado = null;
    const formsContainer = document.getElementById('formsContainer');
    
    // Templates dos formulários
    const formularios = {
        simples: `
            <form class="form-customizar" id="formSimples">
                <div class="form-section">
                    <h4>Informações da Partida</h4>
                    
                    <div class="form-group">
                        <label for="nomePartida">Nome da Partida</label>
                        <input type="text" id="nomePartida" class="form-input" placeholder="Ex: Amistoso Wolves vs Dragons" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="esportePartida">Esporte/Modalidade</label>
                        <select id="esportePartida" class="form-select" required>
                            <option value="">Selecione o esporte</option>
                            <option value="futebol">⚽ Futebol</option>
                            <option value="basquete">🏀 Basquete</option>
                            <option value="cs2">🎮 Counter-Strike 2</option>
                            <option value="valorant">🎯 Valorant</option>
                            <option value="lol">⚔️ League of Legends</option>
                            <option value="outro">🎲 Outro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="dataPartida">Data e Hora</label>
                        <input type="datetime-local" id="dataPartida" class="form-input" required>
                    </div>
                </div>

                <div class="form-section">
                    <h4>Times</h4>
                    
                    <div class="form-group">
                        <label for="timeA">Time A</label>
                        <input type="text" id="timeA" class="form-input" placeholder="Nome do Time A" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="timeB">Time B</label>
                        <input type="text" id="timeB" class="form-input" placeholder="Nome do Time B" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancelar" onclick="cancelarCriacao()">Cancelar</button>
                    <button type="submit" class="btn-criar">Criar Partida</button>
                </div>
            </form>
        `,
        
        torneio: `
            <form class="form-customizar" id="formTorneio">
                <div class="form-section">
                    <h4>Informações do Torneio</h4>
                    
                    <div class="form-group">
                        <label for="nomeTorneio">Nome do Torneio</label>
                        <input type="text" id="nomeTorneio" class="form-input" placeholder="Ex: WolfPack Championship 2024" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="descricaoTorneio">Descrição</label>
                        <textarea id="descricaoTorneio" class="form-textarea" placeholder="Descreva o torneio..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="formatoTorneio">Formato</label>
                        <select id="formatoTorneio" class="form-select" required>
                            <option value="eliminatoria-simples">Eliminatória Simples</option>
                            <option value="grupos-eliminatoria">Grupos + Eliminatória</option>
                            <option value="round-robin">Round Robin</option>
                            <option value="dupla-eliminacao">Dupla Eliminação</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="numTimes">Número de Times</label>
                        <select id="numTimes" class="form-select" required>
                            <option value="4">4 Times</option>
                            <option value="8">8 Times</option>
                            <option value="16">16 Times</option>
                            <option value="32">32 Times</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancelar" onclick="cancelarCriacao()">Cancelar</button>
                    <button type="submit" class="btn-criar">Criar Torneio</button>
                </div>
            </form>
        `,
        
        personalizado: `
            <form class="form-customizar" id="formPersonalizado">
                <div class="form-section">
                    <h4>Configurações Básicas</h4>
                    
                    <div class="form-group">
                        <label for="nomeEvento">Nome do Evento</label>
                        <input type="text" id="nomeEvento" class="form-input" placeholder="Nome do seu evento personalizado" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="tipoEvento">Tipo de Evento</label>
                        <select id="tipoEvento" class="form-select" required>
                            <option value="partida-unica">Partida Única</option>
                            <option value="torneio">Torneio</option>
                            <option value="liga">Liga</option>
                            <option value="amistoso">Série de Amistosos</option>
                        </select>
                    </div>
                </div>

                <div class="form-section advanced-settings">
                    <h4>Configurações Avançadas</h4>
                    
                    <div class="setting-option">
                        <span class="setting-label">Estatísticas Detalhadas</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="statsDetalhadas">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-option">
                        <span class="setting-label">Streaming Integrado</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="streaming">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-option">
                        <span class="setting-label">API Externa</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="apiExterna">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-option">
                        <span class="setting-label">Modo Competitivo</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="modoCompetitivo">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div class="form-section">
                    <h4>Regras Personalizadas</h4>
                    <div class="form-group">
                        <label for="regrasCustom">Regras do Evento</label>
                        <textarea id="regrasCustom" class="form-textarea" placeholder="Descreva as regras personalizadas do seu evento..."></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancelar" onclick="cancelarCriacao()">Cancelar</button>
                    <button type="submit" class="btn-criar">Criar Evento Personalizado</button>
                </div>
            </form>
        `
    };
    
    // Selecionar modo
    window.selecionarModo = function(modo) {
        modoSelecionado = modo;
        
        // Remover classe active de todos os cards
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Adicionar classe active ao card selecionado
        document.querySelector(`[data-mode="${modo}"]`).classList.add('active');
        
        // Mostrar formulário correspondente
        formsContainer.innerHTML = formularios[modo];
        formsContainer.classList.add('active');
        
        // Adicionar event listeners aos formulários
        setTimeout(() => {
            const form = document.getElementById(`form${modo.charAt(0).toUpperCase() + modo.slice(1)}`);
            if (form) {
                form.addEventListener('submit', handleFormSubmit);
            }
        }, 100);
    };
    
    // Manipular envio do formulário
    function handleFormSubmit(event) {
        event.preventDefault();
        
        let dados = {};
        
        switch(modoSelecionado) {
            case 'simples':
                dados = {
                    tipo: 'partida',
                    nome: document.getElementById('nomePartida').value,
                    esporte: document.getElementById('esportePartida').value,
                    data: document.getElementById('dataPartida').value,
                    timeA: document.getElementById('timeA').value,
                    timeB: document.getElementById('timeB').value
                };
                break;
                
            case 'torneio':
                dados = {
                    tipo: 'torneio',
                    nome: document.getElementById('nomeTorneio').value,
                    descricao: document.getElementById('descricaoTorneio').value,
                    formato: document.getElementById('formatoTorneio').value,
                    numTimes: document.getElementById('numTimes').value
                };
                break;
                
            case 'personalizado':
                dados = {
                    tipo: 'personalizado',
                    nome: document.getElementById('nomeEvento').value,
                    tipoEvento: document.getElementById('tipoEvento').value,
                    statsDetalhadas: document.getElementById('statsDetalhadas').checked,
                    streaming: document.getElementById('streaming').checked,
                    apiExterna: document.getElementById('apiExterna').checked,
                    modoCompetitivo: document.getElementById('modoCompetitivo').checked,
                    regras: document.getElementById('regrasCustom').value
                };
                break;
        }
        
        // Salvar no localStorage (simulação)
        salvarEvento(dados);
        
        // Redirecionar
        alert('Evento criado com sucesso!');
        window.location.href = 'partidas.html';
    }
    
    // Salvar evento
    function salvarEvento(dados) {
        const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
        dados.id = Date.now();
        dados.criadoEm = new Date().toISOString();
        eventos.push(dados);
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }
    
    // Cancelar criação
    window.cancelarCriacao = function() {
        formsContainer.classList.remove('active');
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('active');
        });
        modoSelecionado = null;
    };
    
    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Página de customização carregada');
    });
    
})();