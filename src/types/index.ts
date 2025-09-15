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


// types.ts
export interface Data {
id?: number;
title?: string;
status?: string;
}

export interface ApiResponse<T> { data: T; }

export interface RowsResponse {
  rows: Data[];
}


export type InputField = {
name: string;
label: string;
defVal?: string | null; 
type:
| "number"
| "email"
| "hidden"
| "select"
| "textarea"
| "image"
| "text"
| "password"
| "file"
| "radio";
placeholder?: string;
required: boolean;
className: string;
options?: { value: string; label: string }[];
handleImage?: (status: "success" | "error", response: string) => void; // Add this line
};
