## 🐥 Goose CLI Integration

This backend is prepared to integrate with [Goose CLI](https://github.com/llm-goose/goose), an AI-powered tool for document analysis (invoices, reports, etc.).

### 🔧 Local Setup

To run Goose locally alongside the backend:

1. Install Goose from its [official repository](https://github.com/llm-goose/goose).
2. Configure the `goose/config.yaml` file.
3. Make sure the `/goose` route is enabled in `api/index.js` (uncomment the relevant lines).
4. Start both services (backend + Goose) in parallel, using Docker or custom npm scripts.

### ☁️ Vercel Deployment

> 🛑 Vercel **does not support running external binaries or background processes** like Goose (no Docker or custom servers).

Because of this, the `/goose` endpoint is in demo mode on Vercel and returns:


## 🐥 Goose is currently in demo mode and taking a nap on the farm.


### 📦 Current Status

| Environment | Goose Available | Notes                                 |
|-------------|------------------|----------------------------------------|
| Local       | ✅ (optional)     | If manually installed and configured   |
| Vercel      | ❌                | Endpoint mocked, Goose not available   |

---

For contributions or local testing with Goose, check the `goose/` folder and uncomment the related routes.
