# Quick Testing Guide - Social Support Portal

## 🚀 Getting Started

**Development Server:** http://localhost:5173/

The application is now running and ready for manual testing!

---

## 📋 Testing Workflow

### Step 1: Open the Application

1. Open your browser
2. Navigate to: http://localhost:5173/
3. Open DevTools (F12) for detailed testing

### Step 2: Follow the Test Report

- Open `test-report.md` in your editor
- Work through each test case systematically
- Check off completed items
- Document any bugs found

### Step 3: Report Issues

- If you find any bugs, document them in the Bug Documentation section
- For critical/high priority bugs, let me know and I'll help fix them immediately

---

## 🔧 Testing Tools Setup

### Browser DevTools

- **F12** - Open DevTools
- **Ctrl+Shift+M** - Toggle device toolbar (responsive testing)
- **Ctrl+Shift+I** - Inspect element
- **Ctrl+Shift+C** - Select element

### Network Throttling

1. Open DevTools > Network tab
2. Click "No throttling" dropdown
3. Select "Slow 3G" or "Fast 3G"

### Responsive Testing

1. Open DevTools
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device presets or enter custom dimensions:
   - Desktop: 1920x1080, 1366x768
   - Tablet: 768x1024
   - Mobile: 375x667

### Accessibility Testing

1. Install browser extension:
   - Chrome: WAVE or axe DevTools
   - Firefox: WAVE or axe DevTools
2. Run accessibility audit
3. Review findings

### localStorage Inspection

1. Open DevTools > Application tab (Chrome) or Storage tab (Firefox)
2. Expand "Local Storage"
3. Click on your domain
4. View stored keys: `socialSupportForm`, `socialSupportFormStep`, `language`

---

## 🧪 Quick Test Scenarios

### Scenario 1: Happy Path (5 minutes)

1. Fill all three steps with valid data
2. Submit form
3. Verify success page
4. Click "Submit Another Application"
5. Verify form resets

### Scenario 2: Validation Testing (5 minutes)

1. Try to proceed without filling fields
2. Enter invalid email, phone, national ID
3. Enter text < 50 chars in Step 3
4. Verify all error messages appear

### Scenario 3: Persistence Testing (3 minutes)

1. Fill Step 1 and Step 2 partially
2. Refresh browser (F5)
3. Verify data persists
4. Complete and submit
5. Verify localStorage clears

### Scenario 4: i18n Testing (3 minutes)

1. Switch to Arabic
2. Verify RTL layout
3. Fill and submit form in Arabic
4. Switch back to English

### Scenario 5: AI Testing (5 minutes)

1. Navigate to Step 3
2. Click "Help Me Write" on each field
3. Test Accept, Edit, Discard, Retry
4. Verify suggestions work

---

## 🐛 Common Issues to Look For

### Performance Issues

- [ ] Slow page load
- [ ] Laggy form interactions
- [ ] Delayed validation feedback
- [ ] Slow AI suggestion generation

### UI/UX Issues

- [ ] Misaligned elements
- [ ] Overlapping text
- [ ] Broken responsive layout
- [ ] Poor color contrast
- [ ] Missing translations

### Functional Issues

- [ ] Form doesn't submit
- [ ] Validation not working
- [ ] Data not persisting
- [ ] Navigation broken
- [ ] AI suggestions failing

### Accessibility Issues

- [ ] Can't navigate with keyboard
- [ ] Missing ARIA labels
- [ ] Poor focus indicators
- [ ] Screen reader issues

---

## 📊 Test Data

### Valid Test Data Set 1

```
Name: John Doe
National ID: 1234567890
Date of Birth: 01/01/1990
Gender: Male
Address: 123 Main Street, Apartment 4B
City: Dubai
State: Dubai
Country: United Arab Emirates
Phone: +971501234567
Email: john.doe@example.com

Marital Status: Married
Dependents: 2
Employment Status: Employed
Monthly Income: 5000
Currency: USD
Housing Status: Rented

Financial Situation: I am currently facing financial difficulties due to unexpected medical expenses. My family requires additional support to cover basic living costs including rent, utilities, and food. We have exhausted our savings and need temporary assistance.

Employment Circumstances: I am employed full-time as a sales associate but my income is not sufficient to cover all family expenses, especially after recent medical bills. I am actively seeking additional part-time work to supplement my income.

Reason for Applying: I am applying for social support to help my family through this difficult financial period. The assistance would help us maintain stable housing and ensure my children's basic needs are met while we work to improve our financial situation.
```

### Valid Test Data Set 2 (Arabic Names)

```
Name: محمد أحمد
National ID: 9876543210
Date of Birth: 15/05/1985
Gender: Male
Address: شارع الشيخ زايد، برج 5، الطابق 12
City: أبوظبي
State: أبوظبي
Country: الإمارات العربية المتحدة
Phone: +971509876543
Email: mohammed.ahmed@example.com
```

### Invalid Test Data (for validation testing)

```
Email: notanemail
Phone: 123
National ID: 12
Date of Birth: 01/01/2030 (future date)
Monthly Income: -1000 (negative)
Text Area: Short text (< 50 chars)
```

---

## ✅ Completion Checklist

After completing all tests:

- [ ] All 50+ test cases executed
- [ ] All bugs documented in test-report.md
- [ ] Critical bugs fixed
- [ ] High priority bugs fixed or documented
- [ ] Test report filled out completely
- [ ] Screenshots captured for major bugs
- [ ] Performance metrics noted
- [ ] Accessibility audit completed
- [ ] Sign-off section completed

---

## 🆘 Need Help?

If you encounter any issues during testing:

1. **Document the bug** in test-report.md with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

2. **Report to me** by describing:
   - What you were testing
   - What went wrong
   - Any error messages

3. **I'll help fix** critical and high priority bugs immediately

---

## 📝 After Testing

Once you've completed all manual testing:

1. Fill out the "Overall Test Summary" section
2. Add your sign-off
3. Share the test-report.md with me
4. I'll help fix any bugs you found
5. We'll mark task 27 as complete

---

**Happy Testing! 🎉**
