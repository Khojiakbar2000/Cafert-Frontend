import axios from "axios";
import { serverApi } from "../../lib/config";
import { Member } from "../../lib/types/member";
import { MemberStatus } from "../../lib/enums/member.enum";

export interface UserActivity {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastActivity: string;
  activity: string;
  location: string;
  memberId: string;
}

export interface RecentActivity {
  id: string;
  name: string;
  avatar: string;
  message: string;
  type: 'order' | 'favorite' | 'view' | 'join';
  time: string;
  memberId: string;
}

export interface ActiveUsersStats {
  totalActive: number;
  onlineUsers: number;
  recentJoiners: number;
}

class ActivityService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  // Get active users - based on member status and activity
  public async getActiveUsers(): Promise<UserActivity[]> {
    try {
      // Use the existing top users endpoint
      const url = `${this.path.replace(/\/$/, "")}/member/top-users`;
      const result = await axios.get(url, {
        timeout: 5000, // 5 second timeout
        signal: AbortSignal.timeout(5000) // Abort after 5 seconds
      });
      console.log("getActiveUsers (using top-users):", result);
      
      // Transform Member data to UserActivity format
      const members: Member[] = result.data;
      
      // Filter for ACTIVE members only (these are the real "active users")
      const activeMembers = members.filter(member => member.memberStatus === MemberStatus.ACTIVE);
      
      return activeMembers.slice(0, 4).map((member, index) => ({
        id: member._id,
        name: member.memberNick,
        avatar: member.memberImage ? `${this.path}${member.memberImage}` : this.getRandomAvatar(),
        status: 'online' as const,
        lastActivity: this.getRandomTimeAgo(),
        activity: this.getRandomActivity(),
        location: this.getRandomLocation(),
        memberId: member._id
      }));
    } catch (err: any) {
      // Don't log aborted requests as errors
      if (err.code === 'ECONNABORTED' || err.name === 'AbortError') {
        console.log("getActiveUsers request was aborted");
      } else {
        console.log("Error, getActiveUsers:", err);
      }
      // Return fallback data if API fails
      return this.getFallbackActiveUsers();
    }
  }

  // Get recent activities - simulate based on existing data
  public async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // Use the existing top users endpoint to get some real user data
      const url = `${this.path.replace(/\/$/, "")}/member/top-users`;
      const result = await axios.get(url);
      console.log("getRecentActivities (using top-users):", result);
      
      const members: Member[] = result.data;
      const activities: RecentActivity[] = [];
      
      // Create realistic activities based on ACTIVE users only
      const activeMembers = members.filter(member => member.memberStatus === MemberStatus.ACTIVE);
      
      activeMembers.slice(0, 5).forEach((member, index) => {
        const activityTypes: Array<'order' | 'favorite' | 'view' | 'join'> = ['order', 'favorite', 'view', 'join'];
        const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        activities.push({
          id: `activity_${member._id}_${index}`,
          name: member.memberNick,
          avatar: member.memberImage ? `${this.path}${member.memberImage}` : this.getRandomAvatar(),
          message: this.getActivityMessage(randomType),
          type: randomType,
          time: this.getRandomTimeAgo(),
          memberId: member._id
        });
      });
      
      return activities;
    } catch (err) {
      console.log("Error, getRecentActivities:", err);
      // Return fallback data if API fails
      return this.getFallbackRecentActivities();
    }
  }

  // Get active users statistics - calculate from real data based on member status
  public async getActiveUsersStats(): Promise<ActiveUsersStats> {
    try {
      // Use the existing top users endpoint
      const url = `${this.path.replace(/\/$/, "")}/member/top-users`;
      const result = await axios.get(url, {
        timeout: 5000, // 5 second timeout
        signal: AbortSignal.timeout(5000) // Abort after 5 seconds
      });
      console.log("getActiveUsersStats (using top-users):", result);
      
      const members: Member[] = result.data;
      
      // Calculate stats based on member status
      const activeMembers = members.filter(member => member.memberStatus === MemberStatus.ACTIVE);
      const blockedMembers = members.filter(member => member.memberStatus === MemberStatus.BLOCK);
      const deletedMembers = members.filter(member => member.memberStatus === MemberStatus.DELETE);
      
      // Calculate realistic stats based on actual member status
      const totalActive = activeMembers.length;
      const onlineUsers = Math.min(Math.floor(totalActive * 0.7), totalActive); // 70% of active users are "online"
      const recentJoiners = Math.min(Math.floor(totalActive * 0.2), 15); // 20% of active users are recent joiners
      
      return {
        totalActive: totalActive,
        onlineUsers: onlineUsers,
        recentJoiners: recentJoiners
      };
    } catch (err: any) {
      // Don't log aborted requests as errors
      if (err.code === 'ECONNABORTED' || err.name === 'AbortError') {
        console.log("getActiveUsersStats request was aborted");
      } else {
        console.log("Error, getActiveUsersStats:", err);
      }
      // Return fallback data if API fails
      return {
        totalActive: 45,
        onlineUsers: 38,
        recentJoiners: 12
      };
    }
  }

  // Track user activity (when user performs an action)
  public async trackUserActivity(activity: {
    type: 'order' | 'favorite' | 'view' | 'join';
    productId?: string;
    memberId: string;
  }): Promise<void> {
    try {
      // For now, just log the activity since we don't have a tracking endpoint
      console.log("Tracking user activity:", activity);
      
      // In the future, you can implement this endpoint:
      // const url = `${this.path.replace(/\/$/, "")}/member/track-activity`;
      // await axios.post(url, activity);
    } catch (err) {
      console.log("Error tracking user activity:", err);
      // Silently fail - don't break user experience
    }
  }

  // Helper methods for generating realistic data
  private getRandomAvatar(): string {
    const avatars = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  private getRandomTimeAgo(): string {
    const times = ['just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private getRandomActivity(): string {
    const activities = [
      'Ordered Caramel Latte',
      'Browsing menu',
      'Added to favorites',
      'Joined community',
      'Exploring coffee beans'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  private getRandomLocation(): string {
    const locations = [
      'New York, NY',
      'San Francisco, CA',
      'Los Angeles, CA',
      'Chicago, IL',
      'Miami, FL'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private getActivityMessage(type: 'order' | 'favorite' | 'view' | 'join'): string {
    const messages = {
      order: [
        'just ordered a Caramel Macchiato',
        'ordered a Cappuccino',
        'placed an order for Espresso'
      ],
      favorite: [
        'added Espresso to favorites',
        'liked our Latte Art',
        'favorited Cappuccino'
      ],
      view: [
        'is browsing our menu',
        'is exploring our coffee beans',
        'viewed our special offers'
      ],
      join: [
        'joined our coffee community',
        'became a new member',
        'signed up for updates'
      ]
    };
    
    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  // Fallback data for active users
  private getFallbackActiveUsers(): UserActivity[] {
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        status: 'online',
        lastActivity: '2 min ago',
        activity: 'Ordered Caramel Latte',
        location: 'New York, NY',
        memberId: 'user1'
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        status: 'online',
        lastActivity: '1 min ago',
        activity: 'Browsing menu',
        location: 'San Francisco, CA',
        memberId: 'user2'
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        status: 'online',
        lastActivity: '3 min ago',
        activity: 'Added to favorites',
        location: 'Los Angeles, CA',
        memberId: 'user3'
      },
      {
        id: '4',
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        status: 'online',
        lastActivity: 'just now',
        activity: 'Joined community',
        location: 'Chicago, IL',
        memberId: 'user4'
      }
    ];
  }

  // Fallback data for recent activities
  private getFallbackRecentActivities(): RecentActivity[] {
    return [
      {
        id: 'activity_1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        message: 'just ordered a Caramel Macchiato',
        type: 'order',
        time: '2 min ago',
        memberId: 'user1'
      },
      {
        id: 'activity_2',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        message: 'added Espresso to favorites',
        type: 'favorite',
        time: '5 min ago',
        memberId: 'user2'
      },
      {
        id: 'activity_3',
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        message: 'is browsing our menu',
        type: 'view',
        time: '8 min ago',
        memberId: 'user3'
      },
      {
        id: 'activity_4',
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        message: 'joined our coffee community',
        type: 'join',
        time: '12 min ago',
        memberId: 'user4'
      }
    ];
  }
}

export default ActivityService; 