# PageScroll & Side Components for Next.js

A simple **full-page scroll system** for Next.js with Tailwind CSS.  
Scrolls one section at a time and supports navigation dots.

---

created by ChatGPT and me

---

## How to Use

### 1. Add the components to your project

Place the following files in your project:



/PageScroll.jsx

/Side.jsx

---

### 2. Use the components in a page

Here's an example:

```jsx
import PageScroll from "@/components/PageScroll";
import Side from "@/components/Side";

export default function Home() {
  return (
    <PageScroll>
      <Side customClass="bg-red-400">
        <div>
          <h2>Hello</h2>
        </div>
      </Side>
      <Side customClass="bg-blue-400">
        <h2>Section 2</h2>
      </Side>
      <Side customClass="bg-yellow-400">
        <h2>Section 3</h2>
      </Side>
      <Side customClass="bg-green-400">
        <h2>Section 4</h2>
      </Side>
      <Side customClass="bg-purple-400">
        <h2>Section 5</h2>
      </Side>
    </PageScroll>
  );
}
```
Each <Side> represents a full-screen section.

Use the customClass prop to apply Tailwind classes for background colors or other styles.

<PageScroll> handles scrolling, animation, and dot navigation automatically.

