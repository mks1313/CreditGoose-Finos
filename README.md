# CreditGoose 🪙

![FINOS Labs](https://img.shields.io/badge/FINOS%20Labs-Incubating-blue)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![Made with React](https://img.shields.io/badge/Frontend-React-blue)

**CreditGoose** is a lightweight financial tool designed to manage and analyze invoice funding workflows for small businesses and analysts.

This project was initiated during a [FINOS Labs](https://www.finos.org/labs) hackathon and follows the [project-blueprint](https://github.com/finos-labs/project-blueprint) structure.

---

## 📁 Project Structure

```
creditgoose-finos/
├── frontend/   # React app (invoice submission, status tracking)
├── backend/    # Express API (business logic, data handling)
├── docs/       # (optional) Technical docs and architecture
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:mks1313/CreditGoose-Finos.git
cd creditgoose-finos
```

### 2. Install & run the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`

### 3. Install & run the backend

In a separate terminal:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Language:** JavaScript (ES6+)

---

## 🤝 Contributing

We welcome contributions via Pull Requests.  
Please follow the project style and structure guidelines.

### 📜 Developer Certificate of Origin (DCO)

All commits must be signed-off using the `-s` flag in your commit message:

```bash
git commit -s -m "your message"
```

The sign-off must appear at the end of the commit message like this:

```
Signed-off-by: Your Name <your.email@example.com>
```

By signing off, you confirm that you have the legal right to contribute this code under the project's license.  
Learn more about the DCO: [https://developercertificate.org](https://developercertificate.org)

For additional contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 👨‍🔧 Maintainers

- **Maksim Marinov** ([mks1313](https://github.com/mks1313))
- **Francesco** ([framosco0](https://github.com/framosco0))

---

## 📝 License

This project is licensed under the [Apache 2.0 License](./LICENSE).

SPDX-License-Identifier: Apache-2.0

---

## 📢 Contact

For questions or collaboration, open an issue or contact the maintainers via [FINOS Labs](https://www.finos.org/labs).

---

## 🧪 Related Projects

This repo follows the structure of other FINOS Labs projects, such as  
[dtcc-i-h-2025-aura](https://github.com/finos-labs/dtcc-i-h-2025-aura)
