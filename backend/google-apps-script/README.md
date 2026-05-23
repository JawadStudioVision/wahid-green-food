# Wahid order backend: Google Sheet + Telegram

This backend gives the customer the desired simple flow:

1. Customer clicks **Send order** on the website.
2. Website sends the order silently to Google Apps Script.
3. Apps Script saves the order in Google Sheets.
4. Apps Script sends a Telegram notification to Wahid.
5. Website shows the pickup code and success message.

## One-time setup

### 1. Create Telegram bot

1. Open Telegram and message `@BotFather`.
2. Run `/newbot`.
3. Copy the bot token.
4. Wahid must start the bot by pressing **Start**, or add the bot to a private order group.
5. Get Wahid's chat ID using one of these methods:
   - Send a message to the bot, then open: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
   - Or use a helper bot such as `@userinfobot` for personal chat ID.

### 2. Create Google Sheet

Create a Google Sheet named for example `Wahid Green Food Orders`.

### 3. Create Apps Script

1. In the Google Sheet: Extensions → Apps Script.
2. Paste `Code.gs` into the script editor.
3. Project Settings → Script properties:
   - `WGF_TELEGRAM_BOT_TOKEN` = bot token from BotFather
   - `WGF_TELEGRAM_CHAT_ID` = Wahid chat/group ID
   - `WGF_SHEET_ID` = the Google Sheet ID from the URL
4. Deploy → New deployment → Web app.
5. Execute as: **Me**.
6. Who has access: **Anyone**.
7. Copy the Web app URL.

### 4. Connect website

Set this in `index.html`:

```html
window.WAHID_ORDER_ENDPOINT = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```

After this, the customer no longer needs WhatsApp. The order button sends silently and Wahid receives the Telegram notification.

## Test

After deployment:

1. Place a test order from the live website.
2. Confirm a new row appears in Google Sheet.
3. Confirm Wahid receives a Telegram notification.
4. Confirm customer sees the pickup code on the website.
