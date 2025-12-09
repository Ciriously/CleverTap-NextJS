# Curated Reads | CleverTap Web SDK Reference

**Live Demo:** https://curated-archive.vercel.app/
**Stack:** Next.js 14 (App Router), TypeScript, Zustand, CleverTap Web SDK.

This repository serves as a **Reference Implementation** for integrating the CleverTap Web SDK into a modern Next.js application. It demonstrates how to handle Server-Side Rendering (SSR), Hydration, and Dynamic Imports while maintaining a full-funnel analytics strategy.

---

## 🏗️ Architecture & State Management

To prevent data mismatch and ensure performance, this project decouples the UI from the Analytics logic using **Zustand**.

- **Location:** `src/lib/store.ts`
- **The Pattern:**
  1.  User interacts with UI (e.g., clicks "Add to Cart").
  2.  Zustand updates the local Application State (Cart Array).
  3.  Zustand persists data to `LocalStorage`.
  4.  **Simultaneously**, the action triggers `clevertap.event.push()`.

This ensures that the Analytics Dashboard is always 1:1 synchronized with the user's actual cart state.

---

## 📊 Event Dictionary & Implementation Matrix

Below is the complete map of events tracked in this application, mapped to their specific UI triggers and file locations.

### 1. User Identity & Profiles

We utilize a robust Identity management system generating unique IDs based on Epoch time to prevent user duplication.

| Event / Method      | File Location              | Trigger Interaction                                      | Data Passed                                  |
| :------------------ | :------------------------- | :------------------------------------------------------- | :------------------------------------------- |
| **onUserLogin**     | `src/lib/store.ts`         | User clicks **"Generate ID & Enter"** on the Login Page. | `Name`, `Identity` (Epoch), `Email`, `Phone` |
| **profile.push**    | `src/app/profile/page.tsx` | User clicks **"Save Updates"** on the Profile Page.      | Updates `Name`, `Phone`, `Email`             |
| **Profile Updated** | `src/app/profile/page.tsx` | Fired immediately after `profile.push` success.          | `Status: "Success"`                          |

### 2. Funnel & Commerce Events

We track the user's journey from discovery to conversion using a standardized event taxonomy.

| Event Name          | File Location                | Trigger Interaction                                     | Properties                                                      |
| :------------------ | :--------------------------- | :------------------------------------------------------ | :-------------------------------------------------------------- |
| **Category Viewed** | `src/app/shop/page.tsx`      | User clicks a filter (e.g., "Architecture", "Fantasy"). | `Category Name`, `Provider` (Google Books)                      |
| **Added to Cart**   | `src/app/page.tsx`           | Clicking **"BUY NOW"** in the Hero Section.             | `Product Name`, `Category: "Hero"`, `Price`                     |
| **Added to Cart**   | `src/app/shop/page.tsx`      | Clicking the **Glass "+" Fab** on any book card.        | `Product Name`, `Category`, `Price`                             |
| **Added to Cart**   | `src/app/book/[id]/page.tsx` | Clicking **"ADD TO CART"** on the Details page.         | `Product Name`, `Source: "Details Page"`                        |
| **Charged**         | `src/app/cart/page.tsx`      | Clicking **"CHECKOUT"** on the Cart page.               | `Amount` (Total), `Payment Mode`, `Items` (Array), `Charged ID` |

### 3. Engagement Events

Tracking micro-interactions that signal user intent.

| Event Name                | File Location               | Trigger Interaction                                   | Properties                    |
| :------------------------ | :-------------------------- | :---------------------------------------------------- | :---------------------------- |
| **Newsletter Subscribed** | `src/components/Footer.tsx` | User submits email in the Footer input.               | `Source: "Footer"`            |
| **Campaign Clicked**      | _(In Dashboard HTML)_       | User clicks "Unlock Access" on the Custom HTML Popup. | `Campaign Name`, `Input Data` |

---

## 📲 Engagement Channels Integration

This project integrates three distinct CleverTap engagement channels beyond standard analytics.

### 1. Web Push Notifications

- **Configuration:** `public/manifest.json` (VAPID Sender ID) and `public/clevertap_sw.js` (Service Worker).
- **Trigger:** The **Bell Icon** in `src/components/Header.tsx`.
- **Logic:** We manually trigger `clevertap.notifications.push({...})` on click to comply with modern browser permissions policies (no auto-prompt on load).

### 2. Native Display (In-App Messaging)

- **Component:** `src/components/NativeSpotlight.tsx`
- **Location:** Embedded dynamically on the **Home Page**, below the Hero section.
- **Logic:** The component listens for `clevertap.nativeDisplay.getDisplayUnits`. If a campaign is active, it renders a high-end dark mode banner. If no campaign is active, it returns `null` (rendering nothing).

### 3. Web Popups (Custom HTML)

- **Location:** Triggered on the **Shop Page** (`/shop`).
- **Implementation:** Handled entirely via the CleverTap Dashboard using "Custom HTML" campaigns. The application code requires no specific setup other than the SDK being initialized.

---

## 🛠️ Debugging

To verify events in real-time during development:

1.  Open Chrome Developer Tools (`F12`).
2.  Navigate to the **Console** tab.
3.  Look for logs prefixed with `🚀 [CLEVERTAP]` or `🔌 [SYSTEM]`.
4.  All event payloads are logged to the console before being pushed to the SDK for easy debugging.
