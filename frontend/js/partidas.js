const API_URL = 'http://localhost:3000/api';

async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
        return null;
      }
      throw new Error(data.message || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Erro na requisição:`, error);
    alert('Erro: ' + error.message);
    throw error;
  }
}

// Funções específicas da API
    async function carregarTorneioDaURL() {
        const params = new URLSearchParams(window.location.search);
        const torneioId = params.get('torneio') || params.get('torneioId');
        
        if (torneioId) {
            // Carregar torneio da API
            torneioAtual = await carregarTorneioAPI(torneioId);
            
            if (torneioAtual) {
                document.getElementById('nomeTorneio').textContent = torneioAtual.nome;
                document.getElementById('descricaoTorneio').textContent = torneioAtual.descricao || 'Sem descrição';
                
                // Carregar partidas da API
                partidas = await carregarPartidasAPI(torneioId);
                renderizarPartidas();
                
                // Carregar times para o modal
                await carregarTimesParaModal();
            } else {
                alert('Torneio não encontrado!');
                window.location.href = 'principal.html';
            }
        } else {
            alert('ID do torneio não especificado!');
            window.location.href = 'principal.html';
        }
    }

async function carregarPartidasAPI(torneioId) {
  try {
    const result = await apiRequest(`/matches/tournaments/${torneioId}/matches`, 'GET');
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Erro ao carregar partidas:', error);
    return [];
  }
}

async function criarPartidaAPI(partidaData) {
  try {
    const result = await apiRequest('/matches', 'POST', partidaData);
    return result.success ? result.matchId : null;
  } catch (error) {
    console.error('Erro ao criar partida:', error);
    return null;
  }
}

async function atualizarPlacarAPI(partidaId, placarData) {
  try {
    const result = await apiRequest(`/matches/${partidaId}/score`, 'POST', placarData);
    return result.success;
  } catch (error) {
    console.error('Erro ao atualizar placar:', error);
    return false;
  }
}

async function carregarTimesAPI() {
  try {
    const result = await apiRequest('/teams', 'GET');
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Erro ao carregar times:', error);
    return [];
  }
}


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
    
    // Carregar times para os selects do modal
    async function carregarTimesParaModal() {
        const times = await carregarTimesAPI();
        
        const selectTimeA = document.getElementById('timeA');
        const selectTimeB = document.getElementById('timeB');
        
        // Limpar selects
        selectTimeA.innerHTML = '<option value="">Selecione um time</option>';
        selectTimeB.innerHTML = '<option value="">Selecione um time</option>';
        
        // Adicionar times
        times.forEach(time => {
            const optionA = document.createElement('option');
            optionA.value = time.id_equipe;
            optionA.textContent = `${time.nome} (${time.tag || ''})`;
            
            const optionB = optionA.cloneNode(true);
            
            selectTimeA.appendChild(optionA);
            selectTimeB.appendChild(optionB);
        });
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
       // Criar elemento HTML para partida (AGORA COM DADOS DA API)
    function criarElementoPartida(partida, index) {
        const div = document.createElement('div');
        div.className = 'partida-card';
        div.setAttribute('data-status', partida.status);
        div.setAttribute('data-id', partida.id_partida);
        
        const statusClass = `status-${partida.status}`;
        const statusText = {
            'agendada': 'Agendada',
            'em_andamento': 'Em Andamento', 
            'concluida': 'Concluída',
            'cancelada': 'Cancelada'
        }[partida.status] || partida.status;
        
        // Formatar data
        let dataFormatada = 'Não definida';
        if (partida.data_partida) {
            const data = new Date(partida.data_partida);
            dataFormatada = data.toLocaleString('pt-BR');
        }
        
        div.innerHTML = `
            <div class="partida-header">
                <span class="partida-numero">Partida #${index + 1}</span>
                <span class="partida-status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="partida-times">
                <div class="time time-a">
                    <span class="time-nome">${partida.time_casa_nome || 'Time Casa'}</span>
                    <span class="time-pontos">${partida.placar_casa || 0}</span>
                </div>
                <div class="vs">VS</div>
                <div class="time time-b">
                    <span class="time-nome">${partida.time_visitante_nome || 'Time Visitante'}</span>
                    <span class="time-pontos">${partida.placar_visitante || 0}</span>
                </div>
            </div>
            
            <div class="partida-info">
                <div class="info-item">
                    <strong>Data:</strong> ${dataFormatada}
                </div>
                <div class="info-item">
                    <strong>Local:</strong> ${partida.local_partida || 'Não definido'}
                </div>
                <div class="info-item">
                    <strong>Rodada:</strong> ${partida.round || 'Não especificada'}
                </div>
                ${partida.observacoes ? `
                <div class="info-item">
                    <strong>Observações:</strong> ${partida.observacoes}
                </div>` : ''}
            </div>
            
            <div class="partida-actions">
                <button class="btn btn-editar" onclick="editarPartida(${partida.id_partida})">Editar</button>
                <button class="btn btn-resultado" onclick="atualizarResultado(${partida.id_partida})">Atualizar Resultado</button>
                <button class="btn btn-finalizar" onclick="finalizarPartida(${partida.id_partida})">Finalizar</button>
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
        // Salvar nova partida (AGORA COM API)
    async function salvarPartida(event) {
        event.preventDefault();
        
        const params = new URLSearchParams(window.location.search);
        const torneioId = params.get('torneio') || params.get('torneioId');
        
        const novaPartida = {
            torneio_id: parseInt(torneioId),
            time_casa_id: parseInt(document.getElementById('timeA').value),
            time_visitante_id: parseInt(document.getElementById('timeB').value),
            round: document.getElementById('rodadaPartida').value,
            data_partida: document.getElementById('dataPartida').value,
            local_partida: document.getElementById('localPartida').value,
            observacoes: document.getElementById('observacoesPartida').value
        };
        
        try {
            // Mostrar loading
            const btnSalvar = document.querySelector('.btn-salvar');
            const originalText = btnSalvar.textContent;
            btnSalvar.textContent = 'Salvando...';
            btnSalvar.disabled = true;
            
            // Criar partida via API
            const partidaId = await criarPartidaAPI(novaPartida);
            
            if (partidaId) {
                alert('Partida criada com sucesso!');
                
                // Recarregar partidas
                partidas = await carregarPartidasAPI(torneioId);
                renderizarPartidas(filtroStatus.value);
                fecharModalPartida();
            } else {
                alert('Erro ao criar partida!');
            }
            
        } catch (error) {
            console.error('Erro ao salvar partida:', error);
            alert('Erro ao criar partida: ' + error.message);
        } finally {
            // Restaurar botão
            const btnSalvar = document.querySelector('.btn-salvar');
            btnSalvar.textContent = 'Salvar Partida';
            btnSalvar.disabled = false;
        }
    }

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