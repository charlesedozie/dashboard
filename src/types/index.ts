export interface FProps {
number1?: number;
number2?: number;
number3?: number;
number4?: number;
number5?: number;
string1?: string;
string2?: string;
string3?: string;
string4?: string;
string5?: string;
string6?: string;
string7?: string;
string8?: string;
string9?: string;
string10?: string;
}

// @/types/index.ts
export interface Subject {
value: string;
label: string;
lessonsCount?: string;
minutes?: string;
subject?: string;
tutor?: string;
}


export interface Data {
id?: string; // UUID from API
value: string;
label: string;
lessonsCount?: string;
tutor?: string;

fullName?: string;
email?: string;
gender?: "Male" | "Female";
status?: string;
subjects?: string[]; // Add if API returns this
// Other fields as needed
title?: string;
duration?: string;
description?: string;
instructions?: string;
avatar?: string;
subjectId?: string;
userId?: string;
cityId?: string;
createdAt?: string; // ISO Date string
updatedAt?: string; // ISO Date string
country?: string;
isEmailVerified?: boolean;
password?: string;
phone?: string;
provider?: string;
providerId?: string;
referral?: string;
role?: string;
username?: string;
minutes?: string;
subject?: string;
UserSubject?: {
    subjectId?: string;
    userId?: string;
  };
}



export interface ApiResponse<T> { data: T; }

export interface RowsResponse { rows: Data[]; } // use for thise with rows

export type RowsResponse1 = Data[]; 

export type InputField = {
  name: string;
  label: string;
  defVal?: string | string[] | null; // ✅ Allow string for single-select, string[] for multiple-select
  type:
    | 'number'
    | 'email'
    | 'hidden'
    | 'select'
    | 'textarea'
    | 'image'
    | 'text'
    | 'password'
    | 'file'
    | 'html'
    | 'radio';
  placeholder?: string;
  required: boolean;
  className: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  multipleAPI?: string;
  accept?: string;
  handleImage?: (status: 'success' | 'error', response: string) => void;
};

export const UserStatus = [
{ label: "Active", value: "Active" },
{ label: "On-Leave", value: "On-Leave" },
{ label: "Suspended", value: "Suspended" },
{ label: "Terminated", value: "Terminated" },
];

export const Themes = [
{ label: "Light", value: "Light" },
{ label: "Dark", value: "Dark" },
];