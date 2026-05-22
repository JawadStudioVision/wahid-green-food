/**
 * Wahid's Green Food — Google Apps Script order backend
 *
 * Flow:
 * Website POSTs order JSON -> this script saves it to Google Sheet -> sends Telegram notification to Wahid.
 *
 * Setup in Apps Script Project Settings > Script properties:
 * - TELEGRAM_BOT_TOKEN: bot token from @BotFather
 * - TELEGRAM_CHAT_ID: Wahid's Telegram chat ID or group chat ID
 * - SHEET_ID: optional; if empty, uses the active spreadsheet
 */

const ORDER_SHEET_NAME = 'Orders';
const REQUIRED_HEADERS = [
  'Received At',
  'Order Code',
  'Pickup Date',
  'Pickup Time',
  'Customer Name',
  'Phone',
  'Email',
  'Items',
  'Total',
  'Comments',
  'Language',
  'Raw JSON',
];

function doPost(e) {
  try {
    const order = parseOrder_(e);
    validateOrder_(order);
    appendOrder_(order);
    sendTelegram_(formatTelegramMessage_(order));
    return json_({ ok: true, order_code: order.order_code });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "Wahid's Green Food order backend" });
}

function parseOrder_(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  const parsed = JSON.parse(raw);
  parsed._raw = raw;
  parsed.received_at = new Date().toISOString();
  return parsed;
}

function validateOrder_(order) {
  if (!order || typeof order !== 'object') throw new Error('Missing order payload');
  if (!order.order_code) throw new Error('Missing order code');
  if (!Array.isArray(order.items) || order.items.length === 0) throw new Error('Missing order items');
  if (!order.pickup_date || !order.pickup_time) throw new Error('Missing pickup date/time');
}

function appendOrder_(order) {
  const sheet = getOrdersSheet_();
  sheet.appendRow([
    order.received_at || new Date().toISOString(),
    order.order_code || '',
    order.pickup_date || '',
    order.pickup_time || '',
    order.customer_name || '',
    order.phone || '',
    order.email || '',
    formatItems_(order.items),
    Number(order.total || 0),
    order.comments || '',
    order.language || '',
    order._raw || JSON.stringify(order),
  ]);
}

function getOrdersSheet_() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty('SHEET_ID');
  const spreadsheet = sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('No spreadsheet available. Set SHEET_ID script property.');

  let sheet = spreadsheet.getSheetByName(ORDER_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(ORDER_SHEET_NAME);

  const currentHeaders = sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).getValues()[0];
  const needsHeaders = REQUIRED_HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setValues([REQUIRED_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function formatItems_(items) {
  return (items || []).map((item) => {
    const sauces = item.sauce_labels && item.sauce_labels.length ? ` (${item.sauce_labels.join(', ')})` : '';
    return `${item.qty}x ${item.code} ${item.name}${sauces}`;
  }).join('\n');
}

function formatTelegramMessage_(order) {
  const items = formatItems_(order.items);
  const total = Number(order.total || 0).toFixed(2).replace('.', ',') + ' €';
  const customer = order.customer_name || '-';
  const phone = order.phone || '-';
  const email = order.email || '-';
  const comments = order.comments || '-';

  return [
    '🔔 Neue Bestellung — Wahid Green Food',
    '',
    `Code: ${order.order_code}`,
    `Abholung: ${order.pickup_date} ${order.pickup_time}`,
    `Summe: ${total}`,
    '',
    'Artikel:',
    items,
    '',
    `Name: ${customer}`,
    `Telefon: ${phone}`,
    `E-Mail: ${email}`,
    `Wünsche: ${comments}`,
  ].join('\n');
}

function sendTelegram_(text) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID script property');

  const response = UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error(`Telegram send failed: HTTP ${code} ${response.getContentText()}`);
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
