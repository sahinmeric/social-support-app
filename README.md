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

---

## 🔄 Complete Application Workflow

This section explains the end-to-end workflow of how the application works, from user interaction to data persistence.

### 1. Application Startup 🚀

```
User opens browser → http://localhost:5173
│
├─ main.tsx renders App
│  └─ Wraps with LanguageProvider
│     └─ Wraps with FormProvider
│
├─ LanguageProvider initializes:
│  ├─ Checks localStorage for saved language (default: 'en')
│  ├─ Sets document direction (LTR/RTL)
│  └─ Loads i18n translations
│
└─ FormProvider initializes:
   ├─ Checks localStorage for saved form data
   ├─ Checks localStorage for saved step (default: 1)
   ├─ Initializes React Hook Form with:
   │  ├─ defaultValues: saved data or empty initialFormData
   │  ├─ resolver: Yup schema for current step
   │  └─ mode: 'onChange' (validates as user types)
   └─ Renders FormWizard component
```

### 2. User Types in an Input Field ⌨️

**Example: User types "John" in the Name field**

```
User types "J" in Name field
│
├─ Step1PersonalInfo.tsx
│  └─ handleChange('name') is called
│     └─ updateFormData('name', 'J')
│
├─ FormContext.tsx
│  └─ form.setValue('name', 'J', { shouldValidate: false })
│     ├─ React Hook Form updates internal state
│     ├─ Does NOT trigger validation (shouldValidate: false)
│     └─ Triggers re-render ONLY for Name field (optimized!)
│
├─ useFormPersistence hook detects change
│  ├─ Clears previous timeout (if exists)
│  ├─ Sets NEW timeout for 2 seconds
│  └─ Waits... (user keeps typing)
│
└─ User types "o" → "h" → "n"
   └─ Same process repeats
      └─ Timeout keeps resetting (debouncing)
```

**After 2 seconds of no typing:**

```
Timeout fires!
│
└─ useFormPersistence.ts
   ├─ StorageService.saveFormData(formData)
   │  └─ localStorage.setItem('socialSupportForm', JSON.stringify(formData))
   │
   └─ StorageService.saveCurrentStep(currentStep)
      └─ localStorage.setItem('socialSupportFormStep', '1')
```

### 3. User Clicks "Next" Button ➡️

```
User clicks "Next"
│
├─ NavigationButtons.tsx
│  └─ onNext() is called
│
├─ FormWizard.tsx - handleNext()
│  ├─ Calls validateCurrentStep()
│  │  │
│  │  └─ FormContext.tsx
│  │     ├─ trigger() - React Hook Form validation
│  │     ├─ Runs Yup schema for Step 1
│  │     ├─ Checks all fields: name, nationalId, dateOfBirth, etc.
│  │     └─ Returns true/false
│  │
│  ├─ If validation FAILS:
│  │  ├─ Errors are set in formState.errors
│  │  ├─ Red error messages appear under fields
│  │  ├─ User stays on Step 1
│  │  └─ Process stops here ❌
│  │
│  └─ If validation SUCCEEDS:
│     ├─ setCurrentStep(2)
│     ├─ FormContext updates currentStep state
│     ├─ FormWizard re-renders
│     ├─ ProgressBar updates (Step 2 active)
│     ├─ Step2FamilyFinancial component renders
│     ├─ window.scrollTo({ top: 0 }) - smooth scroll
│     └─ User sees Step 2 ✅
```

### 4. User Switches Language 🌐

```
User clicks Language Selector → Selects Arabic
│
├─ LanguageSelector.tsx
│  └─ handleChange() calls setLanguage('ar')
│
├─ LanguageContext.tsx
│  ├─ Updates language state to 'ar'
│  ├─ localStorage.setItem('language', 'ar')
│  ├─ i18n.changeLanguage('ar')
│  ├─ Sets direction to 'rtl'
│  ├─ document.documentElement.dir = 'rtl'
│  └─ document.documentElement.lang = 'ar'
│
├─ App.tsx detects direction change
│  └─ createAppTheme('rtl')
│     ├─ Sets theme direction
│     ├─ Changes font to Cairo
│     └─ ThemeProvider re-renders
│
└─ All components re-render with:
   ├─ Arabic translations (from ar.json)
   ├─ RTL layout (right-to-left)
   └─ Form data preserved! ✅
```

### 5. User Clicks "Help Me Write" (AI Assistance) 🤖

```
User clicks "Help Me Write" on Financial Situation field
│
├─ Step3SituationDescriptions.tsx
│  └─ handleHelpMeWrite('financialSituation')
│     ├─ Sets modalOpen = true
│     ├─ Sets isLoading = true
│     └─ Calls openAIService.generateSuggestion()
│
├─ OpenAIService.ts
│  ├─ Checks if VITE_USE_MOCK_AI = true
│  │  └─ YES → generateMockSuggestion()
│  │     ├─ Waits 1.5 seconds (simulated delay)
│  │     └─ Returns contextual mock text based on formData
│  │
│  └─ If VITE_USE_MOCK_AI = false:
│     ├─ Builds contextual prompt with form data
│     ├─ Calls OpenAI API (would fail due to CORS)
│     └─ Returns AI-generated suggestion
│
├─ Step3 receives suggestion
│  ├─ setSuggestion(result.text)
│  ├─ setIsLoading(false)
│  └─ SuggestionModal shows suggestion
│
└─ User sees modal with:
   ├─ Editable textarea with suggestion
   ├─ Accept button
   ├─ Edit button
   └─ Discard button
```

**If user clicks "Accept":**

```
User clicks Accept
│
├─ SuggestionModal.tsx → onAccept()
│
├─ Step3SituationDescriptions.tsx
│  └─ handleAccept()
│     ├─ updateFormData('financialSituation', suggestion)
│     ├─ TextField updates with AI text
│     ├─ Modal closes
│     └─ useFormPersistence will save in 2 seconds
```

### 6. User Submits Form 📤

```
User completes all 3 steps → Clicks "Submit"
│
├─ NavigationButtons.tsx
│  └─ onSubmit() is called
│
├─ FormWizard.tsx - handleSubmit()
│  ├─ Validates Step 3 (current step)
│  │  └─ If fails: shows errors, stops ❌
│  │
│  ├─ If valid: continues...
│  ├─ setIsSubmitting(true)
│  └─ Calls APIService.submitApplication(formData)
│
├─ APIService.ts
│  ├─ Validates all fields across all steps
│  ├─ Simulates network delay (1-2 seconds)
│  ├─ Generates unique applicationId
│  ├─ Returns success response with:
│  │  ├─ applicationId: "APP-1234567890-abc123"
│  │  ├─ timestamp: "2025-01-13T10:30:00.000Z"
│  │  └─ success: true
│  │
│  └─ (In production: would POST to backend API)
│
├─ FormWizard receives response
│  ├─ StorageService.clearFormData()
│  │  ├─ localStorage.removeItem('socialSupportForm')
│  │  └─ localStorage.removeItem('socialSupportFormStep')
│  │
│  ├─ setSubmissionData({ applicationId, timestamp })
│  ├─ setShowSuccess(true)
│  └─ setIsSubmitting(false)
│
└─ FormWizard renders SuccessPage
   └─ Shows:
      ├─ ✅ Success icon
      ├─ Success message
      ├─ Application ID
      ├─ Timestamp
      ├─ "Submit Another Application" button
      └─ "Go to Home Page" button
```

### 7. User Refreshes Browser 🔄

```
User refreshes page (F5) or closes and reopens
│
├─ Application restarts (Step 1 again)
│
├─ FormProvider initializes
│  ├─ StorageService.loadFormData()
│  │  └─ Reads from localStorage
│  │     └─ Returns saved form data ✅
│  │
│  └─ StorageService.loadCurrentStep()
│     └─ Reads from localStorage
│        └─ Returns saved step (e.g., 2) ✅
│
├─ React Hook Form initializes with saved data
│
└─ FormWizard renders
   ├─ Shows Step 2 (where user left off)
   ├─ All fields pre-filled with saved data
   └─ User can continue from where they left! 🎉
```

### 🔑 Key Performance Optimizations

#### React Hook Form Benefits:

1. **Uncontrolled inputs** - No re-render on every keystroke
2. **Isolated re-renders** - Only the changed field re-renders
3. **Optimized validation** - Only validates when needed
4. **No unnecessary state updates** - Direct DOM manipulation

#### Debouncing (useFormPersistence):

- Saves to localStorage only after 2 seconds of inactivity
- Prevents excessive writes on every keystroke
- Clears and resets timeout on each change

#### React.memo:

- Step components wrapped with React.memo
- Prevents re-render if props haven't changed

#### useCallback & useMemo:

- Functions memoized to prevent recreation
- Context value memoized to prevent provider re-renders

### 📊 Data Flow Summary

```
User Input → React Hook Form → FormContext → useFormPersistence
                                    ↓              ↓
                              Components    localStorage
                                    ↓              ↓
                              Validation    (2s debounce)
                                    ↓
                              Navigation
                                    ↓
                              Submission
                                    ↓
                              APIService
                                    ↓
                              SuccessPage
```

---
