
// Interior Design API Service

// API endpoint
const API_URL = "http://interior.techrealm.online/api/interior-design";

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

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as RoomAnalysis;
  } catch (error) {
    console.error("Error analyzing room:", error);
    throw error;
  }
};
