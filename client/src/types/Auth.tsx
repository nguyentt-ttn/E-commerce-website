export interface RegsiterInterface {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    address?: string;
    via?: "email" | "sms";
}

export interface LoginInterface {
    email: string;
    password: string;
}

// export interface UserInterface {
//   name: string;
//   email: string;
//   slug?: string;
//   phone?: string;
//   address?: string;
//   avatarUrl?: string;
//   role?: string;
// }
export interface UserInterface {
  name: string;                 
  slug?: string;                
  email: string;              
  password?: string;           
  provider?: "local" | "google"; 
  googleId?: string;           
  avatarUrl?: string;          
  phone?: string;              
  address?: string;            
  status?: "active" | "inactive" | "banned" | "pending" | "deleted";
  role?: string
  createdAt?: string;          
  updatedAt?: string;          
}

