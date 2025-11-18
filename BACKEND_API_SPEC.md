# Backend API Specification

This document describes the backend API endpoints that need to be implemented to support the frontend application.

## Base URL

- Development: `http://localhost:3000/api` (or your backend port)
- Production: `https://your-backend-domain.com/api`

## Authentication

Currently, no authentication is required for the AI suggestions endpoint. However, you should implement rate limiting and API key validation on the backend.

## Endpoints

### 1. Generate AI Suggestion

Generate an AI-powered suggestion for a specific form field based on the user's context.

**Endpoint:** `POST /api/ai/suggestions`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "fieldName": "financialSituation",
  "formData": {
    "employmentStatus": "unemployed",
    "monthlyIncome": "0-500",
    "housingStatus": "renting",
    "dependents": 2,
    "financialSituation": "string (optional, for reasonForApplying)"
  }
}
```

**Field Name Options:**

- `financialSituation`
- `employmentCircumstances`
- `reasonForApplying`

**Response (Success - 200):**

```json
{
  "text": "I am currently facing significant financial challenges...",
  "fieldName": "financialSituation"
}
```

**Response (Error - 400):**

```json
{
  "error": "Invalid field name",
  "message": "The field name must be one of: financialSituation, employmentCircumstances, reasonForApplying"
}
```

**Response (Error - 429):**

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

**Response (Error - 500):**

```json
{
  "error": "Internal server error",
  "message": "Failed to generate suggestion"
}
```

## Backend Implementation Guide

### Environment Variables

Your backend should use these environment variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-secret-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.7

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration (for development)
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

### OpenAI Integration

The backend should:

1. Receive the request from the frontend
2. Build an appropriate prompt based on the `fieldName` and `formData`
3. Call OpenAI API with the prompt
4. Return the sanitized response to the frontend

### Prompt Templates

**System Message:**

```
You are a helpful assistant that helps people write clear and empathetic descriptions for social support applications.
```

**User Prompts by Field:**

**financialSituation:**

```
You are helping someone fill out a social support application form. Based on the information provided, generate a clear, concise, and empathetic response for the "financialSituation" field. Keep it between 50-200 words.

Context:
- Employment Status: {employmentStatus}
- Monthly Income: {monthlyIncome}
- Housing Status: {housingStatus}
- Number of Dependents: {dependents}

Generate a description of their current financial situation that explains their need for support.
```

**employmentCircumstances:**

```
You are helping someone fill out a social support application form. Based on the information provided, generate a clear, concise, and empathetic response for the "employmentCircumstances" field. Keep it between 50-200 words.

Context:
- Employment Status: {employmentStatus}
- Monthly Income: {monthlyIncome}

Generate a description of their employment circumstances and how it affects their ability to support themselves.
```

**reasonForApplying:**

```
You are helping someone fill out a social support application form. Based on the information provided, generate a clear, concise, and empathetic response for the "reasonForApplying" field. Keep it between 50-200 words.

Context:
- Financial Situation: {financialSituation}
- Employment Status: {employmentStatus}
- Housing Status: {housingStatus}
- Number of Dependents: {dependents}

Generate a compelling reason for why they are applying for social support, focusing on their specific needs and circumstances.
```

### Security Considerations

1. **Rate Limiting:** Implement rate limiting per IP address (e.g., 10 requests per minute)
2. **Input Validation:** Validate all input fields and sanitize data
3. **CORS:** Configure CORS to only allow requests from your frontend domain
4. **API Key Security:** Never expose the OpenAI API key to the frontend
5. **Error Handling:** Don't expose internal error details to the client
6. **Logging:** Log all requests for monitoring and debugging

### Example Backend Implementation (Node.js/Express)

```javascript
import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    error: "Rate limit exceeded",
    message: "Too many requests. Please try again later.",
  },
});

app.post("/api/ai/suggestions", limiter, async (req, res) => {
  try {
    const { fieldName, formData } = req.body;

    // Validate input
    const validFields = [
      "financialSituation",
      "employmentCircumstances",
      "reasonForApplying",
    ];
    if (!validFields.includes(fieldName)) {
      return res.status(400).json({
        error: "Invalid field name",
        message: `The field name must be one of: ${validFields.join(", ")}`,
      });
    }

    // Build prompt based on fieldName
    const prompt = buildPrompt(fieldName, formData);

    // Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that helps people write clear and empathetic descriptions for social support applications.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 300,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const text = response.data.choices[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to generate suggestion",
      });
    }

    res.json({
      text,
      fieldName,
    });
  } catch (error) {
    console.error("Error generating AI suggestion:", error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests to AI service. Please try again later.",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to generate suggestion",
    });
  }
});

function buildPrompt(fieldName, formData) {
  // Implement prompt building logic here
  // (Use the templates from above)
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing the Backend

You can test the backend API using curl:

```bash
curl -X POST http://localhost:3000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "fieldName": "financialSituation",
    "formData": {
      "employmentStatus": "unemployed",
      "monthlyIncome": "0-500",
      "housingStatus": "renting",
      "dependents": 2
    }
  }'
```

## Frontend Configuration

Update your `.env.local` file:

```bash
# For development (if backend runs on different port)
VITE_API_BASE_URL=http://localhost:3000/api

# For production (same origin)
# VITE_API_BASE_URL=/api

# Mock mode (for testing without backend)
VITE_USE_MOCK_AI=true
```
