import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateDesignConcept = async (prompt: string) => {
  try {
    const fullPrompt = `You are an architectural fabrication specialist for GO SIGNS. 
    Analyze this design request and provide a technical description and a visual imagination of the final product.
    Request: ${prompt}
    
    Return the response in JSON format:
    {
      "technicalAnalysis": "Technical specifications like material thickness, LED wattage, mounting brackets",
      "visualDescription": "A detailed artistic description for an image generator (concise, clear, high-end architectural photography style)",
      "estimatedLeadTime": "e.g., 4-6 weeks",
      "materialRecommendation": "e.g., 4mm ACM Matte Black"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateDesignImage = async (visualDescription: string, sitePhoto?: string | null, clientLogo?: string | null) => {
  try {
    const parts: any[] = [{ text: `CRITICAL ARCHITECTURAL TASK:
    1. BASE IMAGE: If a site photo is provided, you MUST use it as a 100% STATIC background. DO NOT redimension, change perspective, adjust colors, or re-render the existing building or environment.
    2. SYNTHESIS: Only add the new signage elements (ACM panels, letters, lighting) onto the specific facade area indicated.
    3. REALISM: Ensure the new elements align with the original lighting and perspective of the BASE IMAGE.
    4. BRANDING: Integrate the client logo naturally into the new fabrication if provided.
    
    Target Design Concept: ${visualDescription}` }];
    
    if (sitePhoto) {
      const [mimeTypePart, base64Data] = sitePhoto.split(',');
      const mimeType = mimeTypePart.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { data: base64Data, mimeType } });
    }

    if (clientLogo) {
      const [mimeTypePart, base64Data] = clientLogo.split(',');
      const mimeType = mimeTypePart.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { data: base64Data, mimeType } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No candidates in response");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
