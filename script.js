// ============================================
// SISTEMA DE REFEIÇÕES - 2º GAC ITU/SP
// Arquivo: script.js
// Linguagem: JavaScript puro
// ============================================

// ===== DADOS DAS REFEIÇÕES =====
const REFEICOES = {
  cafe: { nome: 'Café da Manhã', horario: '06:00 - 07:30', icon: '☕' },
  almoco: { nome: 'Almoço', horario: '11:30 - 13:00', icon: '🍽️' },
  janta: { nome: 'Janta', horario: '17:30 - 19:00', icon: '🌅' },
  ceia: { nome: 'Ceia', horario: '21:00 - 22:00', icon: '🌙' }
};

// ===== ESTADO DA APLICAÇÃO =====
let usuarioAtual = null;
let bateriaSelecionada = '1ª BO';
let refeicoesSelecionadas = [];

// ============================================
// INICIALIZAÇÃO - Quando a página carrega
// ============================================
window.onload = function() {
  verificarSessao();
  // Define data mínima do agendamento como hoje
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('agendar-data').min = hoje;
  document.getElementById('agendar-data').value = hoje;
};

// ============================================
// SISTEMA DE TELAS
// ============================================
function mostrarTela(idTela) {
  // Esconde todas as telas
  document.querySelectorAll('.tela').forEach(t => t.classList.add('hidden'));
  // Mostra apenas a tela escolhida
  document.getElementById(idTela).classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ============================================
// SISTEMA DE MENSAGENS (TOAST)
// ============================================
function mostrarMensagem(texto, tipo) {
  const toast = document.getElementById('toast');
  toast.textContent = (tipo === 'sucesso' ? '✓ ' : '✕ ') + texto;
  toast.className = 'toast ' + tipo;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// ============================================
// SISTEMA DE ARMAZENAMENTO (localStorage)
// ============================================
function salvarDado(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function buscarDado(chave) {
  const valor = localStorage.getItem(chave);
  return valor ? JSON.parse(valor) : null;
}

function deletarDado(chave) {
  localStorage.removeItem(chave);
}

function listarChaves(prefixo) {
  const chaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave.startsWith(prefixo)) {
      chaves.push(chave);
    }
  }
  return chaves;
}

// ============================================
// SESSÃO - Verificar se já está logado
// ============================================
function verificarSessao() {
  const sessao = buscarDado('sessao_ativa');
  if (sessao && sessao.id) {
    const user = buscarDado(`user:${sessao.id}`);
    if (user) {
      usuarioAtual = user;
      mostrarTela('tela-dashboard');
      carregarDashboard();
      return;
    }
  }
  mostrarTela('tela-login');
}

// ============================================
// CADASTRO
// ============================================
function selecionarBateria(bateria) {
  bateriaSelecionada = bateria;
  document.querySelectorAll('.bateria-btn').forEach(btn => {
    if (btn.dataset.bateria === bateria) {
      btn.classList.add('ativo');
    } else {
      btn.classList.remove('ativo');
    }
  });
}

function atualizarPreview() {
  const nome = document.getElementById('cadastro-nome').value;
  const posto = document.getElementById('cadastro-posto').value;
  const preview = document.getElementById('preview-identificacao');

  if (nome.trim()) {
    preview.innerHTML = 'Sua identificação: <strong>' + posto + ' ' + nome.toUpperCase() + '</strong>';
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
}

function fazerCadastro() {
  const nome = document.getElementById('cadastro-nome').value.trim();
  const posto = document.getElementById('cadastro-posto').value;

  if (!nome) {
    mostrarMensagem('Informe seu nome de guerra', 'erro');
    return;
  }

  const id = posto + ' ' + nome.toUpperCase();

  // Verifica se já existe
  const existente = buscarDado(`user:${id}`);
  if (existente) {
    mostrarMensagem('Já existe um militar cadastrado com este posto e nome', 'erro');
    return;
  }

  // Cria o novo usuário
  const novoUser = {
    id: id,
    nomeGuerra: nome.toUpperCase(),
    posto: posto,
    bateria: bateriaSelecionada,
    cadastradoEm: new Date().toISOString()
  };

  salvarDado(`user:${id}`, novoUser);
  salvarDado('sessao_ativa', { id: id });

  usuarioAtual = novoUser;
  mostrarMensagem('Bem-vindo, ' + id + '!', 'sucesso');
  mostrarTela('tela-dashboard');
  carregarDashboard();
}

// ============================================
// LOGIN
// ============================================
function fazerLogin() {
  const identificador = document.getElementById('input-login').value.trim().toUpperCase();

  if (!identificador) {
    mostrarMensagem('Informe sua identificação', 'erro');
    return;
  }

  const user = buscarDado(`user:${identificador}`);
  if (!user) {
    mostrarMensagem('Militar não cadastrado. Faça o cadastro primeiro.', 'erro');
    return;
  }

  salvarDado('sessao_ativa', { id: identificador });
  usuarioAtual = user;
  mostrarMensagem('Bem-vindo de volta, ' + identificador + '!', 'sucesso');
  mostrarTela('tela-dashboard');
  carregarDashboard();
}

// Permite logar apertando Enter
document.addEventListener('DOMContentLoaded', function() {
  const inputLogin = document.getElementById('input-login');
  if (inputLogin) {
    inputLogin.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') fazerLogin();
    });
  }
});

// ============================================
// LOGOUT
// ============================================
function logout() {
  deletarDado('sessao_ativa');
  usuarioAtual = null;
  document.getElementById('input-login').value = '';
  mostrarTela('tela-login');
}

// ============================================
// DASHBOARD
// ============================================
function carregarDashboard() {
  if (!usuarioAtual) return;

  document.getElementById('usuario-id').textContent = usuarioAtual.id;
  document.getElementById('usuario-bateria').textContent = usuarioAtual.bateria;

  const agendamentos = buscarAgendamentos();
  document.getElementById('contador-agendamentos').textContent = agendamentos.length + ' agendamento(s)';

  // Próximas refeições
  const hoje = new Date().toISOString().split('T')[0];
  const proximas = agendamentos.filter(a => a.data >= hoje).slice(0, 3);
  const lista = document.getElementById('lista-proximas');

  if (proximas.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhuma refeição agendada</div>';
  } else {
    lista.innerHTML = proximas.map(ag => `
      <div class="proxima-card">
        <div class="proxima-data">${formatarData(ag.data)}</div>
        <div class="proxima-refs">
          ${ag.refeicoes.map(r => `<span class="tag-refeicao">${REFEICOES[r].nome}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

function buscarAgendamentos() {
  if (!usuarioAtual) return [];
  const chaves = listarChaves(`agendamento:${usuarioAtual.id}:`);
  const agendamentos = chaves.map(chave => {
    const ag = buscarDado(chave);
    ag._key = chave;
    return ag;
  });
  agendamentos.sort((a, b) => b.data.localeCompare(a.data));
  return agendamentos;
}

function formatarData(dataStr) {
  const partes = dataStr.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// ============================================
// AGENDAR
// ============================================
function abrirAgendar() {
  document.getElementById('header-agendar-sub').textContent = usuarioAtual.id;
  refeicoesSelecionadas = [];
  document.querySelectorAll('.refeicao-card').forEach(card => {
    card.classList.remove('ativo');
    card.querySelector('.check-badge').classList.add('hidden');
  });
  mostrarTela('tela-agendar');
}

function toggleRefeicao(id) {
  const card = document.querySelector(`.refeicao-card[data-refeicao="${id}"]`);
  const badge = card.querySelector('.check-badge');

  if (refeicoesSelecionadas.includes(id)) {
    refeicoesSelecionadas = refeicoesSelecionadas.filter(r => r !== id);
    card.classList.remove('ativo');
    badge.classList.add('hidden');
  } else {
    refeicoesSelecionadas.push(id);
    card.classList.add('ativo');
    badge.classList.remove('hidden');
  }
}

function salvarAgendamento() {
  if (refeicoesSelecionadas.length === 0) {
    mostrarMensagem('Selecione pelo menos uma refeição', 'erro');
    return;
  }

  const data = document.getElementById('agendar-data').value;
  const hoje = new Date().toISOString().split('T')[0];

  if (data < hoje) {
    mostrarMensagem('Não é possível agendar para datas passadas', 'erro');
    return;
  }

  const agendamento = {
    userId: usuarioAtual.id,
    nomeGuerra: usuarioAtual.nomeGuerra,
    posto: usuarioAtual.posto,
    bateria: usuarioAtual.bateria,
    data: data,
    refeicoes: refeicoesSelecionadas,
    registradoEm: new Date().toISOString()
  };

  salvarDado(`agendamento:${usuarioAtual.id}:${data}`, agendamento);
  mostrarMensagem('Refeições agendadas com sucesso!', 'sucesso');
  mostrarTela('tela-historico');
  carregarHistorico();
}

// ============================================
// HISTÓRICO
// ============================================
function carregarHistorico() {
  document.getElementById('header-historico-sub').textContent = usuarioAtual.id;
  const agendamentos = buscarAgendamentos();
  const container = document.getElementById('conteudo-historico');
  const hoje = new Date().toISOString().split('T')[0];

  if (agendamentos.length === 0) {
    container.innerHTML = `
      <div class="vazio">
        <div style="font-size: 48px; color: #5a4509;">📅</div>
        <div style="margin-top: 12px;">Nenhum agendamento ainda</div>
        <button class="btn-primary" style="margin-top: 20px;" onclick="abrirAgendar()">
          AGENDAR AGORA <span class="seta">›</span>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = '<div class="lista-agendamentos">' +
    agendamentos.map(ag => {
      const passado = ag.data < hoje;
      return `
        <div class="agendamento-card ${passado ? 'passado' : ''}">
          <div class="agendamento-header">
            <div>
              <div class="agendamento-data">${formatarData(ag.data)}</div>
              <div class="agendamento-status">${passado ? '✓ Realizado' : '⏳ Agendado'}</div>
            </div>
            ${!passado ? `<button class="btn-delete" onclick="excluirAgendamento('${ag._key}')">🗑️</button>` : ''}
          </div>
          <div class="agendamento-refs">
            ${ag.refeicoes.map(r => `
              <div class="refeicao-item">${REFEICOES[r].icon} ${REFEICOES[r].nome}</div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('') + '</div>';
}

function excluirAgendamento(key) {
  if (confirm('Deseja realmente cancelar este agendamento?')) {
    deletarDado(key);
    mostrarMensagem('Agendamento removido', 'sucesso');
    carregarHistorico();
  }
}
