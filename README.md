# Wahid Green Food Prototype v1

Local static prototype for Wahid's Green Food pickup ordering.

## Run locally

```bash
cd /root/solo-ai-agent-business/wahid-green-food
python3 -m http.server 8087
```

Open:

```text
http://127.0.0.1:8087/
```

## Current features

- German default language
- English language switch
- Menu categories and prices from flyer draft
- Cart with multiple items
- Quantity plus/minus
- Multiple sauce selection
- Optional customer name, phone/WhatsApp, email
- Pickup date and time
- Opening-hour validation
- Short order code like B-001
- Local order storage in browser localStorage
- Confirmation screen with order JSON for testing
- Instagram and HappyCow links
- Payment-on-pickup notice
- Allergy/simple ask-in-shop notice

## Important limitations

- Photos are template placeholders and must be replaced with Wahid/Instagram approved photos.
- Orders are only saved in the visitor browser for now.
- Telegram notification is not connected yet.
- WhatsApp notification is not connected yet.
- No online payment.
- No delivery.
- Menu/all prices should be verified one final time before publishing.

## Next implementation tasks

1. Replace placeholder images with Wahid-approved photos.
2. Add real logo image or cleaned/recreated logo.
3. Add backend or serverless endpoint for order submission.
4. Connect Telegram test notification.
5. Add admin/order list for Wahid or send order summaries.
6. Deploy to Cloudflare Pages/Netlify.
7. Later connect WhatsApp.
