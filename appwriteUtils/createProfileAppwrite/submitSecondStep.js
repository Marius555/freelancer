"use server";
import { createSessionClient } from "../../appwriteServer";
import { ID } from "node-appwrite";
import decript from "../../components/middleware/decript";
import { cookies } from "next/headers";

const submitSecondStep = async (data, parentProfileId) => {
    let profilePictureUrl = null;
  try {
    const { databases, storage } = await createSessionClient();
    const cookieStore = await cookies();
    const session = await cookieStore.get("localSession");
    const decriptedSession = await decript(session?.value);

    
    // Upload profile picture to storage if provided
    if (data.profilePicture) {
      const file = data.profilePicture;
      const uploadedFile = await storage.createFile(
        process.env.PROFILE_BUKET_ID,
        ID.unique(),
        file
      );
      
      // Construct the file URL manually
      profilePictureUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.PROFILE_BUKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.PROJECT_ID}`;
    }
 

    const secondStepData = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.CREATE_PROFILE_SECOND_STEP,
      ID.unique(),
      {
        profileId: parentProfileId, // Reference to parent profile
        userId: decriptedSession.userId,
        profilePictureUrl: profilePictureUrl,
        profilePictureFileId: data.profilePicture ? data.profilePicture.name : null,
        step: 2,
        completed: true,
      }
    );
    return { success: true, message: "Profile picture saved successfully", data: secondStepData };
  } catch (error) {
    return { success: false, message: { error: error.message || "Failed to save profile picture" } };
  }
};

export default submitSecondStep; 