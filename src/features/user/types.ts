export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company: {
    name: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Album {
  id: number;
  userId: number;
  title: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  companyName: string;
}
