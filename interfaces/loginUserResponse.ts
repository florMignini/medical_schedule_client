export interface LoginUserResponse {
  accessToken: string;
  professional: IProfessional;
}

export interface IProfessional {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  username: string;
  userImage: string;
  specialty: string;
  phoneNumber: number;
  email: string;
  isActive: boolean;
}
