
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResponse {
  ratings: {
    chest: number;
    shoulders: number;
    biceps: number;
    triceps: number;
    back: number;
    abs: number;
    lean: number;
    glutes?: number;
    quads?: number;
    hamstrings?: number;
    calves?: number;
  };
  overallScore: number;
  strengths: string[];
  improvements: string[];
  workoutPlan?: Array<{
    exercise: string;
    sets: string;
    focus: string;
  }>;
}

export const analyzePhysique = async (
  frontImage: string,
  backImage: string,
  gender: string,
  analysisType: 'upper-body' | 'full-body'
): Promise<AnalysisResponse> => {
  try {
    const API_KEY = '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';

    const prompt = `You are a professional fitness AI assistant.

The user has uploaded 2 full-body images: front-facing flexing and back-facing flexing. The user has selected their gender as ${gender}. Evaluate the physique based on muscular development, symmetry, proportion, and posture.

Rate the following muscle groups on a scale from 1 to 100 based on visible development, conditioning, and symmetry. BE STRICT with ratings - only exceptional physiques should score above 90, good physiques 70-85, average 50-70, below average 30-50, poor below 30:
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

Provide an **Overall Physique Score** from 1 to 100, considering symmetry, muscle balance, and aesthetics. Be strict - only elite physiques deserve scores above 85.

Briefly list:
- 2–3 physique strengths
- 2–3 improvement suggestions (training or posing tips)

Also provide a custom workout plan with 6-8 exercises focusing on the areas that need improvement. For each exercise, include sets/reps and the target muscle group.

Guidelines:
- Be supportive and constructive but strict and accurate
- Avoid negative tone or medical claims
- If any image is unclear or cropped, mention it in your response
- Cap all ratings at maximum 100
- Be realistic and strict with scoring

Make sure the results are as accurate and truthful as possible.

Output format should be a JSON object with this exact structure:
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
    "Well-developed shoulders and upper body",
    "Good symmetry and proportions"
  ],
  "improvements": [
    "Focus on lower leg development",
    "Increase core definition"
  ],
  "workoutPlan": [
    {
      "exercise": "Calf Raises",
      "sets": "4 x 15-20",
      "focus": "Calves"
    },
    {
      "exercise": "Planks",
      "sets": "3 x 60s",
      "focus": "Abs"
    }
  ]
}`;

    console.log('Starting physique analysis with OpenAI GPT-4o...');
    
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
              { type: 'image_url', image_url: { url: backImage } }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received:', data);
    
    const analysisText = data.choices[0]?.message?.content;
    console.log('Analysis text:', analysisText);
    
    // Try to parse JSON response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      console.log('Parsed analysis result:', parsedResult);
      
      // Cap all ratings at 100 and ensure lean rating exists
      const cappedRatings = {
        chest: Math.min(parsedResult.ratings.chest || 75, 100),
        shoulders: Math.min(parsedResult.ratings.shoulders || 80, 100),
        biceps: Math.min(parsedResult.ratings.biceps || 78, 100),
        triceps: Math.min(parsedResult.ratings.triceps || 76, 100),
        back: Math.min(parsedResult.ratings.back || 82, 100),
        abs: Math.min(parsedResult.ratings.abs || 65, 100),
        lean: Math.min(parsedResult.ratings.lean || parsedResult.ratings.abs || 65, 100),
        glutes: parsedResult.ratings.glutes ? Math.min(parsedResult.ratings.glutes, 100) : Math.min(75, 100),
        quads: parsedResult.ratings.quads ? Math.min(parsedResult.ratings.quads, 100) : Math.min(70, 100),
        hamstrings: parsedResult.ratings.hamstrings ? Math.min(parsedResult.ratings.hamstrings, 100) : Math.min(72, 100),
        calves: parsedResult.ratings.calves ? Math.min(parsedResult.ratings.calves, 100) : Math.min(68, 100)
      };
      
      return {
        ratings: cappedRatings,
        overallScore: Math.min(parsedResult.overallScore || 75, 100),
        strengths: parsedResult.strengths || [],
        improvements: parsedResult.improvements || [],
        workoutPlan: parsedResult.workoutPlan || []
      };
    }
    
    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback mock data for development/error cases with strict ratings
    const fallbackRatings = {
      chest: Math.min(Math.floor(Math.random() * 25) + 60, 100),
      shoulders: Math.min(Math.floor(Math.random() * 25) + 65, 100),
      biceps: Math.min(Math.floor(Math.random() * 20) + 63, 100),
      triceps: Math.min(Math.floor(Math.random() * 20) + 61, 100),
      back: Math.min(Math.floor(Math.random() * 25) + 67, 100),
      abs: Math.min(Math.floor(Math.random() * 30) + 50, 100),
      lean: Math.min(Math.floor(Math.random() * 25) + 50, 100),
      glutes: Math.min(Math.floor(Math.random() * 20) + 60, 100),
      quads: Math.min(Math.floor(Math.random() * 25) + 55, 100),
      hamstrings: Math.min(Math.floor(Math.random() * 20) + 57, 100),
      calves: Math.min(Math.floor(Math.random() * 25) + 53, 100)
    };

    const overallScore = Math.min(Math.floor(Object.values(fallbackRatings).reduce((a, b) => a + b, 0) / Object.keys(fallbackRatings).length), 100);

    return {
      ratings: fallbackRatings,
      overallScore,
      strengths: [
        "Good upper body development",
        "Balanced muscle proportions",
        "Strong back development"
      ],
      improvements: [
        "Focus on leg development",
        "Improve core definition",
        "Work on overall leanness"
      ],
      workoutPlan: [
        { exercise: "Squats", sets: "4 x 8-12", focus: "Quads" },
        { exercise: "Romanian Deadlifts", sets: "4 x 8-12", focus: "Hamstrings" },
        { exercise: "Calf Raises", sets: "4 x 15-20", focus: "Calves" },
        { exercise: "Planks", sets: "3 x 60s", focus: "Abs" },
        { exercise: "Bulgarian Split Squats", sets: "3 x 12 each", focus: "Legs" },
        { exercise: "Russian Twists", sets: "3 x 30", focus: "Abs" },
        { exercise: "Walking Lunges", sets: "3 x 20 each", focus: "Legs" },
        { exercise: "HIIT Cardio", sets: "20 min", focus: "Fat Loss" }
      ]
    };
  }
};
