# Medical Pre-Consultation Platform

A modern, responsive web application for collecting patient information and medical history before consultations. Built with Next.js, React, TypeScript, and Material-UI, featuring an intelligent questionnaire system and intuitive user interface.

##  video link
- https://github.com/user-attachments/assets/cc1e6218-70a3-4da6-9578-276864e444ec

### 📋 Patient Information Collection

- **Demographics Form**: Captures essential patient details (name, date of birth, gender)
- **Smart Date Picker**: Custom-styled MUI DatePicker with visual indicators for disabled future dates
- **Form Validation**: Comprehensive validation using Zod schema and React Hook Form

### 🤖 Dynamic Medical Questionnaire

- **AI-Powered Questions**: Dynamically generates relevant medical questions
- **Interactive Chat Interface**: Conversational Q&A experience with medical professional styling
- **Progress Tracking**: Visual progress indicators for questionnaire completion
- **Smart Navigation**: Easy question navigation with previous/next functionality

### 🎨 Modern UI/UX

- **Material-UI Components**: Professional medical interface with consistent theming
- **Responsive Design**: Mobile-first design that works across all devices
- **Gradient Backgrounds**: Beautiful gradient overlays and glass-morphism effects
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 Technical Features

- **TypeScript**: Full type safety throughout the application
- **Server Actions**: Modern Next.js server-side form handling
- **Custom Components**: Specialized medical UI components
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.3** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library and design system
- **Tailwind CSS** - Utility-first CSS framework

### Form Management

- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - Schema validation and type inference
- **@hookform/resolvers** - Form validation integration

### Date/Time

- **Day.js** - Lightweight date manipulation
- **MUI X Date Pickers** - Advanced date picker components

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript Config** - Strict type checking
- **PostCSS** - CSS processing

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd pre-consultation

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3001`

## 🏃‍♂️ Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## 📁 Project Structure

```
src/
├── app/
│   ├── preconsult-chat.tsx    # Main application component
│   ├── actions.ts             # Server actions for form submission
│   ├── page.tsx              # Home page with gradient background
│   ├── layout.tsx            # Root layout with theme provider
│   └── globals.css           # Global styles and CSS variables
├── ai/
│   └── flows/
│       └── random-medical-questions.ts  # Medical question generation
├── components/
│   ├── chat-message.tsx      # Chat interface components
│   └── theme-provider.tsx    # MUI theme configuration
└── lib/                      # Utility functions and helpers
```

## 🎯 Core Components

### PreConsultChat

Main application component featuring:

- **Patient demographics form** with validation
- **Dynamic questionnaire system** with medical questions
- **Progress tracking** and navigation
- **Form submission** with loading states

### Custom Date Picker

Enhanced MUI DatePicker with:

- **Visual disabled states** for future dates
- **Custom styling** for past/current/future months and days
- **Accessibility features** with clear visual feedback
- **Consistent form styling** matching other inputs

### Chat Interface

Medical-themed chat experience:

- **Professional avatars** for medical staff and patients
- **Message bubbles** with appropriate styling
- **Progress indicators** for form completion
- **Interactive elements** for better engagement

## 🔐 Form Validation Schema

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
});
```

## 🎨 Theming

The application uses Material-UI's theming system with:

- **Custom color palette** for medical applications
- **Typography scales** for readability
- **Component overrides** for consistent styling
- **Responsive breakpoints** for mobile-first design

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```
