// partidas.js - Gerenciamento de Partidas
(function() {
    "use strict";
    
    let partidas = [];
    let torneioAtual = null;
    
    // Elementos DOM
    const modalPartida = document.getElementById('modalPartida');
    const btnNovaPartida = document.getElementById('btnNovaPartida');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelar = document.getElementById('btnCancelar');
    const formPartida = document.getElementById('formPartida');
    const listaPartidas = document.getElementById('listaPartidas');
    const filtroStatus = document.getElementById('filtroStatus');
    
    // Carregar dados do torneio da URL
    function carregarTorneioDaURL() {
        const params = new URLSearchParams(window.location.search);
        const torneioId = params.get('torneio');
        
        if (torneioId) {
            const torneios = JSON.parse(localStorage.getItem('torneios') || '[]');
            torneioAtual = torneios.find(t => t.id == torneioId);
            
            if (torneioAtual) {
                document.getElementById('nomeTorneio').textContent = torneioAtual.titulo;
                document.getElementById('descricaoTorneio').textContent = torneioAtual.descricao;
                
                // Carregar partidas do torneio
                partidas = JSON.parse(localStorage.getItem(`partidas_${torneioId}`) || '[]');
                renderizarPartidas();
            }
        }
    }
    
    // Renderizar lista de partidas
    function renderizarPartidas(filtro = 'todas') {
        listaPartidas.innerHTML = '';
        
        const partidasFiltradas = filtro === 'todas' 
            ? partidas 
            : partidas.filter(p => p.status === filtro);
            
        if (partidasFiltradas.length === 0) {
            listaPartidas.innerHTML = '<p class="sem-partidas">Nenhuma partida encontrada.</p>';
            return;
        }
        
        partidasFiltradas.forEach((partida, index) => {
            const partidaElement = criarElementoPartida(partida, index);
            listaPartidas.appendChild(partidaElement);
        });
    }
    
    // Criar elemento HTML para partida
    function criarElementoPartida(partida, index) {
        const div = document.createElement('div');
        div.className = 'partida-card';
        div.setAttribute('data-status', partida.status);
        
        const statusClass = `status-${partida.status}`;
        const statusText = {
            'agendada': 'Agendada',
            'andamento': 'Em Andamento', 
            'concluida': 'Concluída',
            'cancelada': 'Cancelada'
        }[partida.status] || partida.status;
        
        div.innerHTML = `
            <div class="partida-header">
                <span class="partida-numero">Partida #${index + 1}</span>
                <span class="partida-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="partida-times">
                <div class="time time-a">
                    <span class="time-nome">${partida.timeA}</span>
                    <span class="time-pontos">${partida.pontosA || 0}</span>
                </div>
                <div class="vs">VS</div>
                <div class="time time-b">
                    <span class="time-nome">${partida.timeB}</span>
                    <span class="time-pontos">${partida.pontosB || 0}</span>
                </div>
            </div>
            
            <div class="partida-info">
                <div class="info-item">
                    <strong>Data:</strong> ${formatarData(partida.data)}
                </div>
                <div class="info-item">
                    <strong>Local:</strong> ${partida.local || 'Não definido'}
                </div>
                <div class="info-item">
                    <strong>Rodada:</strong> ${partida.rodada}
                </div>
            </div>
            
            <div class="partida-actions">
                <button class="btn btn-editar" onclick="editarPartida(${index})">Editar</button>
                <button class="btn btn-resultado" onclick="atualizarResultado(${index})">Atualizar Resultado</button>
                <button class="btn btn-finalizar" onclick="finalizarPartida(${index})">Finalizar</button>
            </div>
        `;
        
        return div;
    }
    
    // Formatador de data
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR');
    }
    
    // Abrir modal para nova partida
    function abrirModalPartida() {
        formPartida.reset();
        modalPartida.hidden = false;
    }
    
    // Fechar modal
    function fecharModalPartida() {
        modalPartida.hidden = true;
    }
    
    // Salvar nova partida
    function salvarPartida(event) {
        event.preventDefault();
        
        const novaPartida = {
            timeA: document.getElementById('timeA').value,
            timeB: document.getElementById('timeB').value,
            data: document.getElementById('dataPartida').value,
            local: document.getElementById('localPartida').value,
            rodada: document.getElementById('rodadaPartida').value,
            observacoes: document.getElementById('observacoesPartida').value,
            status: 'agendada',
            pontosA: 0,
            pontosB: 0,
            criadoEm: new Date().toISOString()
        };
        
        partidas.push(novaPartida);
        salvarPartidasNoStorage();
        renderizarPartidas(filtroStatus.value);
        fecharModalPartida();
    }
    
    // Salvar partidas no localStorage
    function salvarPartidasNoStorage() {
        if (torneioAtual) {
            localStorage.setItem(`partidas_${torneioAtual.id}`, JSON.stringify(partidas));
        }
    }
    
    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
        carregarTorneioDaURL();
        
        // Event Listeners
        btnNovaPartida.addEventListener('click', abrirModalPartida);
        btnCloseModal.addEventListener('click', fecharModalPartida);
        btnCancelar.addEventListener('click', fecharModalPartida);
        formPartida.addEventListener('submit', salvarPartida);
        filtroStatus.addEventListener('change', function() {
            renderizarPartidas(this.value);
        });
        
        // Fechar modal clicando fora
        modalPartida.addEventListener('click', function(e) {
            if (e.target === modalPartida) {
                fecharModalPartida();
            }
        });
    });
    
    // Funções globais para os botões
    window.editarPartida = function(index) {
        alert(`Editar partida ${index + 1}`);
    };
    
    window.atualizarResultado = function(index) {
        alert(`Atualizar resultado da partida ${index + 1}`);
    };
    
    window.finalizarPartida = function(index) {
        if (confirm('Deseja finalizar esta partida?')) {
            partidas[index].status = 'concluida';
            salvarPartidasNoStorage();
            renderizarPartidas(filtroStatus.value);
        }
    };
    
})();