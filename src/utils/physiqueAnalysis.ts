
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
  isFallbackData?: boolean;
}

export const analyzePhysique = async (
  frontImage: string,
  backImage: string,
  gender: string,
  analysisType: 'upper-body' | 'full-body'
): Promise<AnalysisResponse> => {
  try {
    const API_KEY = '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';

    const analysisTypeText = analysisType === 'upper-body' ? 'UPPER BODY ONLY' : 'FULL BODY';
    const focusAreas = analysisType === 'upper-body' 
      ? 'Focus ONLY on upper body muscle groups: Chest, Shoulders, Biceps, Triceps, Back, and Abs. DO NOT provide any lower body recommendations or exercises.'
      : 'Analyze all muscle groups including both upper and lower body.';

    const ratingInstructions = analysisType === 'upper-body'
      ? `Rate ONLY these upper body muscle groups on a scale from 1 to 100:
- Chest  
- Shoulders  
- Biceps  
- Triceps  
- Back  
- Abs
- Leanness (overall body fat level and muscle definition)

Do NOT rate or mention: Glutes, Quads, Hamstrings, or Calves.

IMPORTANT SCORING GUIDELINES:
- For Abs and Leanness: If visible abdominal muscles are present (even if not perfectly defined), assign a minimum score of 70 for both categories
- Be generous with abs and leanness scoring - visible definition should always score 70+
- Only rate abs below 70 if there's absolutely no visible abdominal definition`
      : `Rate the following muscle groups on a scale from 1 to 100:
- Chest  
- Shoulders  
- Biceps  
- Triceps  
- Back  
- Abs  
- Leanness (overall body fat level and muscle definition)
- Glutes  
- Quads  
- Hamstrings  
- Calves

IMPORTANT SCORING GUIDELINES:
- For Abs and Leanness: If visible abdominal muscles are present (even if not perfectly defined), assign a minimum score of 70 for both categories
- Be generous with abs and leanness scoring - visible definition should always score 70+
- Only rate abs below 70 if there's absolutely no visible abdominal definition`;

    const workoutInstructions = analysisType === 'upper-body'
      ? 'Provide a workout plan with 6-8 exercises focusing ONLY on upper body areas that need improvement (chest, shoulders, biceps, triceps, back, abs). DO NOT include any leg exercises, squats, lunges, calf raises, or other lower body movements.'
      : 'Provide a workout plan with 6-8 exercises focusing on the areas that need improvement, including both upper and lower body exercises as needed.';

    const prompt = `You are a professional fitness AI assistant analyzing a ${analysisTypeText} physique.

The user has uploaded 2 full-body images: front-facing flexing and back-facing flexing. The user has selected their gender as ${gender} and wants a ${analysisTypeText} analysis.

${focusAreas}

${ratingInstructions}

BE STRICT with ratings - only exceptional physiques should score above 90, good physiques 70-85, average 50-70, below average 30-50, poor below 30.

EXCEPTION: For Abs and Leanness ratings, be more generous. If you can see ANY visible abdominal muscle definition or separation, assign AT LEAST 70 points for both Abs and Leanness categories. Only score below 70 if there is absolutely no visible ab definition.

Provide an **Overall Physique Score** from 1 to 100, considering symmetry, muscle balance, and aesthetics. Be strict - only elite physiques deserve scores above 85.

Briefly list:
- 2–3 physique strengths (${analysisType === 'upper-body' ? 'upper body only' : 'full body'})
- 2–3 improvement suggestions (${analysisType === 'upper-body' ? 'upper body training tips only' : 'full body training tips'})

${workoutInstructions}

Guidelines:
- Be supportive and constructive but strict and accurate
- Avoid negative tone or medical claims
- If any image is unclear or cropped, mention it in your response
- Cap all ratings at maximum 100
- Be realistic and strict with scoring EXCEPT for abs and leanness where visible definition should always be 70+
- ${analysisType === 'upper-body' ? 'IMPORTANT: Do NOT mention legs, glutes, quads, hamstrings, calves, or any lower body parts in strengths, improvements, or workout plan.' : ''}

Make sure the results are as accurate and truthful as possible.

Output format should be a JSON object with this exact structure:
${analysisType === 'upper-body' ? `{
  "ratings": {
    "chest": 87,
    "shoulders": 92,
    "biceps": 90,
    "triceps": 88,
    "back": 91,
    "abs": 79
  },
  "overallScore": 86,
  "strengths": [
    "Well-developed shoulders and upper body",
    "Good upper body symmetry and proportions"
  ],
  "improvements": [
    "Increase chest thickness and width",
    "Improve core definition and abs visibility"
  ],
  "workoutPlan": [
    {
      "exercise": "Incline Barbell Press",
      "sets": "4 x 8-12",
      "focus": "Chest"
    },
    {
      "exercise": "Planks",
      "sets": "3 x 60s",
      "focus": "Abs"
    }
  ]
}` : `{
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
}`}`;

    console.log('Starting physique analysis with OpenAI GPT-4o...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
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
        max_completion_tokens: 1500
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
      
      // Cap all ratings at 100 and ensure lean rating exists, with minimum 70 for abs and leanness if visible
      const cappedRatings = {
        chest: Math.min(parsedResult.ratings.chest || 75, 100),
        shoulders: Math.min(parsedResult.ratings.shoulders || 80, 100),
        biceps: Math.min(parsedResult.ratings.biceps || 78, 100),
        triceps: Math.min(parsedResult.ratings.triceps || 76, 100),
        back: Math.min(parsedResult.ratings.back || 82, 100),
        abs: Math.min(Math.max(parsedResult.ratings.abs || 65, 70), 100), // Minimum 70 for visible abs
        lean: Math.min(Math.max(parsedResult.ratings.lean || parsedResult.ratings.abs || 65, 70), 100), // Minimum 70 for visible definition
        ...(analysisType === 'full-body' && {
          glutes: parsedResult.ratings.glutes ? Math.min(parsedResult.ratings.glutes, 100) : Math.min(75, 100),
          quads: parsedResult.ratings.quads ? Math.min(parsedResult.ratings.quads, 100) : Math.min(70, 100),
          hamstrings: parsedResult.ratings.hamstrings ? Math.min(parsedResult.ratings.hamstrings, 100) : Math.min(72, 100),
          calves: parsedResult.ratings.calves ? Math.min(parsedResult.ratings.calves, 100) : Math.min(68, 100)
        })
      };
      
      return {
        ratings: cappedRatings,
        overallScore: Math.min(parsedResult.overallScore || 75, 100),
        strengths: parsedResult.strengths || [],
        improvements: parsedResult.improvements || [],
        workoutPlan: parsedResult.workoutPlan || [],
        isFallbackData: false
      };
    }
    
    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback mock data for development/error cases with analysis type awareness and minimum 70 for abs/leanness
    const fallbackRatings = analysisType === 'upper-body' ? {
      chest: Math.min(Math.floor(Math.random() * 25) + 60, 100),
      shoulders: Math.min(Math.floor(Math.random() * 25) + 65, 100),
      biceps: Math.min(Math.floor(Math.random() * 20) + 63, 100),
      triceps: Math.min(Math.floor(Math.random() * 20) + 61, 100),
      back: Math.min(Math.floor(Math.random() * 25) + 67, 100),
      abs: Math.min(Math.max(Math.floor(Math.random() * 30) + 50, 70), 100), // Minimum 70
      lean: Math.min(Math.max(Math.floor(Math.random() * 25) + 50, 70), 100) // Minimum 70
    } : {
      chest: Math.min(Math.floor(Math.random() * 25) + 60, 100),
      shoulders: Math.min(Math.floor(Math.random() * 25) + 65, 100),
      biceps: Math.min(Math.floor(Math.random() * 20) + 63, 100),
      triceps: Math.min(Math.floor(Math.random() * 20) + 61, 100),
      back: Math.min(Math.floor(Math.random() * 25) + 67, 100),
      abs: Math.min(Math.max(Math.floor(Math.random() * 30) + 50, 70), 100), // Minimum 70
      lean: Math.min(Math.max(Math.floor(Math.random() * 25) + 50, 70), 100), // Minimum 70
      glutes: Math.min(Math.floor(Math.random() * 20) + 60, 100),
      quads: Math.min(Math.floor(Math.random() * 25) + 55, 100),
      hamstrings: Math.min(Math.floor(Math.random() * 20) + 57, 100),
      calves: Math.min(Math.floor(Math.random() * 25) + 53, 100)
    };

    const overallScore = Math.min(Math.floor(Object.values(fallbackRatings).reduce((a, b) => a + b, 0) / Object.keys(fallbackRatings).length), 100);

    const fallbackData = analysisType === 'upper-body' ? {
      strengths: [
        "Well-developed shoulders and upper body",
        "Good upper body symmetry and proportions",
        "Strong back development"
      ],
      improvements: [
        "Increase core definition and abs visibility",
        "Build more chest thickness and width",
        "Improve triceps separation and definition"
      ],
      workoutPlan: [
        { exercise: "Planks", sets: "3 x 60s", focus: "Abs" },
        { exercise: "Incline Barbell Press", sets: "4 x 8-12", focus: "Chest" },
        { exercise: "Close-Grip Push-ups", sets: "3 x 12-15", focus: "Triceps" },
        { exercise: "Hanging Leg Raises", sets: "3 x 12-15", focus: "Abs" },
        { exercise: "Dumbbell Flyes", sets: "3 x 12-15", focus: "Chest" },
        { exercise: "Russian Twists", sets: "3 x 30", focus: "Abs" }
      ]
    } : {
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

    return {
      ratings: fallbackRatings,
      overallScore,
      ...fallbackData,
      isFallbackData: true
    };
  }
};
