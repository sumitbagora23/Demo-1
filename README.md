## Run the website locally

From the **`public/`** folder, start any one of these servers:

### Option A — Python (usually pre-installed)
```bash
cd "public"
python3 -m http.server 5500
```

### Option B — PHP
```bash
cd "public"
php -S localhost:5500
```

### Option C — Node
```bash
cd "public"
npx serve -l 5500
```

Then open your browser at:

**http://localhost:5500/**

To stop the server, press `Ctrl + C` in the terminal.

---

## Easiest option (VS Code)

1. Install the **Live Server** extension.
2. Right-click `public/index.html` → **Open with Live Server**.

It serves the site over `http://` automatically and reloads on save.

---

## Project structure

```
company demo/
├── index.html              # redirect to public/index.html
├── README.md
└── public/
    ├── index.html          # the website
    ├── app.js              # UI, form validation, submit logic
    ├── firebase-init.js    # Firebase config + Firestore setup
    ├── styles.css
    └── assets/             # images & logo
```

---

## Firebase setup

The Firebase project config and full setup instructions live at the top of
[`public/firebase-init.js`](public/firebase-init.js). You review submitted
inquiries in the **Firebase Console → Firestore Database → `inquiries`**.
