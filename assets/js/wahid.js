const STORAGE_KEYS = {
  lang: 'wgfLang',
  orderCopies: 'wgfCustomerOrderCopies',
  chatCopies: 'wgfCustomerChatCopies',
};

const SUPPORTED_LANGS = ['de', 'en'];
const BERLIN_TIME_ZONE = 'Europe/Berlin';
const MIN_PICKUP_LEAD_MINUTES = 20;
const LOCAL_COPY_LIMIT = 10;
const PICKUP_STEP_MINUTES = 15;

function readStorage(key, fallback = '') {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Browser storage can be unavailable in private modes; the send/copy flow still works.
  }
}

function pushLocalCopy(key, entry) {
  try {
    const previous = JSON.parse(localStorage.getItem(key) || '[]');
    const next = [entry, ...(Array.isArray(previous) ? previous : [])].slice(0, LOCAL_COPY_LIMIT);
    localStorage.setItem(key, JSON.stringify(next));
  } catch (error) {
    // Local copies are a customer convenience only, not order delivery.
  }
}

function initialLang() {
  const saved = readStorage(STORAGE_KEYS.lang, 'de');
  return SUPPORTED_LANGS.includes(saved) ? saved : 'de';
}

const state = {
  lang: initialLang(),
  filter: 'all',
  cart: [],
};

const t = {
  de: {
    navMenu: 'Menü', navOrder: 'Bestellen', navInfo: 'Info', navChat: 'Fragen',
    heroSub: 'Halal • Vegan freundlich • Cottbus',
    heroTitle: "Wahid's Green Food",
    heroText: 'Wähle dein Essen und eine Abholzeit. Der Laden erhält die Bestellung direkt als Benachrichtigung.',
    orderNow: 'Jetzt bestellen', viewMenu: 'Menü ansehen',
    menuTitle: 'Menü',
    menuText: 'Preise laut Flyer-Stand. Keine Online-Zahlung; Abholung und Zahlung im Laden.',
    badgeHalal: 'Halal', badgeVegan: 'Vegane Optionen', badgeCottbus: 'Cottbus', badgePickup: 'Abholung',
    all: 'Alle', sandwich: 'Sandwiches', plate: 'Teller', burger: 'Burger', wrap: 'Wraps', side: 'Beilagen', add: 'Hinzufügen',
    orderTitle: 'Abholbestellung', cart: 'Warenkorb', empty: 'Noch keine Speisen ausgewählt.', sauces: 'Soßen', qty: 'Menge',
    pickup: 'Abholung', pickupDate: 'Datum', pickupTime: 'Uhrzeit',
    pickupHelp: 'Abholzeiten werden nach Deutschlandzeit geprüft. Mindestens 20 Minuten Vorlauf.',
    name: 'Name optional', phone: 'Telefon/WhatsApp optional', email: 'E-Mail optional',
    comments: 'Besondere Wünsche', commentsPh: 'z.B. ohne Zwiebeln, extra scharf, Soße separat ...',
    contactHelp: 'Kontakt ist optional. Ohne Kontakt kann der Laden dich bei Änderungen oder Rückfragen nicht erreichen.',
    allergyShort: 'Allergene: bitte im Laden nachfragen.',
    allergy: 'Bei Allergien oder Unverträglichkeiten bitte direkt im Laden nachfragen. Trotz sorgfältiger Zubereitung können Spuren anderer Allergene enthalten sein.',
    payment: 'Zahlung bei Abholung im Geschäft. Barzahlung oder Kartenzahlung möglich.',
    submit: 'Bestellung senden', total: 'Summe',
    closed: 'Zu dieser Zeit ist keine Abholung möglich.',
    needCart: 'Bitte zuerst mindestens ein Gericht auswählen.',
    pickupInvalid: 'Bitte ein gültiges Datum und eine gültige Uhrzeit wählen.',
    pickupPast: 'Bitte keine vergangene Abholzeit wählen.',
    pickupLead: 'Bitte mindestens 20 Minuten Vorlaufzeit einplanen.',
    pickupSunday: 'Sonntag ist geschlossen. Bitte einen anderen Tag wählen.',
    pickupHours: 'Bitte Mo-Fr 10:30-19:45 oder Sa 12:00-19:45 wählen.',
    success: 'Bestellung gesendet',
    orderNo: 'Ihr Abholcode ist',
    sayNo: 'Bitte behalten Sie den Abholcode. Der Laden bestätigt manuell bei Bedarf.',
    orderSent: 'Danke! Die Bestellung wurde an den Laden gesendet. Bitte behalten Sie Ihren Abholcode.',
    orderSendFailed: 'Die automatische Übermittlung ist fehlgeschlagen. Bitte im Laden anrufen oder die Nachricht kopieren.',
    orderWhatsAppOpened: 'WhatsApp wurde mit der Bestellung geöffnet. Bitte dort auf Senden tippen; diese Website sendet nicht automatisch.',
    orderManualContact: 'WhatsApp ist noch nicht verbunden. Bitte die Bestellnachricht kopieren und den Laden direkt kontaktieren.',
    orderPopupBlocked: 'WhatsApp konnte nicht geöffnet werden. Bitte die Bestellnachricht kopieren und den Laden direkt kontaktieren.',
    orderCopyLabel: 'Bestellnachricht zum Kopieren',
    localCopyOnly: 'Eine lokale Kundenkopie wurde nur in diesem Browser gespeichert. Sie wurde nicht an einen Server gesendet.',
    copyMessage: 'Nachricht kopieren',
    copied: 'Nachricht kopiert.',
    copyFallback: 'Bitte Nachricht markieren und kopieren.',
    infoTitle: 'Informationen', address: 'Adresse', hours: 'Öffnungszeiten',
    hoursText: 'Mo-Fr: 10:30-20:00\nSa: 12:00-20:00\nSo: geschlossen\nOnline-Abholzeiten bis 19:45',
    pay: 'Zahlung', follow: 'Folgen & Bewertungen', instagram: 'Instagram öffnen', happycow: 'HappyCow Bewertungen',
    manual: 'Die Bestellung wird an den Laden gesendet. Zahlung erfolgt bei Abholung.',
    chatTitle: 'Frage oder Problem melden',
    chatType: 'Art der Nachricht', chatTypeQuestion: 'Frage', chatTypeProblem: 'Problem / Fehler auf der Website',
    chatContact: 'Kontakt optional', chatMessage: 'Nachricht',
    chatPlaceholder: 'Schreiben Sie Ihre Frage oder das Problem hier ...',
    chatSend: 'Nachricht vorbereiten',
    chatNote: 'Statische v1: Die Website sendet nichts an einen Server. Mit WhatsApp-Konfiguration öffnet sich eine vorbereitete Nachricht.',
    chatHowTitle: 'So funktioniert es',
    chatHowText: 'Kunden können Fragen stellen oder Website-Probleme melden. Die Website bereitet dafür eine Nachricht vor, die direkt an den Laden gesendet oder kopiert werden muss.',
    chatNeedNumber: 'Ohne konfigurierte WhatsApp-Nummer muss die Nachricht kopiert und direkt an den Laden gesendet werden.',
    chatSaved: 'Nachricht vorbereitet.',
    chatWhatsAppOpened: 'WhatsApp wurde mit der Nachricht geöffnet. Bitte dort auf Senden tippen; diese Website sendet nicht automatisch.',
    chatManualContact: 'WhatsApp ist noch nicht verbunden. Bitte die Nachricht kopieren und den Laden direkt kontaktieren.',
    chatPopupBlocked: 'WhatsApp konnte nicht geöffnet werden. Bitte die Nachricht kopieren und den Laden direkt kontaktieren.',
    chatCopyLabel: 'Nachricht zum Kopieren',
    noSauce: 'Keine Soße',
  },
  en: {
    navMenu: 'Menu', navOrder: 'Order', navInfo: 'Info', navChat: 'Questions',
    heroSub: 'Halal • vegan-friendly • Cottbus',
    heroTitle: "Wahid's Green Food",
    heroText: 'Choose your food and pickup time. The shop receives the order directly as a notification.',
    orderNow: 'Order now', viewMenu: 'View menu',
    menuTitle: 'Menu',
    menuText: 'Prices follow the current flyer. No online payment; pickup and payment happen in the shop.',
    badgeHalal: 'Halal', badgeVegan: 'Vegan options', badgeCottbus: 'Cottbus', badgePickup: 'Pickup',
    all: 'All', sandwich: 'Sandwiches', plate: 'Plates', burger: 'Burgers', wrap: 'Wraps', side: 'Sides', add: 'Add',
    orderTitle: 'Pickup order', cart: 'Cart', empty: 'No food selected yet.', sauces: 'Sauces', qty: 'Qty',
    pickup: 'Pickup', pickupDate: 'Date', pickupTime: 'Time',
    pickupHelp: 'Pickup times are checked in Germany time. Minimum lead time is 20 minutes.',
    name: 'Name optional', phone: 'Phone/WhatsApp optional', email: 'Email optional',
    comments: 'Special requests', commentsPh: 'e.g. without onion, extra spicy, sauce on side ...',
    contactHelp: 'Contact is optional. Without contact, the shop cannot reach you about changes or questions.',
    allergyShort: 'Allergens: please ask in the shop.',
    allergy: 'If you have allergies or intolerances, please ask directly in the shop. Despite careful preparation, traces of other allergens may be present.',
    payment: 'Payment on pickup in the shop. Cash or card accepted.',
    submit: 'Send order', total: 'Total',
    closed: 'Pickup is not available at this time.',
    needCart: 'Please select at least one food item first.',
    pickupInvalid: 'Please choose a valid date and time.',
    pickupPast: 'Please do not choose a past pickup time.',
    pickupLead: 'Please allow at least 20 minutes lead time.',
    pickupSunday: 'Sunday is closed. Please choose another day.',
    pickupHours: 'Please choose Mon-Fri 10:30-19:45 or Sat 12:00-19:45.',
    success: 'Order sent',
    orderNo: 'Your pickup code is',
    sayNo: 'Please keep your pickup code. The shop will confirm manually if needed.',
    orderSent: 'Thank you! The order was sent to the shop. Please keep your pickup code.',
    orderSendFailed: 'Automatic sending failed. Please call the shop or copy the message.',
    orderWhatsAppOpened: 'WhatsApp opened with the order. Please tap Send there; this website does not send automatically.',
    orderManualContact: 'WhatsApp is not connected yet. Please copy the order message and contact the shop directly.',
    orderPopupBlocked: 'WhatsApp could not be opened. Please copy the order message and contact the shop directly.',
    orderCopyLabel: 'Order message to copy',
    localCopyOnly: 'A local customer copy was saved only in this browser. It was not sent to a server.',
    copyMessage: 'Copy message',
    copied: 'Message copied.',
    copyFallback: 'Please select and copy the message.',
    infoTitle: 'Information', address: 'Address', hours: 'Opening hours',
    hoursText: 'Mon-Fri: 10:30-20:00\nSat: 12:00-20:00\nSun: closed\nOnline pickup slots until 19:45',
    pay: 'Payment', follow: 'Follow & reviews', instagram: 'Open Instagram', happycow: 'HappyCow reviews',
    manual: 'The order is sent to the shop. Payment happens at pickup.',
    chatTitle: 'Ask a question or report a problem',
    chatType: 'Message type', chatTypeQuestion: 'Question', chatTypeProblem: 'Website problem / bug',
    chatContact: 'Contact optional', chatMessage: 'Message',
    chatPlaceholder: 'Write your question or the problem here ...',
    chatSend: 'Prepare message',
    chatNote: 'Static v1: this website sends nothing to a server. With WhatsApp configured, it opens a prepared message.',
    chatHowTitle: 'How it works',
    chatHowText: 'Customers can ask questions or report website problems. The website prepares a message that must be sent directly to the shop or copied.',
    chatNeedNumber: 'Without a configured WhatsApp number, the message must be copied and sent directly to the shop.',
    chatSaved: 'Message prepared.',
    chatWhatsAppOpened: 'WhatsApp opened with the message. Please tap Send there; this website does not send automatically.',
    chatManualContact: 'WhatsApp is not connected yet. Please copy the message and contact the shop directly.',
    chatPopupBlocked: 'WhatsApp could not be opened. Please copy the message and contact the shop directly.',
    chatCopyLabel: 'Message to copy',
    noSauce: 'No sauce',
  }
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const money = (n) => `${n.toFixed(2).replace('.', ',')} €`;
const tx = (key) => t[state.lang][key] || t.de[key] || key;
const WAHID_WHATSAPP_NUMBER = normalizeWhatsAppNumber(
  window.WAHID_WHATSAPP_NUMBER || (window.WAHID_CONFIG && window.WAHID_CONFIG.whatsappNumber) || ''
);
const WAHID_ORDER_ENDPOINT = String(
  window.WAHID_ORDER_ENDPOINT || (window.WAHID_CONFIG && window.WAHID_CONFIG.orderEndpoint) || ''
).trim();

function translate() {
  $$('[data-i18n]').forEach(el => el.textContent = tx(el.dataset.i18n));
  $$('[data-i18n-placeholder]').forEach(el => el.placeholder = tx(el.dataset.i18nPlaceholder));
  $$('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === state.lang));
  document.documentElement.lang = state.lang;
  renderMenu();
  renderCart();
  setDateDefaults();
}

function renderFilters() {
  const cats = ['all', 'sandwich', 'plate', 'burger', 'wrap', 'side'];
  $('#filters').innerHTML = cats.map(cat => `<button class="filter ${state.filter === cat ? 'active' : ''}" data-filter="${cat}">${tx(cat)}</button>`).join('');
  $$('#filters button').forEach(btn => btn.addEventListener('click', () => {
    state.filter = btn.dataset.filter;
    renderFilters();
    renderMenu();
  }));
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
      <p class="muted">${tx('allergyShort')}</p>
      <div class="card-row"><span class="price">${money(item.price)}</span><button class="add" data-add="${item.code}">${tx('add')}</button></div>
    </article>`).join('');
  $$('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.add)));
}

function addToCart(code) {
  const openPlainLine = state.cart.find(i => i.code === code && i.sauces.length === 0);
  if (openPlainLine) openPlainLine.qty += 1;
  else state.cart.push({ code, qty: 1, sauces: [] });
  renderCart();
  location.hash = '#order';
}

function renderCart() {
  if (!state.cart.length) {
    $('#cartItems').innerHTML = `<p class="muted">${tx('empty')}</p>`;
  } else {
    $('#cartItems').innerHTML = state.cart.map((ci, idx) => {
      const item = window.WGF_MENU.find(m => m.code === ci.code);
      const sauceLabels = window.WGF_SAUCES.map(s => `<label><input type="checkbox" data-sauce="${idx}:${s.id}" ${ci.sauces.includes(s.id) ? 'checked' : ''}> ${s[state.lang]}</label>`).join('');
      return `<div class="cart-item">
        <div>
          <strong>${item.code} — ${item[`name_${state.lang}`]}</strong><br><span class="muted">${money(item.price)} × ${ci.qty}</span>
          <div class="sauces" aria-label="${tx('sauces')}">${sauceLabels}</div>
        </div>
        <div class="qty"><button type="button" data-dec="${idx}">−</button><strong>${ci.qty}</strong><button type="button" data-inc="${idx}">+</button></div>
      </div>`;
    }).join('');
  }
  $('#total').textContent = money(total());
  $$('[data-inc]').forEach(b => b.addEventListener('click', () => {
    state.cart[b.dataset.inc].qty++;
    renderCart();
  }));
  $$('[data-dec]').forEach(b => b.addEventListener('click', () => {
    const i = Number(b.dataset.dec);
    state.cart[i].qty--;
    if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
    renderCart();
  }));
  $$('[data-sauce]').forEach(cb => cb.addEventListener('change', () => {
    const [idx, id] = cb.dataset.sauce.split(':');
    changeSauce(Number(idx), id, cb.checked);
  }));
}

function changeSauce(idx, id, checked) {
  const line = state.cart[idx];
  if (!line) return;

  if (id === 'none') {
    line.sauces = checked ? ['none'] : [];
    renderCart();
    return;
  }

  const next = new Set(line.sauces.filter(sauce => sauce !== 'none'));
  if (checked) next.add(id);
  else next.delete(id);
  line.sauces = [...next];
  renderCart();
}

function total() {
  return state.cart.reduce((sum, ci) => sum + (window.WGF_MENU.find(m => m.code === ci.code).price * ci.qty), 0);
}

function parseDateInput(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
  if (!match) return null;
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  const check = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (
    check.getUTCFullYear() !== parts.year ||
    check.getUTCMonth() + 1 !== parts.month ||
    check.getUTCDate() !== parts.day
  ) {
    return null;
  }
  return parts;
}

function parseTimeInput(timeStr) {
  const match = /^(\d{2}):(\d{2})$/.exec(timeStr || '');
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function getBerlinParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BERLIN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function formatDateParts(parts) {
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

function formatTimeParts(parts) {
  return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

function addDays(dateStr, days) {
  const parts = parseDateInput(dateStr);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return formatDateParts({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

function dayOfWeek(dateStr) {
  const parts = parseDateInput(dateStr);
  if (!parts) return NaN;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
}

function minutesToTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
  const parts = parseTimeInput(timeStr);
  return parts ? parts.hour * 60 + parts.minute : NaN;
}

function roundUpMinutes(minutes, step = PICKUP_STEP_MINUTES) {
  return Math.ceil(minutes / step) * step;
}

function pickupWindow(dateStr) {
  const day = dayOfWeek(dateStr);
  if (!Number.isFinite(day)) return null;
  if (day === 0) return null;
  if (day === 6) return { open: 12 * 60, close: 19 * 60 + 45 };
  return { open: 10 * 60 + 30, close: 19 * 60 + 45 };
}

function getTimeZoneOffsetMs(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  const zonedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return zonedAsUtc - date.getTime();
}

function berlinWallTimeToUtcMs(dateStr, timeStr) {
  const date = parseDateInput(dateStr);
  const time = parseTimeInput(timeStr);
  if (!date || !time) return NaN;

  const wallTimeMs = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute, 0);
  let utcMs = wallTimeMs;
  for (let i = 0; i < 3; i++) {
    utcMs = wallTimeMs - getTimeZoneOffsetMs(new Date(utcMs), BERLIN_TIME_ZONE);
  }
  return utcMs;
}

function nextPickupSlot() {
  const leadDate = new Date(Date.now() + MIN_PICKUP_LEAD_MINUTES * 60 * 1000);
  const leadParts = getBerlinParts(leadDate);
  const startDate = formatDateParts(leadParts);
  const startMinutes = leadParts.hour * 60 + leadParts.minute + (leadParts.second > 0 ? 1 : 0);

  for (let offset = 0; offset < 21; offset++) {
    const dateStr = addDays(startDate, offset);
    const hours = pickupWindow(dateStr);
    if (!hours) continue;

    const earliest = offset === 0 ? Math.max(hours.open, roundUpMinutes(startMinutes)) : hours.open;
    if (earliest <= hours.close) {
      return { date: dateStr, time: minutesToTime(earliest) };
    }
  }

  return { date: startDate, time: '18:00' };
}

function updatePickupInputLimits() {
  const date = $('#pickupDate');
  const time = $('#pickupTime');
  if (!date || !time) return;

  const today = formatDateParts(getBerlinParts());
  date.min = today;

  const hours = pickupWindow(date.value || today);
  if (!hours) {
    time.min = '';
    time.max = '';
    return;
  }

  let minMinutes = hours.open;
  const minLeadParts = getBerlinParts(new Date(Date.now() + MIN_PICKUP_LEAD_MINUTES * 60 * 1000));
  if ((date.value || today) === formatDateParts(minLeadParts)) {
    const leadMinutes = minLeadParts.hour * 60 + minLeadParts.minute + (minLeadParts.second > 0 ? 1 : 0);
    minMinutes = Math.max(minMinutes, roundUpMinutes(leadMinutes));
  }

  time.min = minutesToTime(minMinutes);
  time.max = minutesToTime(hours.close);
}

function setDateDefaults() {
  const date = $('#pickupDate');
  const time = $('#pickupTime');
  if (!date || !time) return;

  if (!date.value || !time.value) {
    const next = nextPickupSlot();
    date.value = next.date;
    time.value = next.time;
  }
  updatePickupInputLimits();
}

function validatePickup(dateStr, timeStr) {
  if (!parseDateInput(dateStr) || !parseTimeInput(timeStr)) {
    return { valid: false, message: tx('pickupInvalid') };
  }

  const day = dayOfWeek(dateStr);
  if (day === 0) return { valid: false, message: tx('pickupSunday') };

  const hours = pickupWindow(dateStr);
  const minutes = timeToMinutes(timeStr);
  if (!hours || minutes < hours.open || minutes > hours.close) {
    return { valid: false, message: tx('pickupHours') };
  }

  const selectedMs = berlinWallTimeToUtcMs(dateStr, timeStr);
  const nowMs = Date.now();
  if (!Number.isFinite(selectedMs)) return { valid: false, message: tx('pickupInvalid') };
  if (selectedMs < nowMs) return { valid: false, message: tx('pickupPast') };
  if (selectedMs < nowMs + MIN_PICKUP_LEAD_MINUTES * 60 * 1000) {
    return { valid: false, message: tx('pickupLead') };
  }

  return { valid: true };
}

function normalizeWhatsAppNumber(value) {
  return String(value || '').replace(/[^\d]/g, '');
}

function openWhatsAppMessage(message) {
  if (!WAHID_WHATSAPP_NUMBER) return false;
  const encodedMessage = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${WAHID_WHATSAPP_NUMBER}&text=${encodedMessage}`;
  const webFallbackUrl = `https://wa.me/${WAHID_WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Prefer the native WhatsApp app for the easiest customer flow. If the browser
  // cannot hand off to the app, fall back to WhatsApp's normal web handoff page.
  window.location.href = appUrl;
  window.setTimeout(() => {
    if (!document.hidden) window.location.href = webFallbackUrl;
  }, 1200);
  return true;
}

async function copyText(text, fallbackSelector) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall through to selection fallback.
  }

  const fallback = fallbackSelector ? $(fallbackSelector) : null;
  if (fallback) {
    fallback.focus();
    fallback.select();
    try {
      return document.execCommand('copy');
    } catch (error) {
      return false;
    }
  }
  return false;
}

function randomSuffix(length = 5) {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = new Uint8Array(length);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return [...bytes].map(byte => alphabet[byte % alphabet.length]).join('');
}

function nextOrderCode() {
  return randomSuffix(4);
}

function selectedSauceLabels(sauces) {
  if (!sauces.length) return '-';
  return sauces.map(id => {
    const sauce = window.WGF_SAUCES.find(item => item.id === id);
    return sauce ? sauce[state.lang] : id;
  }).join(', ');
}

function buildOrderMessage(order) {
  const lines = state.lang === 'de'
    ? [
        "Wahid's Green Food Abholbestellung",
        `Abholcode: ${order.order_code}`,
        `Erstellt: ${order.created_display} Deutschlandzeit`,
        `Abholung: ${order.pickup_date} ${order.pickup_time} Deutschlandzeit`,
        `Name: ${order.customer_name || '-'}`,
        `Telefon/WhatsApp: ${order.phone || '-'}`,
        `E-Mail: ${order.email || '-'}`,
        '',
        'Gerichte:',
        ...order.items.map(item => `- ${item.qty}x ${item.code} ${item.name} (${money(item.price)} je) | Soßen: ${item.sauce_labels}`),
        '',
        `Summe: ${money(order.total)}`,
        `Besondere Wünsche: ${order.comments || '-'}`,
        '',
        'Zahlung: im Laden bei Abholung, bar oder Karte.',
        tx('allergy'),
        'Hinweis: Diese Nachricht wurde auf der statischen Website vorbereitet. Bitte direkt mit dem Laden bestätigen.',
      ]
    : [
        "Wahid's Green Food pickup order",
        `Pickup code: ${order.order_code}`,
        `Created: ${order.created_display} Germany time`,
        `Pickup: ${order.pickup_date} ${order.pickup_time} Germany time`,
        `Name: ${order.customer_name || '-'}`,
        `Phone/WhatsApp: ${order.phone || '-'}`,
        `Email: ${order.email || '-'}`,
        '',
        'Items:',
        ...order.items.map(item => `- ${item.qty}x ${item.code} ${item.name} (${money(item.price)} each) | Sauces: ${item.sauce_labels}`),
        '',
        `Total: ${money(order.total)}`,
        `Special requests: ${order.comments || '-'}`,
        '',
        'Payment: in the shop at pickup, cash or card.',
        tx('allergy'),
        'Note: This message was prepared on the static website. Please confirm directly with the shop.',
      ];
  return lines.join('\n');
}

async function sendOrderToBackend(order) {
  if (!WAHID_ORDER_ENDPOINT) return false;

  const frameName = `wgf-order-frame-${Date.now()}-${randomSuffix(3)}`;
  const iframe = document.createElement('iframe');
  iframe.name = frameName;
  iframe.hidden = true;
  iframe.style.display = 'none';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = WAHID_ORDER_ENDPOINT;
  form.target = frameName;
  form.enctype = 'application/x-www-form-urlencoded';
  form.hidden = true;

  const payload = document.createElement('input');
  payload.type = 'hidden';
  payload.name = 'payload';
  payload.value = JSON.stringify(order);
  form.appendChild(payload);

  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();
  window.setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 10000);
  return true;
}

function setOrderResult(message, statusKey, showCopyBlock = false) {
  $('#orderActionMessage').textContent = tx(statusKey);
  $('#orderMessage').value = message;
  $('#orderCopyStatus').textContent = tx('localCopyOnly');
  $('#success').style.display = 'block';
  $('#orderCopyBlock').hidden = !showCopyBlock;
}

async function createOrder(e) {
  e.preventDefault();
  $('#error').textContent = '';

  if (!state.cart.length) {
    $('#error').textContent = tx('needCart');
    return;
  }

  const pickupCheck = validatePickup($('#pickupDate').value, $('#pickupTime').value);
  if (!pickupCheck.valid) {
    $('#error').textContent = pickupCheck.message;
    return;
  }

  const code = nextOrderCode();
  const createdParts = getBerlinParts();
  const order = {
    order_code: code,
    created_at: new Date().toISOString(),
    created_display: `${formatDateParts(createdParts)} ${formatTimeParts(createdParts)}`,
    pickup_date: $('#pickupDate').value,
    pickup_time: $('#pickupTime').value,
    customer_name: $('#customerName').value.trim(),
    phone: $('#phone').value.trim(),
    email: $('#email').value.trim(),
    comments: $('#comments').value.trim(),
    total: total(),
    language: state.lang,
    items: state.cart.map(ci => {
      const item = window.WGF_MENU.find(m => m.code === ci.code);
      return {
        code: item.code,
        name: item[`name_${state.lang}`],
        qty: ci.qty,
        sauces: ci.sauces,
        sauce_labels: selectedSauceLabels(ci.sauces),
        price: item.price,
      };
    }),
  };
  const message = buildOrderMessage(order);
  pushLocalCopy(STORAGE_KEYS.orderCopies, { code, message, created_at: order.created_at });

  $('#orderCode').textContent = code;

  if (WAHID_ORDER_ENDPOINT) {
    try {
      setOrderResult(message, 'orderSent', false);
      state.cart = [];
      renderCart();
      await sendOrderToBackend(order);
      return;
    } catch (error) {
      setOrderResult(message, 'orderSendFailed', true);
      const copied = await copyText(message, '#orderMessage');
      $('#orderCopyStatus').textContent = copied ? `${tx('copied')} ${tx('localCopyOnly')}` : `${tx('copyFallback')} ${tx('localCopyOnly')}`;
      return;
    }
  }

  const opened = openWhatsAppMessage(message);
  const statusKey = WAHID_WHATSAPP_NUMBER ? (opened ? 'orderWhatsAppOpened' : 'orderPopupBlocked') : 'orderManualContact';
  setOrderResult(message, statusKey, true);

  if (!WAHID_WHATSAPP_NUMBER || !opened) {
    const copied = await copyText(message, '#orderMessage');
    $('#orderCopyStatus').textContent = copied ? `${tx('copied')} ${tx('localCopyOnly')}` : `${tx('copyFallback')} ${tx('localCopyOnly')}`;
  }

  state.cart = [];
  renderCart();
}

function buildChatMessage(msg) {
  const typeLabel = msg.type === 'problem' ? tx('chatTypeProblem') : tx('chatTypeQuestion');
  const lines = state.lang === 'de'
    ? [
        "Wahid's Green Food Nachricht",
        `Art: ${typeLabel}`,
        `Erstellt: ${msg.created_display} Deutschlandzeit`,
        `Name: ${msg.name || '-'}`,
        `Kontakt: ${msg.contact || '-'}`,
        '',
        'Nachricht:',
        msg.message,
        '',
        `Seite: ${msg.page}`,
        'Hinweis: Diese Nachricht wurde auf der statischen Website vorbereitet. Bitte direkt mit dem Laden klären.',
      ]
    : [
        "Wahid's Green Food message",
        `Type: ${typeLabel}`,
        `Created: ${msg.created_display} Germany time`,
        `Name: ${msg.name || '-'}`,
        `Contact: ${msg.contact || '-'}`,
        '',
        'Message:',
        msg.message,
        '',
        `Page: ${msg.page}`,
        'Note: This message was prepared on the static website. Please coordinate directly with the shop.',
      ];
  return lines.join('\n');
}

async function createChatMessage(e) {
  e.preventDefault();
  const createdParts = getBerlinParts();
  const msg = {
    created_at: new Date().toISOString(),
    created_display: `${formatDateParts(createdParts)} ${formatTimeParts(createdParts)}`,
    type: $('#chatType').value,
    name: $('#chatName').value.trim(),
    contact: $('#chatContact').value.trim(),
    message: $('#chatMessage').value.trim(),
    language: state.lang,
    page: location.href,
  };
  const text = buildChatMessage(msg);
  pushLocalCopy(STORAGE_KEYS.chatCopies, { message: text, created_at: msg.created_at });

  const opened = openWhatsAppMessage(text);
  const statusKey = WAHID_WHATSAPP_NUMBER ? (opened ? 'chatWhatsAppOpened' : 'chatPopupBlocked') : 'chatManualContact';
  const status = $('#chatStatus');
  status.style.display = 'block';
  status.textContent = `${tx('chatSaved')} ${tx(statusKey)}`;
  $('#chatPreparedMessage').value = text;
  $('#chatMessageCopy').hidden = false;
  $('#chatCopyStatus').textContent = tx('localCopyOnly');

  if (!WAHID_WHATSAPP_NUMBER || !opened) {
    const copied = await copyText(text, '#chatPreparedMessage');
    $('#chatCopyStatus').textContent = copied ? `${tx('copied')} ${tx('localCopyOnly')}` : `${tx('copyFallback')} ${tx('localCopyOnly')}`;
  }

  $('#chatForm').reset();
}

function bindCopyButtons() {
  $('#copyOrderMessage').addEventListener('click', async () => {
    const copied = await copyText($('#orderMessage').value, '#orderMessage');
    $('#orderCopyStatus').textContent = copied ? `${tx('copied')} ${tx('localCopyOnly')}` : tx('copyFallback');
  });
  $('#copyChatMessage').addEventListener('click', async () => {
    const copied = await copyText($('#chatPreparedMessage').value, '#chatPreparedMessage');
    $('#chatCopyStatus').textContent = copied ? `${tx('copied')} ${tx('localCopyOnly')}` : tx('copyFallback');
  });
}

function bindPickupInputs() {
  $('#pickupDate').addEventListener('change', updatePickupInputLimits);
  $('#pickupTime').addEventListener('change', () => {
    const error = $('#error');
    if (!error.textContent) return;
    const pickupCheck = validatePickup($('#pickupDate').value, $('#pickupTime').value);
    if (pickupCheck.valid) error.textContent = '';
  });
}

function init() {
  renderFilters();
  renderMenu();
  renderCart();
  setDateDefaults();
  translate();
  $$('.lang button').forEach(btn => btn.addEventListener('click', () => {
    state.lang = btn.dataset.lang;
    writeStorage(STORAGE_KEYS.lang, state.lang);
    translate();
  }));
  bindPickupInputs();
  bindCopyButtons();
  $('#orderForm').addEventListener('submit', createOrder);
  $('#chatForm').addEventListener('submit', createChatMessage);
}

document.addEventListener('DOMContentLoaded', init);
