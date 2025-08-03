
# 🧾 CreditGoose – Frontend

This is the frontend application for **CreditGoose**, a smart invoice financing platform. Built with **React**, it allows users to connect their business account, submit invoices, enable auto-funding, and view reports.

## 🚀 Live Demo

👉 [https://credit-goose.vercel.app](https://credit-goose.vercel.app)

## 📦 Tech Stack

- React 18
- React Router DOM 7
- Tailwind CSS
- Vercel for deployment

## 🧩 Project Structure

```
src/
├── components/
│   ├── Dashboard.js
│   ├── SubmitInvoice.js
│   ├── AutoFundingSettings.js
│   └── Header.js
├── App.js
├── index.js
├── styles/
│   └── tailwind.css
└── ...
```

## ⚙️ Environment Variables

Create a `.env` file in the root of the project and add:

```env
REACT_APP_API_URL=https://creditgoosebe.vercel.app
```

You can also set this environment variable directly in **Vercel > Project Settings > Environment Variables**.

## 🛠️ Scripts

```bash
# Run the development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🧪 Features

- 🌐 Connect Square or other accounts
- 📤 Submit invoices for analysis and funding
- 🤖 Auto-funding configuration
- 📊 Dashboard & Reports (mocked or live)

## 🧠 Notes

> This project is part of an educational initiative and is currently running in demo mode. Some features like the Goose AI backend are mocked or disabled in production due to hosting limitations.

## 📄 License

MIT

---
