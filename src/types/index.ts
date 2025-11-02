import {
LayoutDashboard, TableOfContents, Users, HelpCircle, BookOpen, Trophy, NotebookPen,
BookCheck, LogOut, } from "lucide-react";

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
fileType?: string;
otp?: string;
appNotification?: boolean;
soundNotification?: boolean;
userNotification?: boolean;
emailNotification?: boolean;
lessonsCount?: string;
correctAnswer?: string;
type?: string;
quizId?: string;
lessonId?: string;
mockExamId?: string;
file?: string;
options?: [];
tutor?: string;
avatarOrCover?: string;
videoOrCover?: string;
videoOrFileUrl?: string;
videoCaptionUrl?: string;
question?: string;
answer?: string;
mockTypeId?: string;
[key: string]: any; // for flexibility

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
subtitle?: string;
mainContent?: string;
subject?: string;
UserSubject?: {
subjectId?: string;
userId?: string;
};
}


export interface FormValues {
  [key: string]: string | number | boolean | File | string[] | number[];
};

export type UpdateInputValue = (name: keyof FormValues, value: FormValues[keyof FormValues]) => void;


export interface ApiResponse<T> { data: T; }

export interface RowsResponse { rows: Data[]; } // use for thise with rows
export type RowsResponse1 = Data[]; 
export type RowsResponse2 = Data; // single object, not array

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
    | 'video'
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
  updateFormField?: (key: string, value: any) => void;
};

export const UserStatus = [
{ label: "Active", value: "ACTIVE" },
{ label: "Inactive", value: "INACTIVE" },
{ label: "Suspended", value: "SUSPENDED" },
];

export const Themes = [
{ label: "Light", value: "Light" },
{ label: "Dark", value: "Dark" },
];

export const sidebarItems = [
{ name: "Dashboard", section: "dboard", icon: LayoutDashboard },
{ name: "Students", section: "students", icon: Users },
{ name: "Quizzes", section: "quizzes", icon: BookCheck },
{ name: "Mock", section: "mock", icon: NotebookPen },
{ name: "Lessons", section: "lessons", icon: BookOpen },
{ name: "Leaderboard", section: "leaderboard", icon: Trophy },
{ name: "Admin Control", section: "admin-control", icon: TableOfContents },
];

export const sidebarFootItems = [
{ name: "Support", section: "support", icon: HelpCircle },
];

export type ExtractedParams = {
  section: string | null;
  mod: string | null;
  id: string | null;
  action: string | null;
  itemId: string | null;
};