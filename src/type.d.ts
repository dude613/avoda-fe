export type UserProfile = {
  data?: {
    userName: string;
    email: string;
    verified: string;
    picture?: string;
    role : string;
    avatar?: string;
  };
}

export type TeamMember = {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar?: string;
    organizationName?: string;
    address?: string;
  }
  
  export type FormData = {
    name: string;
    email: string;
    role: string;
  }

  export type LoginFormData = {
    email: string;
    password: string;
  }
  export type EmailFormData = {
    email: string;
  };