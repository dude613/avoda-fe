export interface UserProfile {
    data?: {
      userName: string;
      email: string;
      verified: string;
      picture: string;
      role : string;
    };
  }

  export interface TeamMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar?: string;
    organizationName?: string;
    address?: string;
  }

  export interface FormData {
    name: string;
    email: string;
    role: string;
  }

  interface LoginFormData {
    email: string;
    password: string;
  }
  interface EmailFormData {
    email: string;
  };