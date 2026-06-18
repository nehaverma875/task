import type { WithId } from "mongodb";
import type { AppUser, UserDocument } from "@/types/domain";

export function sanitizeUser(user: WithId<UserDocument>): AppUser {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}
