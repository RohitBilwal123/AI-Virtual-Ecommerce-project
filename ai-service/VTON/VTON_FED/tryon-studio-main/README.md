# AuraFit — AI-Powered Virtual Try-On Studio (Frontend)

[![Live Website](https://img.shields.io/badge/Live%20Website-aurafit--phi.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://aurafit-phi.vercel.app/)

AuraFit is a modern virtual try-on application built with **React 18, Vite, TypeScript, and TailwindCSS / shadcn/ui**, allowing users to visualize how different garments look on them using multi-worker neural inpainting diffusion technology.

---

## 🌐 Live Production

- **Frontend (Vercel)**: **[https://aurafit-phi.vercel.app/](https://aurafit-phi.vercel.app/)**
- **Backend API (Render)**: **[https://aurafit-backend-ql0b.onrender.com](https://aurafit-backend-ql0b.onrender.com)**

---

## 🛠️ Project Structure

- `src/pages/`
  - `Index.tsx`: Modern landing page and product showcases.
  - `TryOnWizard.tsx`: 3-step interactive virtual try-on wizard.
  - `ProductGallery.tsx`: Catalog product browser and match score viewer.
  - `ProductDetail.tsx`: High-resolution garment and try-on inspector.
  - `Gallery.tsx`: Saved lookbook and comparison grid.
  - `CheckoutNew.tsx`: Cart & checkout flow.
  - `Admin.tsx`: Garment catalog and inventory manager.
  - `Profile.tsx`: User profile and history.
- `src/contexts/`
  - `TryOnContext.tsx`: Shared state management for active try-on sessions.
- `src/lib/`
  - `api.ts`: API integration layer supporting dynamic cloud backends via `VITE_API_BASE_URL`.
  - `products.ts`: Dynamic product generator with matching scores.

---

## 💻 Local Development

```powershell
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open **http://localhost:8080** (or **http://localhost:5173**) in your browser.

---

## 🚀 Building for Production

```powershell
npm run build
```

The output bundle will be generated in `dist/`.

---

© 2026 AuraFit. All rights reserved.
