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
      // Se der erro 401 (não autorizado), redirecionar para login
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
    console.error(`❌ Erro na requisição ${method} ${endpoint}:`, error);
    throw error;
  }
}

export const authAPI = {
  login: (email, senha) => apiRequest('/auth/login', 'POST', { email, senha }),
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  getProfile: () => apiRequest('/auth/profile', 'GET'),
  verifyToken: () => apiRequest('/auth/verify', 'GET')
};

export const tournamentAPI = {
  getAll: () => apiRequest('/tournaments', 'GET'),
  getById: (id) => apiRequest(`/tournaments/${id}`, 'GET'),
  create: (tournamentData) => apiRequest('/tournaments', 'POST', tournamentData),
  update: (id, tournamentData) => apiRequest(`/tournaments/${id}`, 'PUT', tournamentData),
  delete: (id) => apiRequest(`/tournaments/${id}`, 'DELETE')
};

export const matchAPI = {
  getByTournament: (torneioId) => apiRequest(`/matches/tournaments/${torneioId}/matches`, 'GET'),
  getById: (id) => apiRequest(`/matches/${id}`, 'GET'),
  create: (matchData) => apiRequest('/matches', 'POST', matchData),
  updateScore: (matchId, scoreData) => apiRequest(`/matches/${matchId}/score`, 'POST', scoreData),
  delete: (id) => apiRequest(`/matches/${id}`, 'DELETE')
};

export const teamAPI = {
  getAll: () => apiRequest('/teams', 'GET'),
  getById: (id) => apiRequest(`/teams/${id}`, 'GET'),
  create: (teamData) => apiRequest('/teams', 'POST', teamData)
};

// Verificar autenticação em todas as páginas
export function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  
  // Se não está na página de login e não tem token, redirecionar
  if (currentPage !== 'index.html' && !token) {
    window.location.href = 'index.html';
    return false;
  }
  
  return !!token;
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}