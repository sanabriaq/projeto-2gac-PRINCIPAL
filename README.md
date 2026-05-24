# 🎖️ Sistema de Refeições - 2º GAC ITU/SP

Sistema de gerenciamento de refeições do 2º Grupo de Artilharia de Campanha.

## 📁 Estrutura

```
projeto-2gac/
├── index.html      ← Página principal (HTML)
├── style.css       ← Estilos visuais (CSS)
├── script.js       ← Lógica do sistema (JavaScript)
└── img/
    └── 2_GAC.png   ← Brasão do quartel
```

## 🚀 Como Executar

**Forma 1 — Mais fácil:**
1. Dê **duplo clique** no arquivo `index.html`
2. O sistema abre no navegador!

**Forma 2 — Servidor local:**
1. Abra o terminal na pasta do projeto
2. Digite: `python -m http.server 8000`
3. Acesse: http://localhost:8000

## 🔤 Linguagens Utilizadas

| Linguagem | Arquivo | Função |
|-----------|---------|--------|
| **HTML** | `index.html` | Estrutura das telas |
| **CSS** | `style.css` | Cores, fontes e layout |
| **JavaScript** | `script.js` | Lógica e interatividade |

## ✨ Funcionalidades

- ✅ Cadastro de militares (posto, bateria, nome de guerra)
- ✅ Login por identificação militar
- ✅ Agendamento de 4 refeições (café, almoço, janta, ceia)
- ✅ Histórico de agendamentos
- ✅ Cancelamento de agendamentos futuros
- ✅ Interface temática militar

## 📋 Postos/Graduações

SD EV, SD EP, CB, 3º SGT, 2º SGT, 1º SGT, ST, ASP, 2º TEN, 1º TEN, CAP, MAJ, TC

## 🎯 Baterias

1ª BO, 2ª BO, 3ª BM, BC

## 💾 Armazenamento

Os dados são salvos no **localStorage** do navegador (cada usuário tem seus próprios dados no seu próprio dispositivo).

## 🌐 Hospedagem

Funciona em qualquer hospedagem estática:
- **Vercel** — Conectar com GitHub e fazer deploy
- **Netlify** — Arrastar pasta direto pro site
- **GitHub Pages** — Ativar nas configurações do repositório

---

**Desenvolvido para o 2º GAC ITU/SP** 🎖️
