export interface LoginUserResponse {
  access_token: string;
  professional: IProfessional;
}
export interface forgotPasswordResponse {
  successResponse: string;
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
