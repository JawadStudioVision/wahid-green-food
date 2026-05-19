const state = {
  lang: 'de',
  filter: 'all',
  cart: [],
  counter: Number(localStorage.getItem('wgfCounter') || '0'),
};

const t = {
  de: {
    navMenu: 'Menü', navOrder: 'Bestellen', navInfo: 'Info', navChat: 'Fragen', heroSub: 'Halal • Vegan freundlich • Cottbus',
    heroTitle: "Wahid's Green Food", heroText: 'Fast Food kann auch gutes Essen sein. Wähle dein Essen, Abholzeit und besondere Wünsche — Wahid bestätigt manuell.',
    orderNow: 'Jetzt bestellen', viewMenu: 'Menü ansehen', menuTitle: 'Menü', menuText: 'Erster Prototyp: Preise aktuell laut Flyer. Fotos werden noch ersetzt/verbessert.',
    all: 'Alle', sandwich: 'Sandwiches', plate: 'Teller', burger: 'Burger', wrap: 'Wraps', side: 'Beilagen', add: 'Hinzufügen',
    orderTitle: 'Abholbestellung', cart: 'Warenkorb', empty: 'Noch keine Speisen ausgewählt.', sauces: 'Soßen', qty: 'Menge',
    pickup: 'Abholung', pickupDate: 'Datum', pickupTime: 'Uhrzeit', name: 'Name optional', phone: 'Telefon/WhatsApp optional', email: 'E-Mail optional', comments: 'Besondere Wünsche', commentsPh: 'z.B. ohne Zwiebeln, extra scharf, Soße separat ...',
    contactHelp: 'Kontakt ist optional. Ohne Kontakt können wir dich bei Änderungen oder Rückmeldung nicht erreichen.', allergy: 'Bei Allergien oder Unverträglichkeiten bitte direkt im Laden fragen.',
    payment: 'Zahlung bei Abholung im Geschäft. Barzahlung oder Kartenzahlung möglich.', submit: 'Bestellung erstellen', total: 'Summe',
    closed: 'Zu dieser Zeit ist der Laden geschlossen. Bitte wähle eine andere Abholzeit.', needCart: 'Bitte zuerst mindestens ein Gericht auswählen.', success: 'Bestellung erstellt', orderNo: 'Ihre Bestellnummer ist', sayNo: 'Bitte nennen Sie diese Nummer bei der Abholung.',
    infoTitle: 'Informationen', address: 'Adresse', hours: 'Öffnungszeiten', pay: 'Zahlung', follow: 'Folgen & Bewertungen', instagram: 'Instagram öffnen', happycow: 'HappyCow Bewertungen',
    manual: 'Testphase: Die Bestellung wird lokal gespeichert. Telegram/WhatsApp wird später verbunden.',
    chatTitle: 'Frage oder Problem melden', chatType: 'Art der Nachricht', chatTypeQuestion: 'Frage', chatTypeProblem: 'Problem / Fehler auf der Website', chatContact: 'Kontakt optional', chatMessage: 'Nachricht', chatPlaceholder: 'Schreiben Sie Ihre Frage oder das Problem hier ...', chatSend: 'An Wahid senden', chatNote: 'Testversion: Nachricht wird lokal gespeichert. Sobald Wahids WhatsApp-Nummer verbunden ist, öffnet sich WhatsApp direkt.', chatHowTitle: 'So funktioniert es', chatHowText: 'Kunden können Fragen stellen oder Website-Probleme melden. Zuerst geht es direkt an Wahid. Später beantwortet der Bot bekannte Fragen automatisch; unbekannte Fragen fragt er Wahid.', chatNeedNumber: 'Noch benötigt: Wahids WhatsApp-Nummer im internationalen Format.', chatSaved: 'Nachricht gespeichert. WhatsApp ist noch nicht verbunden.'
  },
  en: {
    navMenu: 'Menu', navOrder: 'Order', navInfo: 'Info', navChat: 'Fragen', heroSub: 'Halal • vegan-friendly • Cottbus',
    heroTitle: "Wahid's Green Food", heroText: 'Fast food can be good food too. Choose food, pickup time and special wishes — Wahid confirms manually.',
    orderNow: 'Order now', viewMenu: 'View menu', menuTitle: 'Menu', menuText: 'First prototype: prices current from flyer. Photos will be replaced/improved.',
    all: 'All', sandwich: 'Sandwiches', plate: 'Plates', burger: 'Burgers', wrap: 'Wraps', side: 'Sides', add: 'Add',
    orderTitle: 'Pickup order', cart: 'Cart', empty: 'No food selected yet.', sauces: 'Sauces', qty: 'Qty',
    pickup: 'Pickup', pickupDate: 'Date', pickupTime: 'Time', name: 'Name optional', phone: 'Phone/WhatsApp optional', email: 'Email optional', comments: 'Special requests', commentsPh: 'e.g. without onion, extra spicy, sauce on side ...',
    contactHelp: 'Contact is optional. Without contact, we cannot reach you for changes or feedback.', allergy: 'If you have allergies or intolerances, please ask directly in the shop.',
    payment: 'Payment on pickup in the shop. Cash or card accepted.', submit: 'Create order', total: 'Total',
    closed: 'The shop is closed at this time. Please choose another pickup time.', needCart: 'Please select at least one food item first.', success: 'Order created', orderNo: 'Your order number is', sayNo: 'Please say this number when you pick up your food.',
    infoTitle: 'Information', address: 'Address', hours: 'Opening hours', pay: 'Payment', follow: 'Follow & reviews', instagram: 'Open Instagram', happycow: 'HappyCow reviews',
    manual: 'Test phase: order is saved locally. Telegram/WhatsApp will be connected later.',
    chatTitle: 'Ask a question or report a problem', chatType: 'Message type', chatTypeQuestion: 'Question', chatTypeProblem: 'Website problem / bug', chatContact: 'Contact optional', chatMessage: 'Message', chatPlaceholder: 'Write your question or the problem here ...', chatSend: 'Send to Wahid', chatNote: 'Test version: message is saved locally. When Wahid’s WhatsApp number is connected, WhatsApp opens directly.', chatHowTitle: 'How it works', chatHowText: 'Customers can ask questions or report website problems. First it goes directly to Wahid. Later the bot answers known questions automatically; unknown questions are sent to Wahid.', chatNeedNumber: 'Still needed: Wahid’s WhatsApp number in international format.', chatSaved: 'Message saved. WhatsApp is not connected yet.'
  }
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const money = (n) => `${n.toFixed(2).replace('.', ',')} €`;
const tx = (key) => t[state.lang][key] || key;

function translate() {
  $$('[data-i18n]').forEach(el => el.textContent = tx(el.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(el => el.placeholder = tx(el.dataset.i18nPlaceholder));
  $$('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === state.lang));
  document.documentElement.lang = state.lang;
  renderMenu(); renderCart(); setDateDefaults();
}

function renderFilters() {
  const cats = ['all','sandwich','plate','burger','wrap','side'];
  $('#filters').innerHTML = cats.map(cat => `<button class="filter ${state.filter===cat?'active':''}" data-filter="${cat}">${tx(cat)}</button>`).join('');
  $$('#filters button').forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; renderFilters(); renderMenu(); }));
}


function isHalal(item) {
  const text = `${item.name_de} ${item.name_en} ${item.desc_de} ${item.desc_en}`.toLowerCase();
  return item.halal || /köfte|kofte|chicken|hähnchen|shawarma|schawarma|cheese.?burger|fleisch/.test(text);
}

function renderMenu() {
  const list = window.WGF_MENU.filter(item => state.filter === 'all' || item.category === state.filter);
  $('#menuGrid').innerHTML = list.map(item => `
    <article class="card">
      <img src="assets/images/${item.image}" alt="${item[`name_${state.lang}`]}">
      <div class="badges">
        <span class="badge">${item.code}</span>${item.vegan ? '<span class="badge">Vegan</span>' : ''}${isHalal(item) ? '<span class="badge">Halal</span>' : ''}
      </div>
      <h3>${item[`name_${state.lang}`]}</h3>
      <p>${item[`desc_${state.lang}`]}</p>
      <p class="muted">${tx('allergy')}</p>
      <div class="card-row"><span class="price">${money(item.price)}</span><button class="add" data-add="${item.code}">${tx('add')}</button></div>
    </article>`).join('');
  $$('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.add)));
}

function addToCart(code) {
  const found = state.cart.find(i => i.code === code);
  if (found) found.qty += 1;
  else state.cart.push({ code, qty: 1, sauces: [] });
  renderCart(); location.hash = '#order';
}

function renderCart() {
  if (!state.cart.length) {
    $('#cartItems').innerHTML = `<p class="muted">${tx('empty')}</p>`;
  } else {
    $('#cartItems').innerHTML = state.cart.map((ci, idx) => {
      const item = window.WGF_MENU.find(m => m.code === ci.code);
      return `<div class="cart-item">
        <div>
          <strong>${item.code} — ${item[`name_${state.lang}`]}</strong><br><span class="muted">${money(item.price)} × ${ci.qty}</span>
          <div class="sauces">${window.WGF_SAUCES.map(s => `<label><input type="checkbox" data-sauce="${idx}:${s.id}" ${ci.sauces.includes(s.id)?'checked':''}> ${s[state.lang]}</label>`).join('')}</div>
        </div>
        <div class="qty"><button data-dec="${idx}">−</button><strong>${ci.qty}</strong><button data-inc="${idx}">+</button></div>
      </div>`;
    }).join('');
  }
  $('#total').textContent = money(total());
  $$('[data-inc]').forEach(b => b.addEventListener('click', () => { state.cart[b.dataset.inc].qty++; renderCart(); }));
  $$('[data-dec]').forEach(b => b.addEventListener('click', () => { const i=Number(b.dataset.dec); state.cart[i].qty--; if(state.cart[i].qty<=0) state.cart.splice(i,1); renderCart(); }));
  $$('[data-sauce]').forEach(cb => cb.addEventListener('change', () => { const [idx, id] = cb.dataset.sauce.split(':'); const sauces = state.cart[idx].sauces; cb.checked ? sauces.push(id) : state.cart[idx].sauces = sauces.filter(x => x !== id); }));
}

function total() { return state.cart.reduce((sum, ci) => sum + (window.WGF_MENU.find(m => m.code === ci.code).price * ci.qty), 0); }
function isOpen(dateStr, timeStr) {
  const d = new Date(`${dateStr}T${timeStr}`);
  const day = d.getDay();
  if (day === 0) return false;
  const minutes = d.getHours() * 60 + d.getMinutes();
  const open = day === 6 ? 12 * 60 : 10 * 60 + 30;
  const close = 20 * 60;
  return minutes >= open && minutes <= close;
}
function setDateDefaults() {
  const date = $('#pickupDate'); const time = $('#pickupTime');
  const today = new Date();
  const yyyy = today.toISOString().slice(0,10);
  date.min = yyyy;
  if (!date.value) date.value = yyyy;
  if (!time.value) time.value = '18:00';
}
function nextOrderCode() {
  state.counter += 1;
  localStorage.setItem('wgfCounter', String(state.counter));
  return `B-${String(state.counter).padStart(3, '0')}`;
}
function createOrder(e) {
  e.preventDefault();
  $('#error').textContent = '';
  if (!state.cart.length) { $('#error').textContent = tx('needCart'); return; }
  if (!isOpen($('#pickupDate').value, $('#pickupTime').value)) { $('#error').textContent = tx('closed'); return; }
  const code = nextOrderCode();
  const order = {
    order_code: code,
    created_at: new Date().toISOString(),
    pickup_date: $('#pickupDate').value,
    pickup_time: $('#pickupTime').value,
    customer_name: $('#customerName').value.trim(),
    phone: $('#phone').value.trim(),
    email: $('#email').value.trim(),
    comments: $('#comments').value.trim(),
    total: total(),
    items: state.cart.map(ci => {
      const item = window.WGF_MENU.find(m => m.code === ci.code);
      return { code: item.code, name_de: item.name_de, name_en: item.name_en, qty: ci.qty, sauces: ci.sauces, price: item.price };
    })
  };
  const orders = JSON.parse(localStorage.getItem('wgfOrders') || '[]');
  orders.push(order);
  localStorage.setItem('wgfOrders', JSON.stringify(orders));
  $('#orderCode').textContent = code;
  $('#success').style.display = 'block';
  state.cart = [];
  renderCart();
}


const WAHID_WHATSAPP_NUMBER = ''; // later: international format without +, e.g. 4917612345678

function createChatMessage(e) {
  e.preventDefault();
  const msg = {
    created_at: new Date().toISOString(),
    type: $('#chatType').value,
    name: $('#chatName').value.trim(),
    contact: $('#chatContact').value.trim(),
    message: $('#chatMessage').value.trim(),
    language: state.lang,
    page: location.href
  };
  const logs = JSON.parse(localStorage.getItem('wgfQuestions') || '[]');
  logs.push(msg);
  localStorage.setItem('wgfQuestions', JSON.stringify(logs));
  const text = `[Wahid Green Food] ${msg.type}
Name: ${msg.name || '-'}
Contact: ${msg.contact || '-'}
Message: ${msg.message}
Page: ${msg.page}`;
  if (WAHID_WHATSAPP_NUMBER) {
    window.open(`https://wa.me/${WAHID_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }
  const status = $('#chatStatus');
  status.style.display = 'block';
  status.textContent = tx('chatSaved');
  $('#chatForm').reset();
}

function init() {
  renderFilters(); renderMenu(); renderCart(); setDateDefaults(); translate();
  $$('.lang button').forEach(btn => btn.addEventListener('click', () => { state.lang = btn.dataset.lang; translate(); }));
  $('#orderForm').addEventListener('submit', createOrder);
  $('#chatForm').addEventListener('submit', createChatMessage);
}

document.addEventListener('DOMContentLoaded', init);
