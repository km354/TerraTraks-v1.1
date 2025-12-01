/**
 * OpenAI API Service
 * 
 * TODO: Implement real OpenAI API integration
 * API Documentation: https://platform.openai.com/docs/api-reference
 */

export interface ItineraryGenerationInput {
  parks: string[];
  startDate: string;
  endDate: string;
  startingPoint?: string;
  pace: "relaxed" | "balanced" | "packed";
  preferences?: {
    maxMilesPerDay?: number;
    maxHoursHiking?: number;
    difficulty?: ("easy" | "moderate" | "hard")[];
  };
}

export interface GeneratedActivity {
  name: string;
  type: "hike" | "viewpoint" | "poi" | "other";
  park: string;
  day: number;
  description?: string;
  estimatedDuration?: string;
  difficulty?: "easy" | "moderate" | "hard";
  requiresPermit?: boolean;
  requiresShuttle?: boolean;
}

export interface GeneratedItinerary {
  days: Array<{
    day: number;
    park: string;
    activities: GeneratedActivity[];
    drivingTime?: string;
    notes?: string;
  }>;
  summary?: string;
}

/**
 * Generate itinerary using OpenAI
 * @param input - Itinerary generation parameters
 */
export async function generateItineraryPrompt(
  input: ItineraryGenerationInput
): Promise<GeneratedItinerary> {
  // TODO: Implement real OpenAI API call
  // const apiKey = process.env.OPENAI_API_KEY;
  // if (!apiKey) {
  //   throw new Error("OPENAI_API_KEY is not set");
  // }
  //
  // const prompt = `Generate a detailed itinerary for visiting ${input.parks.join(", ")} 
  //   from ${input.startDate} to ${input.endDate}. 
  //   Pace: ${input.pace}. 
  //   ${input.startingPoint ? `Starting from: ${input.startingPoint}` : ""}
  //   ${input.preferences ? `Preferences: ${JSON.stringify(input.preferences)}` : ""}
  //   Provide a day-by-day breakdown with activities, estimated times, and recommendations.`;
  //
  // const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-4",
  //     messages: [{ role: "user", content: prompt }],
  //     temperature: 0.7,
  //   }),
  // });
  //
  // const data = await response.json();
  // return JSON.parse(data.choices[0].message.content);

  // Mock data for development
  return {
    days: input.parks.map((park, index) => ({
      day: index + 1,
      park,
      activities: [
        {
          name: `Activity ${index + 1}`,
          type: "viewpoint" as const,
          park,
          day: index + 1,
          description: "Mock activity description",
        },
      ],
    })),
    summary: "Mock itinerary generated",
  };
}

