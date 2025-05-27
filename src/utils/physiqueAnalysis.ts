
interface AnalysisResponse {
  ratings: {
    chest: number;
    shoulders: number;
    biceps: number;
    triceps: number;
    back: number;
    abs: number;
    glutes: number;
    quads: number;
    hamstrings: number;
    calves: number;
  };
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

export const analyzePhysique = async (
  frontImage: string,
  backImage: string,
  sideImage: string,
  gender: string
): Promise<AnalysisResponse> => {
  const API_KEY = "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";
  
  const prompt = `You are a professional fitness AI assistant.

The user has uploaded 3 full-body images: front-facing flexing, back-facing flexing, and side view. The user has selected their gender as ${gender}. Evaluate the physique based on muscular development, symmetry, proportion, and posture.

Rate the following muscle groups on a scale from 1 to 100 based on visible development, conditioning, and symmetry:
- Chest  
- Shoulders  
- Biceps  
- Triceps  
- Back  
- Abs  
- Glutes  
- Quads  
- Hamstrings  
- Calves

Provide an **Overall Physique Score** from 1 to 100, considering symmetry, muscle balance, and aesthetics.

Briefly list:
- 2–3 physique strengths
- 2–3 improvement suggestions (training or posing tips)

Guidelines:
- Be supportive and constructive but strict and accurate
- Avoid negative tone or medical claims
- If any image is unclear or cropped, mention it in your response

Output format should be a JSON object with this structure:
{
  "ratings": {
    "chest": 87,
    "shoulders": 92,
    "biceps": 90,
    "triceps": 88,
    "back": 91,
    "abs": 79,
    "glutes": 85,
    "quads": 83,
    "hamstrings": 80,
    "calves": 76
  },
  "overallScore": 86,
  "strengths": [
    "Well-developed shoulders",
    "Balanced upper body"
  ],
  "improvements": [
    "Add volume to lower back",
    "Increase calf definition"
  ]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: frontImage } },
              { type: 'image_url', image_url: { url: backImage } },
              { type: 'image_url', image_url: { url: sideImage } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;
    
    // Try to parse JSON response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback mock data for development
    return {
      ratings: {
        chest: 85,
        shoulders: 90,
        biceps: 88,
        triceps: 86,
        back: 89,
        abs: 78,
        glutes: 83,
        quads: 81,
        hamstrings: 79,
        calves: 74
      },
      overallScore: 84,
      strengths: [
        "Well-developed upper body",
        "Good symmetry overall",
        "Strong shoulder development"
      ],
      improvements: [
        "Focus on leg development",
        "Improve core definition",
        "Work on calf size"
      ]
    };
  }
};
