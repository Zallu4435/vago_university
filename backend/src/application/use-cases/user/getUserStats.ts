// application/use-cases/user/getUserStats.ts
import { User } from "../../../infrastructure/database/mongoose/models/user.model";

class GetUserStats {
  async execute() {
    console.log(`Getting user statistics`);
    
    // Get total user count
    const totalUsers = await User.countDocuments();
    
    // Get user counts by role
    const studentCount = await User.countDocuments({ role: "Student" });
    const facultyCount = await User.countDocuments({ role: "Faculty" });
    const adminCount = await User.countDocuments({ role: "Admin" });
    
    // Get user counts by status
    const activeCount = await User.countDocuments({ status: "Active" });
    const pendingCount = await User.countDocuments({ status: "Pending" });
    const suspendedCount = await User.countDocuments({ status: "Suspended" });
    
    // Get monthly user registrations (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const monthlyRegistrations = await User.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { 
        $sort: { 
          "_id.year": 1, 
          "_id.month": 1 
        } 
      }
    ]);
    
    // Format monthly data
    const monthlyData = monthlyRegistrations.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      count: item.count
    }));
    
    return {
      totalUsers,
      byRole: {
        Student: studentCount,
        Faculty: facultyCount,
        Admin: adminCount
      },
      byStatus: {
        Active: activeCount,
        Pending: pendingCount,
        Suspended: suspendedCount
      },
      monthlyRegistrations: monthlyData
    };
  }
}

export const getUserStats = new GetUserStats();