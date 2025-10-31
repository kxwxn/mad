"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData): Promise<void> {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    throw new Error("Unauthorized: You must be an admin to perform this action.");
  }

  const userId = formData.get("id") as string;
  const role = formData.get("role");

  if (!userId) {
    throw new Error("Invalid input: User ID is required.");
  }
  if (!role) {
    throw new Error("Invalid input: Role is required.");
  }

  try {
    await client.users.updateUserMetadata(
      userId,
      {
        publicMetadata: { role: role },
      }
    );
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error setting user role:", err);
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Failed to set user role: ${message}`);
  }
}

export async function removeRole(formData: FormData): Promise<void> {
  const client = await clerkClient();

  // Check that the user trying to remove the role is an admin
  if (!checkRole("admin")) {
    throw new Error("Unauthorized: You must be an admin to perform this action.");
  }

  const userId = formData.get("id") as string;

  if (!userId) {
    throw new Error("Invalid input: User ID is required.");
  }

  try {
    await client.users.updateUserMetadata(
      userId,
      {
        publicMetadata: { role: null },
      }
    );
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error removing user role:", err);
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Failed to remove user role: ${message}`);
  }
}
