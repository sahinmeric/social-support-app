# Social Support Application Portal

A modern, accessible, and multilingual web application for citizens to apply for government social support. Built with React, TypeScript, and Material-UI, featuring AI-powered assistance for form completion.

## 🌟 Features

### Core Functionality

- **3-Step Form Wizard** with progress tracking
- **AI-Powered Writing Assistance** using OpenAI GPT-3.5
- **Bilingual Support** (English & Arabic with RTL)
- **Form Validation** with real-time error feedback
- **Auto-Save** to localStorage (2-second debounce)
- **Responsive Design** (mobile, tablet, desktop)
- **Accessibility** (ARIA labels, keyboard navigation)

### Form Steps

1. **Personal Information**: Name, ID, contact details, address
2. **Family & Financial**: Marital status, dependents, employment, income
3. **Situation Descriptions**: AI-assisted text fields for detailed explanations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20.19+ or 22.12+)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ssa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

4. **Configure OpenAI API Key** (Optional)

   Edit `.env.local` and add your OpenAI API key:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_USE_MOCK_AI=false
   ```

   **Note**: Due to CORS restrictions, direct browser calls to OpenAI are blocked. The app uses mock AI responses by default (`VITE_USE_MOCK_AI=true`). For production, you would need a backend proxy server.

   To get an OpenAI API key:

   - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173)

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: React Context API
- **Form Validation**: Yup
- **Internationalization**: react-i18next
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **AI Integration**: OpenAI GPT-3.5 Turbo

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/                    # AI assistance components
│   │   ├── HelpMeWriteButton.tsx
│   │   └── SuggestionModal.tsx
│   ├── common/                # Reusable UI components
│   │   ├── LanguageSelector.tsx
│   │   ├── NavigationButtons.tsx
│   │   └── ProgressBar.tsx
│   ├── steps/                 # Form step components
│   │   ├── Step1PersonalInfo.tsx
│   │   ├── Step2FamilyFinancial.tsx
│   │   └── Step3SituationDescriptions.tsx
│   └── FormWizard.tsx         # Main form container
├── contexts/                  # React contexts
│   ├── FormContext.tsx        # Form state management
│   ├── FormContext.context.ts
│   ├── FormContext.types.ts
│   └── LanguageContext.tsx    # Language/RTL management
├── hooks/                     # Custom React hooks
│   ├── useFormContext.ts
│   └── useFormPersistence.ts
├── i18n/                      # Internationalization
│   ├── config.ts
│   ├── en.json                # English translations
│   └── ar.json                # Arabic translations
├── services/                  # API and business logic
│   ├── APIService.ts          # Form submission
│   ├── OpenAIService.ts       # AI integration
│   └── StorageService.ts      # localStorage management
├── theme/                     # MUI theme configuration
│   └── theme.ts
├── types/                     # TypeScript type definitions
│   ├── component.types.ts
│   ├── form.types.ts
│   └── openai.types.ts
├── validation/                # Form validation schemas
│   └── schemas.ts
├── App.tsx                    # Root component
└── main.tsx                   # Application entry point
```

## 🎨 Key Features Explained

### AI Writing Assistance

The application includes AI-powered writing assistance for Step 3 text fields:

1. Click "Help Me Write" button next to any textarea
2. AI generates a contextual suggestion based on your form data
3. Review the suggestion in a modal dialog
4. Choose to Accept, Edit, or Discard the suggestion

**Mock Mode**: By default, the app uses mock AI responses to avoid CORS issues. Set `VITE_USE_MOCK_AI=false` in `.env.local` to use real OpenAI API (requires backend proxy in production).

### Form Persistence

- Form data is automatically saved to localStorage every 2 seconds
- Progress is preserved even if you close the browser
- Data is cleared after successful submission

### Multilingual Support

- Switch between English and Arabic using the language selector
- Arabic mode includes full RTL (right-to-left) layout
- All UI text and validation messages are translated

### Responsive Design

- **Mobile** (< 768px): Single column layout, vertical progress bar
- **Tablet** (768-1024px): Optimized spacing and layout
- **Desktop** (> 1024px): Two-column layout, horizontal progress bar

### Accessibility

- ARIA labels on all form fields
- Keyboard navigation support (Tab, Shift+Tab, Enter, Escape)
- Focus indicators (2px outline)
- Screen reader announcements for errors
- Semantic HTML structure

## 🧪 Testing the Application

### Test the Form Flow

1. Fill out Step 1 (Personal Information)
2. Click "Next" to proceed to Step 2
3. Fill out Step 2 (Family & Financial)
4. Click "Next" to proceed to Step 3
5. Try the "Help Me Write" buttons for AI assistance
6. Complete all fields and click "Submit"

### Test Form Validation

- Try clicking "Next" without filling required fields
- Enter invalid email or phone formats
- Try submitting with incomplete data

### Test Language Switching

- Click the language selector in the top right
- Switch between English and Arabic
- Notice the RTL layout change for Arabic

### Test Form Persistence

1. Fill out some form fields
2. Refresh the page or close the browser
3. Return to the application
4. Your data should be restored

## 🔧 Configuration

### Environment Variables

| Variable              | Description                         | Default             |
| --------------------- | ----------------------------------- | ------------------- |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI assistance    | -                   |
| `VITE_USE_MOCK_AI`    | Use mock AI responses (avoids CORS) | `true`              |
| `VITE_API_URL`        | Backend API endpoint                | `/api/applications` |

### Customization

**Theme**: Edit `src/theme/theme.ts` to customize colors, typography, and breakpoints.

**Translations**: Add or modify translations in `src/i18n/en.json` and `src/i18n/ar.json`.

**Validation**: Update validation rules in `src/validation/schemas.ts`.

## 📝 Architecture & Design Decisions

### State Management

- **FormContext**: Centralized form state with validation
- **LanguageContext**: Language and RTL direction management
- **localStorage**: Automatic form persistence with debouncing

### Component Architecture

- **Container/Presentational Pattern**: FormWizard (container) manages logic, step components handle presentation
- **Composition**: Reusable components (ProgressBar, NavigationButtons) composed into larger features
- **Separation of Concerns**: Services handle API calls, contexts manage state, components handle UI

### Why Mock AI Mode?

OpenAI's API doesn't support direct browser calls due to CORS security policies. In production, you would:

1. Create a backend API endpoint (e.g., `/api/ai/suggest`)
2. Backend calls OpenAI API with your API key
3. Frontend calls your backend endpoint

For this demo, mock mode provides the same UX without requiring a backend.

## 🚧 Known Limitations

1. **OpenAI CORS**: Direct browser calls blocked - using mock mode by default
2. **No Backend**: Form submission is mocked (1-2 second delay)
3. **No Authentication**: No user login or session management
4. **No File Uploads**: No document attachment support
5. **No Email Notifications**: No confirmation emails sent

## 🔮 Future Enhancements

- Backend API integration for real form submission
- Backend proxy for OpenAI API calls
- User authentication and session management
- Document upload functionality
- Email notifications
- Application status tracking
- Admin dashboard for reviewing applications
- PDF export of submitted applications
- Multi-language support (add more languages)
- Advanced analytics and reporting

## 📄 License

This project is for demonstration purposes.

## 👥 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Material-UI**
