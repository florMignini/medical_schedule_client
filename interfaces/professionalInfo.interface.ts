import { Patient } from "./patientsResponse";

export interface ProfessionalInformation {
    id:               string;
    createdAt:        Date;
    updatedAt:        Date;
    firstName:        string;
    lastName:         string;
    username:         string;
    userImage:        string;
    specialty:        string;
    phoneNumber:      number;
    email:            string;
    isActive:         boolean;
    patientsIncluded: PatientsIncluded[];
}

export interface PatientsIncluded {
    id:        string;
    createdAt: Date;
    updatedAt: Date;
    patient:   Patient;
}


