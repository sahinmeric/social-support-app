# Implementation Plan

## Phase 1: Foundation (Low Risk)

- [x] 1. Consolidate constants into centralized files
  - Create src/constants/app.ts with application-wide constants (debounce delays, timeouts, step count)
  - Create src/constants/storage.ts with all localStorage keys
  - Create src/constants/api.ts with API endpoints and configuration
  - Update src/constants/validation.ts with all validation rules and field constraints
  - Create src/constants/index.ts to re-export all constants
  - Replace all magic strings throughout codebase with constant references
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Improve TypeScript type safety
  - Enable strict mode in tsconfig.json (strict, noImplicitAny, strictNullChecks)
  - Replace all `any` types with proper types or generics
  - Remove all @ts-ignore comments by fixing underlying type issues
  - Create generic type for form field updates: `<K extends keyof ApplicationFormData>`
  - Define strict APIResponse<T> interface for all API responses
  - Add SubmissionResponse interface with proper typing
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3. Implement input sanitization utilities
  - Create src/utils/sanitize.ts with sanitizeInput function
  - Add SanitizeOptions interface (allowHtml, maxLength, trim)
  - Implement sanitizeFormData function for entire form
  - Integrate sanitization in StorageService before saving
  - Integrate sanitization in APIService before submission
  - Integrate sanitization for AI-generated content in OpenAIService
  - Add sanitization on form field blur events
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Configure development tooling
  - Install ESLint, Prettier, Husky, and lint-staged as dev dependencies
  - Create .eslintrc.json with recommended rules for React and TypeScript
  - Create .prettierrc with code formatting rules
  - Set up Husky pre-commit hooks with `npx husky install`
  - Create .lintstagedrc.json to run linting and formatting on staged files
  - Update .vscode/settings.json for consistent editor experience
  - Add npm scripts: "lint", "lint:fix", "format"
  - Run linter and fix all existing issues
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

## Phase 2: Performance Optimization (Medium Risk)

- [x] 5. Implement code splitting for step components
  - Update FormWizard.tsx to use React.lazy() for Step1, Step2, Step3
  - Update FormWizard.tsx to use React.lazy() for SuccessPage
  - Wrap lazy-loaded components with Suspense boundary
  - Create FormSkeleton component in src/components/common/SkeletonLoader.tsx
  - Test that steps load on demand and not upfront
  - Verify bundle size reduction with `npm run build`
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 6. Optimize MUI imports for tree shaking
  - Replace barrel imports with direct imports throughout codebase
  - Update all files: change `import { X } from '@mui/material'` to `import X from '@mui/material/X'`
  - Update icon imports: change `import { X } from '@mui/icons-material'` to `import X from '@mui/icons-material/X'`
  - Verify tree shaking works with build analysis
  - Measure bundle size reduction
  - _Requirements: 1.3_

- [x] 7. Configure Vite build optimization
  - Update vite.config.ts with manual chunks configuration
  - Create separate chunks: react-vendor, mui-vendor, form-vendor, i18n-vendor
  - Set chunkSizeWarningLimit to 500KB
  - Add build.rollupOptions.output.manualChunks configuration
  - Run production build and verify chunk sizes
  - Document chunk breakdown in build output
  - _Requirements: 1.1_

- [x] 8. Implement lazy loading for translation files
  - Update src/i18n/config.ts to load translations dynamically
  - Create loadLanguageResources async function
  - Modify i18next initialization to load only active language
  - Test language switching with dynamic loading
  - Verify only active language is in initial bundle
  - _Requirements: 1.5_

- [x] 9. Add component memoization
  - Wrap ProgressBar component with React.memo and custom comparison function
  - Wrap NavigationButtons component with React.memo
  - Wrap LanguageSelector component with React.memo
  - Add useCallback for event handlers in FormWizard (handleNext, handlePrevious, handleSubmit)
  - Add useMemo for expensive computations (completion percentage calculation)
  - Test that components don't re-render unnecessarily
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 10. Implement performance monitoring utilities
  - Create src/utils/performance.ts with PerformanceMonitor class
  - Add measure() method for synchronous operations
  - Add measureAsync() method for async operations
  - Add getStats() method to retrieve performance statistics
  - Add logAllStats() method to display all measurements
  - Integrate performance monitoring in critical operations (validation, AI generation, submission)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

## Phase 3: Architecture Improvements (Higher Risk)

- [x] 11. Extract useStepNavigation custom hook
  - Create src/hooks/useStepNavigation.ts
  - Define UseStepNavigationReturn interface
  - Extract step navigation logic from FormWizard component
  - Implement handleNext, handlePrevious, goToStep functions
  - Add canGoNext and canGoPrevious computed properties
  - Update FormWizard to use the new hook
  - Test navigation functionality remains unchanged
  - _Requirements: 2.1, 2.4, 2.5_

- [x] 12. Extract useAISuggestion custom hook
  - Create src/hooks/useAISuggestion.ts
  - Define UseAISuggestionReturn interface
  - Extract AI suggestion logic from Step3SituationDescriptions
  - Implement generateSuggestion, acceptSuggestion, editSuggestion, discardSuggestion, retry functions
  - Add loading, error, and suggestion state management
  - Update Step3SituationDescriptions to use the new hook
  - Test AI suggestion workflow remains unchanged
  - _Requirements: 2.2, 2.4, 2.5_

- [x] 13. Extract useFormSubmission custom hook
  - Create src/hooks/useFormSubmission.ts
  - Define UseFormSubmissionReturn interface
  - Extract form submission logic from FormWizard component
  - Implement submitForm and resetSubmission functions
  - Add isSubmitting, isSuccess, error, submissionData state management
  - Update FormWizard to use the new hook
  - Test form submission workflow remains unchanged
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 14. Implement ErrorBoundary component
  - Create src/components/common/ErrorBoundary.tsx class component
  - Implement getDerivedStateFromError static method
  - Implement componentDidCatch lifecycle method with error logging
  - Create ErrorFallback component with user-friendly error UI
  - Add reset mechanism to clear error state
  - Add translations for error messages (error.somethingWentWrong, error.pleaseTryAgain, error.retry)
  - Wrap FormWizard in App.tsx with ErrorBoundary
  - Test error boundary catches and displays errors correctly
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 15. Create skeleton loader components
  - Create src/components/common/SkeletonLoader.tsx
  - Implement FormSkeleton component (5 field skeletons)
  - Implement ModalSkeleton component for AI suggestion modal
  - Implement ProgressSkeleton component for progress bar
  - Use Skeleton components as Suspense fallbacks
  - Test skeleton loaders display during lazy loading
  - Ensure smooth transitions from skeleton to actual content
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 16. Implement progress calculation utilities
  - Create src/utils/progress.ts
  - Implement calculateCompletionPercentage function for overall form
  - Implement calculateStepCompletion function for individual steps
  - Define required fields arrays for each step
  - Add logic to check if fields are filled (handle strings, numbers, dates)
  - Test calculation accuracy with various form states
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 17. Enhance ProgressBar with completion percentage
  - Update ProgressBar component to accept completionPercentage prop
  - Add LinearProgress component to display overall completion
  - Display completion percentage text above progress bar
  - Integrate calculateCompletionPercentage in FormWizard
  - Pass completion percentage to ProgressBar component
  - Add translations for progress.overallCompletion
  - Test completion percentage updates as form is filled
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 18. Implement field-level success indicators
  - Create enhanced FormField component in src/components/common/FormField.tsx
  - Implement getFieldStatus function (default, success, error)
  - Add InputAdornment with CheckCircleIcon for valid fields
  - Add InputAdornment with ErrorIcon for invalid fields
  - Update all form fields to use enhanced FormField component
  - Add ARIA labels for status icons (aria-label="Valid input")
  - Test real-time status updates as user types
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

## Phase 4: Final Verification and Documentation

- [x] 19. Run comprehensive testing
  - Test complete form flow with all optimizations
  - Test code splitting: verify steps load on demand
  - Test error boundary: trigger errors and verify fallback UI
  - Test custom hooks: verify navigation, AI, and submission work correctly
  - Test performance: measure bundle size, load time, interaction time
  - Test memoization: verify components don't re-render unnecessarily
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on multiple devices (desktop, tablet, mobile)
  - _Requirements: All requirements (verification)_

- [x] 20. Update documentation
  - Update README.md with new architecture overview
  - Document all custom hooks with usage examples
  - Document constants structure and how to add new constants
  - Document performance monitoring utilities and how to use them
  - Document development workflow (linting, formatting, pre-commit hooks)
  - Add performance metrics comparison (before/after)
  - Add bundle size analysis documentation
  - Document migration decisions and rationale
  - _Requirements: All requirements (documentation)_

## Phase 5: Bug Fixes and UI Improvements (Completed)

- [x] 21. Fix i18n initialization issue
  - Export i18nInitPromise from config.ts
  - Update main.tsx to wait for i18n initialization before rendering
  - Verify translation keys don't flash on initial load
  - Test with both English and Arabic languages
  - _Requirements: Bug fix for translation loading_

- [x] 22. Fix Step3 validation error translation
  - Add translateError helper function to Step3SituationDescriptions
  - Parse pipe-separated error format (key|value)
  - Apply translation with proper interpolation
  - Verify minimum length errors display correctly
  - _Requirements: Bug fix for validation messages_

- [x] 23. Improve numeric input UX
  - Change dependents and monthlyIncome initial values from 0 to empty string
  - Update form types to accept number | "" for numeric fields
  - Update validation schema with transform to handle empty strings
  - Update sanitizeFormData to convert empty strings to 0 before submission
  - Test that inputs start empty and don't show "0" prefix
  - _Requirements: UX improvement for numeric inputs_

- [x] 24. Convert dependents to dropdown
  - Replace number input with Select component for dependents field
  - Add options from 0 to 20
  - Update handleSelectChange to convert string to number
  - Remove number input validation attributes
  - Test dropdown selection and form submission
  - _Requirements: UX improvement for dependents field_

- [x] 25. Add currency selector
  - Add currency field to form types (USD | AED)
  - Add currency dropdown next to monthly income field
  - Add currency validation to schema
  - Add currency translations (English and Arabic)
  - Display currency symbols: USD ($) and AED (د.إ)
  - Set default currency to USD
  - _Requirements: Feature addition for currency selection_

- [x] 26. Fix success page form reset
  - Add resetForm function to FormContext
  - Implement resetForm to clear form data, reset to step 1, and clear localStorage
  - Update FormWizard handleSubmitAnother to use resetForm
  - Update FormWizard handleGoHome to use resetForm
  - Remove window.location.reload() calls
  - Test that success page buttons properly reset form
  - _Requirements: Bug fix for form reset after submission_

## Phase 6: Testing and Quality Assurance (TODO)

- [-] 27. Complete application review and manual testing
  - [x] 27.1 Test complete user flow from start to finish
    - Fill out all three steps with valid data
    - Test form validation on each step
    - Test navigation between steps (Next/Previous)
    - Test form submission and success page
    - Test "Submit Another Application" flow
  - [-] 27.2 Test internationalization (i18n)
    - Switch between English and Arabic
    - Verify all text translates correctly
    - Test RTL layout for Arabic
    - Verify validation messages in both languages
  - [-] 27.3 Test form persistence
    - Fill out partial form
    - Refresh browser
    - Verify data persists from localStorage
    - Complete and submit form
    - Verify localStorage clears after submission
  - [-] 27.4 Test AI suggestion feature
    - Click "Help Me Write" on each Step 3 field
    - Verify suggestions generate correctly
    - Test Accept, Edit, Discard, and Retry actions
    - Test error handling for AI failures
  - [-] 27.5 Test validation and error handling
    - Submit empty form and verify validation errors
    - Test field-level validation (email, phone, national ID)
    - Test minimum length validation for text areas
    - Test numeric field validation (dependents, income)
    - Test date validation (date of birth must be in past)
  - [-] 27.6 Test responsive design
    - Test on desktop (1920x1080, 1366x768)
    - Test on tablet (iPad, 768x1024)
    - Test on mobile (iPhone, 375x667)
    - Verify layout adapts correctly
    - Test touch interactions on mobile
  - [-] 27.7 Test accessibility
    - Test keyboard navigation (Tab, Enter, Escape)
    - Test screen reader compatibility
    - Verify ARIA labels are present
    - Test focus management
    - Verify color contrast meets WCAG standards
  - [-] 27.8 Test edge cases
    - Test with very long text inputs
    - Test with special characters in text fields
    - Test rapid clicking on buttons
    - Test browser back/forward buttons
    - Test with slow network (throttle to 3G)
  - [x] 27.9 Document all bugs found
    - Create bug report for each issue
    - Prioritize bugs (critical, high, medium, low)
    - Fix critical and high priority bugs
    - Document known issues for medium/low priority
  - _Requirements: Comprehensive manual testing_

- [-] 28. Set up unit testing framework
  - [x] 28.1 Install testing dependencies
    - Install Vitest as test runner
    - Install @testing-library/react for component testing
    - Install @testing-library/jest-dom for DOM matchers
    - Install @testing-library/user-event for user interactions
    - Configure Vitest in vite.config.ts
  - [x] 28.2 Create test utilities and setup
    - Create src/test/setup.ts with global test configuration
    - Create src/test/utils.tsx with custom render function
    - Set up test providers (FormProvider, LanguageProvider, ThemeProvider)
    - Create mock data factories for form data
    - Create test helpers for common assertions
  - [ ] 28.3 Write utility function tests
    - Test sanitizeInput function with various inputs
    - Test sanitizeFormData function
    - Test calculateCompletionPercentage function
    - Test calculateStepCompletion function
    - Test PerformanceMonitor class methods
  - [ ] 28.4 Write validation schema tests
    - Test step1Schema with valid and invalid data
    - Test step2Schema with valid and invalid data
    - Test step3Schema with valid and invalid data
    - Test edge cases (empty strings, special characters, boundary values)
  - [ ] 28.5 Write custom hook tests
    - Test useFormContext hook
    - Test useStepNavigation hook
    - Test useAISuggestion hook
    - Test useFormSubmission hook
    - Test useFormPersistence hook
  - [ ] 28.6 Write component tests
    - Test FormField component (success/error states)
    - Test ProgressBar component
    - Test NavigationButtons component
    - Test LanguageSelector component
    - Test ErrorBoundary component
    - Test SkeletonLoader components
  - [ ] 28.7 Write form step component tests
    - Test Step1PersonalInfo rendering and validation
    - Test Step2FamilyFinancial rendering and validation
    - Test Step3SituationDescriptions rendering and AI integration
    - Test SuccessPage rendering and actions
  - [ ] 28.8 Write integration tests
    - Test complete form flow (all steps)
    - Test form persistence across page reloads
    - Test form submission and success flow
    - Test error handling and recovery
  - [ ] 28.9 Set up test coverage reporting
    - Configure Vitest coverage with c8
    - Set coverage thresholds (80% minimum)
    - Generate coverage reports
    - Add coverage badge to README
  - [ ] 28.10 Add test scripts to package.json
    - Add "test" script to run all tests
    - Add "test:watch" script for development
    - Add "test:coverage" script for coverage reports
    - Add "test:ui" script for Vitest UI
  - _Requirements: Unit and integration testing_

- [ ] 29. Set up E2E testing with Cypress
  - [ ] 29.1 Install Cypress and dependencies
    - Install Cypress as dev dependency
    - Install @testing-library/cypress for better selectors
    - Configure Cypress in cypress.config.ts
    - Set up Cypress folder structure
  - [ ] 29.2 Create Cypress test utilities
    - Create cypress/support/commands.ts with custom commands
    - Create fillStep1 command for personal info
    - Create fillStep2 command for family/financial info
    - Create fillStep3 command for situation descriptions
    - Create helper functions for common actions
  - [ ] 29.3 Write E2E test for happy path
    - Test complete form submission flow
    - Fill all three steps with valid data
    - Submit form and verify success page
    - Verify application ID is displayed
    - Test "Submit Another Application" button
  - [ ] 29.4 Write E2E test for validation
    - Test form validation on each step
    - Attempt to proceed with empty fields
    - Verify error messages display
    - Fill fields and verify errors clear
    - Test field-level validation (email, phone, etc.)
  - [ ] 29.5 Write E2E test for navigation
    - Test Next/Previous button navigation
    - Test progress bar updates
    - Test step indicator highlights
    - Test browser back/forward buttons
    - Verify form data persists during navigation
  - [ ] 29.6 Write E2E test for persistence
    - Fill partial form
    - Refresh page
    - Verify data persists
    - Complete and submit form
    - Verify localStorage clears
  - [ ] 29.7 Write E2E test for internationalization
    - Switch to Arabic language
    - Verify text translates
    - Verify RTL layout
    - Fill and submit form in Arabic
    - Switch back to English
  - [ ] 29.8 Write E2E test for AI suggestions
    - Navigate to Step 3
    - Click "Help Me Write" button
    - Wait for suggestion to generate
    - Test Accept action
    - Test Edit action
    - Test Discard action
    - Test Retry action
  - [ ] 29.9 Write E2E test for error scenarios
    - Test network error during submission
    - Test AI service error
    - Test form validation errors
    - Verify error messages display
    - Verify error recovery
  - [ ] 29.10 Set up Cypress in CI/CD
    - Add Cypress scripts to package.json
    - Configure Cypress for headless mode
    - Set up video recording for failed tests
    - Set up screenshot capture on failures
    - Document how to run E2E tests locally
  - _Requirements: End-to-end testing_

- [ ] 30. Performance testing and optimization
  - [ ] 30.1 Run Lighthouse audits
    - Run Lighthouse on production build
    - Analyze Performance score
    - Analyze Accessibility score
    - Analyze Best Practices score
    - Analyze SEO score
    - Document baseline scores
  - [ ] 30.2 Analyze bundle size
    - Run production build
    - Analyze bundle size with rollup-plugin-visualizer
    - Identify large dependencies
    - Check for duplicate dependencies
    - Verify code splitting is working
    - Document bundle size breakdown
  - [ ] 30.3 Test load performance
    - Measure First Contentful Paint (FCP)
    - Measure Largest Contentful Paint (LCP)
    - Measure Time to Interactive (TTI)
    - Measure Total Blocking Time (TBT)
    - Measure Cumulative Layout Shift (CLS)
    - Document performance metrics
  - [ ] 30.4 Test runtime performance
    - Profile component render times
    - Check for unnecessary re-renders
    - Verify memoization is working
    - Test form validation performance
    - Test AI suggestion generation time
    - Document performance bottlenecks
  - [ ] 30.5 Optimize based on findings
    - Address any performance issues found
    - Optimize large dependencies if needed
    - Further optimize component rendering
    - Implement additional lazy loading if beneficial
    - Re-run tests to verify improvements
  - _Requirements: Performance testing and optimization_

## Success Criteria

After completing all tasks, verify:

- ✅ Bundle size is below 500KB minified
- ✅ Initial load time is under 2 seconds
- ✅ All TypeScript strict mode checks pass
- ✅ No ESLint errors or warnings
- ✅ All components properly memoized
- ✅ Error boundary catches and displays errors
- ✅ Custom hooks reduce component complexity
- ✅ All constants centralized
- ✅ Input sanitization working on all fields
- ✅ Skeleton loaders display during lazy loading
- ✅ Progress indicators show accurate completion
- ✅ Field-level success indicators work correctly
- ✅ Pre-commit hooks run linting and formatting
- ✅ Performance monitoring logs critical operations
- ✅ All existing functionality preserved

## Rollback Plan

If issues arise during implementation:

1. Each phase is independent - can rollback individual phases
2. Keep original code in `main` branch before starting
3. Create feature branch `feature/app-optimization` for all changes
4. Test thoroughly after each task before proceeding
5. Monitor bundle size after each optimization
6. If bundle size increases, investigate and fix before continuing
7. If critical bugs appear, rollback to previous working state
8. Document any issues encountered and solutions applied
