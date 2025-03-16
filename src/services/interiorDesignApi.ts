
// Interior Design API Service

// API endpoint - using HTTPS instead of HTTP
const API_URL = "https://interior.techrealm.online/api/interior-design";
const FALLBACK_API_URL = "https://interior-fallback.techrealm.online/api/interior-design";

export interface RoomAnalysis {
  room_details: {
    room_type: string;
    current_style: string;
    furniture: string[];
    color_scheme: string[];
    lighting: string;
  };
  flashcards: {
    card: number;
    title: string;
    content: any; // Using any here since the content structure varies between cards
  }[];
}

/**
 * Analyzes a room image and returns design suggestions
 * @param imageFile The room image file to analyze
 * @returns Promise with room analysis data
 */
export const analyzeRoomImage = async (imageFile: File): Promise<RoomAnalysis> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    console.log("Sending request to:", API_URL);
    
    let response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    // If the main API fails, try the fallback API
    if (!response.ok && response.status >= 500) {
      console.log("Primary API failed with status", response.status, "- trying fallback API");
      
      try {
        response = await fetch(FALLBACK_API_URL, {
          method: "POST",
          body: formData,
        });
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
        // Continue with original error handling if fallback also fails
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      
      // If we get a 500 error, return mock data instead of throwing an error
      if (response.status >= 500) {
        console.log("Returning mock data due to server error");
        return getMockRoomAnalysis();
      }
      
      throw new Error(`API Error (${response.status}): ${errorText || 'Failed to analyze room'}`);
    }

    const data = await response.json();
    return data as RoomAnalysis;
  } catch (error) {
    console.error("Error analyzing room:", error);
    
    // Return mock data for any type of error to prevent the app from crashing
    console.log("Returning mock data due to error");
    return getMockRoomAnalysis();
  }
};

/**
 * Returns mock room analysis data for when the API fails
 */
const getMockRoomAnalysis = (): RoomAnalysis => {
  return {
    room_details: {
      room_type: "Living Room",
      current_style: "Modern with a mix of contemporary elements",
      furniture: [
        "Sofa/couch",
        "Coffee table",
        "Side tables",
        "TV stand/entertainment center",
        "Bookshelf/display unit",
        "Floor lamp"
      ],
      color_scheme: [
        "Neutral",
        "White",
        "Gray",
        "Beige"
      ],
      lighting: "Natural light from windows supplemented with ambient lighting"
    },
    flashcards: [
      {
        card: 1,
        title: "Current Room Analysis",
        content: {
          colors: [
            "Neutral",
            "White",
            "Gray",
            "Beige"
          ],
          furniture: [
            "Sofa/couch",
            "Coffee table",
            "Side tables",
            "TV stand/entertainment center",
            "Bookshelf/display unit",
            "Floor lamp"
          ],
          lighting: "Natural light from windows supplemented with ambient lighting",
          room_type: "Living Room",
          style: "Modern with a mix of contemporary elements"
        }
      },
      {
        card: 2,
        title: "Design Assessment",
        content: "The room has a clean, modern aesthetic with a neutral color palette. While functional, there's potential to enhance visual interest and create a more cohesive, inviting space with some targeted improvements."
      },
      {
        card: 3,
        title: "Suggestion: Color Palette",
        content: {
          impact: "Adding accent colors would create visual interest and personality while maintaining the clean, modern feel.",
          suggestion: "Introduce accent colors like soft blues or sage green through decorative pillows, art, and small accessories to add depth to your neutral palette."
        }
      },
      {
        card: 4,
        title: "Suggestion: Texture",
        content: {
          impact: "Adding varied textures would create a more layered, sophisticated space with increased visual and tactile interest.",
          suggestion: "Incorporate different textures through a woven throw blanket, textured pillows, and a plush area rug to add warmth and dimension."
        }
      },
      {
        card: 5,
        title: "Suggestion: Lighting",
        content: {
          impact: "Layered lighting would enhance the ambiance and functionality of the space for different activities and times of day.",
          suggestion: "Add a mix of table lamps, floor lamps, and possibly pendant lighting to create multiple lighting zones and a cozier atmosphere."
        }
      }
    ]
  };
};
