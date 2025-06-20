"use server"
import { Client, Account, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.PROJECT_ID);

  const cookieStore = await cookies(); // Wait for cookies to resolve
  const session = cookieStore.get("appSession");
  if (!session || !session.value) {
    return { success: false, message: "Failed to load session" };
  }

  client.setSession(session.value);

  const databases = new Databases(client);
  const storage = new Storage(client);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return databases;
    },
    get storage() {
      return storage;
    }
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}