export interface Application {
  id?: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  wilaya: string;
  education: string;
  course: string;
  experience?: string;
  comments?: string;
  registrationType: 'Basic' | 'Full';
  submissionDate: Date;
  paymentMethod?: string;
  agreedToContract?: boolean;
  signature?: string;
  paymentProofUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Workshop {
  id?: string;
  name: string;
  arabicName: string;
  description: string;
  imageUrl: string;
  date: Date;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  createdAt: Date;
}

export interface WorkshopRegistration {
  id?: string;
  workshopId: string;
  workshopName: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  languageLevel: string;
  registrationDate: Date;
  status: 'registered' | 'attended' | 'cancelled';
}

export interface Club {
  id?: string;
  name: string;
  arabicName: string;
  description: string;
  imageUrl: string;
  departments: ClubDepartment[];
  isActive: boolean;
  createdAt: Date;
}

export interface ClubDepartment {
  id: string;
  name: string;
  arabicName: string;
  description: string;
}

export interface ClubApplication {
  id?: string;
  clubId: string;
  clubName: string;
  departmentId: string;
  departmentName: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  skills: string;
  address: string;
  languageLevel: string;
  healthProblems?: string;
  signature: string;
  agreedToContract: boolean;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface JobApplication {
  id?: string;
  jobType: 'teacher' | 'staff';
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  teachingLanguage?: string;
  staffField?: string;
  skills?: string;
  cvUrl?: string;
  signature: string;
  agreedToContract: boolean;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface InternApplication {
  id?: string;
  fullName: string;
  age: number;
  phone: string;
  email?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  academicSpecialization: string;
  skills: string;
  cvUrl?: string;
  signature: string;
  agreedToContract: boolean;
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}