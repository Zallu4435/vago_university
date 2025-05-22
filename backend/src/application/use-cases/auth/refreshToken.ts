import jwt from "jsonwebtoken";
import { Register } from "../../../infrastructure/database/mongoose/models/register.model";
import { Admin } from "../../../infrastructure/database/mongoose/models/admin.model";
import { User } from "../../../infrastructure/database/mongoose/models/user.model";
import { Faculty } from "../../../infrastructure/database/mongoose/models/faculty.model";

interface RefreshTokenResponse {
  token: string;
  user: { firstName: string; lastName: string; email: string; profilePicture: string, id: string };
  collection: "register" | "admin" | "user" | "faculty";
}

class RefreshToken {
  async execute({ token }: { token: string }): Promise<RefreshTokenResponse> {
    console.log("Backend: Refreshing token"); // Debug
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as {
        userId: string;
        email: string;
        collection: "register" | "admin" | "user" | "faculty";
      };

      let user;
      switch (decoded.collection) {
        case "register":
          user = await Register.findById(decoded.userId);
          break;
        case "admin":
          user = await Admin.findById(decoded.userId);
          break;
        case "user":
          user = await User.findById(decoded.userId);
          break;
        case "faculty":
          user = await Faculty.findById(decoded.userId);
          break;
        default:
          throw new Error("Invalid collection");
      }

      if (!user || user.email !== decoded.email) {
        throw new Error("Invalid token");
      }

      const newToken = jwt.sign(
        { userId: user._id, email: user.email, collection: decoded.collection },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );

      return {
        token: newToken,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user?._id,
          profilePicture: user?.profilePicture
        },
        collection: decoded.collection,
      };
    } catch (error) {
      console.error("Backend: Refresh token error:", error.message); // Debug
      throw new Error("Invalid or expired token");
    }
  }
}

export const refreshToken = new RefreshToken();
