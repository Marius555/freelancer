"use server"
import { ID } from "node-appwrite";
import { createAdminClient } from "../appwriteServer";
import { cookies } from "next/headers";

export async function createUser(data) {
    try {
        const email = await data.email.trim();
        const name = await email.split("@");
        const password = await data.password;
      
        const { account } = await createAdminClient();
      
        await account.create(ID.unique(), email, password, name[0]);
        const session = await account.createEmailPasswordSession(email, password);
        console.log("session", session);
        const cookieStore = await cookies()
        cookieStore.set("appSession", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
      
        return { success: true, message: "User Created Successfull" };
    } catch (error) {
        return { success: false, message: error.message || "An error occurred" };
    }
 
}

