"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";



const submitSixStep = async (data, parentProfileId) => {
  try {
    const { databases } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

   

    const sixStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_STEP_SIX,
      ID.unique(),
      {
        profileId: parentProfileId, // Reference to parent profile
        userId: decriptedSession.userId,
        profession: data.education.profession,
        country: data.education.country,
        school: data.education.school,
        educationLevel: data.education.educationLevel,
        startDate: data.education.startDate,
        endDate: data.education.endDate,
        step: 6,
        completed: true,
      }
    );
    return { success: true, message: "Education information saved successfully", data: sixStepData };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save education information" } };
  }
};

export default submitSixStep; 