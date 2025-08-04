"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitThirdStep = async (data, parentProfileId) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    

    // Create separate documents for each language
    const createdLanguages = [];
    
    for (const languageData of data.languages) {
      const languageDocument = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.CREATE_PROFILE_THIRD_STEP,
        ID.unique(),
        {
          profileId: [parentProfileId], // Try array format as error suggests array is expected
          userId: decriptedSession.userId,
          language: languageData.language,
          proficiency: languageData.proficiency,
          isCustom: languageData.isCustom || false,
          step: 3,
          completed: true,
        }
      );
      createdLanguages.push(languageDocument);
    }

    return { 
      success: true, 
      message: `${createdLanguages.length} language(s) saved successfully`, 
      data: createdLanguages 
    };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save languages" } };
  }
};

export default submitThirdStep; 