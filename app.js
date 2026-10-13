'use strict';
/* Gerenia · gerente com IA, painel que cresce por áreas.
   Áreas (WhatsApp, Clientes, Agenda, Financeiro) são o que você vê.
   Apps conectados são de onde vêm os dados: um app pode alimentar várias áreas.
   Textos em PT e EN lado a lado: L('português', 'english').
   SPA sem build. Rotas por hash. Todos os dados são fictícios. */

const root = document.getElementById('root');
// Número da Gerenia no WhatsApp. Demonstração: trocar pelo número oficial.
const GERENIA_WHATSAPP = '5511900000000';
const waLink = () => `https://wa.me/${GERENIA_WHATSAPP}?text=${encodeURIComponent(L(
  `Oi, Gerenia! Aqui é ${first(S.name) || 'eu'}${S.business ? `, da ${S.business}` : ''}.`,
  `Hi, Gerenia! This is ${first(S.name) || 'me'}${S.business ? ` from ${S.business}` : ''}.`))}`;
const KEY = 'gerenia-claude-v4';
const AREAS = ['whatsapp', 'clientes', 'agenda', 'financeiro'];

/* ---------- Ícones ---------- */
const P = {
  chat: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 18l-6-6 6-6',
  check: 'M20 6 9 17l-5-5',
  close: 'M18 6 6 18M6 6l12 12',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  sun: 'M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M17.7 17.7l.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M20.4 14.5A8.5 8.5 0 0 1 9.5 3.6 8.5 8.5 0 1 0 20.4 14.5z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  search: 'M21 21l-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  clinic: 'M4 21V7l8-4 8 4v14M9 21v-5h6v5M12 8v5M9.5 10.5h5',
  dumbbell: 'M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12',
  lotus: 'M12 20c-4 0-8-2-9-6 3-1 6 0 9 3 3-3 6-4 9-3-1 4-5 6-9 6zM12 17c-2-3-2-7 0-11 2 4 2 8 0 11z',
  store: 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  plug: 'M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM17 9a4 4 0 0 1 0 6M20 6a8 8 0 0 1 0 12',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9z',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  userPlus: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  play: 'M7 4.5v15l12-7.5z',
  stop: 'M7 7h10v10H7z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  pin: 'M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;

/* ---------- Idioma ---------- */
const EN = () => S.lang === 'en';
const L = (pt, en) => (S.lang === 'en' ? en : pt);
const loc = () => (EN() ? 'en-US' : 'pt-BR');
const langToggle = () => `<div class="lang-toggle" role="group" aria-label="${L('Idioma', 'Language')}">${[['pt', 'PT'], ['en', 'EN']].map(([k, l]) => `<button data-act="lang" data-v="${k}" aria-pressed="${S.lang === k}">${l}</button>`).join('')}</div>`;

/* ---------- Utilitários ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = v => v.toLocaleString(loc(), { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const first = s => (s || '').trim().split(/\s+/)[0] || '';
const initials = s => s.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const join = l => l.length > 1 ? `${l.slice(0, -1).join(', ')} ${L('e', 'and')} ${l[l.length - 1]}` : (l[0] || '');
const monthName = (offset = 0) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + offset); const m = d.toLocaleDateString(loc(), { month: 'long' }); return EN() ? m : m.toLowerCase(); };
const greeting = () => { const h = new Date().getHours(); return h < 12 ? L('Bom dia', 'Good morning') : h < 18 ? L('Boa tarde', 'Good afternoon') : L('Boa noite', 'Good evening'); };
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const mark = (cls = '') => `<img class="mark ${cls}" src="assets/mark.svg" alt="">`;
const brand = (href = '#/') => `<a class="brand" href="${href}" aria-label="${L('Gerenia, início', 'Gerenia, home')}">${mark()}<span>Gerenia</span></a>`;
const thousands = n => EN() ? `${(n / 1000).toFixed(1)}K` : `${(n / 1000).toFixed(1).replace('.', ',')} mil`;

/* ---------- Estado ---------- */
const startLang = () => (new URLSearchParams(location.search).get('lang') === 'pt' ? 'pt' : 'en');
function blank() {
  return {
    name: '', business: '', sector: 'clinica', apps: {}, signedIn: false, waMode: 'assist', tone: 'acolhedora',
    dismissed: [], done: {}, replies: {}, campaigns: [], autos: { bday: true }, tasks: [], skipped: false, company: null, researched: false, briefDone: false,
    theme: document.documentElement.dataset.theme || 'light', lang: startLang(),
  };
}
function load() { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return blank(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
let S = load();
if (new URLSearchParams(location.search).get('lang')) S.lang = startLang();
const keep = () => ({ theme: S.theme, lang: S.lang });
const ui = {
  entering: true, sideNew: false, chat: false, log: [], flow: null, su: null, camp: null,
  day: 0, filter: 'todos', q: '', ctab: 'pessoas', watab: 'pend', cat: 'all', appq: '', sel: [],
  fresh: [], confirm: null, lpStep: 0, lpAuto: true, lpBiz: { q: '', results: [], loading: false }, timers: [], task: null, watch: null, rstep: 0, briefOpen: false,
};
const later = (fn, ms) => ui.timers.push(setTimeout(fn, ms));
const clearTimers = () => { ui.timers.forEach(clearTimeout); ui.timers = []; };

/* ---------- Setores ---------- */
const sectors = () => ({
  clinica: { label: L('Clínica', 'Clinic'), icon: 'clinic', hint: L('Consultórios e clínicas', 'Practices and clinics'), client: L('paciente', 'patient'), clients: L('pacientes', 'patients'), service: L('consulta', 'appointment'), services: L('consultas', 'appointments'), staff: [L('Dra. Ana Ribeiro', 'Dr. Ana Ribeiro'), 'Dr. Lucas Mendes'] },
  academia: { label: L('Academia', 'Gym'), icon: 'dumbbell', hint: L('Academias, boxes e CTs', 'Gyms, boxes and training centers'), client: L('aluno', 'member'), clients: L('alunos', 'members'), service: L('avaliação', 'assessment'), services: L('aulas', 'classes'), staff: [L('Prof. Diego', 'Coach Diego'), L('Prof.ª Camila', 'Coach Camila')] },
  estudio: { label: L('Estúdio', 'Studio'), icon: 'lotus', hint: L('Pilates, yoga e funcional', 'Pilates, yoga and functional'), client: L('aluno', 'student'), clients: L('alunos', 'students'), service: L('aula', 'class'), services: L('aulas', 'classes'), staff: ['Fernanda', 'Marina'] },
  outro: { label: L('Outro', 'Other'), icon: 'store', hint: L('Outro tipo de negócio', 'Another type of business'), client: L('cliente', 'client'), clients: L('clientes', 'clients'), service: L('atendimento', 'appointment'), services: L('atendimentos', 'appointments'), staff: [L('Equipe', 'Team')] },
});
const SECTOR_KEYS = ['clinica', 'academia', 'estudio', 'outro'];
const V = () => sectors()[S.sector] || sectors().clinica;

/* ---------- Apps (de onde vêm os dados) ---------- */
const app = (o, namePt, nameEn, hintPt, hintEn) => Object.assign(o, {
  get name() { return nameEn ? L(namePt, nameEn) : namePt; },
  get hint() { return L(hintPt, hintEn); },
});
const APPS = {
  whatsapp: app({ mono: 'WA', color: '#1f8a5b', cat: 'com', feeds: ['whatsapp', 'clientes'] }, 'WhatsApp', '', 'Conversas e contatos', 'Conversations and contacts'),
  feegow: app({ mono: 'F', color: '#1f9aa5', cat: 'gestao', feeds: ['clientes', 'agenda', 'financeiro'], sectors: ['clinica'] }, 'Feegow', '', 'Gestão de clínicas', 'Clinic management'),
  iclinic: app({ mono: 'iC', color: '#d6455d', cat: 'gestao', feeds: ['clientes', 'agenda'], sectors: ['clinica'] }, 'iClinic', '', 'Gestão de consultórios', 'Practice management'),
  doctoralia: app({ mono: 'Dr', color: '#119e8f', cat: 'agenda', feeds: ['agenda', 'clientes'], sectors: ['clinica'] }, 'Doctoralia', '', 'Agendamento online', 'Online booking'),
  tecnofit: app({ mono: 'Tf', color: '#e05a2a', cat: 'gestao', feeds: ['clientes', 'agenda', 'financeiro'], sectors: ['academia', 'estudio'] }, 'Tecnofit', '', 'Gestão de academias', 'Gym management'),
  nextfit: app({ mono: 'NF', color: '#5b3fd6', cat: 'gestao', feeds: ['clientes', 'agenda', 'financeiro'], sectors: ['estudio', 'academia'] }, 'Next Fit', '', 'Academias e estúdios', 'Gyms and studios'),
  pacto: app({ mono: 'Pa', color: '#2c4fa3', cat: 'gestao', feeds: ['clientes', 'financeiro'], sectors: ['academia'] }, 'Pacto', '', 'Gestão fitness', 'Fitness management'),
  gcal: app({ mono: '31', color: '#3b6fd8', cat: 'agenda', feeds: ['agenda'] }, 'Google Agenda', 'Google Calendar', 'Agenda do Google', 'Google calendar'),
  rdcrm: app({ mono: 'RD', color: '#1d3a6e', cat: 'crm', feeds: ['clientes'] }, 'RD Station CRM', '', 'CRM de vendas', 'Sales CRM'),
  hubspot: app({ mono: 'Hs', color: '#e8613c', cat: 'crm', feeds: ['clientes'] }, 'HubSpot', '', 'CRM e marketing', 'CRM and marketing'),
  sheets: app({ mono: 'GS', color: '#1e8e3e', cat: 'crm', feeds: ['clientes'] }, 'Google Planilhas', 'Google Sheets', 'Lista de contatos', 'Contact list'),
  contaazul: app({ mono: 'CA', color: '#1e7be0', cat: 'fin', feeds: ['financeiro'] }, 'Conta Azul', '', 'Gestão financeira', 'Financial management'),
  omie: app({ mono: 'Om', color: '#0d6efd', cat: 'fin', feeds: ['financeiro'] }, 'Omie', '', 'ERP e financeiro', 'ERP and finance'),
  asaas: app({ mono: 'As', color: '#1767c9', cat: 'pay', feeds: ['financeiro'] }, 'Asaas', '', 'Cobranças e Pix', 'Billing and Pix'),
  mercadopago: app({ mono: 'MP', color: '#0aa5e0', cat: 'pay', feeds: ['financeiro'] }, 'Mercado Pago', '', 'Maquininha e pagamentos', 'Card terminal and payments'),
  stripe: app({ mono: 'S', color: '#635bff', cat: 'pay', feeds: ['financeiro'] }, 'Stripe', '', 'Pagamentos e assinaturas', 'Payments and subscriptions'),
  instagram: app({ mono: 'IG', color: '#c13584', cat: 'com', feeds: [], soon: true }, 'Instagram Direct', '', 'Mensagens do Instagram', 'Instagram messages'),
  gagenda: app({ native: true, feeds: ['agenda'] }, 'Agenda da Gerenia', 'Gerenia Calendar', 'Não uso nenhuma: a Gerenia cria uma pra mim', 'I don’t use one: Gerenia creates one for me'),
  gfin: app({ native: true, feeds: ['financeiro'] }, 'Controle da Gerenia', 'Gerenia Ledger', 'Uso planilha ou nada: a Gerenia monta pra mim', 'Spreadsheet or nothing: Gerenia sets it up for me'),
};
/* Como a Gerenia opera cada app: conexão direta (API) ou pelo navegador, com o acesso da pessoa. */
const VIA = {
  get api() { return { short: 'API', name: L('Conexão direta', 'Direct connection'), icon: 'zap', phrase: L('pela conexão direta', 'through the direct connection'), desc: L('Rápida e em segundo plano, pela integração oficial do sistema.', 'Fast and in the background, through the system’s official integration.') }; },
  get browser() { return { short: L('Navegador', 'Browser'), name: L('Pelo navegador', 'Through the browser'), icon: 'monitor', phrase: L('pelo navegador', 'through the browser'), desc: L('A Gerenia entra com o seu acesso e usa o sistema como você usaria. Dá para assistir.', 'Gerenia signs in with your access and uses the system just like you would. You can watch.') }; },
};
const BROWSER_APPS = ['feegow', 'iclinic', 'doctoralia', 'tecnofit', 'nextfit', 'pacto'];
Object.keys(APPS).forEach(a => { APPS[a].via = APPS[a].native ? null : BROWSER_APPS.includes(a) ? 'browser' : 'api'; });
const viaTag = (a, cls = '') => APPS[a].via ? `<span class="via via-${APPS[a].via} ${cls}" title="${VIA[APPS[a].via].name}">${icon(VIA[APPS[a].via].icon)}${VIA[APPS[a].via].short}</span>` : '';
const cats = () => [['all', L('Todos', 'All')], ['gestao', L('Gestão do negócio', 'Business management')], ['agenda', L('Agenda', 'Calendar')], ['fin', L('Financeiro', 'Finance')], ['pay', L('Pagamentos', 'Payments')], ['crm', L('Clientes e CRM', 'Clients and CRM')], ['com', L('Conversas', 'Conversations')]];
const fitsSector = a => !APPS[a].sectors || APPS[a].sectors.includes(S.sector);
const mono = (a, size = '') => APPS[a].native
  ? `<span class="mono ${size} native">${icon('plus')}</span>`
  : `<span class="mono ${size}" style="background:${APPS[a].color}">${APPS[a].mono}</span>`;
const connected = () => Object.keys(S.apps).filter(a => APPS[a]).sort((a, b) => S.apps[a].at - S.apps[b].at);
const isOn = a => !!S.apps[a];

/* ---------- Áreas (o que você vê) ---------- */
const AREA = {
  whatsapp: {
    icon: 'chat', cls: 'm-wa',
    get name() { return 'WhatsApp'; },
    get pitch() { return L('Responde, agenda e chama você quando precisa.', 'Replies, books and calls you only when needed.'); },
  },
  clientes: {
    icon: 'users', cls: 'm-cl',
    get name() { return L('Clientes', 'Clients'); },
    get pitch() { return L('Junta os contatos de todos os sistemas e cria campanhas.', 'Brings contacts from every system together and runs campaigns.'); },
    question: () => L(`Onde estão seus ${V().clients} hoje?`, `Where are your ${V().clients} today?`),
    options: ['whatsapp', 'feegow', 'iclinic', 'tecnofit', 'nextfit', 'pacto', 'rdcrm', 'hubspot', 'sheets'],
  },
  agenda: {
    icon: 'calendar', cls: 'm-ag',
    get name() { return L('Agenda', 'Calendar'); },
    get pitch() { return L('Confirma horários, encaixa remarcações e evita buracos.', 'Confirms bookings, fits in reschedules and avoids gaps.'); },
    question: () => L('Onde fica sua agenda hoje?', 'Where is your calendar today?'),
    options: ['gcal', 'feegow', 'iclinic', 'doctoralia', 'tecnofit', 'nextfit', 'gagenda'],
  },
  financeiro: {
    icon: 'wallet', cls: 'm-fi',
    get name() { return L('Financeiro', 'Finance'); },
    get pitch() { return L('Mostra o que entrou, cobra quem atrasou e avisa o que vence.', 'Shows what came in, chases late payments and flags what’s due.'); },
    question: () => L('Onde você controla os pagamentos?', 'Where do you track payments?'),
    options: ['contaazul', 'asaas', 'mercadopago', 'feegow', 'tecnofit', 'nextfit', 'omie', 'stripe', 'gfin'],
  },
};
const areaApps = id => connected().filter(a => APPS[a].feeds.includes(id));
const hasArea = id => areaApps(id).length > 0;
const activeAreas = () => AREAS.filter(hasArea);
const isFresh = id => ui.fresh.includes(id);

/* ---------- Dados fictícios ---------- */
function convos() {
  const v = V();
  const firstMsg = {
    clinica: [L('Oi! Vocês aceitam convênio Bradesco Saúde?', 'Hi! Do you accept Bradesco Saúde insurance?'), L('Pergunta sobre convênio', 'Insurance question'), [L('Aceitamos sim! Quer agendar?', 'Yes, we do! Want to book?'), L('Ainda não, mas temos valor especial no particular.', 'Not yet, but we have a special private rate.')], L('Quer saber se aceitam o convênio Bradesco Saúde.', 'Wants to know if you accept Bradesco Saúde insurance.')],
    academia: [L('Tem desconto no plano anual pra casal?', 'Is there a couples discount on the yearly plan?'), L('Pergunta sobre desconto', 'Discount question'), [L('Temos sim: 15% no anual para casal.', 'Yes: 15% off the yearly plan for couples.'), L('No momento não, mas o anual já sai 20% mais barato.', 'Not right now, but the yearly plan is already 20% cheaper.')], L('Quer desconto no plano anual para casal.', 'Wants a couples discount on the yearly plan.')],
    estudio: [L('Dá pra fazer uma aula experimental no sábado?', 'Can I take a trial class on Saturday?'), L('Pedido fora da agenda padrão', 'Request outside the usual schedule'), [L('Dá sim! Sábado às 9h, pode ser?', 'Sure! Saturday at 9 AM, does that work?'), L('Sábado não temos, mas sexta às 18h tem vaga.', 'No Saturday classes, but Friday at 6 PM has a spot.')], L('Quer uma aula experimental no sábado.', 'Wants a trial class on Saturday.')],
    outro: [L('Vocês fazem atendimento a domicílio?', 'Do you do home visits?'), L('Pergunta que ela não sabe responder', 'Question she can’t answer'), [L('Fazemos sim! Qual o seu bairro?', 'We do! Which neighborhood?'), L('Ainda não, só no nosso endereço.', 'Not yet, only at our location.')], L('Quer saber se há atendimento a domicílio.', 'Wants to know about home visits.')],
  }[S.sector];
  return [
    { id: 'c1', name: 'Pedro Almeida', time: '09:41', need: firstMsg[1], quick: firstMsg[2], sum: firstMsg[3], msgs: [['in', firstMsg[0]], ['g', L('Oi, Pedro! Vou confirmar com a equipe e já te respondo, tá bem?', 'Hi Pedro! Let me check with the team and get right back to you.')]] },
    { id: 'c2', name: 'Beatriz Santos', time: '09:12', need: L('Reclamação', 'Complaint'), quick: [L('Sinto muito, Beatriz. Vou te ligar agora.', 'I’m so sorry, Beatriz. I’ll call you now.'), L('Peço desculpas. Na próxima, você é a primeira do dia.', 'My apologies. Next time, you’ll be first of the day.')], sum: L('Reclamou de 40 minutos de espera ontem.', 'Complained about a 40-minute wait yesterday.'), msgs: [['in', L('Ontem esperei 40 minutos pra ser atendida. Não gostei.', 'Yesterday I waited 40 minutes to be seen. Not happy.')], ['g', L('Sinto muito, Beatriz. Já avisei a responsável e ela vai falar com você.', 'I’m sorry, Beatriz. I’ve told the manager and she’ll reach out to you.')]] },
    { id: 'c3', name: 'Rafael Oliveira', time: '08:55', need: L('Pedido de parcelamento', 'Installment request'), quick: [L('Pode sim, em até 3x no cartão.', 'Sure, up to 3 installments on card.'), L('Parcelamos em 2x sem juros.', 'We can split it in 2, interest-free.')], sum: L('Quer parcelar o pacote em 3x.', 'Wants to split the package into 3 payments.'), msgs: [['in', L('Consigo pagar o pacote em 3x?', 'Can I pay the package in 3 installments?')], ['g', L('Oi, Rafael! Vou verificar as condições e te respondo já.', 'Hi Rafael! Let me check the options and get back to you.')]] },
    { id: 'c4', name: 'Julia Costa', time: '08:40', done: L('Remarcou para quinta, 16h30', 'Moved to Thursday, 4:30 PM'), quick: [L('Claro, Julia! Tenho quinta às 14h ou 16h30. Qual prefere?', 'Of course, Julia! I have Thursday at 2 PM or 4:30 PM. Which works?')], sum: L(`Quer remarcar a ${v.service} para quinta à tarde.`, `Wants to move the ${v.service} to Thursday afternoon.`), msgs: [['in', L(`Consigo remarcar minha ${v.service} pra quinta à tarde?`, `Can I move my ${v.service} to Thursday afternoon?`)], ['g', L('Claro, Julia! Tenho quinta às 14h ou 16h30. Qual prefere?', 'Of course, Julia! I have Thursday at 2 PM or 4:30 PM. Which works?')], ['in', L('16h30', '4:30 PM')], ['g', L('Pronto, remarcado para quinta às 16h30 ✓', 'Done, moved to Thursday at 4:30 PM ✓')]] },
    { id: 'c5', name: 'Lucas Ferreira', time: '08:21', done: L('Novo horário · sábado 9h', 'New booking · Saturday 9 AM'), msgs: [['in', L(`Quanto custa a primeira ${v.service}?`, `How much is the first ${v.service}?`)], ['g', L(`A primeira ${v.service} custa R$ 180. Quer agendar?`, `The first ${v.service} is R$ 180. Want to book?`)], ['in', L('Quero sim, sábado de manhã', 'Yes please, Saturday morning')], ['g', L('Agendado: sábado às 9h ✓ Te mando um lembrete na sexta.', 'Booked: Saturday at 9 AM ✓ I’ll send you a reminder on Friday.')]] },
    { id: 'c6', name: 'Carla Dias', time: '07:58', done: L('Confirmou horário', 'Confirmed booking'), msgs: [['in', L('Bom dia! Tá confirmado amanhã às 10h?', 'Good morning! Am I confirmed for tomorrow at 10 AM?')], ['g', L('Bom dia, Carla! Confirmadíssimo. Te esperamos ✓', 'Good morning, Carla! All confirmed. See you then ✓')]] },
    { id: 'c7', name: 'Ana Lima', time: L('ontem', 'yesterday'), done: L('Endereço enviado', 'Address sent'), msgs: [['in', L('Qual o endereço de vocês?', 'What’s your address?')], ['g', L('Rua das Acácias, 120 – Pinheiros. Tem estacionamento no local 🙂', 'Rua das Acácias, 120 – Pinheiros. There’s parking on site 🙂')]] },
  ];
}
const MANUAL = ['c1', 'c2', 'c3', 'c4']; // conversas em aberto nos modos sem resposta automática
function pendingConvos() {
  const all = convos();
  const ids = S.waMode === 'auto' ? all.filter(c => c.need).map(c => c.id) : MANUAL;
  return all.filter(c => ids.includes(c.id) && !S.replies[c.id]);
}
const handledToday = () => 15 + (3 - convos().filter(c => c.need && !S.replies[c.id]).length);

function today() {
  const st = V().staff;
  return [
    ['08:30', 'Carla Dias', 'ok', st[0]], ['09:00', 'Pedro Almeida', 'ok', st[1] || st[0]], ['10:30', 'Julia Costa', S.done.moved ? 'moved' : 'ok', st[0]],
    ['11:00', 'Beatriz Santos', 'wait', st[0]], ['14:00', 'Rafael Oliveira', 'ok', st[1] || st[0]], ['15:30', 'Ana Lima', 'wait', st[0]],
    ['16:30', 'Lucas Ferreira', 'new', st[1] || st[0]], ['17:30', 'Marcos Teixeira', 'ok', st[0]],
  ];
}
const PEOPLE = ['Julia Costa', 'Pedro Almeida', 'Beatriz Santos', 'Rafael Oliveira', 'Ana Lima', 'Lucas Ferreira', 'Carla Dias', 'Marcos Teixeira', 'Mariana Souza', 'Thiago Rocha', 'Camila Nunes', 'Bruno Martins'];
function slotsFor(dayIdx) {
  if (dayIdx === 0) return today();
  const d = new Date(); d.setDate(d.getDate() + dayIdx);
  if (d.getDay() === 0) return [];
  const n = d.getDay() === 6 ? 3 : 4 + (dayIdx * 3) % 4;
  const hours = ['08:00', '09:30', '10:30', '11:30', '14:00', '15:00', '16:30', '18:00'];
  return Array.from({ length: n }, (_, i) => [hours[(i + dayIdx) % 8], PEOPLE[(i * 5 + dayIdx * 3) % PEOPLE.length], dayIdx === 1 && i < 2 ? 'wait' : 'ok', V().staff[i % V().staff.length]]).sort((a, b) => a[0].localeCompare(b[0]));
}

const BILLS = () => [['Rafael Oliveira', 450, L('Venceu há 3 dias', '3 days overdue'), true], ['Mariana Souza', 280, L('Vence amanhã', 'Due tomorrow')], ['Thiago Rocha', 600, L('Vence em 5 dias', 'Due in 5 days')]];
const PAID = () => [['Julia Costa', 180, L('Hoje · Pix', 'Today · Pix')], ['Carla Dias', 350, L('Ontem · Cartão', 'Yesterday · Card')], ['Lucas Ferreira', 180, L('Ontem · Pix', 'Yesterday · Pix')], ['Ana Lima', 900, L('Segunda · Boleto', 'Monday · Boleto')]];
const openBills = () => BILLS().filter(b => !S.done['p:' + b[0]]);
const received = () => 12480 + BILLS().filter(b => S.done['p:' + b[0]]).reduce((t, b) => t + b[1], 0);

const clients = () => [
  ['Julia Costa', L('Há 2 dias', '2 days ago'), 'freq'], ['Lucas Ferreira', L('Primeira visita sábado', 'First visit on Saturday'), 'new'], ['Pedro Almeida', L('Hoje', 'Today'), 'freq'],
  ['Bruno Martins', L('Há 74 dias', '74 days ago'), 'away'], ['Carla Dias', L('Há 1 semana', '1 week ago'), 'freq'], ['Camila Nunes', L('Chegou esta semana', 'Joined this week'), 'new'],
  ['Patrícia Gomes', L('Há 92 dias', '92 days ago'), 'away'], ['Ana Lima', L('Há 3 semanas', '3 weeks ago'), 'freq'], ['Gustavo Reis', L('Há 63 dias', '63 days ago'), 'away'],
  ['Marcos Teixeira', L('Há 5 dias', '5 days ago'), 'freq'], ['Beatriz Santos', L('Ontem', 'Yesterday'), 'freq'], ['Thiago Rocha', L('Há 12 dias', '12 days ago'), 'freq'],
];
const awayCount = () => 6 - clients().filter(c => c[2] === 'away' && S.done['w:' + c[0]]).length;

/* Segmentos que a Gerenia encontra ao analisar a base de clientes. */
function segments() {
  const v = V();
  return {
    away: { n: awayCount(), title: L('Sumidos', 'Gone quiet'), label: L('sem voltar há 60+ dias', 'not back in 60+ days'), icon: 'clock', cta: L('Chamar de volta', 'Bring them back'),
      msgs: [L(`Oi, {nome}! Sentimos sua falta por aqui 💙 Que tal marcar sua próxima ${v.service}? Tenho horários esta semana.`, `Hi {name}! We miss you 💙 How about booking your next ${v.service}? I have openings this week.`), L('Oi, {nome}, tudo bem? Faz um tempinho que você não aparece. Separei dois horários para você esta semana, quer que eu reserve?', 'Hi {name}, how are you? It’s been a while. I set aside two times for you this week — want me to hold one?')] },
    bday: { n: 12, title: L('Aniversariantes', 'Birthdays'), label: L(`fazem aniversário em ${monthName()}`, `have a birthday in ${monthName()}`), icon: 'gift', cta: L('Mandar parabéns', 'Send wishes'),
      msgs: [L(`Feliz aniversário, {nome}! 🎉 De presente, 15% de desconto na sua próxima ${v.service} este mês.`, `Happy birthday, {name}! 🎉 Here’s 15% off your next ${v.service} this month.`), L(`Parabéns, {nome}! 🎂 Que seu novo ano seja leve. Tem um presente esperando por você aqui: 15% na próxima ${v.service}.`, `Happy birthday, {name}! 🎂 Wishing you a great year. A gift is waiting for you: 15% off your next ${v.service}.`)] },
    new: { n: 18, title: L('Novos', 'New'), label: L('chegaram este mês', 'joined this month'), icon: 'userPlus', cta: L('Dar boas-vindas', 'Say welcome'),
      msgs: [L('Oi, {nome}! Que bom ter você com a gente. Qualquer dúvida, é só chamar aqui 😊', 'Hi {name}! So glad to have you with us. Any questions, just message here 😊'), L('Boas-vindas, {nome}! Aqui você remarca, tira dúvidas e recebe lembretes. É só mandar mensagem.', 'Welcome, {name}! Here you can reschedule, ask questions and get reminders. Just send a message.')] },
    all: { n: 214, title: L(`Todos os ${v.clients}`, `All ${v.clients}`), label: L('na sua base', 'in your base'), icon: 'users', cta: L('Enviar para todos', 'Send to everyone'),
      msgs: [L('Oi, {nome}! Temos novidade: horários aos sábados a partir deste mês. Quer reservar o seu?', 'Hi {name}! News: Saturday openings starting this month. Want to book yours?'), L('Oi, {nome}! A partir deste mês abrimos aos sábados. Responda esta mensagem para garantir seu horário.', 'Hi {name}! Starting this month we’re open on Saturdays. Reply to this message to save your spot.')] },
  };
}
const autos = () => [
  ['bday', L('Parabéns no aniversário', 'Birthday wishes'), L('Mensagem com um presente no dia', 'A message with a gift on the day'), 'gift'],
  ['return', L('Lembrete de retorno', 'Return reminder'), L(`Chama quem fez a última ${V().service} há 6 meses`, `Reaches out 6 months after the last ${V().service}`), 'clock'],
  ['welcome', L('Boas-vindas', 'Welcome'), L(`Recebe cada novo ${V().client} no WhatsApp`, `Greets every new ${V().client} on WhatsApp`), 'userPlus'],
  ['review', L('Pedido de avaliação', 'Review request'), L('Pede uma nota depois do atendimento', 'Asks for a rating after the visit'), 'star'],
];
/* ---------- Tarefas que a Gerenia executa nos apps ---------- */
const agendaApp = () => { const l = areaApps('agenda'); return l.find(a => APPS[a].via === 'browser') || l[0]; };
const SCENARIO = a => [
  L(`Abrindo o ${APPS[a].name}`, `Opening ${APPS[a].name}`),
  L('Buscando Julia Costa', 'Finding Julia Costa'),
  L('Abrindo o horário de terça, 10:30', 'Opening Tuesday, 10:30 AM'),
  L('Mudando para quinta, 16:30', 'Moving to Thursday, 4:30 PM'),
  L('Salvando a alteração', 'Saving the change'),
];
const TASK_TITLE = {
  moved: () => L('Remarcou Julia Costa para quinta, 16:30', 'Moved Julia Costa to Thursday, 4:30 PM'),
  moving: () => L('Remarcando Julia Costa para quinta, 16:30', 'Moving Julia Costa to Thursday, 4:30 PM'),
  confirmed: () => L(`Confirmou 6 ${V().services} de amanhã`, `Confirmed 6 ${V().services} for tomorrow`),
};
const timeLabel = t => ({ now: L('Agora', 'Now'), today: L('Hoje', 'Today') }[t] || t);
function tasks() {
  const t = S.tasks.map(x => ({ ...x, title: TASK_TITLE[x.kind]() }));
  const ag = agendaApp();
  if (isOn('whatsapp')) t.push({ app: 'whatsapp', title: L(`Respondeu ${handledToday()} conversas`, `Answered ${handledToday()} conversations`), time: 'today' });
  if (ag && APPS[ag].via === 'browser' && !S.done.moved) t.push({ app: ag, kind: 'confirmed', title: TASK_TITLE.confirmed(), time: '08:41', replay: true });
  if (isOn('gcal')) t.push({ app: 'gcal', title: L('Criou o horário de Lucas Ferreira, sábado 9h', 'Booked Lucas Ferreira for Saturday, 9 AM'), time: '08:22' });
  const pay = ['asaas', 'mercadopago', 'stripe', 'contaazul', 'omie'].find(isOn);
  if (pay) t.push({ app: pay, title: L('Conferiu 3 pagamentos via Pix', 'Reconciled 3 Pix payments'), time: '08:05' });
  return t;
}
function taskRow(t) {
  const x = APPS[t.app];
  return `<li class="row-item task"><span class="task-ico">${icon('check')}</span><div class="row-main"><b>${esc(t.title)}</b><small>${mono(t.app, 'xxs')}${x.name} · ${viaTag(t.app, 'inline')} · ${timeLabel(t.time)}</small></div>
    ${x.via === 'browser' && t.replay ? `<button class="btn ghost sm" data-act="watch-replay" data-app="${t.app}" data-kind="${t.kind || 'moved'}">${icon('play')}${L('Ver', 'View')}</button>` : ''}</li>`;
}

function startTask(a) {
  ui.task = { app: a, kind: 'moving', step: 0, live: true, steps: SCENARIO(a) };
  ui.watch = { live: true, app: a, kind: 'moving' };
  ui.chat = false;
  render();
  paintWatch();
  const tick = () => {
    const t = ui.task;
    if (!t) return;
    t.step++;
    if (t.step >= t.steps.length) {
      S.done.moved = true;
      S.tasks.unshift({ app: a, kind: 'moved', time: 'now', replay: true });
      save();
      ui.task = null;
      ui.log.push({ from: 'g', text: L(
        `Pronto ✓ Remarquei Julia Costa para <b>quinta, 16:30</b> no ${APPS[a].name}.${isOn('whatsapp') ? ' Ela vai receber a confirmação pelo WhatsApp.' : ''}`,
        `Done ✓ I moved Julia Costa to <b>Thursday, 4:30 PM</b> in ${APPS[a].name}.${isOn('whatsapp') ? ' She’ll get the confirmation on WhatsApp.' : ''}`) });
      if (ui.watch) { ui.watch.done = true; paintWatch(); }
      if (!ui.watch) render();
      toast(L(`Feito no ${APPS[a].name}: Julia remarcada para quinta, 16:30.`, `Done in ${APPS[a].name}: Julia moved to Thursday, 4:30 PM.`));
      return;
    }
    if (ui.watch) paintWatch(); else refreshPill();
    t.timer = setTimeout(tick, 1300);
  };
  ui.task.timer = setTimeout(tick, 1400);
}
function stopTask() {
  if (!ui.task) return;
  clearTimeout(ui.task.timer);
  const name = APPS[ui.task.app].name;
  ui.task = null; ui.watch = null;
  ui.log.push({ from: 'g', text: L(`Parei. Nada foi alterado no ${name}.`, `Stopped. Nothing was changed in ${name}.`) });
  render();
  toast(L('Tarefa interrompida. Nada foi alterado.', 'Task stopped. Nothing was changed.'));
}

/* Janela que mostra a Gerenia operando um app pelo navegador. */
const DAYS = () => ({ tue: L('Ter', 'Tue'), wed: L('Qua', 'Wed'), thu: L('Qui', 'Thu') });
const fakeRows = () => { const d = DAYS(); return [[`${d.tue} 11:00`, 'Beatriz Santos', L('Retorno', 'Follow-up')], [`${d.wed} 09:00`, 'Pedro Almeida', L('Consulta', 'Appointment')], [`${d.thu} 14:00`, 'Rafael Oliveira', L('Avaliação', 'Assessment')]]; };
function watchView() {
  const w = ui.watch;
  if (!w) return '';
  const live = ui.task && w.live;
  const a = live ? ui.task.app : w.app;
  const steps = SCENARIO(a);
  const title = TASK_TITLE[live ? 'moving' : w.kind]();
  const x = APPS[a];
  const host = x.name.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
  const d = DAYS();
  return `<div class="watch-scrim" data-act="watch-close"></div>
  <div class="watch" role="dialog" aria-modal="true" aria-label="${L(`Gerenia operando o ${x.name}`, `Gerenia operating ${x.name}`)}">
    <header class="watch-head">
      ${mono(a, 'sm')}
      <div class="watch-title"><b>${esc(title)}</b><small>${x.name} · ${viaTag(a, 'inline')} · ${L('com o seu acesso', 'with your access')}</small></div>
      <span class="live-badge ${live ? '' : 'rec'}" id="w-badge">${live ? L('Ao vivo', 'Live') : L('Gravação', 'Recording')}</span>
      <button class="icon-btn" data-act="watch-close" aria-label="${L('Fechar', 'Close')}">${icon('close')}</button>
    </header>
    <div class="watch-body">
      <div class="bw">
        <div class="bw-bar"><span class="dots"><i></i><i></i><i></i></span><span class="bw-url">${icon('lock')}app.${host}.com.br/agenda</span></div>
        <div class="bw-screen" id="bw" style="--app:${x.color}">
          <div class="fk-top"><span class="fk-logo">${x.mono}</span><b>${x.name}</b><span class="fk-search" data-t="search">${icon('search')}<span id="fk-typed">${L('Buscar paciente', 'Search patient')}</span></span></div>
          <div class="fk-body">
            <div class="fk-side"><i class="on"></i><i></i><i></i><i></i><i></i></div>
            <div class="fk-main">
              <p class="fk-h">${L('Agenda · esta semana', 'Calendar · this week')}</p>
              <div class="fk-row" data-t="row"><b id="fk-when">${d.tue} 10:30</b><span>Julia Costa</span><em>${L('Consulta', 'Appointment')}</em></div>
              ${fakeRows().map(r => `<div class="fk-row"><b>${r[0]}</b><span>${r[1]}</span><em>${r[2]}</em></div>`).join('')}
              <div class="fk-modal" id="fk-modal"><p>${L('Remarcar horário', 'Reschedule')}</p><span class="fk-field" data-t="date" id="fk-date">${d.tue}, 10:30</span><span class="fk-save" data-t="save">${L('Salvar', 'Save')}</span></div>
              <div class="fk-toast" id="fk-toast">${icon('check')}${L('Alteração salva', 'Change saved')}</div>
            </div>
          </div>
          <div class="fk-loading" id="fk-loading"><span></span></div>
          <svg class="cursor" id="cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 7-6 2-2 6z"/></svg>
        </div>
      </div>
      <aside class="watch-side">
        <p class="block-title">${L('Passo a passo', 'Step by step')}</p>
        <ol class="watch-steps" id="w-steps">${steps.map(s => `<li><span class="st"></span>${s}</li>`).join('')}</ol>
        <p class="fine watch-note">${icon('lock')}${L(`A Gerenia usa o ${x.name} com o seu acesso, só quando você pede. Tudo fica registrado em Atividade.`, `Gerenia uses ${x.name} with your access, only when you ask. Everything is logged in Activity.`)}</p>
        <div class="watch-actions" id="w-actions"></div>
      </aside>
    </div>
  </div>`;
}
function paintWatch() {
  const w = ui.watch, bw = $('#bw');
  if (!w || !bw) return;
  const live = !!(ui.task && w.live);
  const k = live ? ui.task.step : w.step ?? 0;
  const total = 5;
  const done = w.done || k >= total;
  const d = DAYS();
  const set = (id, on, cls = 'show') => $(id)?.classList.toggle(cls, on);
  set('#fk-loading', k === 0 && !done);
  $('#fk-typed').textContent = k >= 1 || done ? 'Julia Costa' : L('Buscar paciente', 'Search patient');
  $('#fk-typed').classList.toggle('typed', k >= 1 || done);
  bw.querySelector('[data-t=row]').classList.toggle('hl', k === 2 || k === 3);
  set('#fk-modal', k >= 2 && k <= 4 && !done);
  $('#fk-date').textContent = k >= 3 || done ? `${d.thu}, 16:30` : `${d.tue}, 10:30`;
  $('#fk-when').textContent = done ? `${d.thu} 16:30` : `${d.tue} 10:30`;
  set('#fk-toast', done);
  const target = done ? null : { 1: 'search', 2: 'row', 3: 'date', 4: 'save' }[k];
  const cur = $('#cursor');
  if (target) {
    const el = bw.querySelector(`[data-t=${target}]`), a = el.getBoundingClientRect(), b = bw.getBoundingClientRect();
    cur.style.transform = `translate(${a.left - b.left + Math.min(40, a.width / 2)}px, ${a.top - b.top + a.height / 2}px)`;
    cur.classList.add('show');
  } else cur.classList.remove('show');
  document.querySelectorAll('#w-steps li').forEach((li, i) => { li.className = done || i < k ? 'done' : i === k ? 'doing' : ''; li.querySelector('.st').innerHTML = done || i < k ? icon('check') : ''; });
  const badge = $('#w-badge');
  if (done) { badge.textContent = L('Concluído', 'Done'); badge.className = 'live-badge ok'; }
  $('#w-actions').innerHTML = live && !done ? `<button class="btn ghost sm" data-act="task-stop">${icon('stop')}${L('Parar', 'Stop')}</button>`
    : `<button class="btn sm" data-act="watch-close">${L('Fechar', 'Close')}</button>${w.live ? '' : `<button class="btn ghost sm" data-act="watch-again">${icon('refresh')}${L('Rever', 'Replay')}</button>`}`;
}
function playReplay() {
  const w = ui.watch;
  w.step = 0; w.done = false;
  paintWatch();
  const tick = () => {
    if (ui.watch !== w) return;
    w.step++;
    if (w.step >= 5) w.done = true;
    paintWatch();
    if (!w.done) w.timer = setTimeout(tick, 1000);
  };
  w.timer = setTimeout(tick, 900);
}
const pillText = () => L(`Gerenia no ${APPS[ui.task.app].name} · ${ui.task.steps[ui.task.step]}`, `Gerenia in ${APPS[ui.task.app].name} · ${ui.task.steps[ui.task.step]}`);
const livePill = () => ui.task && !ui.watch ? `<button class="live-pill" data-act="watch-open" id="live-pill"><span class="rec-dot"></span><span class="lp-text">${esc(pillText())}</span><b>${L('Assistir', 'Watch')}</b></button>` : '';
function refreshPill() { const p = $('#live-pill'); if (p && ui.task) p.querySelector('.lp-text').textContent = pillText(); }

/* ---------- Resumos ---------- */
function stats(id) {
  const v = V();
  const p = pendingConvos().length;
  return {
    whatsapp: ['18', S.waMode === 'auto' ? L(`conversas hoje · ${handledToday()} resolvidas pela Gerenia`, `conversations today · ${handledToday()} handled by Gerenia`)
      : S.waMode === 'assist' ? L(`conversas hoje · ${plural(p, 'resposta pronta', 'respostas prontas')}`, `conversations today · ${plural(p, 'reply ready', 'replies ready')}`)
      : L(`conversas hoje · ${p} sem resposta`, `conversations today · ${p} unanswered`)],
    clientes: ['214', L(`${v.clients} · ${awayCount()} sumidos há 60+ dias`, `${v.clients} · ${awayCount()} gone quiet for 60+ days`)],
    agenda: ['8', L(`${v.services} hoje · próxima às 10:30`, `${v.services} today · next at 10:30 AM`)],
    financeiro: [brl(received()), L(`recebidos em ${monthName()}`, `received in ${monthName()}`)],
  }[id];
}

function needs() {
  const list = [];
  const v = V();
  if (hasArea('whatsapp')) {
    const p = pendingConvos();
    if (S.waMode === 'auto') p.forEach(c => list.push({ area: 'whatsapp', av: initials(c.name), title: c.name, sub: c.need, href: `#/app/whatsapp/${c.id}` }));
    else if (p.length) list.push({
      area: 'whatsapp', icon: S.waMode === 'assist' ? 'edit' : 'chat',
      title: S.waMode === 'assist' ? L(`${plural(p.length, 'resposta pronta', 'respostas prontas')} para aprovar`, `${plural(p.length, 'reply', 'replies')} ready to approve`) : L(`${plural(p.length, 'conversa', 'conversas')} sem resposta`, `${plural(p.length, 'conversation', 'conversations')} unanswered`),
      sub: S.waMode === 'assist' ? L('A Gerenia escreveu, você só confirma', 'Gerenia wrote them, you just confirm') : L('A mais antiga espera há 1 hora', 'The oldest has waited 1 hour'),
      href: '#/app/whatsapp',
    });
  }
  if (hasArea('financeiro')) openBills().filter(b => b[3] && !S.done['r:' + b[0]]).forEach(b => list.push({ area: 'financeiro', av: initials(b[0]), title: `${b[0]} · ${brl(b[1])}`, sub: b[2], action: isOn('whatsapp') ? ['remind', b[0], L('Lembrar', 'Remind')] : null, href: '#/app/financeiro' }));
  if (hasArea('agenda') && !isOn('whatsapp')) list.push({ area: 'agenda', icon: 'clock', title: L('2 horários sem confirmação', '2 bookings unconfirmed'), sub: L('Com o WhatsApp, a Gerenia confirma por você', 'With WhatsApp, Gerenia confirms for you'), href: '#/app/agenda' });
  if (hasArea('clientes') && awayCount() > 0 && !S.campaigns.some(c => c.seg === 'away')) list.push({ area: 'clientes', icon: 'megaphone', title: L(`${awayCount()} ${v.clients} sumidos`, `${awayCount()} ${v.clients} gone quiet`), sub: L('A Gerenia já escreveu uma campanha', 'Gerenia already wrote a campaign'), href: '#/app/clientes/campanha/away' });
  return list;
}

/* ---------- Empresa: busca e briefing ----------
   Na demonstração, a busca gera resultados fictícios a partir do nome digitado.
   No produto, viria de uma base/serviço de busca de empresas no backend. */
const norm = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
/* [padrão, setor, categoria PT, categoria EN, foco PT, foco EN, serviços PT, serviços EN] */
const CATEGORIES = [
  [/odonto|dent|sorriso|smile/, 'clinica', 'Clínica odontológica', 'Dental clinic', 'tratamentos odontológicos e estética do sorriso', 'dental care and cosmetic dentistry', ['Limpeza', 'Clareamento', 'Implantes', 'Ortodontia'], ['Cleaning', 'Whitening', 'Implants', 'Orthodontics']],
  [/derma|estetic|aesthetic|pele|skin/, 'clinica', 'Clínica de dermatologia', 'Dermatology clinic', 'consultas e procedimentos estéticos', 'consultations and aesthetic procedures', ['Consultas', 'Botox', 'Peeling', 'Laser'], ['Consultations', 'Botox', 'Peels', 'Laser']],
  [/fisio|physio|reabilit|rehab/, 'clinica', 'Clínica de fisioterapia', 'Physiotherapy clinic', 'reabilitação, RPG e pilates clínico', 'rehab, postural therapy and clinical pilates', ['Fisioterapia', 'RPG', 'Pilates clínico', 'Acupuntura'], ['Physiotherapy', 'Postural therapy', 'Clinical pilates', 'Acupuncture']],
  [/psic|psych|terapia|therapy/, 'clinica', 'Consultório de psicologia', 'Psychology practice', 'terapia individual, de casal e online', 'individual, couples and online therapy', ['Terapia individual', 'Casal', 'Online'], ['Individual therapy', 'Couples', 'Online']],
  [/cross|\bbox\b/, 'academia', 'Box de crossfit', 'CrossFit box', 'aulas em turma e planos recorrentes', 'group classes and recurring plans', ['Cross training', 'LPO', 'Mobilidade', 'Planos mensais'], ['Cross training', 'Olympic lifting', 'Mobility', 'Monthly plans']],
  [/academia|fit|gym|muscula|treino|training/, 'academia', 'Academia', 'Gym', 'musculação, aulas coletivas e planos mensais', 'strength training, group classes and monthly plans', ['Musculação', 'Funcional', 'Spinning', 'Avaliação física'], ['Strength', 'Functional', 'Spinning', 'Fitness assessment']],
  [/pilates/, 'estudio', 'Estúdio de pilates', 'Pilates studio', 'aulas de pilates em pequenos grupos e pacotes mensais', 'small-group pilates classes and monthly packages', ['Pilates solo', 'Reformer', 'Aulas em dupla', 'Pacotes'], ['Mat pilates', 'Reformer', 'Duo classes', 'Packages']],
  [/yoga|ioga/, 'estudio', 'Estúdio de yoga', 'Yoga studio', 'aulas regulares, meditação e pacotes', 'regular classes, meditation and packages', ['Hatha', 'Vinyasa', 'Meditação', 'Pacotes'], ['Hatha', 'Vinyasa', 'Meditation', 'Packages']],
  [/estudio|studio|danca|dance/, 'estudio', 'Estúdio de movimento', 'Movement studio', 'aulas em turma e pacotes mensais', 'group classes and monthly packages', ['Aulas em turma', 'Aula experimental', 'Pacotes'], ['Group classes', 'Trial class', 'Packages']],
  [/clinica|clinic|consultorio|medic|saude|health/, 'clinica', 'Clínica médica', 'Medical clinic', 'consultas, check-ups e acompanhamento contínuo', 'appointments, check-ups and ongoing care', ['Consultas', 'Check-up', 'Exames', 'Retornos'], ['Appointments', 'Check-ups', 'Tests', 'Follow-ups']],
  [/./, 'outro', 'Negócio local', 'Local business', 'atendimento com hora marcada', 'appointment-based service', ['Atendimento', 'Pacotes'], ['Appointments', 'Packages']],
];
const DEFAULT_CATEGORY = { clinica: 9, academia: 5, estudio: 8, outro: 10 };
function categorize(name, hint) {
  const i = CATEGORIES.findIndex(c => c[0].test(norm(name)));
  if (hint && CATEGORIES[i][1] !== hint) return DEFAULT_CATEGORY[hint];
  return !hint && CATEGORIES[i][1] === 'outro' ? 9 : i;
}
const catOf = c => CATEGORIES[c.cat] || CATEGORIES[9];
const catLabel = c => L(catOf(c)[2], catOf(c)[3]);
const catFocus = c => L(catOf(c)[4], catOf(c)[5]);
const catServices = c => L(catOf(c)[6], catOf(c)[7]);
const BRAND_COLORS = ['#2f6fd6', '#7b4fd6', '#d2553f', '#1a8f7a', '#c0407a', '#e07a2e', '#3d7a3a', '#9a4fd0'];
const brandOf = name => BRAND_COLORS[[...norm(name)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % BRAND_COLORS.length];
const PLACES = [['Pinheiros', 'São Paulo, SP'], ['Moema', 'São Paulo, SP'], ['Savassi', 'Belo Horizonte, MG']];
function company(name, i = 0, opts = {}) {
  const cat = categorize(name, opts.sector);
  const slug = norm(name).replace(/[^a-z0-9]/g, '');
  return {
    name, branch: !!opts.branch, brand: brandOf(name), sector: CATEGORIES[cat][1], cat,
    hood: PLACES[i][0], city: PLACES[i][1], site: opts.site || `${slug}.com.br`, ig: opts.ig || `@${slug.slice(0, 24)}`,
    rating: [4.8, 4.6, 4.9][i], reviews: [214, 87, 132][i], followers: [3200, 1400, 5100][i], since: [2016, 2019, 2021][i],
  };
}
function searchCompanies(q) {
  const clean = q.trim().replace(/\s+/g, ' ');
  if (clean.length < 2) return [];
  const name = clean === clean.toLowerCase() ? clean.replace(/(^|\s)(\S)/g, (m, sp, ch) => sp + ch.toUpperCase()) : clean;
  const core = name.replace(/\b(cl[ií]nica|clinic|academia|gym|est[uú]dio|studio|consult[oó]rio|espa[cç]o|centro|center)\b/gi, '').trim() || name;
  const sector = CATEGORIES[categorize(name)][1];
  const alt = sector === 'clinica' ? `${core} Pilates` : sector === 'estudio' ? L(`Clínica ${core}`, `${core} Clinic`) : L(`${core} Fisioterapia`, `${core} Physio`);
  return [company(name, 0), company(name, 1, { branch: true }), company(alt, 2)];
}
const branchLabel = () => L('Unidade Moema', 'Moema branch');
const bizAvatar = (c = S.company, size = '') => `<span class="biz-av ${size}" style="--brand:${c?.brand || 'var(--primary)'}">${esc(initials(c ? c.name : S.business))}</span>`;
const rating = c => (EN() ? String(c.rating) : String(c.rating).replace('.', ','));

/* Ordem em que a Gerenia recomenda conectar, por setor. */
const PRIORITY = {
  clinica: ['whatsapp', 'agenda', 'clientes', 'financeiro'],
  academia: ['whatsapp', 'clientes', 'financeiro', 'agenda'],
  estudio: ['whatsapp', 'agenda', 'financeiro', 'clientes'],
  outro: ['whatsapp', 'clientes', 'agenda', 'financeiro'],
};
const priority = () => PRIORITY[S.sector] || PRIORITY.clinica;

/* Chamada de cada área ainda não conectada: fala da dor, cabe num cartão. */
const PITCH = {
  get whatsapp() { return { title: L('Automatize seu WhatsApp', 'Automate your WhatsApp'), cta: L('Automatizar meu WhatsApp', 'Automate my WhatsApp') }; },
  get agenda() { return { title: L('Acabe com as faltas na agenda', 'End no-shows and calendar gaps'), cta: L('Conectar minha agenda', 'Connect my calendar') }; },
  get clientes() { return { title: L('Traga de volta quem sumiu', 'Bring back clients who went quiet'), cta: L('Organizar meus clientes', 'Organize my clients') }; },
  get financeiro() { return { title: L('Pare de correr atrás de pagamento', 'Stop chasing payments'), cta: L('Organizar meu financeiro', 'Organize my finances') }; },
};
const NEED = {
  whatsapp: () => [L('Responder rápido, inclusive fora do horário', 'Reply fast, even after hours'), L('Avaliações citam demora e o Instagram leva todo mundo para o WhatsApp.', 'Reviews mention slow replies and Instagram sends everyone to WhatsApp.')],
  agenda: v => [L('Reduzir faltas e encaixar remarcações', 'Cut no-shows and fit in reschedules'), L(`Sem agendamento online, cada ${v.service} é marcada na conversa e depende de lembrete manual.`, `With no online booking, every ${v.service} is set up in chat and relies on manual reminders.`)],
  clientes: () => [L('Trazer de volta quem sumiu', 'Win back clients who went quiet'), L('Negócios como o seu vivem de quem volta. Vale saber quem parou de vir e chamar de volta.', 'Businesses like yours live on repeat visits. It pays to know who stopped coming and invite them back.')],
  financeiro: () => [L('Organizar mensalidades e cobranças', 'Organize memberships and billing'), L('Planos e pacotes geram pagamentos recorrentes que hoje provavelmente são cobrados um a um.', 'Plans and packages create recurring payments that are probably being chased one by one.')],
};
function briefing() {
  const c = S.company, v = V();
  const hours = {
    clinica: L('segunda a sexta, das 8h às 19h', 'Monday to Friday, 8 AM to 7 PM'),
    academia: L('segunda a sábado, das 6h às 22h', 'Monday to Saturday, 6 AM to 10 PM'),
    estudio: L('segunda a sábado, das 7h às 20h', 'Monday to Saturday, 7 AM to 8 PM'),
    outro: L('segunda a sexta, das 9h às 18h', 'Monday to Friday, 9 AM to 6 PM'),
  }[c.sector];
  return {
    summary: L(`${catLabel(c)} em ${c.hood}, ${c.city.split(',')[0]}, desde ${c.since}. Pelo site e pelo Instagram, o foco é ${catFocus(c)}.`,
      `${catLabel(c)} in ${c.hood}, ${c.city.split(',')[0]}, since ${c.since}. Based on the website and Instagram, the focus is ${catFocus(c)}.`),
    findings: [
      ['instagram', `Instagram ${c.ig}`, L(`${thousands(c.followers)} seguidores. O link da bio leva para o WhatsApp, então a maioria dos pedidos de horário deve chegar por lá.`, `${thousands(c.followers)} followers. The bio link goes to WhatsApp, so most booking requests probably arrive there.`)],
      ['star', 'Google', L(`Nota ${rating(c)} com ${c.reviews} avaliações. 6 das últimas 20 citam demora para responder.`, `${rating(c)} rating from ${c.reviews} reviews. 6 of the last 20 mention slow replies.`)],
      ['globe', c.site, L('O site não tem agendamento online: quem visita precisa chamar no WhatsApp.', 'The website has no online booking: visitors have to message on WhatsApp.')],
      ['clock', L('Horário de atendimento', 'Opening hours'), L(`De ${hours}. Mensagens fora disso esperam até o próximo dia útil.`, `${hours}. Messages outside those hours wait until the next business day.`)],
    ],
    needs: priority().slice(0, 3).map(id => [id, ...NEED[id](v)]),
  };
}

/* ---------- Roteamento ---------- */
const route = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
const go = h => { location.hash = h; };

function renderRaw() {
  document.documentElement.lang = EN() ? 'en' : 'pt-BR';
  const r = route();
  if (r[0] === 'demo') return applyDemo(+r[1] || 0, r[2]);
  if (!r.length) { root.innerHTML = landing(); return afterLanding(); }
  if (r[0] === 'entrar' || r[0] === 'comecar') {
    ui.su = ui.su || {};
    root.innerHTML = signup();
    return afterSignup();
  }
  if (r[0] !== 'app') return location.replace('#/');
  if (!S.business) return location.replace('#/');
  if (r[1] !== 'conectar') ui.flow = null;
  if (!(r[1] === 'clientes' && r[2] === 'campanha')) ui.camp = null;

  if (r[1] === 'conectar') return renderFlow(r);
  if (r[1] === 'clientes' && r[2] === 'campanha') {
    if (!hasArea('clientes')) return location.replace('#/app/conectar/clientes');
    root.innerHTML = campaignView(r[3]);
    return afterCampaign();
  }
  const page = r[1] || 'inicio';
  if (AREA[page] && !hasArea(page)) return location.replace('#/app/conectar/' + page);
  if (!AREA[page] && !['inicio', 'adicionar', 'ajustes', 'conexoes', 'atividade'].includes(page)) return location.replace('#/app');
  root.innerHTML = shell(page, r[2]);
  afterApp(page);
}

function applyDemo(n, sector) {
  S = Object.assign(blank(), keep(), { name: 'Mariana', business: 'Clínica Horizonte', sector: sectors()[sector] ? sector : 'clinica' });
  if (sector === 'academia') S.business = 'Academia Movimento';
  if (sector === 'estudio') S.business = 'Estúdio Respira';
  S.company = company(S.business, 0, { sector: S.sector });
  S.researched = S.briefDone = n > 0;
  const big = { clinica: 'feegow', academia: 'tecnofit', estudio: 'nextfit', outro: 'sheets' }[S.sector];
  ['whatsapp', 'gcal', 'asaas', big].slice(0, Math.max(0, Math.min(4, n))).forEach((a, i) => { S.apps[a] = { at: i + 1 }; });
  S.campaigns = n >= 1 ? [{ id: 'k0', seg: 'month', n: 42, status: 'sent', replied: 11, booked: 4, when: 'days5' }] : [];
  Object.assign(ui, { log: [], flow: null, su: null, chat: false, confirm: null, sel: [], fresh: [], rstep: 0, briefOpen: false });
  save();
  location.replace('#/app');
}

/* ---------- Landing page ---------- */
const themeBtn = () => `<button class="icon-btn" data-act="theme" aria-label="${L('Alternar tema claro e escuro', 'Toggle light and dark theme')}">${icon(S.theme === 'dark' ? 'sun' : 'moon')}</button>`;
/* [rótulo, descrição, ícone, frase] */
const MODES = {
  get off() { return [L('Só organizar', 'Organize only'), L('A Gerenia não responde. Organiza as conversas, salva os contatos e resume o que importa.', 'Gerenia doesn’t reply. She organizes conversations, saves contacts and summarizes what matters.'), 'eye', L('só organizando as conversas', 'only organizing conversations')]; },
  get assist() { return [L('Assistida', 'Assisted'), L('A Gerenia escreve cada resposta e você aprova com um toque.', 'Gerenia drafts every reply and you approve with one tap.'), 'edit', L('com resposta assistida', 'on assisted replies')]; },
  get auto() { return [L('Automática', 'Automatic'), L('A Gerenia responde sozinha e chama você só quando precisa.', 'Gerenia replies on her own and calls you only when needed.'), 'zap', L('com resposta automática', 'on automatic replies')]; },
};

/* ---------- Tradução da interface legada ---------- */
const UI_EN = {"Seções":"Sections","Para quem":"Audience","O que ela faz":"What she does","Como ela opera":"How she works","Integrações":"Integrations","Como começa":"Getting started","Entrar":"Sign in","Começar":"Get started","Gerente com IA para saúde e bem-estar":"AI manager for health and wellness","Uma gerente com IA":"An AI manager","que cuida dos seus sistemas.":"that takes care of your systems.","Clientes, agenda, WhatsApp e financeiro num só lugar. A Gerenia conecta os sistemas que você já usa, analisa tudo e age por você, sempre com a sua aprovação.":"Clients, calendar, WhatsApp and finances in one place. Gerenia connects the systems you already use, analyzes everything and takes action for you—with your approval.","Começar agora":"Get started","Comece em minutos, conectando uma coisa de cada vez.":"Start in minutes, connecting one thing at a time.","Exemplo de conversa com a Gerenia":"Example conversation with Gerenia","Sua gerente · Clínica Horizonte":"Your manager · Clínica Horizonte","Sistemas conectados":"Connected systems","Gerenia, como está hoje?":"Gerenia, how are things today?","Bom dia, Mariana! Hoje são":"Good morning, Mariana! Today you have","Duas ainda não confirmaram e já mandei lembrete pelo WhatsApp.":"Two are still unconfirmed, and I’ve already sent WhatsApp reminders.","O Rafael está com":"Rafael has","em atraso. Quer que eu cobre?":"overdue. Want me to follow up?","Pode cobrar":"Yes, follow up","Ver agenda":"View calendar","Feito pela Gerenia hoje":"Done by Gerenia today","Respondeu 15 conversas no WhatsApp":"Answered 15 WhatsApp conversations","Agendou Lucas para sábado, 9h":"Booked Lucas for Saturday, 9 AM","Conferiu 3 pagamentos via Pix":"Reconciled 3 Pix payments","Feita para quem cuida de gente.":"Made for people who care for people.","Clínicas, academias e estúdios. A Gerenia já chega falando a língua do seu negócio e pronta para os sistemas do seu setor.":"Clinics, gyms and studios. Gerenia understands your business from day one and is ready for the systems in your industry.","Clínicas":"Clinics","Consultas. Pacientes. Convênios.":"Appointments. Patients. Insurance.","Confirma consultas, responde sobre convênio e lembra retornos.":"Confirms appointments, answers insurance questions and reminds patients about follow-ups.","Academias":"Gyms","Alunos. Planos. Relacionamento.":"Members. Plans. Relationships.","Atende interessados, renova planos e chama quem parou de treinar.":"Handles leads, renews plans and re-engages members who stopped training.","Estúdios":"Studios","Pilates. Yoga. Aulas e sessões.":"Pilates. Yoga. Classes and sessions.","Organiza turmas, remarca aulas e cuida das mensalidades.":"Organizes classes, reschedules sessions and takes care of memberships.","Clientes, agenda, WhatsApp e financeiro. Num só lugar.":"Clients, calendar, WhatsApp and finances. All in one place.","A Gerenia junta os dados de todos os seus sistemas e opera o dia a dia: responde, confirma, cobra e avisa o que precisa de você.":"Gerenia brings data from all your systems together and runs the day-to-day: replying, confirming, billing and flagging what needs you.","Ela opera seus sistemas":"She operates your systems","Não só mostra. A Gerenia faz.":"Gerenia doesn’t just show you. She gets it done.","Você pede, ela executa nos seus sistemas: remarca, lança, cobra, atualiza cadastro. Quando o sistema tem integração, ela usa a conexão direta. Quando não tem, ela usa pelo navegador, como você usaria.":"You ask, and she works inside your systems: rescheduling, recording, billing and updating records. When an integration is available, she connects directly. Otherwise, she uses the browser just like you would.","Conecta com o que você já usa.":"Connects to what you already use.","Você não troca de sistema. A Gerenia lê os dados de cada um, centraliza, analisa tudo com IA e trabalha neles por você. Conecte quantos quiser.":"Keep the systems you already have. Gerenia reads their data, brings it together, analyzes it with AI and works in them for you. Connect as many as you like.","Um app pode alimentar várias áreas":"One app can power several areas","Vários apps na mesma área, sem duplicar":"Several apps in one area, without duplicates","Desconecte quando quiser":"Disconnect whenever you want","em breve":"coming soon","Conexão direta":"Direct connection","Pelo navegador":"Through the browser","Exemplos de plataformas do mercado. Disponibilidade e forma de cada integração a confirmar.":"Examples of market platforms. Availability and connection method are subject to confirmation.","Você no controle":"You’re in control","Você decide quanto a Gerenia faz sozinha.":"You decide how much Gerenia does on her own.","No WhatsApp e nas campanhas, escolha o nível de autonomia. Dá para mudar a qualquer momento.":"Choose the autonomy level for WhatsApp and campaigns. Change it anytime.","Recomendado para começar":"Recommended to start","Comece simples. Cresça no seu ritmo.":"Start simple. Grow at your own pace.","Conecte uma coisa":"Connect one thing","O WhatsApp ou o sistema que você já usa. Leva poucos minutos.":"WhatsApp or a system you already use. It only takes a few minutes.","A Gerenia monta seu painel":"Gerenia builds your dashboard","Só com o que você conectou. Nada de tela cheia no primeiro dia.":"Only with what you connected. No overwhelming dashboard on day one.","Cresça no seu ritmo":"Grow at your own pace","Adicione agenda, financeiro e outros apps quando fizer sentido.":"Add your calendar, finances and other apps when it makes sense.","Exemplo: o painel crescendo":"Example: a dashboard that grows","Coloque uma gerente com IA no seu negócio.":"Put an AI manager in your business.","Comece em minutos. Ela cuida do resto.":"Start in minutes. She takes care of the rest.","Protótipo navegável · dados fictícios · nenhuma integração real":"Interactive prototype · fictional data · no real integrations","Ao vivo":"Live","Agenda · esta semana":"Calendar · this week","Consulta":"Appointment","Retorno":"Follow-up","Remarcar horário":"Reschedule","Salvar":"Save","Remarcando Julia para quinta, 16:30":"Moving Julia to Thursday, 4:30 PM","Parar":"Stop","Dia 1":"Day 1","+ Agenda":"+ Calendar","+ Financeiro":"+ Finance","conversas hoje":"conversations today","consultas hoje":"appointments today","recebidos no mês":"received this month","Oi, Mariana.":"Hi, Mariana.","Por onde a Gerenia começa?":"Where should Gerenia start?","Conectar WhatsApp":"Connect WhatsApp","Bom dia, Mariana.":"Good morning, Mariana.","Seus contatos do WhatsApp já viraram sua base de clientes.":"Your WhatsApp contacts are now your client base.","8 consultas hoje. Todas confirmadas pelo WhatsApp.":"8 appointments today. All confirmed through WhatsApp.","Rafael está com R$ 450 em aberto. Lembro ele?":"Rafael has R$450 outstanding. Should I remind him?","Vamos criar seu espaço.":"Let’s create your workspace.","Leva 1 minuto. A Gerenia pesquisa seu negócio e já chega com um primeiro diagnóstico.":"It takes one minute. Gerenia researches your business and arrives with an initial assessment.","Continuar com Google":"Continue with Google","Continuar com e-mail":"Continue with email","Demonstração: nenhuma conta é criada.":"Demo: no account will be created.","Como podemos te chamar?":"What should we call you?","Seu nome":"Your name","Continuar":"Continue","Qual o nome da sua empresa?":"What’s your company’s name?","A gente encontra seu site e Instagram para já chegar sabendo um pouco do seu negócio.":"We’ll find your website and Instagram so Gerenia can arrive knowing a little about your business.","Ex.: Clínica Horizonte":"E.g. Clínica Horizonte","Voltar":"Back","Sem problema. Conta pra gente.":"No problem. Tell us about it.","Com o link, a Gerenia pesquisa seu negócio do mesmo jeito.":"With a link, Gerenia researches your business the same way.","Nome da empresa":"Company name","Site ou Instagram":"Website or Instagram","Tipo de negócio":"Business type","Voltar à busca":"Back to search","Digite o nome como aparece no Google ou no Instagram.":"Enter the name as it appears on Google or Instagram.","Empresas encontradas":"Companies found","Não encontrei minha empresa":"I can’t find my company","Demonstração: resultados fictícios, gerados a partir do nome digitado.":"Demo: fictional results generated from the name you enter.","Pergunte à Gerenia":"Ask Gerenia","Ajustes":"Settings","Principal":"Main","Início":"Home","Suas áreas":"Your areas","Adicionar área":"Add area","Atividade":"Activity","Conexões":"Connections","Falar com a Gerenia":"Talk to Gerenia","no WhatsApp":"on WhatsApp","Fontes":"Sources","Conectar":"Connect","Recomendado":"Recommended","Já usa um sistema de gestão?":"Already use a management system?","Ver conexões":"View connections","Precisa de você":"Needs you","Pesquisando a":"Researching","Site, Instagram e Google, para montar seu briefing.":"Website, Instagram and Google, to build your briefing.","Montando seu briefing":"Building your briefing","O que a Gerenia descobriu sobre o seu negócio":"What Gerenia discovered about your business","Ver":"View","avaliações":"reviews","O que vocês fazem":"What you do","O que encontramos":"What we found","O que achamos que você precisa":"What we think you need","São suposições a partir de fontes públicas.":"These are assumptions based on public sources.","Algo errado? Me conta":"Something wrong? Tell me","Fechar briefing":"Close briefing","Tudo o que a Gerenia fez nos seus sistemas. Ela só age quando você pede ou aprova.":"Everything Gerenia did in your systems. She only acts when you ask or approve.","Hoje":"Today","Nada por aqui ainda. Peça algo à Gerenia, como “remarca a Julia para quinta”.":"Nothing here yet. Ask Gerenia something like “move Julia to Thursday.”","Adicionar uma área":"Add an area","Cada área entra no seu painel já funcionando. Escolha a que mais toma seu tempo.":"Each area arrives ready to work. Choose the one that takes most of your time.","Você já tem todas as áreas.":"You already have every area.","Prefere escolher pelos apps?":"Prefer to choose by app?","Veja todos os sistemas que a Gerenia conecta":"See every system Gerenia connects","Conecte quantos sistemas quiser. A Gerenia centraliza os dados e analisa tudo com IA.":"Connect as many systems as you like. Gerenia centralizes their data and analyzes it with AI.","Conectados":"Connected","Desconectar?":"Disconnect?","Sim":"Yes","Não":"No","Sincronizado":"Synced","Desconectar":"Disconnect","Nenhum app conectado ainda. Escolha abaixo, pode ser mais de um.":"No apps connected yet. Choose below—you can select more than one.","Adicionar apps":"Add apps","Buscar app ou categoria":"Search app or category","Buscar app":"Search app","Nenhum app encontrado.":"No apps found.","Em breve":"Coming soon","app selecionado":"app selected","apps selecionados":"apps selected","Limpar":"Clear","Conectado":"Connected","Modo do agente":"Agent mode","Precisam de você":"Need you","Para aprovar":"For approval","Sem resposta":"Unanswered","Todas":"All","Nada esperando você.":"Nothing waiting for you.","Ver todas":"View all","Escolha uma conversa.":"Choose a conversation.","As que precisam de você aparecem primeiro.":"Those that need you appear first.","Sugestão pronta":"Draft ready","Respondida por você":"Answered by you","Respondida":"Answered","Você":"You","A Gerenia chamou você:":"Gerenia needs you:","Sugestão da Gerenia":"Gerenia’s draft","Enviar":"Send","Editar":"Edit","Resumo da Gerenia:":"Gerenia summary:","Sugerir resposta":"Draft a reply","Respondida.":"Answered.","A Gerenia continua acompanhando.":"Gerenia keeps monitoring.","A Gerenia salvou no histórico do cliente.":"Gerenia saved it to the client history.","última mensagem":"last message","Escreva uma resposta…":"Write a reply…","A Gerenia analisou sua base":"Gerenia analyzed your client base","Buscar por nome":"Search by name","Todos":"All","Novos":"New","Sumidos":"Gone quiet","Campanhas":"Campaigns","Nova campanha":"New campaign","Nenhuma campanha ainda. A Gerenia escreve a primeira pra você.":"No campaigns yet. Gerenia will write the first one for you.","Ações automáticas":"Automations","Campanhas e ações são enviadas pelo WhatsApp.":"Campaigns and automations are sent through WhatsApp.","Campanhas e ações":"Campaigns and automations","Enviando…":"Sending…","Agendada · amanhã às 9h":"Scheduled · tomorrow at 9 AM","enviadas":"sent","responderam":"replied","agendaram":"booked","Ninguém encontrado.":"No one found.","Novo":"New","Sumido":"Gone quiet","Gerenia chamou":"Gerenia reached out","Chamar de volta":"Bring back","Nenhum horário neste dia.":"No bookings on this day.","A Gerenia confirma cada horário pelo WhatsApp um dia antes e encaixa quem quer remarcar.":"Gerenia confirms each booking on WhatsApp one day ahead and fits in reschedules.","Com o WhatsApp conectado, a Gerenia confirma cada horário por você.":"With WhatsApp connected, Gerenia confirms each booking for you.","Confirmado pela Gerenia":"Confirmed by Gerenia","Confirmado":"Confirmed","Gerenia lembra às 18h":"Gerenia reminds at 6 PM","Sem confirmação":"Unconfirmed","Remarcada para qui, 16:30":"Moved to Thu, 4:30 PM","Novo · marcado no WhatsApp":"New · booked on WhatsApp","Financeiro":"Finance","Recebimentos e cobranças de":"Payments and billing for","Recebido em":"Received in","A receber":"Outstanding","pagamento":"payment","pagamentos":"payments","Em aberto":"Outstanding","Lembrete enviado":"Reminder sent","Lembrar":"Remind","Marcar pago":"Mark paid","Nada em aberto.":"Nothing outstanding.","Últimos recebimentos":"Latest payments","Agora · marcado por você":"Now · marked by you","Seu espaço, o jeito da Gerenia e a aparência.":"Your workspace, Gerenia’s voice and appearance.","Seu negócio":"Your business","Negócio":"Business","Cor da marca":"Brand color","Puxada do seu Instagram. Aparece no seu espaço.":"Taken from your Instagram. Used in your workspace.","Falar com a Gerenia no WhatsApp":"Talk to Gerenia on WhatsApp","Peça coisas para ela de onde estiver":"Ask her to do things from anywhere","Jeito da Gerenia falar":"Gerenia’s voice","Oi, vocês têm horário amanhã?":"Hi, do you have any openings tomorrow?","Conectar, ver e desconectar sistemas":"Connect, view and disconnect systems","Nenhum app conectado":"No apps connected","Aparência":"Appearance","Tema":"Theme","Claro":"Light","Escuro":"Dark","Demonstração":"Demo","Protótipo com dados fictícios. Nenhuma conta, mensagem ou integração real é criada.":"Prototype with fictional data. No real account, message or integration is created.","Recomeçar do zero":"Start over","Ver com tudo conectado":"View with everything connected","Ver o site":"View website","Escolha um ou mais. A Gerenia junta tudo na área":"Choose one or more. Gerenia brings everything together in","Já conectado":"Already connected","Não achou? Ver todos os apps":"Can’t find it? View all apps","Conecte seu WhatsApp":"Connect your WhatsApp","Igual ao WhatsApp Web. Seu número continua o mesmo, e seus contatos viram sua base de clientes na Gerenia.":"Just like WhatsApp Web. Your number stays the same, and your contacts become your client base in Gerenia.","Abra o WhatsApp no celular":"Open WhatsApp on your phone","Toque em":"Tap","Aparelhos conectados":"Linked devices","Aponte a câmera para o código":"Point the camera at the code","Escolha":"Choose","Conectar com número":"Link with phone number","e digite o código":"and enter the code","Seu código":"Your code","Já conectei":"I’ve connected it","Demonstração: nenhum WhatsApp real é conectado.":"Demo: no real WhatsApp account is connected.","Como a Gerenia deve agir no WhatsApp?":"How should Gerenia work on WhatsApp?","Você pode mudar quando quiser, na própria aba do WhatsApp.":"You can change this anytime in the WhatsApp tab.","Como fica":"Preview","A Gerenia não responde. Ela salva o contato e resume: “quer horário amanhã”.":"Gerenia doesn’t reply. She saves the contact and summarizes: “wants a time tomorrow.”","Conectar à Gerenia":"Connect to Gerenia","Você entra uma vez nesta janela segura. A Gerenia guarda a sessão, nunca a sua senha.":"You sign in once in this secure window. Gerenia stores the session, never your password.","Agir só quando você pedir ou aprovar":"Act only when you ask or approve","Você assiste tudo ao vivo ou depois":"Watch everything live or later","Desconecte quando quiser, em Conexões.":"Disconnect anytime in Connections.","Juntando tudo…":"Bringing everything together…","analisando tudo com IA":"analyzing everything with AI","apps conectados!":"apps connected!","Novo no seu painel":"New on your dashboard","Ver no meu painel":"View my dashboard","Fechar":"Close","Pular agora":"Skip for now","Código QR de demonstração":"Demo QR code","A Gerenia escreve, você revisa e envia.":"Gerenia writes, you review and send.","Mensagem":"Message","Reescrever":"Rewrite","vira o primeiro nome de cada pessoa.":"becomes each person’s first name.","Quando":"When","Agora":"Now","Amanhã às 9h":"Tomorrow at 9 AM","Sai pelo seu WhatsApp. As respostas aparecem na aba WhatsApp.":"Sent from your WhatsApp. Replies appear in the WhatsApp tab.","Campanhas são enviadas pelo WhatsApp.":"Campaigns are sent through WhatsApp.","Agendar para":"Schedule for","Conversa com a Gerenia":"Conversation with Gerenia","Ainda sem conexões":"No connections yet","Fechar conversa":"Close conversation","Continuar a conversa no WhatsApp":"Continue on WhatsApp","Pergunte à Gerenia…":"Ask Gerenia…","Gerenia está escrevendo":"Gerenia is typing","Pode fazer":"Go ahead","Agora não":"Not now","Por onde eu começo?":"Where should I start?","Quais sistemas você conecta?":"Which systems do you connect?","O que precisa de mim hoje?":"What needs me today?","Monta uma campanha":"Create a campaign","Remarca a Julia para quinta 16h30":"Move Julia to Thursday at 4:30 PM","Como está a agenda?":"How does the calendar look?","Quanto entrou este mês?":"How much came in this month?","O que mais posso conectar?":"What else can I connect?","Tudo bem, não mexi em nada.":"All right, I didn’t change anything.","Resposta enviada.":"Reply sent.","Resposta enviada. A Gerenia continua daqui.":"Reply sent. Gerenia takes it from here.","Marcado como pago.":"Marked as paid.","Ação automática ligada.":"Automation turned on.","Ação automática desligada.":"Automation turned off.","Campanha agendada para amanhã às 9h.":"Campaign scheduled for tomorrow at 9 AM.","Criar seu espaço · Gerenia":"Create your workspace · Gerenia","Conectar · Gerenia":"Connect · Gerenia","Nova campanha · Gerenia":"New campaign · Gerenia","Gerenia — Sua gerente com IA":"Gerenia — Your AI manager"};
Object.assign(UI_EN, {
  'A Gerenia respondeu': 'Gerenia answered',
  'A Gerenia preparou': 'Gerenia prepared',
  'para você aprovar.': 'for you to approve.',
  'Você tem': 'You have',
  'sem resposta.': 'unanswered.',
  'Hoje tem': 'Today you have',
  'na agenda.': 'on the calendar.',
  'Você recebeu': 'You received',
  'este mês.': 'this month.',
  'Seus': 'Your',
  'estão num lugar só.': 'are all in one place.',
  '1 coisa': '1 item',
  'coisas': 'items',
  'precisa': 'needs',
  'precisam': 'need',
  'de você.': 'your attention.',
  'Encontrando': 'Finding',
  'Lendo o Instagram': 'Reading Instagram',
  'Lendo': 'Reading',
  'avaliações no Google': 'Google reviews',
  'Briefing da': 'Briefing for',
  'reunidos de': 'combined from',
  'fonte': 'source',
  'fontes': 'sources',
  'Acolhedora': 'Warm',
  'Próxima e calorosa': 'Friendly and warm',
  'Direta': 'Direct',
  'Curta e objetiva': 'Short and concise',
  'Formal': 'Formal',
  'Educada e profissional': 'Polite and professional',
  'Ver o cadastro de': 'View records for',
  'Ver e atualizar horários': 'View and update bookings',
  'Ver recebimentos e cobranças': 'View payments and billing',
  'Ler e responder conversas': 'Read and reply to conversations',
  'lendo conversas e contatos': 'reading conversations and contacts',
  'criando do zero': 'creating from scratch',
  'horários': 'bookings',
  'recebimentos': 'payments',
  'abrindo pelo navegador e lendo': 'opening in the browser and reading',
  'lendo': 'reading',
  'O': 'The',
  'não tem integração aberta, então a Gerenia opera pelo navegador, com o seu acesso.': 'does not offer an open integration, so Gerenia operates it through the browser with your access.',
  'A Gerenia usa a integração oficial do': 'Gerenia uses the official integration from',
  'Você entra na sua conta': 'Sign in to your',
  'e autoriza o acesso. A Gerenia vai poder:': 'account and authorize access. Gerenia will be able to:',
  'Seus contatos viraram sua base de': 'Your contacts are now your',
  'e a Gerenia já está': 'base, and Gerenia is already',
  'agora alimenta': 'now powers',
  'agora alimentam': 'now power',
  'Ainda não vejo': 'I can’t see',
  'Conectando, eu analiso sua base e escrevo campanhas.': 'Once connected, I analyze your client base and write campaigns.',
  'Conectando, eu remarco direto no seu sistema.': 'Once connected, I reschedule directly in your system.',
  'Conectando, eu mostro os horários do dia e confirmo cada um.': 'Once connected, I show the day’s bookings and confirm each one.',
  'Conectando, eu sei quem pagou e lembro quem falta.': 'Once connected, I know who paid and remind anyone outstanding.',
  'Conectando, eu aviso quem não volta há muito tempo.': 'Once connected, I flag clients who haven’t returned in a while.',
  'Eu passo a atender e seus contatos viram sua base de clientes.': 'I start handling messages and your contacts become your client base.',
  'Ainda não estou conectada a nada.': 'I’m not connected to anything yet.',
  'Quanto mais eu vejo, melhor eu analiso.': 'The more I can see, the better I can analyze.',
  'A Julia já está remarcada para quinta, 16:30. ✓': 'Julia is already moved to Thursday, 4:30 PM. ✓',
  'Você pode assistir enquanto eu faço.': 'You can watch while I do it.',
  'Duas ainda não confirmaram e eu lembro às 18h.': 'Two are still unconfirmed, and I’ll remind them at 6 PM.',
  'Duas ainda não confirmaram.': 'Two are still unconfirmed.',
  'Nada em aberto.': 'Nothing outstanding.',
  'Posso montar uma campanha para chamar de volta.': 'I can create a campaign to bring them back.',
  'Comece pelo WhatsApp: é onde seus clientes já falam com você, e os contatos viram sua base. Se já usa um sistema de gestão, conecte ele também e eu junto tudo.': 'Start with WhatsApp: it’s where your clients already talk to you, and those contacts become your client base. If you use a management system, connect that too and I’ll bring everything together.',
  'Ainda não tenho nada para acompanhar. Conecte o WhatsApp ou um sistema e eu já te mostro o que precisa de você.': 'I don’t have anything to monitor yet. Connect WhatsApp or another system and I’ll show you what needs your attention.',
  'Nada precisa de você agora. Eu aviso se algo mudar. ✓': 'Nothing needs your attention right now. I’ll let you know if that changes. ✓',
  'Nenhuma conversa espera por você.': 'No conversations are waiting for you.',
  'Sou a gerente do': 'I’m the manager for',
  'Conecto seus sistemas, junto clientes, agenda, WhatsApp e financeiro, e cuido do dia a dia. Só vejo o que você conecta.': 'I connect your systems, bring clients, calendar, WhatsApp and finances together, and run the day-to-day. I only see what you connect.',
  'Ainda estou aprendendo a responder isso. Pergunte sobre': 'I’m still learning how to answer that. Ask me about',
  'como começar': 'how to get started',
  'No briefing, o que não está certo é': 'In the briefing, what isn’t right is',
  'Pronto ✓ Remarquei Julia Costa para': 'Done ✓ I moved Julia Costa to',
  'pela conexão direta, em 2 segundos.': 'through the direct connection in 2 seconds.',
});
const UI_PATTERNS = [
  [/^Conecta com (.+)$/, 'Connects with $1'],
  [/^Conectar (\d+) apps$/, 'Connect $1 apps'],
  [/^(\d+) de (\d+)$/, '$1 of $2'],
  [/^Mostrando (\d+) de (\d+)\.$/, 'Showing $1 of $2.'],
  [/^Alimenta (.+)$/, 'Feeds $1'],
  [/^também alimenta (.+)$/, 'also feeds $1'],
  [/^Última visita: (.+)$/, 'Last visit: $1'],
  [/^App (\d+) de (\d+)$/, 'App $1 of $2'],
  [/^(\d+) apps conectados!$/, '$1 apps connected!'],
  [/^Entrar no (.+)$/, 'Sign in to $1'],
  [/^Autorizar (.+)$/, 'Authorize $1'],
  [/^Conectar (.+) à Gerenia$/, 'Connect $1 to Gerenia'],
  [/^Agora no (.+)$/, 'Now in $1'],
  [/^Falar com a Gerenia no WhatsApp$/, 'Talk to Gerenia on WhatsApp'],
  [/^Recebimentos e cobranças de (.+)$/, 'Payments and billing for $1'],
  [/^Recebido em (.+)$/, 'Received in $1'],
  [/^Enviar para (\d+)$/, 'Send to $1'],
  [/^Agendar para (\d+)$/, 'Schedule for $1'],
  [/^(.+) desconectado\.$/, '$1 disconnected.'],
  [/^WhatsApp agora (.+)\.$/, 'WhatsApp is now $1.'],
  [/^A Gerenia enviou um lembrete para (.+) pelo WhatsApp\.$/, 'Gerenia sent $1 a WhatsApp reminder.'],
  [/^A Gerenia mandou uma mensagem para (.+)\.$/, 'Gerenia messaged $1.'],
  [/^Enviando para (\d+) (.+)\.$/, 'Sending to $1 $2.'],
  [/^(.+) avaliações$/, '$1 reviews'],
  [/^Briefing da (.+)$/, 'Briefing for $1'],
  [/^Mensagem para (.+)$/, 'Message for $1'],
  [/^(.+) · última mensagem (.+)$/, '$1 · last message $2'],
  [/^(.+) no total · reunidos de (.+)$/, '$1 total · combined from $2'],
  [/^Seus contatos viraram sua base de (.+), e a Gerenia já está (.+)\.$/, 'Your contacts are now your $1 base, and Gerenia is already $2.'],
];
function uiTranslate(raw) {
  const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0], text = raw.trim();
  if (!text) return raw;
  let out = UI_EN[text] || text;
  if (out === text) for (const [re, value] of UI_PATTERNS) if (re.test(text)) { out = text.replace(re, value); break; }
  return lead + out + trail;
}
function localizeDom(scope = document) {
  if (!EN() || !scope) return;
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { const next = uiTranslate(n.nodeValue); if (next !== n.nodeValue) n.nodeValue = next; });
  scope.querySelectorAll?.('[aria-label],[title],[placeholder]').forEach(el => {
    for (const a of ['aria-label', 'title', 'placeholder']) if (el.hasAttribute(a)) el.setAttribute(a, uiTranslate(el.getAttribute(a)));
  });
}
function syncLanguageMeta() {
  document.documentElement.lang = EN() ? 'en' : 'pt-BR';
  if (EN()) document.title = uiTranslate(document.title);
  const meta = document.querySelector('meta[name=description]');
  if (meta) meta.content = L('Uma gerente com IA que cuida dos seus sistemas: clientes, agenda, WhatsApp e financeiro num só lugar.', 'An AI manager that takes care of your systems—clients, calendar, WhatsApp and finances in one place.');
}
function render() {
  const result = renderRaw();
  localizeDom(root);
  syncLanguageMeta();
  return result;
}
const uiObserver = new MutationObserver(() => { if (EN()) requestAnimationFrame(() => localizeDom(root)); });
uiObserver.observe(root, { childList: true, subtree: true });

function landing() {
  const v = sectors().clinica;
  const steps = [
    ['Conecte uma coisa', 'O WhatsApp ou o sistema que você já usa. Leva poucos minutos.'],
    ['A Gerenia monta seu painel', 'Só com o que você conectou. Nada de tela cheia no primeiro dia.'],
    ['Cresça no seu ritmo', 'Adicione agenda, financeiro e outros apps quando fizer sentido.'],
  ];
  const lpApps = Object.keys(APPS).filter(a => !APPS[a].native);
  return `<div class="lp">
  <header class="lp-head wrap">
    ${brand()}
    <nav class="lp-nav" aria-label="Seções"><a href="#para-quem">Para quem</a><a href="#areas">O que ela faz</a><a href="#opera">Como ela opera</a><a href="#integracoes">Integrações</a><a href="#como">Como começa</a></nav>
    <div class="lp-actions">${langToggle()}${themeBtn()}<a class="link hide-sm" href="#/entrar">${L('Entrar', 'Sign in')}</a><a class="btn sm" href="#encontre" data-act="focus-company">${L('Começar', 'Get started')}</a></div>
  </header>

  <section class="hero wrap">
    <div class="hero-copy">
      <p class="eyebrow">Gerente com IA para saúde e bem-estar</p>
      <h1>Uma gerente com IA <span>que cuida dos seus sistemas.</span></h1>
      <p class="lead">Clientes, agenda, WhatsApp e financeiro num só lugar. A Gerenia conecta os sistemas que você já usa, analisa tudo e age por você, sempre com a sua aprovação.</p>
      ${lpCompanyFinder()}
    </div>
    <div class="hero-visual">
      <div class="console" aria-label="Exemplo de conversa com a Gerenia">
        <div class="console-head">
          <span class="g-av">${mark()}</span>
          <div><b>Gerenia</b><small><i class="online"></i>Sua gerente · Clínica Horizonte</small></div>
          <span class="mstack" title="Sistemas conectados">${['whatsapp', 'feegow', 'gcal', 'asaas'].map(a => mono(a, 'xs')).join('')}</span>
        </div>
        <div class="console-body">
          <div class="bubble me a1">Gerenia, como está hoje?</div>
          <div class="bubble a2">${L('Bom dia, Mariana! Hoje são', 'Good morning, Mariana! Today you have')} <b>8 ${v.services}</b>. ${L('Duas ainda não confirmaram e já mandei lembrete pelo WhatsApp.', 'Two are still unconfirmed, and I’ve already sent WhatsApp reminders.')}<br><br>${L('O Rafael está com', 'Rafael has')} <b>R$ 450</b> ${L('em atraso. Quer que eu cobre?', 'overdue. Want me to follow up?')}
            <div class="bubble-actions"><span class="pill">Pode cobrar</span><span class="pill ghost">Ver agenda</span></div></div>
        </div>
        <div class="console-feed a3">
          <p class="block-title">Feito pela Gerenia hoje</p>
          <ul>
            <li>${icon('check')}<span>Respondeu 15 conversas no WhatsApp</span>${viaTag('whatsapp', 'inline')}${mono('whatsapp', 'xxs')}</li>
            <li>${icon('check')}<span>Agendou Lucas para sábado, 9h</span>${viaTag('feegow', 'inline')}${mono('feegow', 'xxs')}</li>
            <li>${icon('check')}<span>Conferiu 3 pagamentos via Pix</span>${viaTag('asaas', 'inline')}${mono('asaas', 'xxs')}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="para-quem" class="section">
    <div class="wrap">
      <p class="eyebrow">Para quem</p>
      <h2>Feita para quem cuida de gente.</h2>
      <p class="lead">Clínicas, academias e estúdios. A Gerenia já chega falando a língua do seu negócio e pronta para os sistemas do seu setor.</p>
      <div class="markets">${MARKETS.map(m => `<article class="market">
        <div class="market-photo"><img src="assets/setor-${m[0]}.jpg" alt="${m[5]}" width="724" height="724" loading="lazy"></div>
        <div class="market-body">
          <div class="market-title"><h3>${m[1]}</h3><span class="sec-ico">${icon(sectors()[m[0]].icon)}</span></div>
          <p class="market-tags">${m[2]}</p>
          <p>${m[3]}</p>
          <div class="market-apps"><span class="mstack">${m[4].map(a => mono(a, 'xs')).join('')}</span><small>Conecta com ${join(m[4].map(a => APPS[a].name))}</small></div>
        </div>
      </article>`).join('')}</div>
    </div>
  </section>

  <section id="areas" class="section">
    <div class="wrap">
      <p class="eyebrow">O que ela faz</p>
      <h2>Clientes, agenda, WhatsApp e financeiro. Num só lugar.</h2>
      <p class="lead">A Gerenia junta os dados de todos os seus sistemas e opera o dia a dia: responde, confirma, cobra e avisa o que precisa de você.</p>
      <div class="areas">${AREAS.map(id => `<article class="area ${AREA[id].cls}"><span class="mico">${icon(AREA[id].icon)}</span><h3>${AREA[id].name}</h3><p>${AREA[id].pitch}</p></article>`).join('')}</div>
    </div>
  </section>

  <section id="opera" class="section">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Ela opera seus sistemas</p>
        <h2>Não só mostra. A Gerenia faz.</h2>
        <p class="lead">Você pede, ela executa nos seus sistemas: remarca, lança, cobra, atualiza cadastro. Quando o sistema tem integração, ela usa a conexão direta. Quando não tem, ela usa pelo navegador, como você usaria.</p>
        <div class="via-explainer">${Object.entries(VIA).map(([k, v]) => `<div class="via-card"><span class="via-ico via-${k}">${icon(v.icon)}</span><div><b>${v.name}</b><p>${v.desc}</p></div></div>`).join('')}</div>
      </div>
      ${lpOperate()}
    </div>
  </section>

  <section id="integracoes" class="section">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Integrações</p>
        <h2>Conecta com o que você já usa.</h2>
        <p class="lead">Você não troca de sistema. A Gerenia lê os dados de cada um, centraliza, analisa tudo com IA e trabalha neles por você. Conecte quantos quiser.</p>
        <ul class="checks lp-checks"><li>${icon('check')}Um app pode alimentar várias áreas</li><li>${icon('check')}Vários apps na mesma área, sem duplicar</li><li>${icon('check')}Desconecte quando quiser</li></ul>
      </div>
      <div>
        <ul class="logo-grid">${lpApps.map(a => `<li>${mono(a, 'sm')}<span>${APPS[a].name}</span>${APPS[a].soon ? '<em>em breve</em>' : `<i class="via-dot via-${APPS[a].via}" title="${VIA[APPS[a].via].name}">${icon(VIA[APPS[a].via].icon)}</i>`}</li>`).join('')}</ul>
        <p class="fine legend"><span>${icon('zap')}Conexão direta</span><span>${icon('monitor')}Pelo navegador</span></p>
        <p class="fine">Exemplos de plataformas do mercado. Disponibilidade e forma de cada integração a confirmar.</p>
      </div>
    </div>
  </section>

  <section id="controle" class="section">
    <div class="wrap">
      <p class="eyebrow">Você no controle</p>
      <h2>Você decide quanto a Gerenia faz sozinha.</h2>
      <p class="lead">No WhatsApp e nas campanhas, escolha o nível de autonomia. Dá para mudar a qualquer momento.</p>
      <div class="modes">${Object.entries(MODES).map(([k, m]) => `<article class="mode ${k === 'assist' ? 'featured' : ''}"><span class="mode-ico">${icon(m[2])}</span><h3>${m[0]}</h3><p>${m[1]}</p>${k === 'assist' ? '<span class="tag info">Recomendado para começar</span>' : ''}</article>`).join('')}</div>
    </div>
  </section>

  <section id="como" class="section">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Como começa</p>
        <h2>Comece simples. Cresça no seu ritmo.</h2>
        <ol class="steps-list">${steps.map((s, i) => `<li><span class="n">${i + 1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p></div></li>`).join('')}</ol>
      </div>
      <div class="hero-demo">
        <div class="demo-frame" aria-label="Exemplo: o painel crescendo">
          <div class="demo-bar"><span class="dots"><i></i><i></i><i></i></span><span>Clínica Horizonte</span></div>
          <div class="demo-body" id="demo-body">${demoBody(ui.lpStep)}</div>
        </div>
        <div class="demo-steps" id="demo-steps">${demoSteps()}</div>
      </div>
    </div>
  </section>

  <section class="final wrap">
    <h2>Coloque uma gerente com IA no seu negócio.</h2>
    <p class="lead">Comece em minutos. Ela cuida do resto.</p>
    <a class="btn lg" href="#encontre" data-act="focus-company">${L('Começar', 'Get started')} ${icon('arrow')}</a>
  </section>

  <footer class="lp-foot wrap">
    ${brand()}
    <p class="fine">Protótipo navegável · dados fictícios · nenhuma integração real</p>
  </footer>
</div>`;
}

function lpCompanyFinder() {
  const f = ui.lpBiz;
  return `<div class="hero-finder" id="encontre">
    <form class="lp-company-form" data-form="lp-company">
      ${icon('search')}
      <input data-input="lp-biz" name="company" value="${esc(f.q)}" placeholder="${L('Digite o nome da sua empresa', 'Enter your company name')}" autocomplete="organization" maxlength="60" aria-label="${L('Nome da empresa', 'Company name')}">
      <button type="submit" aria-label="${L('Pesquisar empresa', 'Search for company')}" ${f.q.trim().length < 2 ? 'disabled' : ''}>${icon('arrow')}</button>
    </form>
    <div id="lp-biz-results" class="lp-company-results" aria-live="polite">${lpBizResults()}</div>
    <p class="fine">${icon('check')}${L('Veja seu diagnóstico e painel antes de criar uma conta.', 'See your diagnosis and dashboard before creating an account.')}</p>
  </div>`;
}

function lpBizResults() {
  const f = ui.lpBiz;
  if ((f.q || '').trim().length < 2) return '';
  if (f.loading) return `<ul class="biz-results lp-results">${[0, 1, 2].map(() => '<li class="biz-skel"><span></span><div><i></i><i></i></div></li>').join('')}</ul>`;
  if (!f.results.length) return '';
  const q = norm(f.q.trim());
  const hl = name => { const k = norm(name).indexOf(q); return k < 0 ? esc(name) : `${esc(name.slice(0, k))}<mark>${esc(name.slice(k, k + q.length))}</mark>${esc(name.slice(k + q.length))}`; };
  return `<ul class="biz-results lp-results" aria-label="${L('Empresas encontradas', 'Companies found')}">${f.results.map((c, i) => `<li><button type="button" class="biz-result" data-act="lp-pick" data-v="${i}">
    ${bizAvatar(c)}<span class="br-main"><b>${hl(c.name)}${c.branch ? ` <em>· ${branchLabel()}</em>` : ''}</b><small>${catLabel(c)} · ${c.hood}, ${c.city}</small></span>${icon('arrow')}
  </button></li>`).join('')}</ul>
  <p class="fine lp-demo-note">${L('Demonstração: resultados fictícios gerados a partir do nome digitado.', 'Demo: fictional results generated from the name you enter.')}</p>`;
}

function selectCompany(c) {
  const preserved = keep();
  S = Object.assign(blank(), preserved, { name: 'Mariana', business: c.name, sector: c.sector, company: c, signedIn: false });
  ui.lpBiz = { q: '', results: [], loading: false };
  ui.log = []; ui.rstep = 0; ui.briefOpen = false; ui.sideNew = true;
  save();
  go('#/app');
}

const MARKETS = [
  ['clinica', 'Clínicas', 'Consultas. Pacientes. Convênios.', 'Confirma consultas, responde sobre convênio e lembra retornos.', ['feegow', 'iclinic', 'doctoralia'], 'Médica conversando com uma paciente em um consultório'],
  ['academia', 'Academias', 'Alunos. Planos. Relacionamento.', 'Atende interessados, renova planos e chama quem parou de treinar.', ['tecnofit', 'pacto', 'nextfit'], 'Professora conversando com um aluno em uma academia'],
  ['estudio', 'Estúdios', 'Pilates. Yoga. Aulas e sessões.', 'Organiza turmas, remarca aulas e cuida das mensalidades.', ['nextfit', 'tecnofit', 'gcal'], 'Instrutora ajudando uma aluna no reformer de pilates'],
];
function lpOperate() {
  const steps = SCENARIO('feegow');
  return `<div class="lp-operate">
    <div class="bw">
      <div class="bw-bar"><span class="dots"><i></i><i></i><i></i></span><span class="bw-url">${icon('lock')}app.feegow.com.br/agenda</span><span class="live-badge">Ao vivo</span></div>
      <div class="bw-screen static" style="--app:${APPS.feegow.color}">
        <div class="fk-top"><span class="fk-logo">F</span><b>Feegow</b><span class="fk-search">${icon('search')}<span class="typed">Julia Costa</span></span></div>
        <div class="fk-body">
          <div class="fk-side"><i class="on"></i><i></i><i></i><i></i><i></i></div>
          <div class="fk-main">
            <p class="fk-h">Agenda · esta semana</p>
            <div class="fk-row hl"><b>Ter 10:30</b><span>Julia Costa</span><em>Consulta</em></div>
            <div class="fk-row"><b>Ter 11:00</b><span>Beatriz Santos</span><em>Retorno</em></div>
            <div class="fk-row"><b>Qua 09:00</b><span>Pedro Almeida</span><em>Consulta</em></div>
            <div class="fk-modal show"><p>Remarcar horário</p><span class="fk-field">Qui, 16:30</span><span class="fk-save">Salvar</span></div>
          </div>
        </div>
        <svg class="cursor show static-cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 7-6 2-2 6z"/></svg>
      </div>
    </div>
    <div class="lp-operate-card">
      <div class="lp-operate-head">${mono('feegow', 'xs')}<b>Remarcando Julia para quinta, 16:30</b>${viaTag('feegow', 'inline')}</div>
      <ol class="watch-steps">${steps.map((t, i) => `<li class="${i < 3 ? 'done' : i === 3 ? 'doing' : ''}"><span class="st">${i < 3 ? icon('check') : ''}</span>${t}</li>`).join('')}</ol>
      <span class="pill ghost">${icon('stop')}Parar</span>
    </div>
  </div>`;
}

const DEMO_LABELS = ['Dia 1', '+ WhatsApp', '+ Agenda', '+ Financeiro'];
const DEMO = { whatsapp: ['18', 'conversas hoje'], clientes: ['214', 'pacientes'], agenda: ['8', 'consultas hoje'], financeiro: ['R$ 12,4 mil', 'recebidos no mês'] };
const DEMO_AREAS = [[], ['whatsapp', 'clientes'], ['whatsapp', 'clientes', 'agenda'], ['whatsapp', 'clientes', 'agenda', 'financeiro']];
const demoSteps = () => DEMO_LABELS.map((l, i) => `<button data-act="lp-step" data-v="${i}" aria-pressed="${ui.lpStep === i}">${l}</button>`).join('');
function demoBody(n) {
  if (n === 0) return `<div class="demo-empty"><div><p class="demo-hi">Oi, Mariana.</p><p class="demo-sub">Por onde a Gerenia começa?</p><span class="demo-btn">${icon('chat')}Conectar WhatsApp</span></div></div>`;
  const areas = DEMO_AREAS[n], prev = DEMO_AREAS[n - 1];
  const isNew = id => !prev.includes(id);
  return `<div class="demo-rail">${mark('demo-mark')}${areas.map(id => `<span class="mico ${AREA[id].cls} ${isNew(id) ? 'new' : ''}">${icon(AREA[id].icon)}</span>`).join('')}</div>
  <div class="demo-main">
    <p class="demo-hi">Bom dia, Mariana.</p>
    <p class="demo-sub">${['', 'Seus contatos do WhatsApp já viraram sua base de clientes.', '8 consultas hoje. Todas confirmadas pelo WhatsApp.', 'Rafael está com R$ 450 em aberto. Lembro ele?'][n]}</p>
    <div class="demo-cards">${areas.map(id => `<div class="demo-card ${AREA[id].cls} ${isNew(id) ? 'new' : ''}"><span class="mico">${icon(AREA[id].icon)}</span><b>${DEMO[id][0]}</b><small>${DEMO[id][1]}</small></div>`).join('')}</div>
  </div>`;
}
function setDemo(n) {
  ui.lpStep = n;
  const body = $('#demo-body'), steps = $('#demo-steps');
  if (body) body.innerHTML = demoBody(n);
  if (steps) steps.innerHTML = demoSteps();
}
function afterLanding() {
  document.title = 'Gerenia — Sua gerente com IA';
  if (!ui.lpAuto || reduceMotion()) return;
  const tick = () => { setDemo((ui.lpStep + 1) % 4); later(tick, ui.lpStep === 3 ? 4200 : 2600); };
  later(tick, 2600);
}

/* ---------- Entrada opcional ---------- */
function signup() {
  const body = `
    <div class="flow-narrow auth account-auth">
      <span class="mico lg">${icon('lock')}</span>
      <h1>${L('Entre na Gerenia.', 'Sign in to Gerenia.')}</h1>
      <p class="lead">${L('Salve seu progresso e conecte seus sistemas com segurança.', 'Save your progress and securely connect your systems.')}</p>
    <div class="stack">
      <button class="oauth" data-act="login-complete"><span class="g-logo">G</span>${L('Continuar com Google', 'Continue with Google')}</button>
      <button class="oauth" data-act="login-complete">${icon('mail')}${L('Continuar com e-mail', 'Continue with email')}</button>
    </div>
      <p class="fine">${icon('lock')}${L('Demonstração: nenhuma conta é criada.', 'Demo: no account is created.')}</p>
      <a class="link login-back" href="${S.business ? '#/app' : '#/'}">${icon('back')}${S.business ? L('Voltar ao painel', 'Back to dashboard') : L('Pesquisar minha empresa primeiro', 'Search for my company first')}</a>
    </div>`;
  return `<div class="flow entering">
    <header class="flow-head">${brand()}<span class="flow-step">${L('Conta', 'Account')}</span></header>
    <main class="flow-body">${body}</main>
  </div>`;
}
function afterSignup() {
  document.title = L('Entrar · Gerenia', 'Sign in · Gerenia');
}

/* ---------- App: moldura ---------- */
function shell(page, sub) {
  const nav = true;
  const body = { inicio: home, adicionar: catalog, ajustes: settings, conexoes: connections, atividade: activity }[page]?.() || areaPage(page, sub);
  return `<div class="app ${nav ? 'has-nav' : 'no-nav'} ${ui.entering ? 'entering' : ''} ${ui.sideNew ? 'side-new' : ''}" style="--brand:${S.company?.brand || 'var(--primary)'}">
    ${nav ? sidebar(page) : ''}
    <div class="main">
      <header class="topbar">
        ${nav ? `<a class="brand biz-brand mobile-only" href="#/app">${bizAvatar(S.company, 'sm')}<span>${esc(S.business)}</span></a>` : brand('#/app')}
        <div class="top-actions">
          ${langToggle()}
          <button class="ask" data-act="chat-open" aria-haspopup="dialog">${icon('spark')}<span>Pergunte à Gerenia</span></button>
          <a class="avatar" href="#/app/ajustes" aria-label="Ajustes">${esc(initials(S.name || 'G'))}</a>
        </div>
      </header>
      <main class="content" id="content">${body}</main>
    </div>
    ${nav ? tabbar(page) : ''}
    ${livePill()}
    ${watchView()}
    ${page === 'conexoes' ? `<div class="selbar ${ui.sel.length ? 'show' : ''}" id="selbar">${selbar()}</div>` : ''}
    ${chatPanel()}
  </div>`;
}

function sidebar(page) {
  const act = activeAreas();
  const pend = hasArea('whatsapp') ? pendingConvos().length : 0;
  return `<aside class="side">
    ${brand('#/app')}
    <div class="biz">${bizAvatar(S.company, 'sm')}<div><b>${esc(S.business)}</b><small>${V().label}</small></div></div>
    <nav class="side-nav" aria-label="Principal">
      <a class="nav-item ${page === 'inicio' ? 'on' : ''}" href="#/app">${icon('home')}Início</a>
      <p class="nav-label">Suas áreas</p>
      ${act.map(id => `<a class="nav-item ${page === id ? 'on' : ''}" href="#/app/${id}"><span class="mico ${AREA[id].cls}">${icon(AREA[id].icon)}</span>${AREA[id].name}${id === 'whatsapp' && pend ? `<span class="count">${pend}</span>` : ''}</a>`).join('')}
      ${act.length < 4 ? `<a class="nav-item add ${page === 'adicionar' ? 'on' : ''}" href="#/app/adicionar"><span class="plus">${icon('plus')}</span>Adicionar área</a>` : ''}
    </nav>
    <div class="side-foot">
      <a class="nav-item ${page === 'atividade' ? 'on' : ''}" href="#/app/atividade">${icon('activity')}Atividade${ui.task ? '<span class="rec-dot"></span>' : ''}</a>
      <a class="nav-item ${page === 'conexoes' ? 'on' : ''}" href="#/app/conexoes">${icon('plug')}Conexões${connected().length ? `<span class="count muted">${connected().length}</span>` : ''}</a>
      <a class="nav-item ${page === 'ajustes' ? 'on' : ''}" href="#/app/ajustes">${icon('sliders')}Ajustes</a>
      <a class="wa-gerenia last" href="${waLink()}" target="_blank" rel="noopener">${icon('chat')}<span><b>Falar com a Gerenia</b><small>no WhatsApp</small></span>${icon('external', 'ext')}</a>
    </div>
  </aside>`;
}

function tabbar(page) {
  const act = activeAreas();
  return `<nav class="tabbar" aria-label="Principal">
    <a class="tab ${page === 'inicio' ? 'on' : ''}" href="#/app">${icon('home')}<span>Início</span></a>
    ${act.map(id => `<a class="tab ${page === id ? 'on' : ''}" href="#/app/${id}">${icon(AREA[id].icon)}<span>${AREA[id].name}</span>${id === 'whatsapp' && pendingConvos().length ? '<i class="dot"></i>' : ''}</a>`).join('')}
    ${act.length < 4 ? `<a class="tab ${page === 'conexoes' || page === 'adicionar' ? 'on' : ''}" href="#/app/conexoes">${icon('plug')}<span>Conexões</span></a>` : ''}
  </nav>`;
}

function afterApp(page) {
  ui.entering = false;
  ui.sideNew = false;
  document.title = `${{ inicio: 'Início', adicionar: 'Adicionar área', ajustes: 'Ajustes', conexoes: 'Conexões', atividade: 'Atividade' }[page] || AREA[page].name} · Gerenia`;
  const msgs = $('.msgs'); if (msgs) msgs.scrollTop = msgs.scrollHeight;
  const log = $('#chat-log'); if (log) log.scrollTop = log.scrollHeight;
  if (ui.watch) { if (!ui.task && ui.watch.live) ui.watch.done = true; paintWatch(); }
  if (page === 'inicio' && S.company && !S.researched) {
    const tick = () => {
      ui.rstep++;
      if (ui.rstep >= 4) { S.researched = true; ui.briefIn = true; save(); }
      render();
      if (!S.researched) later(tick, 900);
    };
    later(tick, ui.rstep ? 900 : 1100);
  } else ui.briefIn = false;
  if (ui.fresh.length) later(() => { ui.fresh = []; document.querySelectorAll('.is-fresh').forEach(e => e.classList.remove('is-fresh')); }, 2800);
}

const pageHead = (title, subtitle, end = '') => `<header class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div>${end}</header>`;
const backLink = () => '';
function sources(area) {
  return `<div class="sources"><span class="sources-label">Fontes</span>${areaApps(area).map(a => `<span class="source">${mono(a, 'xxs')}${APPS[a].name}</span>`).join('')}<a class="source add" href="#/app/conectar/${area}">${icon('plus')}Conectar</a></div>`;
}

/* ---------- Início ----------
   Briefing (1ª vez) → as quatro áreas em cartões simples → o que precisa de você. */
function home() {
  const act = activeAreas();
  const v = V();
  const n = needs();
  const p = pendingConvos().length;
  let summary = '';
  if (act.length) {
    const lead = hasArea('whatsapp')
      ? (S.waMode === 'auto' ? `A Gerenia respondeu <b>${handledToday()} conversas</b> hoje.` : S.waMode === 'assist' ? `A Gerenia preparou <b>${plural(p, 'resposta', 'respostas')}</b> para você aprovar.` : `Você tem <b>18 conversas</b> hoje, ${p} sem resposta.`)
      : hasArea('agenda') ? `Hoje tem <b>8 ${v.services}</b> na agenda.`
      : hasArea('financeiro') ? `Você recebeu <b>${brl(received())}</b> este mês.`
      : `Seus <b>214 ${v.clients}</b> estão num lugar só.`;
    summary = `${lead}${n.length ? ` ${n.length === 1 ? '<b>1 coisa</b> precisa' : `<b>${n.length} coisas</b> precisam`} de você.` : ''}`;
  }
  const researching = S.company && !S.researched;
  const next = priority().find(id => !hasArea(id));
  const card = id => {
    if (hasArea(id)) {
      const [big, sub] = stats(id);
      return `<a class="mcard ${AREA[id].cls} ${isFresh(id) ? 'is-fresh' : ''}" href="#/app/${id}">
        <div class="mcard-top"><span class="mico">${icon(AREA[id].icon)}</span><span>${AREA[id].name}</span>${icon('arrow', 'go')}</div>
        <p class="mbig">${big}</p><p class="msub">${sub}</p></a>`;
    }
    const rec = id === next;
    return `<a class="mcard invite ${AREA[id].cls} ${rec ? 'rec' : ''}" href="#/app/conectar/${id}">
      <div class="mcard-top"><span class="mico">${icon(AREA[id].icon)}</span><span>${AREA[id].name}</span></div>
      ${rec ? '<span class="rec-tag">Recomendado</span>' : ''}<p class="invite-title">${PITCH[id].title}</p>
      <span class="invite-cta">Conectar ${icon('arrow')}</span></a>`;
  };
  return `<section class="page home">
    <header class="greet">
      <h1>${greeting()}, ${esc(first(S.name))}.</h1>
      ${summary ? `<p class="summary">${icon('spark')}<span>${summary}</span></p>` : ''}
    </header>
    ${briefCard()}
    ${!researching && !act.length && (S.briefDone || !S.company) ? `<button class="brief-row guide-row" data-act="chat-guide"><span class="g-av">${mark()}</span><span><b>${L('Quer que a Gerenia te guie?', 'Want Gerenia to guide you?')}</b><small>${L('Ela pergunta o que você quer resolver e monta o caminho com você.', 'She asks what you want to solve and builds the path with you.')}</small></span><span class="link">${L('Conversar', 'Chat')} ${icon('arrow')}</span></button>` : ''}
    ${researching ? '' : `<section class="block">
      <h2 class="block-title">Suas áreas</h2>
      <div class="cards">${priority().map(card).join('')}</div>
      <p class="fine more">Já usa um sistema de gestão? <a class="link" href="#/app/conexoes">Ver conexões</a></p>
    </section>`}
    ${n.length ? `<section class="block">
      <h2 class="block-title">Precisa de você</h2>
      <ul class="needs">${n.slice(0, 3).map(needRow).join('')}</ul>
    </section>` : ''}
  </section>`;
}

function researchCard() {
  const c = S.company;
  const steps = [L(`Encontrando ${c.site}`, `Finding ${c.site}`), L(`Lendo o Instagram ${c.ig}`, `Reading Instagram ${c.ig}`), L(`Lendo ${c.reviews} avaliações no Google`, `Reading ${c.reviews} Google reviews`), L('Montando seu briefing', 'Building your briefing')];
  const k = ui.rstep;
  return `<section class="brief researching">
    <div class="ring"><span class="g-av lg">${mark()}</span></div>
    <div>
      <h2>${L(`Pesquisando a ${esc(c.name)}…`, `Researching ${esc(c.name)}…`)}</h2>
      <p class="fine">${L('Site, Instagram e Google, para montar seu briefing.', 'Website, Instagram and Google, to build your briefing.')}</p>
      <ul class="sync-list">${steps.map((t, i) => `<li class="${i < k ? 'done' : i === k ? 'doing' : ''}"><span class="st">${i < k ? icon('check') : ''}</span>${esc(t)}</li>`).join('')}</ul>
    </div>
  </section>`;
}

function briefCard() {
  const c = S.company;
  if (!c) return '';
  if (!S.researched) return researchCard();
  if (S.briefDone && !ui.briefOpen) return `<button class="brief-row" data-act="brief-open">${bizAvatar(c)}<span><b>Briefing da ${esc(c.name)}</b><small>O que a Gerenia descobriu sobre o seu negócio</small></span><span class="link">Ver ${icon('arrow')}</span></button>`;
  const b = briefing();
  return `<section class="brief ${ui.briefIn ? 'brief-in' : ''}">
    <header class="brief-head">
      <div class="brief-id">${bizAvatar(c, 'lg')}<div>
        <h2>${esc(c.name)}</h2>
        <p>${catLabel(c)} · ${icon('pin')}${c.hood}, ${c.city}</p>
        <div class="brief-links"><span>${icon('globe')}${esc(c.site)}</span><span>${icon('instagram')}${esc(c.ig)}</span><span>${icon('star')}${rating(c)} · ${c.reviews} avaliações</span></div>
      </div></div>
    </header>
    <div class="brief-grid">
      <div>
        <h3 class="block-title">O que vocês fazem</h3>
        <p class="brief-summary">${b.summary}</p>
        <div class="chips left">${catServices(c).map(x => `<span class="chip ghost">${x}</span>`).join('')}</div>
        <h3 class="block-title">O que encontramos</h3>
        <ul class="findings">${b.findings.map(([ic, src, t]) => `<li><span class="f-ico">${icon(ic)}</span><div><small>${esc(src)}</small><p>${t}</p></div></li>`).join('')}</ul>
      </div>
      <div class="guess-col">
        <h3 class="block-title">O que achamos que você precisa</h3>
        <ol class="guesses">${b.needs.map(([id, title, why], i) => `<li class="${AREA[id].cls}"><span class="g-n">${i + 1}</span><div><b>${title}</b><p>${why}</p></div></li>`).join('')}</ol>
        <p class="fine guess-note">${icon('spark')}<span>São suposições a partir de fontes públicas. <button class="link" data-act="brief-fix">Algo errado? Me conta</button></span></p>
      </div>
    </div>
    <footer class="brief-foot">
      <a class="btn lg" href="#/app/conectar/${b.needs[0][0]}" data-act="brief-go">${PITCH[b.needs[0][0]].cta} ${icon('arrow')}</a>
      <button class="btn ghost lg" data-act="brief-close">Fechar briefing</button>
      ${activeAreas().length ? '' : `<button class="link brief-guide" data-act="chat-guide">${icon('chat')}${L('Prefiro ir conversando com a Gerenia', 'I’d rather chat with Gerenia')}</button>`}
    </footer>
  </section>`;
}

function needRow(x) {
  const lead = x.av ? `<span class="av">${esc(x.av)}</span>` : `<span class="mico ${AREA[x.area].cls}">${icon(x.icon)}</span>`;
  const main = `<div class="need-main"><b>${esc(x.title)}</b><small><span class="dot-mod ${AREA[x.area].cls}"></span>${AREA[x.area].name} · ${esc(x.sub)}</small></div>`;
  if (x.action) return `<li class="need">${lead}${main}<button class="btn soft sm" data-act="${x.action[0]}" data-id="${esc(x.action[1])}">${x.action[2]}</button></li>`;
  return `<li><a class="need" href="${x.href}">${lead}${main}${icon('arrow', 'go')}</a></li>`;
}

/* ---------- Atividade ---------- */
function activity() {
  const list = tasks();
  return `<section class="page narrow">
    ${backLink()}
    ${pageHead('Atividade', 'Tudo o que a Gerenia fez nos seus sistemas. Ela só age quando você pede ou aprova.')}
    ${ui.task ? `<button class="live-card" data-act="watch-open"><span class="rec-dot"></span><span><b>Agora no ${APPS[ui.task.app].name}</b><small>${esc(ui.task.title)}</small></span><span class="btn sm">${icon('play')}Assistir</span></button>` : ''}
    <div class="via-explainer">${Object.entries(VIA).map(([k, v]) => `<div class="via-card"><span class="via-ico via-${k}">${icon(v.icon)}</span><div><b>${v.name}</b><p>${v.desc}</p></div></div>`).join('')}</div>
    <section class="block">
      <h2 class="block-title">Hoje</h2>
      ${list.length ? `<ul class="rows">${list.map(taskRow).join('')}</ul>` : `<div class="all-clear">${icon('activity')}<span>Nada por aqui ainda. Peça algo à Gerenia, como “remarca a Julia para quinta”.</span></div>`}
    </section>
  </section>`;
}

/* ---------- Adicionar área ---------- */
function catalog() {
  const missing = AREAS.filter(id => !hasArea(id));
  return `<section class="page narrow">
    ${pageHead('Adicionar uma área', 'Cada área entra no seu painel já funcionando. Escolha a que mais toma seu tempo.')}
    ${missing.length ? `<div class="catalog">${missing.map(id => `<a class="cat-item ${AREA[id].cls}" href="#/app/conectar/${id}">
      <span class="mico lg">${icon(AREA[id].icon)}</span><div><b>${AREA[id].name}</b><p>${AREA[id].pitch}</p></div>${icon('arrow', 'go')}</a>`).join('')}</div>`
      : `<div class="all-clear">${icon('check')}<span>Você já tem todas as áreas.</span></div>`}
    <a class="conn-row" href="#/app/conexoes"><span class="mico">${icon('plug')}</span><span class="conn-text"><b>Prefere escolher pelos apps?</b><small>Veja todos os sistemas que a Gerenia conecta</small></span><span class="link">Conexões ${icon('arrow')}</span></a>
  </section>`;
}

/* ---------- Conexões ---------- */
function connections() {
  const apps = connected();
  return `<section class="page">
    ${backLink()}
    ${pageHead('Conexões', 'Conecte quantos sistemas quiser. A Gerenia centraliza os dados e analisa tudo com IA.')}
    <section class="block first">
      <h2 class="block-title">Conectados${apps.length ? ` · ${apps.length}` : ''}</h2>
      ${apps.length ? `<ul class="rows">${apps.map(a => `<li class="row-item">${mono(a)}<div class="row-main"><b>${APPS[a].name} ${viaTag(a)}</b><small>Alimenta ${join(APPS[a].feeds.map(f => AREA[f].name))}</small></div>
        <div class="row-end">${ui.confirm === a ? `<span class="confirm-q">Desconectar?</span><button class="btn sm danger" data-act="disc-yes" data-id="${a}">Sim</button><button class="btn ghost sm" data-act="disc-no">Não</button>` : `<span class="tag ok hide-xs">${icon('check')}Sincronizado</span><button class="btn ghost sm" data-act="disc-ask" data-id="${a}">Desconectar</button>`}</div></li>`).join('')}</ul>`
        : `<div class="all-clear">${icon('plug')}<span>Nenhum app conectado ainda. Escolha abaixo, pode ser mais de um.</span></div>`}
    </section>
    <section class="block">
      <h2 class="block-title">Adicionar apps</h2>
      <div class="via-explainer compact">${Object.entries(VIA).map(([k, v]) => `<div class="via-card"><span class="via-ico via-${k}">${icon(v.icon)}</span><div><b>${v.name}</b><p>${v.desc}</p></div></div>`).join('')}</div>
      <div class="toolbar">
        <label class="search">${icon('search')}<input data-input="appq" value="${esc(ui.appq)}" placeholder="Buscar app ou categoria" aria-label="Buscar app"></label>
      </div>
      <div class="cat-chips" role="tablist">${cats().map(([k, l]) => `<button role="tab" data-act="cat" data-v="${k}" class="${ui.cat === k ? 'on' : ''}" aria-selected="${ui.cat === k}">${l}</button>`).join('')}</div>
      <ul class="app-grid" id="app-grid">${appGrid()}</ul>
    </section>
  </section>`;
}
function appGrid() {
  const term = ui.appq.trim().toLowerCase();
  const catName = k => (cats().find(c => c[0] === k) || [])[1] || '';
  const list = Object.keys(APPS)
    .filter(a => !APPS[a].native && !isOn(a))
    .filter(a => ui.cat === 'all' || APPS[a].cat === ui.cat)
    .filter(a => !term || `${APPS[a].name} ${APPS[a].hint} ${catName(APPS[a].cat)}`.toLowerCase().includes(term))
    .sort((a, b) => (fitsSector(b) - fitsSector(a)) || ((APPS[b].sectors ? 1 : 0) - (APPS[a].sectors ? 1 : 0)) || ((APPS[a].soon ? 1 : 0) - (APPS[b].soon ? 1 : 0)));
  if (!list.length) return `<li class="app-empty">Nenhum app encontrado.</li>`;
  return list.map(a => {
    const x = APPS[a], on = ui.sel.includes(a);
    return `<li><button class="app-card" ${x.soon ? 'disabled' : ''} role="checkbox" aria-checked="${on}" data-act="pick-app" data-v="${a}">
      ${mono(a)}<span class="app-info"><b>${x.name}</b><small>${x.soon ? 'Em breve' : x.hint}</small>
      <span class="feeds">${x.feeds.map(f => `<i class="${AREA[f].cls}">${AREA[f].name}</i>`).join('')}${x.soon ? '' : viaTag(a, 'inline')}</span></span>
      <span class="check">${icon('check')}</span></button></li>`;
  }).join('');
}
function selbar() {
  const n = ui.sel.length;
  return `<span class="mstack">${ui.sel.map(a => mono(a, 'xs')).join('')}</span><span class="sel-text">${plural(n, 'app selecionado', 'apps selecionados')}</span>
    <button class="btn ghost sm" data-act="sel-clear">Limpar</button><button class="btn sm" data-act="sel-go">Conectar ${n > 1 ? n + ' apps' : ''} ${icon('arrow')}</button>`;
}

/* ---------- Páginas das áreas ---------- */
function areaPage(id, sub) {
  return { whatsapp: waPage, clientes: clientsPage, agenda: agendaPage, financeiro: financePage }[id](sub);
}

function waPage(cid) {
  const all = convos();
  const pend = pendingConvos();
  const mode = S.waMode;
  const cur = all.find(c => c.id === cid);
  const tabLabel = { auto: 'Precisam de você', assist: 'Para aprovar', off: 'Sem resposta' }[mode];
  const list = ui.watab === 'all' ? all : pend;
  return `<section class="page wide">
    ${pageHead('WhatsApp', '(11) 98765-4321 · 18 conversas hoje', '<span class="status">Conectado</span>')}
    <div class="mode-bar">
      <div class="seg" role="radiogroup" aria-label="Modo do agente">${Object.entries(MODES).map(([k, m]) => `<button role="radio" aria-checked="${mode === k}" class="${mode === k ? 'on' : ''}" data-act="wa-mode" data-v="${k}">${icon(m[2])}${m[0]}</button>`).join('')}</div>
      <p class="mode-desc">${MODES[mode][1]}</p>
    </div>
    <div class="seg small" role="tablist">
      <button role="tab" data-act="watab" data-v="pend" class="${ui.watab !== 'all' ? 'on' : ''}" aria-selected="${ui.watab !== 'all'}">${tabLabel}${pend.length ? ` <b>${pend.length}</b>` : ''}</button>
      <button role="tab" data-act="watab" data-v="all" class="${ui.watab === 'all' ? 'on' : ''}" aria-selected="${ui.watab === 'all'}">Todas</button>
    </div>
    <div class="inbox ${cur ? 'has-thread' : ''}">
      <ul class="convos">${list.length ? list.map(c => convoRow(c, cur)).join('') : `<li class="convos-empty">${icon('check')}<p>Nada esperando você.</p><button class="link" data-act="watab" data-v="all">Ver todas</button></li>`}</ul>
      <div class="thread">${cur ? thread(cur) : `<div class="thread-empty"><div>${icon('chat')}<p>Escolha uma conversa.</p><small>As que precisam de você aparecem primeiro.</small></div></div>`}</div>
    </div>
  </section>`;
}
const isPending = c => pendingConvos().some(p => p.id === c.id);
function threadMsgs(c) {
  if (S.waMode === 'auto') return c.msgs;
  return MANUAL.includes(c.id) ? c.msgs.slice(0, 1) : c.msgs.map(m => m[0] === 'g' ? ['me', m[1]] : m);
}
function convoRow(c, cur) {
  const replies = S.replies[c.id] || [];
  const ins = threadMsgs(c).filter(m => m[0] === 'in');
  const last = replies.length ? `Você: ${replies[replies.length - 1]}` : ins[ins.length - 1][1];
  const mode = S.waMode, pend = isPending(c);
  const tag = pend ? (mode === 'auto' ? `<span class="tag warn">${esc(c.need)}</span>` : mode === 'assist' ? `<span class="tag info">${icon('edit')}Sugestão pronta</span>` : '<span class="tag warn">Sem resposta</span>')
    : replies.length ? `<span class="tag muted">${icon('check')}Respondida por você</span>`
    : mode === 'auto' ? `<span class="tag ok">${icon('check')}Gerenia · ${esc(c.done)}</span>` : `<span class="tag muted">${icon('check')}Respondida</span>`;
  return `<li><a class="convo ${cur?.id === c.id ? 'on' : ''}" href="#/app/whatsapp/${c.id}"><span class="av">${initials(c.name)}</span><div class="convo-main"><div class="convo-top"><b>${c.name}</b><time>${c.time}</time></div><p>${esc(last)}</p>${tag}</div></a></li>`;
}
function thread(c) {
  const replies = S.replies[c.id] || [];
  const pend = isPending(c), mode = S.waMode;
  const draft = (c.quick || [])[0];
  const bubble = m => m[0] === 'in' ? `<div class="bubble">${esc(m[1])}</div>` : m[0] === 'g' ? `<div class="bubble g"><small>Gerenia</small>${esc(m[1])}</div>` : `<div class="bubble me"><small>Você</small>${esc(m[1])}</div>`;
  let foot = '';
  if (pend && mode === 'auto') foot = `<div class="handoff">${icon('bell')}<p><b>A Gerenia chamou você:</b> ${esc(c.need.toLowerCase())}. Responda e ela continua daqui.</p></div>
    <div class="quick">${c.quick.map(t => `<button data-act="quick" data-id="${c.id}" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
  if (pend && mode === 'assist') foot = `<div class="draft"><p class="draft-label">${icon('spark')}Sugestão da Gerenia</p><p class="draft-text">${esc(draft)}</p>
    <div class="row"><button class="btn sm" data-act="quick" data-id="${c.id}" data-v="${esc(draft)}">${icon('send')}Enviar</button><button class="btn ghost sm" data-act="edit-draft" data-v="${esc(draft)}">${icon('edit')}Editar</button></div></div>`;
  if (pend && mode === 'off') foot = `<div class="handoff info">${icon('eye')}<p><b>Resumo da Gerenia:</b> ${esc(c.sum)}</p><button class="btn soft sm" data-act="edit-draft" data-v="${esc(draft)}">Sugerir resposta</button></div>`;
  if (!pend && replies.length) foot = `<div class="handoff ok">${icon('check')}<p>Respondida. ${mode === 'auto' ? 'A Gerenia continua acompanhando.' : 'A Gerenia salvou no histórico do cliente.'}</p></div>`;
  return `<div class="thread-head">
      <a class="icon-btn back" href="#/app/whatsapp" aria-label="Voltar">${icon('back')}</a>
      <span class="av">${initials(c.name)}</span><div><b>${c.name}</b><small>${cap(V().client)} · última mensagem ${c.time}</small></div>
    </div>
    <div class="msgs">${threadMsgs(c).map(bubble).join('')}${replies.map(t => bubble(['me', t])).join('')}</div>
    ${foot}
    <form class="composer" data-form="reply" data-id="${c.id}">
      <input name="t" placeholder="Escreva uma resposta…" autocomplete="off" aria-label="Mensagem para ${c.name}">
      <button class="btn" aria-label="Enviar">${icon('send')}</button>
    </form>`;
}

function clientsPage() {
  const v = V();
  const segs = segments();
  const tab = (k, l) => `<button role="tab" data-act="ctab" data-v="${k}" class="${ui.ctab === k ? 'on' : ''}" aria-selected="${ui.ctab === k}">${l}</button>`;
  const f = (k, l) => `<button role="tab" data-act="filter" data-v="${k}" class="${ui.filter === k ? 'on' : ''}" aria-selected="${ui.filter === k}">${l}</button>`;
  const people = `
    <section class="block first">
      <h2 class="block-title with-icon">${icon('spark')}A Gerenia analisou sua base</h2>
      <div class="insights">${['away', 'bday', 'new'].map(k => `<div class="insight"><span class="mico">${icon(segs[k].icon)}</span><b>${segs[k].n}</b><p>${v.clients} ${segs[k].label}</p><a class="link" href="#/app/clientes/campanha/${k}">${segs[k].cta} ${icon('arrow')}</a></div>`).join('')}</div>
    </section>
    <section class="block">
      <div class="toolbar">
        <label class="search">${icon('search')}<input data-input="q" value="${esc(ui.q)}" placeholder="Buscar por nome" aria-label="Buscar ${v.clients}"></label>
        <div class="seg" role="tablist">${f('todos', 'Todos')}${f('new', 'Novos')}${f('away', 'Sumidos')}</div>
      </div>
      <ul class="rows" id="people">${peopleRows()}</ul>
      ${ui.filter === 'todos' ? `<p class="fine more">Mostrando ${clients().length} de 214.</p>` : ''}
    </section>`;
  const wa = isOn('whatsapp');
  const campaigns = `
    <section class="block first">
      <div class="block-head"><h2 class="block-title">Campanhas</h2><a class="btn sm" href="#/app/clientes/campanha/away">${icon('plus')}Nova campanha</a></div>
      ${S.campaigns.length ? `<ul class="rows">${S.campaigns.map(campRow).join('')}</ul>` : `<div class="all-clear">${icon('megaphone')}<span>Nenhuma campanha ainda. A Gerenia escreve a primeira pra você.</span></div>`}
    </section>
    <section class="block">
      <h2 class="block-title">Ações automáticas</h2>
      <ul class="rows">${autos().map(([k, t, d, ic]) => `<li class="row-item"><span class="mico">${icon(ic)}</span><div class="row-main"><b>${t}</b><small>${d}</small></div>
        <button class="switch" role="switch" aria-checked="${!!S.autos[k] && wa}" aria-label="${t}" data-act="auto" data-id="${k}" ${wa ? '' : 'disabled'}><i></i></button></li>`).join('')}</ul>
      ${wa ? '' : `<p class="note">${icon('chat')}<span>Campanhas e ações são enviadas pelo WhatsApp. <a class="link" href="#/app/conectar/whatsapp">Conectar WhatsApp</a></span></p>`}
    </section>`;
  return `<section class="page clientes">
    ${pageHead(cap(v.clients), `214 no total · reunidos de ${plural(areaApps('clientes').length, 'fonte', 'fontes')}`)}
    ${sources('clientes')}
    <div class="seg tabs" role="tablist">${tab('pessoas', cap(v.clients))}${tab('campanhas', 'Campanhas e ações')}</div>
    ${ui.ctab === 'campanhas' ? campaigns : people}
  </section>`;
}
function campRow(c) {
  const sub = c.status === 'sending' ? '<span class="tag info">Enviando…</span>'
    : c.status === 'scheduled' ? `<span class="tag muted">${icon('clock')}Agendada · amanhã às 9h</span>`
    : `<span class="camp-stats"><span><b>${c.n}</b> enviadas</span><span><b>${c.replied}</b> responderam</span><span><b>${c.booked}</b> agendaram</span></span>`;
  return `<li class="row-item camp"><span class="mico">${icon('megaphone')}</span><div class="row-main"><b>${esc(c.title)}</b><small>${esc(c.when)}</small></div><div class="row-end">${sub}</div></li>`;
}
function peopleRows() {
  const wa = isOn('whatsapp');
  const term = ui.q.trim().toLowerCase();
  const rows = clients().filter(c => (ui.filter === 'todos' || c[2] === ui.filter) && c[0].toLowerCase().includes(term));
  if (!rows.length) return `<li class="row-item empty-row">Ninguém encontrado.</li>`;
  const src = areaApps('clientes').map(a => APPS[a].name);
  return rows.map(c => {
    const i = clients().indexOf(c);
    const tag = c[2] === 'new' ? '<span class="tag info">Novo</span>' : c[2] === 'away' ? '<span class="tag warn">Sumido</span>' : '';
    const act = c[2] === 'away' && wa ? (S.done['w:' + c[0]] ? `<span class="tag ok">${icon('check')}Gerenia chamou</span>` : `<button class="btn soft sm" data-act="winback" data-id="${c[0]}">Chamar de volta</button>`) : '';
    return `<li class="row-item"><span class="av">${initials(c[0])}</span><div class="row-main"><b>${c[0]}</b><small>Última visita: ${c[1].toLowerCase()} · ${src[i % src.length]}</small></div><div class="row-end">${tag}${act}</div></li>`;
  }).join('');
}

function agendaPage() {
  const v = V();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const slots = slotsFor(ui.day);
  const wa = isOn('whatsapp');
  const status = s => s === 'ok' ? `<span class="tag ok">${icon('check')}${wa ? 'Confirmado pela Gerenia' : 'Confirmado'}</span>`
    : s === 'wait' ? `<span class="tag warn">${wa ? 'Gerenia lembra às 18h' : 'Sem confirmação'}</span>`
    : s === 'moved' ? `<span class="tag info">${icon('check')}Remarcada para qui, 16:30</span>`
    : `<span class="tag info">${wa ? 'Novo · marcado no WhatsApp' : 'Novo'}</span>`;
  return `<section class="page">
    ${pageHead('Agenda', `${plural(8, v.service, v.services)} hoje`)}
    ${sources('agenda')}
    <div class="days" role="tablist">${days.map((d, i) => `<button class="day ${ui.day === i ? 'on' : ''}" data-act="day" data-v="${i}" role="tab" aria-selected="${ui.day === i}"><small>${i === 0 ? 'Hoje' : d.toLocaleDateString(loc(), { weekday: 'short' }).replace('.', '')}</small><b>${d.getDate()}</b></button>`).join('')}</div>
    <p class="block-title day-title">${plural(slots.length, v.service, v.services)}</p>
    ${slots.length ? `<ul class="rows">${slots.map(s => `<li class="row-item slot"><time>${s[0]}</time><div class="row-main"><b>${s[1]}</b><small>${cap(v.service)} · ${s[3]}</small></div>${status(s[2])}</li>`).join('')}</ul>`
      : `<div class="all-clear">${icon('calendar')}<span>Nenhum horário neste dia.</span></div>`}
    ${wa ? `<p class="note">${icon('spark')}<span>A Gerenia confirma cada horário pelo WhatsApp um dia antes e encaixa quem quer remarcar.</span></p>`
      : `<p class="note">${icon('spark')}<span>Com o WhatsApp conectado, a Gerenia confirma cada horário por você. <a class="link" href="#/app/conectar/whatsapp">Conectar</a></span></p>`}
  </section>`;
}

function financePage() {
  const open = openBills();
  const paidNow = BILLS().filter(b => S.done['p:' + b[0]]).map(b => [b[0], b[1], 'Agora · marcado por você']);
  const wa = isOn('whatsapp');
  return `<section class="page">
    ${pageHead('Financeiro', `Recebimentos e cobranças de ${monthName()}`)}
    ${sources('financeiro')}
    <div class="stats">
      <div class="stat"><small>Recebido em ${monthName()}</small><b>${brl(received())}</b><span class="delta">+12% vs. ${monthName(-1)}</span></div>
      <div class="stat"><small>A receber</small><b>${brl(open.reduce((t, b) => t + b[1], 0))}</b><span class="fine">${plural(open.length, 'pagamento', 'pagamentos')}</span></div>
    </div>
    <section class="block">
      <h2 class="block-title">Em aberto</h2>
      ${open.length ? `<ul class="rows">${open.map(b => `<li class="row-item"><span class="av">${initials(b[0])}</span><div class="row-main"><b>${b[0]}</b><small class="${b[3] ? 'late' : ''}">${b[2]}</small></div><div class="row-end"><span class="amount">${brl(b[1])}</span>
        ${wa ? (S.done['r:' + b[0]] ? `<span class="tag ok">${icon('check')}Lembrete enviado</span>` : `<button class="btn soft sm" data-act="remind" data-id="${b[0]}">Lembrar</button>`) : `<button class="btn ghost sm" data-act="paid" data-id="${b[0]}">Marcar pago</button>`}
      </div></li>`).join('')}</ul>` : `<div class="all-clear">${icon('check')}<span>Nada em aberto.</span></div>`}
      ${wa ? '' : `<p class="note">${icon('spark')}<span>Com o WhatsApp conectado, a Gerenia lembra quem falta pagar. <a class="link" href="#/app/conectar/whatsapp">Conectar</a></span></p>`}
    </section>
    <section class="block">
      <h2 class="block-title">Últimos recebimentos</h2>
      <ul class="rows">${[...paidNow, ...PAID()].map(b => `<li class="row-item"><span class="av">${initials(b[0])}</span><div class="row-main"><b>${b[0]}</b><small>${b[2]}</small></div><span class="amount in">+ ${brl(b[1])}</span></li>`).join('')}</ul>
    </section>
  </section>`;
}

/* ---------- Ajustes ---------- */
const TONES = {
  acolhedora: ['Acolhedora', 'Próxima e calorosa', 'Oi! Que bom falar com você 😊 Amanhã tenho 10h ou 15h30. Qual fica melhor?'],
  direta: ['Direta', 'Curta e objetiva', 'Oi! Amanhã: 10h ou 15h30. Qual prefere?'],
  formal: ['Formal', 'Educada e profissional', 'Olá, tudo bem? Para amanhã temos disponibilidade às 10h ou às 15h30. Qual horário prefere?'],
};
function settings() {
  const apps = connected();
  return `<section class="page narrow">
    ${backLink()}
    ${pageHead('Ajustes', 'Seu espaço, o jeito da Gerenia e a aparência.')}
    <section class="block first">
      <h2 class="block-title">Seu negócio</h2>
      <ul class="rows">
        <li class="row-item"><div class="row-main"><small>Você</small><b>${esc(S.name)}</b></div></li>
        <li class="row-item"><div class="row-main"><small>Negócio</small><b>${esc(S.business)}</b>${S.company ? `<small>${catLabel(S.company)} · ${esc(S.company.site)} · ${esc(S.company.ig)}</small>` : ''}</div><span class="tag muted">${V().label}</span></li>
        ${S.company ? `<li class="row-item"><span class="swatch" style="background:${S.company.brand}"></span><div class="row-main"><small>Cor da marca</small><b>${S.company.brand.toUpperCase()}</b><small>Puxada do seu Instagram. Aparece no seu espaço.</small></div></li>` : ''}
        <li class="row-item"><a class="wa-gerenia flat" href="${waLink()}" target="_blank" rel="noopener">${icon('chat')}<span><b>Falar com a Gerenia no WhatsApp</b><small>Peça coisas para ela de onde estiver</small></span>${icon('external', 'ext')}</a></li>
      </ul>
    </section>
    <section class="block">
      <h2 class="block-title">Jeito da Gerenia falar</h2>
      <div class="seg" role="radiogroup" aria-label="Tom">${Object.entries(TONES).map(([k, t]) => `<button role="radio" data-act="tone" data-v="${k}" class="${S.tone === k ? 'on' : ''}" aria-checked="${S.tone === k}">${t[0]}</button>`).join('')}</div>
      <div class="preview-chat"><div class="bubble">Oi, vocês têm horário amanhã?</div><div class="bubble g"><small>Gerenia</small>${TONES[S.tone][2]}</div></div>
    </section>
    <section class="block">
      <h2 class="block-title">Conexões</h2>
      <a class="conn-row flat" href="#/app/conexoes"><span class="mstack">${apps.map(a => mono(a, 'xs')).join('') || `<span class="mico">${icon('plug')}</span>`}</span><span class="conn-text"><b>${apps.length ? plural(apps.length, 'app conectado', 'apps conectados') : 'Nenhum app conectado'}</b><small>Conectar, ver e desconectar sistemas</small></span>${icon('arrow', 'go')}</a>
    </section>
    <section class="block">
      <h2 class="block-title">Aparência</h2>
      <div class="seg" role="radiogroup" aria-label="Tema">
        <button role="radio" data-act="theme-set" data-v="light" class="${S.theme === 'light' ? 'on' : ''}" aria-checked="${S.theme === 'light'}">${icon('sun')} Claro</button>
        <button role="radio" data-act="theme-set" data-v="dark" class="${S.theme === 'dark' ? 'on' : ''}" aria-checked="${S.theme === 'dark'}">${icon('moon')} Escuro</button>
      </div>
    </section>
    <section class="block">
      <h2 class="block-title">Demonstração</h2>
      <p class="fine para">Protótipo com dados fictícios. Nenhuma conta, mensagem ou integração real é criada.</p>
      <div class="row-btns">
        <button class="btn ghost sm" data-act="reset">${icon('refresh')}Recomeçar do zero</button>
        <a class="btn ghost sm" href="#/demo/4">Ver com tudo conectado</a>
        <a class="btn ghost sm" href="#/">Ver o site</a>
      </div>
    </section>
  </section>`;
}

/* ---------- Fluxo de conexão ----------
   #/app/conectar/<area>          escolhe apps para uma área (WhatsApp vai direto)
   #/app/conectar/apps/<a,b,c>    conecta uma lista de apps de uma vez */
function renderFlow(r) {
  const key = r.slice(2).join('/');
  if (ui.flow?.key !== key) {
    const before = activeAreas();
    if (r[2] === 'apps') {
      const queue = (r[3] || '').split(',').filter(a => APPS[a] && !APPS[a].soon && !isOn(a));
      if (!queue.length) return location.replace('#/app/conexoes');
      ui.flow = { key, kind: 'apps', queue, idx: 0, mode: S.waMode, before, needsLogin: !S.signedIn, loginDone: false };
    } else if (AREA[r[2]]) {
      if (r[2] === 'whatsapp' && isOn('whatsapp')) return location.replace('#/app/whatsapp');
      ui.flow = { key, kind: 'area', area: r[2], queue: r[2] === 'whatsapp' ? ['whatsapp'] : null, sel: [], idx: 0, mode: S.waMode, before, needsLogin: !S.signedIn, loginDone: false };
    } else return location.replace('#/app/conexoes');
  }
  root.innerHTML = flowView();
  afterFlow();
}
function flowSteps(f) {
  const s = [];
  if (f.needsLogin && !f.loginDone) s.push('login');
  if (f.kind === 'area' && f.area !== 'whatsapp') s.push('pick');
  (f.queue || f.sel).forEach(a => { if (a === 'whatsapp') s.push('qr', 'mode'); else if (!APPS[a].native) s.push('auth:' + a); });
  s.push('sync', 'done');
  return s;
}
const PERM = { clientes: () => `Ver o cadastro de ${V().clients}`, agenda: () => 'Ver e atualizar horários', financeiro: () => 'Ver recebimentos e cobranças', whatsapp: () => 'Ler e responder conversas' };
function syncLine(a) {
  if (a === 'whatsapp') return ['WhatsApp', 'lendo conversas e contatos'];
  if (APPS[a].via === 'browser') return [APPS[a].name, `abrindo pelo navegador e lendo ${join(APPS[a].feeds.map(f => ({ clientes: V().clients, agenda: 'horários', financeiro: 'recebimentos' }[f])))}`];
  if (APPS[a].native) return [APPS[a].name, 'criando do zero'];
  const w = { clientes: V().clients, agenda: 'horários', financeiro: 'recebimentos' };
  return [APPS[a].name, `lendo ${join(APPS[a].feeds.map(f => w[f]))}`];
}

function flowView() {
  const f = ui.flow, steps = flowSteps(f), step = steps[f.idx];
  const pct = ((f.idx + 1) / steps.length) * 100;
  const area = f.kind === 'area' ? AREA[f.area] : null;
  const cls = area ? area.cls : 'm-pl';
  const label = area ? area.name : f.queue.length > 1 ? 'Conexões' : APPS[f.queue[0]].name;
  const back = f.kind === 'area' && f.area !== 'whatsapp' && hasArea(f.area) ? `#/app/${f.area}` : f.kind === 'apps' ? '#/app/conexoes' : '#/app';
  let body = '';

  if (step === 'login') body = `<div class="flow-narrow auth connect-login">
    <span class="mico lg">${icon('lock')}</span>
    <p class="eyebrow">${L('Seu painel já está pronto', 'Your dashboard is already ready')}</p>
    <h1>${L('Entre para conectar seus sistemas.', 'Sign in to connect your systems.')}</h1>
    <p class="lead">${L(`Vamos salvar o diagnóstico da ${esc(S.business)} e manter suas conexões seguras.`, `We’ll save ${esc(S.business)}’s diagnosis and keep your connections secure.`)}</p>
    <div class="stack">
      <button class="oauth" data-act="flow-login"><span class="g-logo">G</span>${L('Continuar com Google', 'Continue with Google')}</button>
      <button class="oauth" data-act="flow-login">${icon('mail')}${L('Continuar com e-mail', 'Continue with email')}</button>
    </div>
    <p class="fine">${icon('lock')}${L('Demonstração: nenhuma conta ou integração real é criada.', 'Demo: no real account or integration is created.')}</p>
  </div>`;

  if (step === 'pick') {
    const opts = area.options.filter(fitsSector);
    body = `<div class="flow-narrow">
      <span class="mico lg">${icon(area.icon)}</span>
      <h1>${area.question()}</h1>
      <p class="lead">Escolha um ou mais. A Gerenia junta tudo na área ${area.name}.</p>
      <div class="options" role="group">${opts.map(a => { const on = isOn(a); return `<button class="option ${APPS[a].native ? 'none' : ''}" role="checkbox" aria-checked="${on || f.sel.includes(a)}" ${on ? 'disabled' : ''} data-act="pick" data-v="${a}">
        ${mono(a)}<div><b>${APPS[a].name}</b><small>${on ? 'Já conectado' : APPS[a].hint}${!on && APPS[a].feeds.length > 1 ? ` · também alimenta ${join(APPS[a].feeds.filter(x => x !== f.area).map(x => AREA[x].name))}` : ''}</small></div><span class="radio sq">${icon('check')}</span></button>`; }).join('')}</div>
      <a class="link more-link" href="#/app/conexoes">Não achou? Ver todos os apps ${icon('arrow')}</a>
      <div class="flow-foot"><button class="btn lg" data-act="flow-next" ${f.sel.length ? '' : 'disabled'}>${f.sel.length > 1 ? `Conectar ${f.sel.length} apps` : 'Conectar'} ${icon('arrow')}</button></div>
    </div>`;
  }

  if (step === 'qr') body = `<div class="flow-grid">
    <div>
      <span class="mico lg m-wa">${icon('chat')}</span>
      <h1>Conecte seu WhatsApp</h1>
      <p class="lead">Igual ao WhatsApp Web. Seu número continua o mesmo, e seus contatos viram sua base de clientes na Gerenia.</p>
      <ol class="howto"><li><span>Abra o WhatsApp no celular</span></li><li><span>Toque em <b>Aparelhos conectados</b></span></li><li class="desk"><span>Aponte a câmera para o código</span></li><li class="mob"><span>Escolha <b>Conectar com número</b> e digite o código</span></li></ol>
    </div>
    <div class="qr-box">
      ${qr()}
      <div class="pair"><small>Seu código</small><b>GRN4-7K2Q</b></div>
      <button class="btn lg" data-act="flow-next">Já conectei</button>
      <p class="fine">${icon('lock')}Demonstração: nenhum WhatsApp real é conectado.</p>
    </div>
  </div>`;

  if (step === 'mode') body = `<div class="flow-narrow m-wa">
    <h1>Como a Gerenia deve agir no WhatsApp?</h1>
    <p class="lead">Você pode mudar quando quiser, na própria aba do WhatsApp.</p>
    <div class="options" role="radiogroup">${Object.entries(MODES).map(([k, m]) => `<button class="option" role="radio" aria-checked="${f.mode === k}" data-act="flow-mode" data-v="${k}"><span class="mode-ico sm">${icon(m[2])}</span><div><b>${m[0]}${k === 'assist' ? ' <span class="tag info">Recomendado</span>' : ''}</b><small>${m[1]}</small></div><span class="radio">${icon('check')}</span></button>`).join('')}</div>
    <div class="preview-chat" aria-live="polite"><p class="block-title">Como fica</p><div class="bubble">Oi, vocês têm horário amanhã?</div>
      ${f.mode === 'auto' ? `<div class="bubble g"><small>Gerenia</small>${TONES[S.tone][2]}</div>`
        : f.mode === 'assist' ? `<div class="draft mini"><p class="draft-label">${icon('spark')}Sugestão da Gerenia</p><p class="draft-text">${TONES[S.tone][2]}</p><div class="row"><span class="pill">Enviar</span><span class="pill ghost">Editar</span></div></div>`
        : `<p class="fine">${icon('eye')}A Gerenia não responde. Ela salva o contato e resume: “quer horário amanhã”.</p>`}
    </div>
    <div class="flow-foot"><button class="btn ghost lg" data-act="flow-back">Voltar</button><button class="btn lg" data-act="flow-next">Continuar ${icon('arrow')}</button></div>
  </div>`;

  if (step?.startsWith('auth:')) {
    const a = step.slice(5), x = APPS[a];
    const q = f.queue, pos = q.indexOf(a) + 1;
    body = `<div class="flow-narrow auth">
      ${q.length > 1 ? `<p class="eyebrow">App ${pos} de ${q.length}</p>` : ''}
      <div class="auth-logos">${mono(a, 'lg')}<span class="auth-link">${icon('arrow')}</span><span class="mono lg gmark">${mark()}</span></div>
      <h1>Conectar ${x.name} à Gerenia</h1>
      <p class="via-line">${viaTag(a)} ${x.via === 'browser' ? `O ${x.name} não tem integração aberta, então a Gerenia opera pelo navegador, com o seu acesso.` : `A Gerenia usa a integração oficial do ${x.name}.`}</p>
      ${x.via === 'browser' ? `<div class="bw mini-login">
          <div class="bw-bar"><span class="dots"><i></i><i></i><i></i></span><span class="bw-url">${icon('lock')}app.${x.name.toLowerCase().replace(/[^a-z]/g, '')}.com.br/login</span></div>
          <div class="login-body"><span class="mono" style="background:${x.color}">${x.mono}</span><b>Entrar no ${x.name}</b><span class="fake-input">${first(S.name).toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') || 'voce'}@${S.business.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '').slice(0, 16) || 'clinica'}.com.br</span><span class="fake-input">••••••••••</span></div>
        </div>
        <p class="lead small">Você entra uma vez nesta janela segura. A Gerenia guarda a sessão, nunca a sua senha.</p>`
      : `<p class="lead">Você entra na sua conta ${x.name} e autoriza o acesso. A Gerenia vai poder:</p>`}
      <ul class="checks perm">${x.feeds.map(fd => `<li>${icon('check')}${PERM[fd]()}</li>`).join('')}<li>${icon('check')}Agir só quando você pedir ou aprovar</li>${x.via === 'browser' ? `<li>${icon('eye')}Você assiste tudo ao vivo ou depois</li>` : ''}</ul>
      <p class="fine">${icon('lock')}Desconecte quando quiser, em Conexões.</p>
      <div class="flow-foot"><button class="btn lg" data-act="flow-next">${x.via === 'browser' ? `Entrar no ${x.name}` : `Autorizar ${x.name}`} ${icon('arrow')}</button></div>
    </div>`;
  }

  if (step === 'sync') {
    const items = [...f.queue.map(syncLine), ['Gerenia', 'analisando tudo com IA']];
    const k = f.sync || 0;
    body = `<div class="sync">
      <div class="ring"><span class="g-av lg">${mark()}</span></div>
      <h1>Juntando tudo…</h1>
      <ul class="sync-list">${items.map((t, i) => `<li class="${i < k ? 'done' : i === k ? 'doing' : ''}"><span class="st">${i < k ? icon('check') : ''}</span><span><b>${t[0]}</b> · ${t[1]}</span></li>`).join('')}</ul>
    </div>`;
  }

  if (step === 'done') {
    const added = f.newAreas || [];
    const names = f.queue.map(a => APPS[a].name);
    const touched = [...new Set(f.queue.flatMap(a => APPS[a].feeds))];
    body = `<div class="done-view">
      <span class="burst">${icon('check')}</span>
      <h1>${f.queue.length > 1 ? `${f.queue.length} apps conectados!` : `${names[0]} conectado!`}</h1>
      ${f.queue.includes('whatsapp') ? `<p class="lead">Seus contatos viraram sua base de ${V().clients}, e a Gerenia já está <b>${MODES[S.waMode][3]}</b>.</p>` : `<p class="lead">${join(names)} ${names.length > 1 ? 'agora alimentam' : 'agora alimenta'} ${join(touched.map(t => AREA[t].name))}.</p>`}
      ${added.length ? `<p class="block-title">Novo no seu painel</p><div class="chips">${added.map(id => `<span class="chip ${AREA[id].cls}"><span class="mico">${icon(AREA[id].icon)}</span>${AREA[id].name}</span>`).join('')}</div>` : ''}
      <button class="btn lg" data-act="flow-finish">Ver no meu painel ${icon('arrow')}</button>
    </div>`;
  }

  return `<div class="flow ${cls} ${ui.entering ? 'entering' : ''}">
    <header class="flow-head">
      <a class="icon-btn" href="${back}" aria-label="Fechar">${icon('close')}</a>
      <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>
      ${!activeAreas().length && !S.skipped && step !== 'done' && step !== 'login' ? '<button class="link flow-skip" data-act="skip">Pular agora</button>' : `<span class="flow-step">${label}</span>`}
    </header>
    <main class="flow-body ${step === 'qr' ? 'wide' : ''}">${body}</main>
  </div>`;
}

function afterFlow() {
  const f = ui.flow;
  ui.entering = false;
  document.title = 'Conectar · Gerenia';
  if (flowSteps(f)[f.idx] !== 'sync') return;
  const total = f.queue.length + 1;
  f.sync = f.sync || 0;
  const tick = () => {
    f.sync++;
    if (f.sync >= total) {
      const now = Date.now();
      f.queue.forEach((a, i) => { S.apps[a] = { at: now + i }; });
      if (f.queue.includes('whatsapp')) S.waMode = f.mode;
      f.newAreas = activeAreas().filter(a => !f.before.includes(a));
      S.dismissed = S.dismissed.filter(x => !f.newAreas.includes(x));
      save();
      f.idx++;
      ui.entering = true;
    }
    root.innerHTML = flowView();
    afterFlow();
  };
  later(tick, f.sync === 0 ? 900 : 700);
}

function qr() {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const n = 25;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    const center = x > 9 && x < 15 && y > 9 && y < 15;
    if (!finder && !center && rnd() > 0.5) d += `M${x} ${y}h1v1h-1z`;
  }
  const f = (x, y) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return `<svg class="qr" viewBox="-2 -2 29 29" role="img" aria-label="Código QR de demonstração"><rect x="-2" y="-2" width="29" height="29" rx="2" fill="#fff"/><path fill="#14262e" fill-rule="evenodd" d="${d}${f(0, 0)}${f(18, 0)}${f(0, 18)}"/><image href="assets/mark.svg" x="10.25" y="10.25" width="4.5" height="4.5"/></svg>`;
}

/* ---------- Nova campanha ---------- */
function campaignView(seg) {
  const segs = segments();
  if (!ui.camp) ui.camp = { seg: segs[seg] ? seg : 'away', v: 0, when: 'now', text: null };
  const c = ui.camp, s = segs[c.seg];
  const text = c.text ?? s.msgs[c.v % s.msgs.length];
  const wa = isOn('whatsapp');
  const v = V();
  return `<div class="flow m-cl ${ui.entering ? 'entering' : ''}">
    <header class="flow-head">
      <a class="icon-btn" href="#/app/clientes" aria-label="Fechar">${icon('close')}</a>
      <div class="progress" aria-hidden="true"><i style="width:100%"></i></div>
      <span class="flow-step">Nova campanha</span>
    </header>
    <main class="flow-body">
      <div class="flow-narrow">
        <h1>Nova campanha</h1>
        <p class="lead">A Gerenia escreve, você revisa e envia.</p>
        <p class="block-title camp-title">Para quem</p>
        <div class="options compact" role="radiogroup">${['away', 'bday', 'new', 'all'].map(k => `<button class="option" role="radio" aria-checked="${c.seg === k}" data-act="camp-seg" data-v="${k}"><span class="mico">${icon(segs[k].icon)}</span><div><b>${segs[k].title}</b><small>${segs[k].n} ${k === 'all' ? '' : v.clients + ' '}${segs[k].label}</small></div><span class="radio">${icon('check')}</span></button>`).join('')}</div>
        <div class="camp-msg-head"><p class="block-title camp-title">Mensagem</p><button class="link" data-act="camp-rewrite">${icon('spark')}Reescrever</button></div>
        <textarea id="camp-text" class="textarea" rows="4" aria-label="Mensagem da campanha">${esc(text)}</textarea>
        <p class="fine">{nome} vira o primeiro nome de cada pessoa.</p>
        <p class="block-title camp-title">Quando</p>
        <div class="seg"><button data-act="camp-when" data-v="now" class="${c.when === 'now' ? 'on' : ''}">Agora</button><button data-act="camp-when" data-v="tomorrow" class="${c.when === 'tomorrow' ? 'on' : ''}">Amanhã às 9h</button></div>
        ${wa ? `<p class="fine channel">${mono('whatsapp', 'xxs')}Sai pelo seu WhatsApp. As respostas aparecem na aba WhatsApp.</p>`
          : `<p class="note">${icon('chat')}<span>Campanhas são enviadas pelo WhatsApp. <a class="link" href="#/app/conectar/whatsapp">Conectar WhatsApp</a></span></p>`}
        <div class="flow-foot"><button class="btn lg" data-act="camp-send" ${wa ? '' : 'disabled'}>${c.when === 'now' ? `Enviar para ${s.n}` : `Agendar para ${s.n}`} ${icon('send')}</button></div>
      </div>
    </main>
  </div>`;
}
function afterCampaign() { ui.entering = false; document.title = 'Nova campanha · Gerenia'; }

/* ---------- Onboarding pelo chat ----------
   O painel é o lugar "comum". Quem preferir, segue o começo conversando com a Gerenia:
   objetivo → uma pergunta → plano → primeira conexão. */
function goals() {
  return {
    whatsapp: {
      title: L('Automatizar o WhatsApp', 'Automate WhatsApp'),
      question: L('Quem responde o WhatsApp hoje?', 'Who handles WhatsApp today?'),
      answers: [L('Eu mesma', 'I do'), L('Minha equipe', 'My team'), L('Ninguém dá conta', 'No one keeps up')],
      plan: [L('Conectar o WhatsApp (2 minutos)', 'Connect WhatsApp (2 minutes)'), L('Escolher se eu respondo sozinha ou com sua aprovação', 'Choose whether I reply alone or with your approval'), L('Acompanhar as primeiras conversas com você', 'Watch the first conversations together')],
      cta: L('Conectar WhatsApp', 'Connect WhatsApp'), route: '#/app/conectar/whatsapp',
    },
    noshows: {
      title: L('Acabar com as faltas na agenda', 'End no-shows'),
      question: L('Como vocês confirmam os horários hoje?', 'How do you confirm bookings today?'),
      answers: [L('Pelo WhatsApp, na mão', 'Manually on WhatsApp'), L('Pelo sistema', 'Through our system'), L('Não confirmamos', 'We don’t')],
      plan: [L('Conectar sua agenda', 'Connect your calendar'), L('Conectar o WhatsApp para eu confirmar por você', 'Connect WhatsApp so I can confirm for you'), L('Lembrar cada horário um dia antes e encaixar remarcações', 'Remind every booking a day ahead and fit in reschedules')],
      cta: L('Conectar minha agenda', 'Connect my calendar'), route: '#/app/conectar/agenda',
    },
    reconcile: {
      title: L('Conferir os repasses dos convênios', 'Reconcile health-plan payments'),
      question: L('Como você confere os repasses hoje?', 'How do you check health-plan payments today?'),
      answers: [L('Numa planilha', 'In a spreadsheet'), L('Dentro do sistema', 'Inside our system'), L('Ninguém confere', 'Nobody checks')],
      plan: [L('Conectar o sistema da clínica', 'Connect your clinic system'), L('Conectar onde o dinheiro cai', 'Connect where the money lands'), L('Eu cruzo atendido, faturado e recebido e aponto as diferenças', 'I match services, billing and payments and flag the gaps')],
      cta: L('Conectar minhas fontes', 'Connect my sources'), route: '#/app/conectar/apps/feegow,asaas',
    },
    winback: {
      title: L('Trazer de volta quem sumiu', 'Win back clients who went quiet'),
      question: L(`Onde estão seus ${V().clients} hoje?`, `Where are your ${V().clients} today?`),
      answers: [L('No WhatsApp', 'On WhatsApp'), L('No sistema de gestão', 'In our management system'), L('Numa planilha', 'In a spreadsheet')],
      plan: [L(`Juntar seus ${V().clients} num lugar só`, `Bring your ${V().clients} into one place`), L('Eu encontro quem não volta há meses', 'I find who hasn’t been back in months'), L('Escrevo a campanha e você aprova antes de sair', 'I write the campaign and you approve it before it goes out')],
      cta: L('Organizar meus clientes', 'Organize my clients'), route: '#/app/conectar/clientes',
    },
    collections: {
      title: L('Parar de correr atrás de pagamento', 'Stop chasing payments'),
      question: L('Onde você acompanha os pagamentos hoje?', 'Where do you track payments today?'),
      answers: [L('No banco', 'In the bank app'), L('Numa planilha', 'In a spreadsheet'), L('No sistema de gestão', 'In our management system')],
      plan: [L('Conectar sua fonte financeira', 'Connect your financial source'), L('Eu separo o que entrou e o que está atrasado', 'I separate what came in from what’s late'), L('Cobro com educação, no tom do seu negócio', 'I follow up politely, in your business’s tone')],
      cta: L('Organizar meu financeiro', 'Organize my finances'), route: '#/app/conectar/financeiro',
    },
  };
}
const GOAL_OF_AREA = { whatsapp: 'whatsapp', agenda: 'noshows', clientes: 'winback', financeiro: 'collections' };
const goalIds = () => {
  const ids = priority().map(a => GOAL_OF_AREA[a]);
  return S.sector === 'clinica' ? [ids[0], ids[1], 'reconcile', ids[2]] : ids;
};
function goalFromText(text) {
  const t = norm(text);
  if (/convenio|repasse|glosa|reconcil|health.?plan|insurance/.test(t)) return 'reconcile';
  if (/whatsapp|mensage|atendimento|responder|message|reply/.test(t)) return 'whatsapp';
  if (/falta|agenda|horario|confirm|remarc|no.?show|calendar|booking/.test(t)) return 'noshows';
  if (/sumid|volta|campanha|win.?back|quiet|campaign/.test(t)) return 'winback';
  if (/cobran|pagamento|financ|atras|receb|payment|billing|collect/.test(t)) return 'collections';
  return null;
}
function guideStart() {
  return {
    from: 'g',
    text: L(`Oi, ${esc(first(S.name))}! Já pesquisei a <b>${esc(S.business)}</b>. Se quiser, eu te guio no começo. O que você quer resolver primeiro?`,
      `Hi ${esc(first(S.name))}! I’ve already researched <b>${esc(S.business)}</b>. If you like, I’ll guide you through getting started. What do you want to solve first?`),
    options: [...goalIds().map(id => ({ label: goals()[id].title, next: `goal:${id}` })), { label: L('Só quero explorar o painel', 'I just want to explore'), next: 'explore', ghost: true }],
  };
}
function guideNext(key) {
  if (key === 'explore') return { from: 'g', text: L('Combinado. O painel é todo seu. Quando quiser, é só me chamar aqui ou pelo WhatsApp.', 'Sounds good. The dashboard is all yours. Call me here or on WhatsApp anytime.') };
  const [kind, id, ans] = key.split(':');
  const g = goals()[id];
  if (kind === 'goal') return { from: 'g', text: `<b>${g.question}</b><br>${L('Isso me ajuda a montar o caminho mais curto.', 'This helps me find the shortest path.')}`, options: g.answers.map((a, i) => ({ label: a, next: `ans:${id}:${i}` })) };
  S.goal = id; save();
  return {
    from: 'g',
    text: `${L('Perfeito. Montei um plano:', 'Perfect. Here’s the plan:')}<ol class="chat-plan">${g.plan.map(x => `<li>${x}</li>`).join('')}</ol>${L('Começamos pelo primeiro passo?', 'Shall we start with step one?')}`,
    action: [g.cta, g.route],
  };
}

/* ---------- Chat da Gerenia ---------- */
function chatPanel() {
  const act = activeAreas();
  if (!ui.log.length) ui.log.push(act.length ? { from: 'g', text: `Oi, ${first(S.name)}! Estou de olho em ${join(act.map(a => AREA[a].name))}, com dados de ${join(connected().map(a => APPS[a].name))}. Pergunte o que quiser.` } : guideStart());
  return `<div class="scrim ${ui.chat ? 'open' : ''}" data-act="chat-close"></div>
  <div class="chat ${ui.chat ? 'open' : ''}" role="dialog" aria-modal="true" aria-label="Conversa com a Gerenia" ${ui.chat ? '' : 'inert'}>
    <header class="chat-head">
      <span class="g-av">${mark()}</span>
      <div><b>Gerenia</b><small>${act.length ? `Vê ${join(act.map(a => AREA[a].name))}` : 'Ainda sem conexões'}</small></div>
      <button class="icon-btn" data-act="chat-close" aria-label="Fechar conversa">${icon('close')}</button>
    </header>
    <a class="chat-wa" href="${waLink()}" target="_blank" rel="noopener">${icon('chat')}Continuar a conversa no WhatsApp${icon('external', 'ext')}</a>
    <div class="chat-log" id="chat-log">${ui.log.map(chatMsg).join('')}</div>
    <div class="chat-sugs">${chatSuggestions().map(s => `<button data-act="chat-sug" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <form class="composer" data-form="chat"><input name="t" placeholder="Pergunte à Gerenia…" autocomplete="off" aria-label="Mensagem para a Gerenia"><button class="btn" aria-label="Enviar">${icon('send')}</button></form>
  </div>`;
}
const chatMsg = m => m.typing ? `<div class="bubble typing" aria-label="Gerenia está escrevendo"><span></span><span></span><span></span></div>`
  : `<div class="bubble ${m.from === 'me' ? 'me' : ''}">${m.from === 'me' ? esc(m.text) : m.text}${m.action ? `<a class="btn sm" href="${m.action[1]}">${m.action[0]}</a>` : ''}${m.confirm && !m.answered ? `<div class="bubble-actions"><button class="btn sm" data-act="task-confirm" data-i="${ui.log.indexOf(m)}">${APPS[m.confirm].via === 'browser' ? icon('play') : icon('zap')}Pode fazer</button><button class="btn ghost sm" data-act="task-cancel" data-i="${ui.log.indexOf(m)}">Agora não</button></div>` : ''}${m.options && !m.answered ? `<div class="chat-options">${m.options.map((o, j) => `<button class="${o.ghost ? 'ghost' : ''}" data-act="chat-opt" data-i="${ui.log.indexOf(m)}" data-j="${j}">${esc(o.label)}</button>`).join('')}</div>` : ''}</div>`;
function chatSuggestions() {
  if (!activeAreas().length) return [L('Me guia no começo', 'Guide me through setup'), 'Quais sistemas você conecta?'];
  const s = ['O que precisa de mim hoje?'];
  if (hasArea('clientes')) s.push('Monta uma campanha');
  if (hasArea('agenda')) s.push('Remarca a Julia para quinta 16h30');
  if (hasArea('agenda')) s.push('Como está a agenda?');
  if (hasArea('financeiro')) s.push('Quanto entrou este mês?');
  s.push('O que mais posso conectar?');
  return s;
}
function reply(text) {
  const t = text.toLowerCase();
  const v = V();
  if (!activeAreas().length) {
    const goal = goalFromText(text);
    if (goal) return guideNext(`goal:${goal}`);
    if (/guia|guie|guide|começo|comeco|começar|start|setup/.test(t)) return guideStart();
  }
  const missing = (id, why) => ({ text: `Ainda não vejo ${{ agenda: 'sua agenda', financeiro: 'seu financeiro', clientes: `seus ${v.clients}`, whatsapp: 'seu WhatsApp' }[id]}. ${why}`, action: [`Conectar ${AREA[id].name.toLowerCase()}`, `#/app/conectar/${id}`] });
  if (/campanha|ação|acao|promo|campaign|promotion/.test(t)) {
    if (!hasArea('clientes')) return missing('clientes', 'Conectando, eu analiso sua base e escrevo campanhas.');
    return { text: `Analisei seus ${v.clients}: <b>${awayCount()} sumidos</b> há mais de 60 dias e <b>12 aniversariantes</b> este mês. Já escrevi uma mensagem para chamar os sumidos de volta.`, action: ['Revisar campanha', '#/app/clientes/campanha/away'] };
  }
  if (/conect|sistema|integra|apps?\b|plataforma|connect|system|integration|platform/.test(t)) {
    const c = connected();
    const sug = Object.keys(APPS).filter(a => !APPS[a].native && !APPS[a].soon && !isOn(a) && APPS[a].sectors?.includes(S.sector)).slice(0, 2).map(a => APPS[a].name);
    return { text: `${c.length ? `Hoje estou conectada a ${join(c.map(a => APPS[a].name))}.` : 'Ainda não estou conectada a nada.'} Conecto sistemas de gestão, agenda, financeiro, pagamentos e CRM${sug.length ? `, como ${join(sug)}` : ''}. Quanto mais eu vejo, melhor eu analiso.`, action: ['Ver conexões', '#/app/conexoes'] };
  }
  if (/remarc|reagend|muda.*hor|troca.*hor|resched|move.*(?:time|appointment)|change.*(?:time|appointment)/.test(t)) {
    if (!hasArea('agenda')) return missing('agenda', 'Conectando, eu remarco direto no seu sistema.');
    if (S.done.moved) return { text: 'A Julia já está remarcada para quinta, 16:30. ✓' };
    const app = agendaApp(), x = APPS[app];
    return { text: `Vou remarcar <b>Julia Costa</b> de terça, 10:30 para <b>quinta, 16:30</b> no ${x.name}, ${VIA[x.via].phrase}.${x.via === 'browser' ? ' Você pode assistir enquanto eu faço.' : ''}`, confirm: app };
  }
  if (/agenda|horário|horario|consulta|aula|calendar|schedule|booking|appointment|class/.test(t)) {
    if (!hasArea('agenda')) return missing('agenda', 'Conectando, eu mostro os horários do dia e confirmo cada um.');
    return { text: `Hoje são <b>8 ${v.services}</b>. A próxima é às 10:30 com Julia Costa. ${isOn('whatsapp') ? 'Duas ainda não confirmaram e eu lembro às 18h.' : 'Duas ainda não confirmaram.'}`, action: ['Ver agenda', '#/app/agenda'] };
  }
  if (/financ|dinheiro|receb|pag|entrou|cobr|money|payment|income|bill|billing|received/.test(t)) {
    if (!hasArea('financeiro')) return missing('financeiro', 'Conectando, eu sei quem pagou e lembro quem falta.');
    const o = openBills();
    return { text: `Entraram <b>${brl(received())}</b> este mês, 12% a mais que no anterior. ${o.length ? `Faltam ${brl(o.reduce((a, b) => a + b[1], 0))} de ${plural(o.length, 'pessoa', 'pessoas')}.` : 'Nada em aberto.'}`, action: ['Ver financeiro', '#/app/financeiro'] };
  }
  if (/sumid|client|pacient|aluno|member|student|gone quiet/.test(t)) {
    if (!hasArea('clientes')) return missing('clientes', 'Conectando, eu aviso quem não volta há muito tempo.');
    return { text: `<b>${awayCount()} ${v.clients}</b> não voltam há mais de 60 dias. Posso montar uma campanha para chamar de volta.`, action: ['Criar campanha', '#/app/clientes/campanha/away'] };
  }
  if (/começo|comeco|começar|primeiro|start|first/.test(t)) return { text: 'Comece pelo WhatsApp: é onde seus clientes já falam com você, e os contatos viram sua base. Se já usa um sistema de gestão, conecte ele também e eu junto tudo.', action: ['Conectar WhatsApp', '#/app/conectar/whatsapp'] };
  if (/hoje|precisa|pendente|resumo|mim|today|need|pending|summary/.test(t)) {
    if (!activeAreas().length) return { text: 'Ainda não tenho nada para acompanhar. Conecte o WhatsApp ou um sistema e eu já te mostro o que precisa de você.', action: ['Ver opções', '#/app'] };
    const n = needs();
    if (!n.length) return { text: 'Nada precisa de você agora. Eu aviso se algo mudar. ✓' };
    return { text: `${plural(n.length, 'coisa precisa', 'coisas precisam')} de você:<br>${n.slice(0, 4).map(x => `• ${esc(x.title)} (${esc(x.sub.toLowerCase())})`).join('<br>')}`, action: ['Ir para o início', '#/app'] };
  }
  if (/whatsapp|mensag|conversa|message|conversation/.test(t)) {
    if (!hasArea('whatsapp')) return missing('whatsapp', 'Eu passo a atender e seus contatos viram sua base de clientes.');
    const p = pendingConvos().length;
    return { text: `Estou <b>${MODES[S.waMode][3]}</b>. ${p ? `${plural(p, 'conversa espera', 'conversas esperam')} por você.` : 'Nenhuma conversa espera por você.'}`, action: ['Abrir WhatsApp', '#/app/whatsapp'] };
  }
  if (/faz|consegue|ajuda|quem é|o que você|what.*you|who are|can you|help/.test(t)) return { text: `Sou a gerente do ${esc(S.business)}. Conecto seus sistemas, junto clientes, agenda, WhatsApp e financeiro, e cuido do dia a dia. Só vejo o que você conecta.` };
  return { text: `Ainda estou aprendendo a responder isso. Pergunte sobre ${activeAreas().length ? join(activeAreas().map(a => AREA[a].name.toLowerCase())) : 'como começar'}.` };
}
function chatSend(text) {
  text = text.trim();
  if (!text) return;
  ui.log.push({ from: 'me', text });
  ui.log.push({ typing: true });
  refreshChat();
  setTimeout(() => {
    ui.log = ui.log.filter(m => !m.typing);
    ui.log.push({ from: 'g', ...reply(text) });
    refreshChat();
  }, 650);
}
function refreshChat() {
  const log = $('#chat-log');
  if (!log) return;
  log.innerHTML = ui.log.map(chatMsg).join('');
  log.scrollTop = log.scrollHeight;
}
function openChat() {
  ui.chat = true;
  const c = $('.chat'); if (!c) return;
  c.classList.add('open'); c.removeAttribute('inert'); $('.scrim')?.classList.add('open');
  refreshChat();
  setTimeout(() => $('.chat input')?.focus(), 50);
}
function closeChat() {
  ui.chat = false;
  const c = $('.chat'); if (!c) return;
  c.classList.remove('open'); c.setAttribute('inert', ''); $('.scrim')?.classList.remove('open');
  $('.ask')?.focus();
}

/* ---------- Ações ---------- */
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2800);
}
function setTheme(t) { S.theme = t; document.documentElement.dataset.theme = t; save(); }
const rerender = () => { clearTimers(); render(); };
const toggle = (list, v) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];

const actions = {
  lang: el => { S.lang = el.dataset.v; save(); const u = new URL(location.href); if (S.lang === 'pt') u.searchParams.set('lang', 'pt'); else u.searchParams.delete('lang'); history.replaceState(null, '', u); render(); },
  theme: () => { setTheme(S.theme === 'dark' ? 'light' : 'dark'); document.querySelectorAll('[data-act=theme]').forEach(b => { b.innerHTML = icon(S.theme === 'dark' ? 'sun' : 'moon'); }); },
  'theme-set': el => { setTheme(el.dataset.v); render(); },
  tone: el => { S.tone = el.dataset.v; save(); render(); },
  'lp-step': el => { ui.lpAuto = false; clearTimers(); setDemo(+el.dataset.v); },
  'focus-company': (el, e) => {
    e?.preventDefault();
    const finder = $('#encontre');
    if (!finder) return;
    const distance = Math.abs(finder.getBoundingClientRect().top - (window.innerHeight / 2));
    finder.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
    clearTimeout(ui.companyFocusTimer);
    finder.classList.remove('is-focused');
    ui.companyFocusTimer = setTimeout(() => {
      finder.classList.add('is-focused');
      finder.querySelector('input')?.focus({ preventScroll: true });
      ui.companyFocusTimer = setTimeout(() => finder.classList.remove('is-focused'), 1500);
    }, reduceMotion() ? 0 : distance > window.innerHeight ? 800 : 180);
  },
  'lp-pick': el => { const c = ui.lpBiz.results?.[+el.dataset.v]; if (c) selectCompany(c); },
  'login-complete': () => { S.signedIn = true; if (!S.name) S.name = 'Mariana'; save(); ui.su = null; go(S.business ? '#/app' : '#/'); },
  'brief-open': () => { ui.briefOpen = true; render(); },
  'brief-close': () => { S.briefDone = true; ui.briefOpen = false; save(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  'brief-go': () => { S.briefDone = true; save(); },
  'brief-fix': () => { openChat(); const inp = $('.chat input'); if (inp) inp.value = 'No briefing, o que não está certo é '; },
  'chat-open': openChat,
  'chat-close': closeChat,
  'chat-sug': el => chatSend(el.dataset.v),
  'chat-opt': el => {
    const m = ui.log[+el.dataset.i], o = m?.options?.[+el.dataset.j];
    if (!o || m.answered) return;
    m.answered = true;
    ui.log.push({ from: 'me', text: o.label }, { typing: true });
    refreshChat();
    setTimeout(() => { ui.log = ui.log.filter(x => !x.typing); ui.log.push(guideNext(o.next)); refreshChat(); }, 550);
  },
  'chat-guide': () => { if (ui.log.length > 1) ui.log = []; openChat(); },
  'task-confirm': el => {
    const m = ui.log[+el.dataset.i]; if (!m || m.answered) return;
    m.answered = true;
    const app = m.confirm;
    if (APPS[app].via === 'browser') { ui.log.push({ from: 'g', text: `Abrindo o ${APPS[app].name}…` }); return startTask(app); }
    S.done.moved = true;
    S.tasks.unshift({ app, kind: 'moved', time: 'now', replay: true });
    save();
    ui.log.push({ from: 'g', text: `Pronto ✓ Remarquei Julia Costa para <b>quinta, 16:30</b> no ${APPS[app].name}, pela conexão direta, em 2 segundos.` });
    refreshChat();
  },
  'task-cancel': el => { const m = ui.log[+el.dataset.i]; if (m) m.answered = true; ui.log.push({ from: 'g', text: 'Tudo bem, não mexi em nada.' }); refreshChat(); },
  'task-stop': stopTask,
  skip: () => { S.skipped = true; ui.sideNew = true; ui.flow = null; save(); if (location.hash === '#/app') render(); else go('#/app'); },
  'watch-open': () => { if (!ui.task) return; ui.watch = { live: true, app: ui.task.app, kind: ui.task.kind }; render(); },
  'watch-close': () => { const w = ui.watch; if (w?.timer) clearTimeout(w.timer); ui.watch = null; render(); },
  'watch-replay': el => { ui.watch = { live: false, app: el.dataset.app, kind: el.dataset.kind || 'moved', step: 0 }; render(); playReplay(); },
  'watch-again': () => { if (ui.watch && !ui.watch.live) playReplay(); },

  pick: el => { ui.flow.sel = toggle(ui.flow.sel, el.dataset.v); render(); },
  'flow-login': () => {
    S.signedIn = true; if (!S.name) S.name = 'Mariana'; save();
    ui.flow.loginDone = true; ui.entering = true; rerender(); window.scrollTo(0, 0);
  },
  'flow-mode': el => { ui.flow.mode = el.dataset.v; render(); },
  'flow-next': () => {
    const f = ui.flow;
    if (flowSteps(f)[f.idx] === 'pick') f.queue = f.sel.slice();
    f.idx++; f.sync = 0; ui.entering = true; rerender(); window.scrollTo(0, 0);
  },
  'flow-back': () => { ui.flow.idx--; ui.entering = true; rerender(); },
  'flow-finish': () => {
    const f = ui.flow;
    ui.fresh = f.newAreas || [];
    ui.sideNew = f.before.length === 0;
    ui.flow = null; ui.log = [];
    go(f.kind === 'area' && f.area !== 'whatsapp' && f.before.includes(f.area) ? `#/app/${f.area}` : '#/app');
  },

  'pick-app': el => { ui.sel = toggle(ui.sel, el.dataset.v); el.setAttribute('aria-checked', ui.sel.includes(el.dataset.v)); const bar = $('#selbar'); bar.innerHTML = selbar(); bar.classList.toggle('show', ui.sel.length > 0); },
  'sel-clear': () => { ui.sel = []; render(); },
  'sel-go': () => { const list = ui.sel.join(','); ui.sel = []; go('#/app/conectar/apps/' + list); },
  cat: el => { ui.cat = el.dataset.v; render(); },
  'disc-ask': el => { ui.confirm = el.dataset.id; render(); },
  'disc-no': () => { ui.confirm = null; render(); },
  'disc-yes': el => { const a = el.dataset.id; delete S.apps[a]; ui.confirm = null; ui.log = []; save(); render(); toast(`${APPS[a].name} desconectado.`); },

  'wa-mode': el => { S.waMode = el.dataset.v; save(); render(); toast(`WhatsApp agora ${MODES[S.waMode][3]}.`); },
  watab: el => { ui.watab = el.dataset.v; render(); },
  quick: el => sendReply(el.dataset.id, el.dataset.v),
  'edit-draft': el => { const inp = $('.composer input[name=t]'); inp.value = el.dataset.v; inp.focus(); },

  ctab: el => { ui.ctab = el.dataset.v; render(); },
  filter: el => { ui.filter = el.dataset.v; render(); },
  day: el => { ui.day = +el.dataset.v; render(); },
  remind: el => { S.done['r:' + el.dataset.id] = true; save(); render(); toast(`A Gerenia enviou um lembrete para ${first(el.dataset.id)} pelo WhatsApp.`); },
  paid: el => { S.done['p:' + el.dataset.id] = true; save(); render(); toast('Marcado como pago.'); },
  winback: el => { S.done['w:' + el.dataset.id] = true; save(); render(); toast(`A Gerenia mandou uma mensagem para ${first(el.dataset.id)}.`); },
  auto: el => { const k = el.dataset.id; S.autos[k] = !S.autos[k]; save(); render(); toast(S.autos[k] ? 'Ação automática ligada.' : 'Ação automática desligada.'); },

  'camp-seg': el => { ui.camp = { ...ui.camp, seg: el.dataset.v, v: 0, text: null }; render(); },
  'camp-rewrite': () => { ui.camp.v++; ui.camp.text = null; const s = segments()[ui.camp.seg]; $('#camp-text').value = s.msgs[ui.camp.v % s.msgs.length]; },
  'camp-when': el => { ui.camp.when = el.dataset.v; render(); },
  'camp-send': () => {
    const c = ui.camp, s = segments()[c.seg];
    const camp = { id: 'k' + Date.now(), title: s.title, seg: c.seg, n: s.n, status: c.when === 'now' ? 'sending' : 'scheduled', replied: 0, booked: 0, when: c.when === 'now' ? 'Agora' : 'Criada agora' };
    S.campaigns.unshift(camp);
    save();
    ui.ctab = 'campanhas';
    go('#/app/clientes');
    toast(c.when === 'now' ? `Enviando para ${s.n} ${V().clients}.` : 'Campanha agendada para amanhã às 9h.');
    if (camp.status === 'sending') setTimeout(() => {
      const k = S.campaigns.find(x => x.id === camp.id);
      if (!k) return;
      Object.assign(k, { status: 'sent', replied: Math.max(1, Math.round(k.n * 0.25)), booked: Math.max(1, Math.round(k.n * 0.1)), when: 'Hoje' });
      save();
      if (route()[1] === 'clientes' && !route()[2]) render();
    }, 2200);
  },

  reset: () => { const preserved = keep(); S = Object.assign(blank(), preserved); Object.assign(ui, { log: [], flow: null, su: null, fresh: [], confirm: null, sel: [], day: 0, filter: 'todos', q: '', ctab: 'pessoas', lpBiz: { q: '', results: [], loading: false } }); save(); go('#/'); },
};

function sendReply(id, text) {
  text = text.trim();
  if (!text) return;
  S.replies[id] = [...(S.replies[id] || []), text];
  save();
  render();
  toast(S.waMode === 'auto' ? 'Resposta enviada. A Gerenia continua daqui.' : 'Resposta enviada.');
}

const forms = {
  'lp-company': f => {
    const q = f.elements.company.value.trim();
    if (q.length < 2) return;
    const c = searchCompanies(q)[0];
    if (c) selectCompany(c);
  },
  reply: f => sendReply(f.dataset.id, f.elements.t.value),
  chat: f => { const v = f.elements.t.value; f.elements.t.value = ''; chatSend(v); },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el && actions[el.dataset.act]) actions[el.dataset.act](el, e);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  forms[f.dataset.form]?.(f);
});
document.addEventListener('input', e => {
  const k = e.target.dataset.input;
  if (k === 'q') { ui.q = e.target.value; $('#people').innerHTML = peopleRows(); }
  if (k === 'lp-biz') {
    const f = ui.lpBiz;
    f.q = e.target.value; f.loading = f.q.trim().length >= 2;
    const results = $('#lp-biz-results'); if (results) results.innerHTML = lpBizResults();
    const submit = e.target.form?.querySelector('button[type=submit]'); if (submit) submit.disabled = f.q.trim().length < 2;
    clearTimeout(f.t);
    f.t = setTimeout(() => { f.results = searchCompanies(f.q); f.loading = false; if ($('#lp-biz-results')) $('#lp-biz-results').innerHTML = lpBizResults(); }, 320);
  }
  if (k === 'appq') { ui.appq = e.target.value; $('#app-grid').innerHTML = appGrid(); }
  if (e.target.id === 'camp-text' && ui.camp) ui.camp.text = e.target.value;
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (ui.watch) actions['watch-close']();
  else if (ui.chat) closeChat();
});
window.addEventListener('hashchange', () => {
  const r = route();
  // Âncoras da LP (#como, #areas) rolam a página em vez de trocar de tela.
  if (r.length === 1 && document.getElementById(r[0]) && !location.hash.startsWith('#/')) return;
  clearTimers();
  ui.confirm = null;
  ui.chat = false;
  ui.entering = true;
  render();
  if (!(r[0] === 'app' && r[1] === 'whatsapp' && r[2] && matchMedia('(min-width: 960px)').matches)) window.scrollTo(0, 0);
});

syncLanguageMeta();
render();
