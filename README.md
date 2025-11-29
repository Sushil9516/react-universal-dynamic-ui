# 🚀 react-universal-dynamic-ui

A universal, cross‑platform UI Kit for **React Native** and **React Web**.  
Includes production‑ready **BannerComponent**, **CategoryComponent**, and **SaleCard** — with auto‑platform resolution:

- `index.native.js` → React Native (Mobile)
- `index.js` → React Web (Browser)

---

## ✨ Features

### 📱 Universal Platform Support

- React Native → Native Views, Shimmer, LinearGradient, Pinar Carousel
- React Web → HTML, CSS, Tailwind utilities

### 🎨 Styled UI Components

- Banner carousel
- Category list (horizontal / circle / grid / vertical)
- Sale cards with timer, badges, layouts

### ⚡ Zero Config

Works out of the box. Tailwind optional.

### 🧩 Future‑Ready

Add unlimited components into this package without renaming.

---

## 📦 Installation

### 1. Install Main Package

```
npm install react-universal-dynamic-ui
```

---

## 📱 For React Native (Mobile)

Install peer dependencies:

```
npm install pinar react-native-linear-gradient react-native-shimmer-placeholder
```

iOS users must install pods:

```
cd ios && pod install && cd ..
```

---

## 💻 For Web (React / Vite / Next.js)

Tailwind v4:

**index.css**

```
@import "tailwindcss";
@source "../node_modules/react-universal-dynamic-ui";
```

Tailwind v3:

**tailwind.config.js**

```
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-universal-dynamic-ui/**/*.{js,jsx}"
  ],
};
```

---

## 🎯 Usage (All Components)

### 1. Import Components

```js
import {
  BannerComponent,
  CategoryComponent,
  SaleCard,
} from "react-universal-dynamic-ui";
```

---

## 🖼 BannerComponent (Web + Mobile)

### Basic Example

```js
<BannerComponent
  bannerData={[
    { image: "https://picsum.photos/800/400" },
    { image: "https://picsum.photos/900/400" },
  ]}
  autoplay={true}
  autoplayInterval={3000}
/>
```

### Props

| Prop             | Type    | Default         | Description                       |
| ---------------- | ------- | --------------- | --------------------------------- |
| bannerData       | array   | []              | List of banners `{ image, name }` |
| autoplay         | boolean | true            | Enables auto slide                |
| autoplayInterval | number  | 4000            | Time per slide                    |
| showDots         | boolean | true            | Show pagination dots              |
| activeDotColor   | string  | "#a1127f"       | Active dot color                  |
| dotColor         | string  | rgba(0,0,0,0.3) | Inactive dot                      |

---

## 🗂 CategoryComponent

```js
<CategoryComponent
  categoriesData={[
    { name: "Shoes", image: "https://picsum.photos/200" },
    { name: "Mobiles", image: "https://picsum.photos/201" },
  ]}
  layout="circle"
/>
```

### Layout Options

- `"horizontal"`
- `"circle"`
- `"grid"`
- `"vertical"`

---

## 🛍 SaleCard Component

```js
<SaleCard
  title="Flash Sale"
  brand="Apple"
  category="Electronics"
  discount="50% OFF"
  image="https://picsum.photos/500"
  showTimer={true}
  endTime="2025-12-31T23:59:59"
/>
```

---

## 🧩 API (SaleCard)

| Prop        | Description       |
| ----------- | ----------------- |
| title       | Product title     |
| brand       | Brand title       |
| category    | Category          |
| image       | Image URL         |
| badge       | Corner badge      |
| showTimer   | Enable countdown  |
| endTime     | Sale end time     |
| horizontal  | Horizontal layout |
| minimalMode | Image + 1 button  |
| imageOnly   | Only image card   |
