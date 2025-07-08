import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface HealthAssessment {
    response: string;
    severity: 'low' | 'medium' | 'high';
    mood: string;
    recommendations: string[];
    followUpQuestions: string[];
    emergency?: boolean;
}

interface HealthContext {
    age?: number;
    gender?: string;
    knownConditions?: string[];
    medications?: string[];
    allergies?: string[];
}

interface PainSketchData {
    bodyPart: string;
    painLocations: Array<{
        x: number;
        y: number;
        type: string;
        intensity: number;
    }>;
    additionalNotes?: string;
}

interface VisualSymptomsData {
    description: string;
    ageGroup?: 'child' | 'adult' | 'elderly';
    consciousnessLevel?: 'alert' | 'confused' | 'unresponsive';
}

export class HealthAssistant {
    public model: GenerativeModel;
    private context: HealthContext = {};

    constructor() {
        this.model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.5,
                topP: 0.9,
            }
        });
    }

    async initializeContext(context: HealthContext) {
        this.context = context;
    }

    async assessHealthConcern(userInput: string): Promise<HealthAssessment> {
        try {
            const prompt = this.buildPrompt(userInput);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseResponse(text);
        } catch (error) {
            console.error('Error in health assessment:', error);
            return this.getErrorResponse();
        }
    }

    async assessPainSketch(sketchData: PainSketchData): Promise<HealthAssessment> {
        try {
            const prompt = this.buildSketchPrompt(sketchData);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseResponse(text);
        } catch (error) {
            console.error('Error in sketch assessment:', error);
            return this.getErrorResponse();
        }
    }

    async assessVisualSymptoms(visualData: VisualSymptomsData): Promise<HealthAssessment> {
        try {
            const prompt = this.buildVisualSymptomsPrompt(visualData);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseResponse(text);
        } catch (error) {
            console.error('Error in visual symptoms assessment:', error);
            return this.getErrorResponse();
        }
    }

    private buildVisualSymptomsPrompt(visualData: VisualSymptomsData): string {
        return `
        You are CareLink AI, a professional emergency medical assistant helping bystanders assess someone in distress.
        
        A user is describing visual symptoms they observe in another person. Your role is to:
        1. Identify potential medical conditions based on the description
        2. Provide immediate first-aid steps
        3. Determine if emergency services are needed
        
        Patient details:
        - Age group: ${visualData.ageGroup || 'unknown'}
        - Consciousness: ${visualData.consciousnessLevel || 'unknown'}
        
        Observed symptoms:
        "${visualData.description}"
        
        Respond in JSON format with these fields:
        {
            "response": "A brief (2-3 sentence) assessment of what might be happening in simple language",
            "severity": "'low', 'medium', or 'high' based on potential risk",
            "mood": "Your emotional tone ('Calm', 'Concerned', or 'Urgent')",
            "recommendations": [
                "3-4 immediate action steps",
                "Prioritize life-saving measures first",
                "Include when to call emergency services"
            ],
            "followUpQuestions": [
                "1-2 questions to gather more info if condition isn't critical"
            ],
            "emergency": "boolean (true if immediate medical attention is needed)"
        }
        
        Critical guidelines:
        - Assume this is real and act with appropriate urgency
        - For chest pain, breathing difficulty, or unconsciousness: recommend emergency services immediately
        - Use simple language anyone can understand
        - Never say "I'm not a doctor" - provide actionable advice
        - For children/elderly: adjust advice for age-specific considerations
        - If unsure: recommend erring on side of caution
        
        Example good response for chest pain:
        {
            "response": "This could be a heart attack. The person needs immediate medical attention.",
            "severity": "high",
            "mood": "Urgent",
            "recommendations": [
                "Call emergency services immediately",
                "Have the person sit down and stay calm",
                "Loosen any tight clothing",
                "If they have prescribed heart medication, help them take it"
            ],
            "followUpQuestions": [],
            "emergency": true
        }
        `;
    }

    private buildSketchPrompt(sketchData: PainSketchData): string {
        const painDescription = sketchData.painLocations.map(pain => {
            return `- ${pain.type} pain (intensity: ${pain.intensity}/10) at coordinates (${pain.x}, ${pain.y})`;
        }).join('\n');

        return `
        You are CareLink AI, a professional healthcare assistant analyzing a patient's pain sketch.
        
        Current patient context:
        ${JSON.stringify(this.context, null, 2)}
        
        Patient has indicated pain in the ${sketchData.bodyPart} area with these characteristics:
        ${painDescription}
        ${sketchData.additionalNotes ? `Additional notes: ${sketchData.additionalNotes}` : ''}
        
        Analyze this pain information and provide:
        1. Potential causes based on location and pain type
        2. Severity assessment
        3. Immediate recommendations
        4. Whether emergency care is needed
        
        Respond in JSON format with these fields:
        {
            "response": "A compassionate, professional reply analyzing the pain (3-4 sentences)",
            "severity": "'low', 'medium', or 'high' based on potential risk",
            "mood": "Your emotional tone (e.g., 'Calm', 'Concerned', 'Urgent')",
            "recommendations": ["Array", "of", "3-4", "actionable", "recommendations"],
            "followUpQuestions": ["Array", "of", "2-3", "relevant", "follow-up", "questions"],
            "emergency": "boolean (true if immediate medical attention is needed)"
        }
        
        Important guidelines:
        - For chest pain, severe headaches, or abdominal pain, be extra cautious
        - Mention red flag symptoms that require immediate attention
        - Suggest first-aid measures when appropriate
        - Always recommend professional medical evaluation for serious concerns
        `;
    }

    private buildPrompt(userInput: string): string {
        return `
        You are CareLink AI, a professional healthcare assistant designed to provide preliminary health assessments. 
        Your responses should be empathetic, clear, and medically responsible.

        Current patient context:
        ${JSON.stringify(this.context, null, 2)}

        User input: "${userInput}"

        Analyze this health concern and provide a structured response in JSON format with the following fields:
        - response: A compassionate, professional reply to the user's concern (2-3 sentences)
        - severity: 'low', 'medium', or 'high' based on potential risk
        - mood: Your emotional tone (e.g., 'Calm', 'Concerned', 'Urgent')
        - recommendations: Array of 2-3 actionable recommendations
        - followUpQuestions: Array of 2-3 relevant follow-up questions
        - emergency: boolean (true if immediate medical attention is needed)

        IMPORTANT:
        - For high severity or emergency cases, clearly state the need for immediate medical attention
        - Never diagnose - only provide general health information
        - Always recommend consulting a healthcare professional for serious concerns
        - Be mindful of potential emergencies (chest pain, difficulty breathing, etc.)

        Respond ONLY with valid JSON in this exact format:
        {
          "response": "",
          "severity": "",
          "mood": "",
          "recommendations": [],
          "followUpQuestions": [],
          "emergency": boolean
        }
        `;
    }

    private parseResponse(text: string): HealthAssessment {
        try {
            // Clean the response (Gemini sometimes adds markdown)
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing response:', error);
            throw new Error('Failed to parse AI response');
        }
    }

    private getErrorResponse(): HealthAssessment {
        return {
            response: "I'm having trouble assessing your health concern. Please try again or contact a healthcare provider if this is urgent.",
            severity: 'medium',
            mood: 'Concerned',
            recommendations: [
                'Try rephrasing your concern',
                'Contact a healthcare provider if symptoms are severe'
            ],
            followUpQuestions: [
                'Could you describe your symptoms in more detail?',
                'How long have you been experiencing this?'
            ],
            emergency: false
        };
    }
}