// Separate types file to avoid circular dependencies
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






