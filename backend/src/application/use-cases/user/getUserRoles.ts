// application/use-cases/user/getUserRoles.ts
import { User } from "../../../infrastructure/database/mongoose/models/user.model";

class GetUserRoles {
  async execute() {
    console.log(`Getting available user roles`);
    
    // Return the fixed list of roles from the schema
    const roles = ["Student", "Faculty", "Admin"];
    
    // Optionally, you could also query the database for distinct roles
    // const roles = await User.distinct("role");
    
    return roles;
  }
}

export const getUserRoles = new GetUserRoles();