# Wahid Green Food static v1

Static GitHub Pages site for Wahid's Green Food pickup ordering.

## Run locally

```bash
cd /root/solo-ai-agent-business/wahid-green-food
python3 -m http.server 8087
```

Open:

```text
http://127.0.0.1:8087/
```

## Public v1 behavior

- The site is fully static: HTML, CSS, JavaScript, and menu data only.
- There is no backend, database, admin panel, online payment, delivery workflow, Telegram bot, or server order storage.
- Orders and chat messages are prepared as customer-copy messages.
- A short local browser copy is kept only for the visitor's convenience; it is not shop storage and is not available to Wahid unless the customer sends it.
- Pickup validation uses practical client-side Germany time logic: no past pickup, minimum 20 minutes lead time, Sunday blocked, Mon-Fri 10:30-19:45, Saturday 12:00-19:45.
- Allergy wording is intentionally general because item-level allergen data is not confirmed.

## WhatsApp setup

In `index.html`, set the public WhatsApp number in international format without `+`, spaces, or dashes:

```html
<script>
  window.WAHID_WHATSAPP_NUMBER = '4917612345678';
</script>
```

This is not a secret token. It is a public phone number used only to open `wa.me` with a prefilled message. The customer must still tap Send in WhatsApp.

If `window.WAHID_WHATSAPP_NUMBER` is empty, the site shows the full order/chat message, tries to copy it to the clipboard, and asks the customer to contact the shop directly.

## Current features

- German default language with persisted English/German switch
- Menu categories and prices from the current business-info draft
- Cart with quantity controls and separate lines for the same item when sauces differ
- Sauce validation that prevents "No sauce" from being combined with other sauces
- Globally safer pickup code format with Germany date/time and random suffix
- WhatsApp-prefilled or copy-only order flow
- WhatsApp-prefilled or copy-only chat/problem flow
- Payment-on-pickup notice
- Strong allergy notice from `WAHID_BUSINESS_INFO.md`
- Instagram and HappyCow links

## Checks

```bash
node --check assets/js/wahid.js
node --check data/menu.js
```

## Later work

1. Add Wahid-approved production food photos.
2. Confirm final menu and prices before broader promotion.
3. Add a real backend or serverless function if Wahid needs persistent order storage or staff notifications.
4. Add an admin/order list only after backend storage and access control exist.
