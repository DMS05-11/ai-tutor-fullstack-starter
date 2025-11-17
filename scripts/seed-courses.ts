import 'dotenv/config';
import { db } from '../db';
import { course } from '../db/schema';
import { generateId } from '../lib/auth-utils';

const sampleCourses = [
  {
    title: 'Introduction to React',
    content: `# Introduction to React

React is a JavaScript library for building user interfaces, particularly web applications with rich, interactive UIs. It was developed by Facebook and is now maintained by Meta and the open-source community.

## What You'll Learn

- Components and Props
- State and Lifecycle
- Handling Events
- Conditional Rendering
- Lists and Keys
- Forms and Controlled Components
- Lifting State Up
- Composition vs Inheritance
- Thinking in React

## Getting Started

React allows you to build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.

## Key Concepts

### Components
Components are the building blocks of React applications. They are like JavaScript functions that accept inputs (called "props") and return React elements describing what should appear on screen.

### JSX
JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It makes React components more readable and easier to write.

### State
State is a built-in object that stores property values belonging to a component. When the state object changes, the component re-renders.

### Props
Props (short for "properties") are read-only components that pass data from parent to child components. They help make your components more reusable and dynamic.

## Best Practices

1. Keep components small and focused
2. Use functional components with hooks
3. Follow naming conventions
4. Write tests for your components
5. Use TypeScript for better type safety

Ready to start building amazing React applications? Let's dive in!`,
  },
  {
    title: 'TypeScript Fundamentals',
    content: `# TypeScript Fundamentals

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds static type definitions to JavaScript, allowing you to catch errors early in development.

## Why TypeScript?

- **Type Safety**: Catch errors at compile-time instead of runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Improved Code Documentation**: Types serve as documentation
- **Easier Refactoring**: Make changes with confidence
- **Better Team Collaboration**: Clear interfaces and contracts

## Basic Types

### Primitive Types
\`\`\`typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
\`\`\`

### Arrays
\`\`\`typescript
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
\`\`\`

### Interfaces
\`\`\`typescript
interface Person {
  name: string;
  age: number;
  email?: string; // Optional property
}

function greet(person: Person) {
  console.log(\`Hello, \${person.name}!\`);
}
\`\`\`

## Advanced Features

### Generics
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);
\`\`\`

### Union Types
\`\`\`typescript
function printId(id: number | string) {
  console.log(\`Your ID is: \${id}\`);
}
\`\`\`

### Type Guards
\`\`\`typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  return padding + value;
}
\`\`\`

## Getting Started

1. Install TypeScript: \`npm install -g typescript\`
2. Create a TypeScript file: \`app.ts\`
3. Compile to JavaScript: \`tsc app.ts\`

TypeScript makes JavaScript development more robust and maintainable. Start using it in your projects today!`,
  },
  {
    title: 'CSS Grid and Flexbox',
    content: `# CSS Grid and Flexbox: Modern Layout Techniques

CSS Grid and Flexbox are two powerful layout systems that have revolutionized how we create layouts on the web. Understanding when and how to use each is essential for modern web development.

## CSS Flexbox

Flexbox is designed for one-dimensional layouts - either a row or a column.

### Basic Concepts

- **Container**: The parent element with \`display: flex\`
- **Items**: The direct children of a flex container
- **Main Axis**: The primary axis along which flex items are laid out
- **Cross Axis**: The axis perpendicular to the main axis

### Common Properties

#### Container Properties
\`\`\`css
.flex-container {
  display: flex;
  justify-content: center; /* Main axis alignment */
  align-items: center;    /* Cross axis alignment */
  flex-direction: row;    /* row | column | row-reverse | column-reverse */
  flex-wrap: wrap;        /* nowrap | wrap | wrap-reverse */
  gap: 1rem;             /* Space between items */
}
\`\`\`

#### Item Properties
\`\`\`css
.flex-item {
  flex: 1;               /* flex-grow flex-shrink flex-basis */
  align-self: flex-start; /* Individual alignment */
  order: 2;             /* Item order */
}
\`\`\`

## CSS Grid

Grid is designed for two-dimensional layouts - rows and columns simultaneously.

### Basic Concepts

- **Grid Container**: The parent element with \`display: grid\`
- **Grid Items**: The direct children of a grid container
- **Grid Lines**: The horizontal and vertical lines that divide the grid
- **Grid Tracks**: The spaces between two adjacent grid lines
- **Grid Cells**: The space between four grid lines
- **Grid Areas**: Rectangular areas made up of one or more grid cells

### Common Properties

#### Container Properties
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* Define columns */
  grid-template-rows: auto 1fr auto;    /* Define rows */
  gap: 1rem;                           /* Space between items */
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}
\`\`\`

#### Item Properties
\`\`\`css
.grid-item {
  grid-column: 1 / 3;      /* Span columns */
  grid-row: 2 / 3;         /* Span rows */
  grid-area: header;       /* Named area */
  justify-self: center;    /* Individual alignment */
}
\`\`\`

## When to Use Which?

### Use Flexbox When:
- Arranging items in a single row or column
- Distributing space between items
- Aligning items vertically or horizontally
- Creating navigation bars, card layouts, or form elements

### Use Grid When:
- Creating complex two-dimensional layouts
- Overlapping elements
- Precise control over rows and columns
- Creating overall page layouts

## Combining Both

Modern layouts often use both Flexbox and Grid together:

\`\`\`css
/* Page layout with Grid */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 2rem;
}

/* Navigation with Flexbox */
.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

Mastering both Flexbox and Grid will make you a much more effective CSS developer!`,
  },
];

async function seedCourses() {
  try {
    console.log('Starting to seed courses...');

    // Clear existing courses
    await db.delete(course);

    // Insert sample courses
    for (const courseData of sampleCourses) {
      await db.insert(course).values({
        id: generateId(),
        title: courseData.title,
        content: courseData.content,
      });
    }

    console.log('✅ Courses seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  } finally {
    process.exit(0);
  }
}

seedCourses();