# Quick Start: Backend Implementation

This guide helps you quickly implement the backend API for AI suggestions.

## Option 1: Node.js/Express (Recommended)

### 1. Install Dependencies

```bash
npm install express cors dotenv axios express-rate-limit
npm install -D @types/express @types/cors
```

### 2. Create Backend Server

**`server.js`** or **`server.ts`**:

```javascript
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: {
    error: "Rate limit exceeded",
    message: "Too many requests. Please try again later.",
  },
});

// AI Suggestions Endpoint
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
        message: `Field name must be one of: ${validFields.join(", ")}`,
      });
    }

    // Build prompt
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
        timeout: 30000,
      }
    );

    const text = response.data.choices[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to generate suggestion",
      });
    }

    res.json({ text, fieldName });
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
  const baseContext = `You are helping someone fill out a social support application form. Based on the information provided, generate a clear, concise, and empathetic response for the "${fieldName}" field. Keep it between 50-200 words.`;

  switch (fieldName) {
    case "financialSituation":
      return `${baseContext}

Context:
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Monthly Income: ${formData.monthlyIncome || "Not specified"}
- Housing Status: ${formData.housingStatus || "Not specified"}
- Number of Dependents: ${formData.dependents || 0}

Generate a description of their current financial situation that explains their need for support.`;

    case "employmentCircumstances":
      return `${baseContext}

Context:
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Monthly Income: ${formData.monthlyIncome || "Not specified"}

Generate a description of their employment circumstances and how it affects their ability to support themselves.`;

    case "reasonForApplying":
      return `${baseContext}

Context:
- Financial Situation: ${formData.financialSituation || "Not specified"}
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Housing Status: ${formData.housingStatus || "Not specified"}
- Number of Dependents: ${formData.dependents || 0}

Generate a compelling reason for why they are applying for social support, focusing on their specific needs and circumstances.`;

    default:
      return `${baseContext}\n\nGenerate appropriate content for the ${fieldName} field.`;
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

### 3. Environment Variables

**`.env`**:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-secret-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.7

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

### 4. Run the Backend

```bash
node server.js
# or with TypeScript
ts-node server.ts
```

### 5. Update Frontend Configuration

**Frontend `.env.local`**:

```bash
# Point to your backend
VITE_API_BASE_URL=http://localhost:3000/api

# Disable mock mode
VITE_USE_MOCK_AI=false
```

## Option 2: Python/Flask

### 1. Install Dependencies

```bash
pip install flask flask-cors python-dotenv openai
```

### 2. Create Backend Server

**`app.py`**:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(','))

openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/ai/suggestions', methods=['POST'])
def generate_suggestion():
    data = request.json
    field_name = data.get('fieldName')
    form_data = data.get('formData', {})

    valid_fields = ['financialSituation', 'employmentCircumstances', 'reasonForApplying']
    if field_name not in valid_fields:
        return jsonify({
            'error': 'Invalid field name',
            'message': f'Field name must be one of: {", ".join(valid_fields)}'
        }), 400

    try:
        prompt = build_prompt(field_name, form_data)

        response = openai.ChatCompletion.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a helpful assistant that helps people write clear and empathetic descriptions for social support applications.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            max_tokens=int(os.getenv('OPENAI_MAX_TOKENS', 300)),
            temperature=float(os.getenv('OPENAI_TEMPERATURE', 0.7))
        )

        text = response.choices[0].message.content.strip()

        return jsonify({
            'text': text,
            'fieldName': field_name
        })

    except Exception as e:
        print(f'Error: {e}')
        return jsonify({
            'error': 'Internal server error',
            'message': 'Failed to generate suggestion'
        }), 500

def build_prompt(field_name, form_data):
    # Similar to Node.js implementation
    pass

if __name__ == '__main__':
    app.run(port=int(os.getenv('PORT', 3000)))
```

## Testing the Backend

### Using curl

```bash
curl -X POST http://localhost:3000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "fieldName": "financialSituation",
    "formData": {
      "employmentStatus": "unemployed",
      "monthlyIncome": 0,
      "housingStatus": "renting",
      "dependents": 2
    }
  }'
```

### Expected Response

```json
{
  "text": "I am currently facing significant financial challenges...",
  "fieldName": "financialSituation"
}
```

## Deployment

### Vercel (Node.js)

1. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

2. Deploy:

```bash
vercel --prod
```

### Heroku

```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
```

### Railway

1. Connect your GitHub repo
2. Add environment variables in dashboard
3. Deploy automatically

## Security Checklist

- [ ] API key stored in environment variables (never in code)
- [ ] Rate limiting enabled
- [ ] CORS configured for your domain only
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS enabled in production
- [ ] Logging configured for monitoring

## Troubleshooting

### CORS Errors

Make sure `ALLOWED_ORIGINS` includes your frontend URL.

### Rate Limiting

Adjust the rate limit settings based on your needs.

### OpenAI API Errors

Check your API key and billing status at platform.openai.com.

## Next Steps

1. Implement the backend using one of the options above
2. Test locally with the frontend
3. Deploy to your preferred platform
4. Update frontend `VITE_API_BASE_URL` to point to deployed backend
5. Monitor usage and costs
