import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WorkoutPreferences {
  workoutDays: string;
  fitnessGoal: string;
  experienceLevel: string;
  workoutDuration: string;
  availableEquipment: string[];
  targetMuscles: string[];
  injuries: string;
  additionalNotes: string;
}

interface Exercise {
  name: string;
  category: string;
  muscle: string;
  sets: number;
  reps: string;
  weight?: number;
  rest?: string;
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  exercises: Exercise[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const preferences: WorkoutPreferences = await req.json()
    
    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found')
    }

    // Create detailed prompt for AI
    const prompt = `Create a detailed workout program based on these preferences:

Workout Frequency: ${preferences.workoutDays}
Primary Goal: ${preferences.fitnessGoal}
Experience Level: ${preferences.experienceLevel}
Workout Duration: ${preferences.workoutDuration}
Available Equipment: ${preferences.availableEquipment.join(', ')}
Target Muscle Groups: ${preferences.targetMuscles.join(', ')}
Injuries/Limitations: ${preferences.injuries || 'None specified'}
Additional Notes: ${preferences.additionalNotes || 'None'}

Please create a comprehensive workout program that includes:
1. A catchy program name
2. A brief description explaining the program's approach
3. Program duration (e.g., "4 weeks", "8 weeks")
4. Difficulty level (Beginner, Intermediate, or Advanced)
5. A list of 6-12 exercises with:
   - Exercise name
   - Target muscle group/category
   - Number of sets (2-5)
   - Rep range (e.g., "8-12", "12-15", "6-8")
   - Rest time between sets
   - Any weight recommendations if applicable

Make sure the exercises:
- Match the available equipment
- Align with the fitness goal
- Are appropriate for the experience level
- Target the specified muscle groups
- Fit within the specified workout duration
- Account for any injuries or limitations

Return the response in this exact JSON format:
{
  "id": "generated-[timestamp]",
  "name": "Program Name",
  "description": "Brief description of the program approach and benefits",
  "duration": "X weeks",
  "difficulty": "Beginner/Intermediate/Advanced",
  "exercises": [
    {
      "name": "Exercise Name",
      "category": "Category (e.g., Strength, Cardio, Flexibility)",
      "muscle": "Primary muscle group",
      "sets": 3,
      "reps": "8-12",
      "rest": "60-90 seconds"
    }
  ]
}`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a certified personal trainer and fitness expert. Create personalized workout programs based on user preferences. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response
    let workoutProgram: WorkoutProgram
    try {
      workoutProgram = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Invalid AI response format')
    }

    // Ensure ID is unique
    workoutProgram.id = `generated-${Date.now()}`

    return new Response(
      JSON.stringify(workoutProgram),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating workout:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})