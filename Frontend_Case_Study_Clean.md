# Front-End Case Study: Social Support Application with AI Assistance

## 1. Background
You are building a new front-end for a government social support portal. The portal must allow citizens to apply for financial assistance easily, quickly, and with smart help.

You will design a multi-step form wizard and integrate the OpenAI GPT API to assist users in writing certain text fields.

---

## 2. What You Need to Build

### A 3-Step Application Form Wizard

| Step | Section | Fields | AI Assistance |
|------|----------|---------|----------------|
| 1 | Personal Information | Name, National ID, Date of Birth, Gender, Address, City, State, Country, Phone, Email | No |
| 2 | Family & Financial Info | Marital Status, Dependents, Employment Status, Monthly Income, Housing Status | No |
| 3 | Situation Descriptions | 1. Current Financial Situation  <br> 2. Employment Circumstances  <br> 3. Reason for Applying | Yes (Help Me Write button) |

### Main Features
- Multi-step form with progress bar.
- Responsive (mobile, tablet, desktop).
- English + Arabic (RTL) language support.
- Accessibility friendly (basic ARIA roles, keyboard navigation).
- Save progress locally (e.g., LocalStorage).
- Submit data (mock API call).

---

## 3. AI Integration

- Add a **"Help Me Write"** button near the 3 textarea fields in Step 3.  
- Clicking the button sends a request to the **OpenAI GPT API** to generate a text suggestion.  
- Show the suggestion in a popup where the user can **Accept**, **Edit**, or **Discard**.  
- Handle errors gracefully (timeout, failure).

---

## 4. Tech Stack (Recommended)

- **Framework:** React.js (preferred) / Vue 3 / Angular  
- **UI Library:** Material UI / Ant Design / Tailwind CSS  
- **Form Handling:** React Hook Form / VeeValidate  
- **State Management:** Context API / Redux Toolkit  
- **API Calls:** Axios / Fetch  
- **Internationalization:** React-i18next / Vue I18n  
- **Routing:** React Router / Vue Router  
- **Optional Testing:** Jest, Testing Library  

---

## 5. OpenAI API Details

- **Endpoint:** [https://api.openai.com/v1/chat/completions](https://api.openai.com/v1/chat/completions)  
- **Model:** `gpt-3.5-turbo`  
- **Prompt Example:**  
  > "I am unemployed with no income. Help me describe my financial hardship."

---

## 6. Deliverables

- Full source code  
- A **README.md** explaining:  
  - How to run the project  
  - How to set up the OpenAI API Key  
- (Optional) Short document or comments explaining architecture, decisions, and improvements.

---

## 7. Evaluation Focus

- Form flow and validations  
- OpenAI integration (correct usage, error handling)  
- UI/UX (mobile-friendly, clean design)  
- Accessibility basics  
- Code structure and readability  
- Documentation quality  

---

## 8. Timeframe

- Complete within **5 days**.  
- Follow-up **1-hour live walkthrough** depends on source code.
