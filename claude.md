# Project Context: Curated Reads

## 1. Project Overview

"Curated Reads" is a headless, premium e-commerce web application. It serves as a reference implementation for integrating the **CleverTap Web SDK** into a modern Next.js environment, demonstrating full-funnel analytics, user identity management, and multi-channel engagement (Push, Native Display, Popups).

The design aesthetic is "Awwwards-winning": editorial typography, minimalist layouts, glassmorphism, and kinetic smooth animations.

---

## 2. Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS (v4)
- **Animation:** Framer Motion
- **State Management:** Zustand (with LocalStorage persistence)
- **Icons:** Phosphor Icons (Light/Thin weights)
- **Analytics/CRM:** CleverTap Web SDK
- **Data Source:** Google Books API

### Directory Structure

```text
/src
  /app                  # Next.js App Router (Pages & Layouts)
    /shop               # Product Grid with Category filtering
    /book/[id]          # Dynamic Product Details page
    /cart               # Checkout and Cart logic
    /profile            # User CRM updates
  /components           # UI Building Blocks
    Header.tsx          # Responsive Nav (Transparent to Solid, Mobile Hamburger)
    Footer.tsx          # Mega-footer with Newsletter
    NativeSpotlight.tsx # CleverTap Native Display integration
  /lib
    store.ts            # Zustand global state (Auth, Cart, Toasts)
```

---

## 3. Engineering Rules & Best Practices

### A. API Integration (Google Books) - STRICT RULES

We have faced severe Rate Limiting (429 Quota Exceeded) and malformed data issues from the Google Books API. **All future API calls MUST follow these rules:**

1. **API Key Injection:** Every fetch request to `googleapis.com` MUST include `?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}` (or `&key=`).
2. **Defensive Programming:** Never assume data exists.
   - ALWAYS check for `data.error` immediately after parsing JSON.
   - ALWAYS use optional chaining for images: `data.volumeInfo?.imageLinks?.thumbnail`.
   - ALWAYS provide a fallback image URL if the thumbnail is missing.
   - Strip raw HTML from descriptions using regex.
3. **Caching:** If fetching lists of books (like the Shop page), ALWAYS cache the JSON response in `sessionStorage` to prevent burning the API quota on page navigation or hot-reloads.
4. **Graceful Degradation:** Pages MUST NOT crash to a white screen if the API fails. Catch errors and render a fallback UI (e.g., a "Volume Unavailable" message or a hardcoded `FALLBACK_BOOK` object).

### B. CleverTap SDK Integration Rules

1. **Client-Side Only:** CleverTap relies on the `window` object. It MUST be dynamically imported inside `useEffect` or event handlers.
   ```typescript
   if (typeof window !== "undefined") {
     const ctModule = await import("clevertap-web-sdk");
     const ct = ctModule.default || ctModule;
     ct.event.push("Event Name", { ...props });
   }
   ```
2. **Event Taxonomy:**
   - `onUserLogin`: Fired on Login (creates Identity via Epoch time).
   - `profile.push`: Fired on Profile Update (updates Name, Email).
   - `Added to Cart`: Fired universally on all Add to Cart buttons.
   - `Category Viewed`: Fired on Shop page filter clicks.
   - `Charged`: Fired on Checkout completion.
3. **Web Push:** Handled manually via `clevertap.notifications.push({...})` to comply with modern browser anti-spam policies. Requires `clevertap_sw.js` and `manifest.json` (Firebase Sender ID).

### C. UI/UX & Next.js Guidelines

1. **Design System (Tailwind):**
   - Backgrounds: `bg-paper` (#Fdfbf7 - warm off-white).
   - Text: `text-ink` (#1a1a1a - soft black).
   - Accents: `#9F8155` (Antique Bronze/Gold).
   - Typography: Use `font-serif` for primary headings, `font-sans text-xs uppercase tracking-widest` for buttons, labels, and metadata.
2. **Next.js Image Optimization:**
   - ALWAYS use Next.js `<Image />` component.
   - **LCP Optimization:** The first 1-4 images on any screen (Above the Fold) MUST have the `priority` prop set to `true` to satisfy Core Web Vitals.
3. **Responsiveness:**
   - Mobile navigation uses a Framer Motion slide-down overlay (Hamburger menu). Do not rely solely on `hidden lg:flex`.
4. **Loading States:**
   - Prefer subtle loading animations (spinning rings, pulsing skeletons) over blocking the entire UI.

---

## 4. State Management (Zustand)

- All shared logic (Cart Array, User Session Object, Toast Triggers) lives in `src/lib/store.ts`.
- Components should subscribe only to the state they need.
- DO NOT use standard `window.alert()`. ALWAYS use `useAuthStore().showToast('message')` for notifications.

---

## 5. Development Workflow Context

- When generating code for this project, ensure all new components include `"use client"` if they utilize hooks, Framer Motion, or CleverTap.
- Keep components modular. If a page file exceeds 300 lines, extract sub-components (like `BookCard`) into the same file or a separate component file.
- Write Git commit messages using conventional commits (e.g., `feat:`, `fix:`, `perf:`).

```
***
```
