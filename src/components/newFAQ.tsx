"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import { useSearchParams, usePathname } from "next/navigation";
import { InputField, Data, ApiResponse, RowsResponse1, RowsResponse2, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
/*
import Link from 'next/link';
import { SquareCheckBig, Plus, TextAlignStart, Book } from "lucide-react";
import { fetchData } from "@/utils/fetchData";
import FileUpload from "./fileUpload";
import { useForm } from "react-hook-form";
import { Subject, Data, ApiResponse, InputField } from "@/types";
*/
type FormFields = {
  key: string;
  value: any;
};

export default function CreateFaq() {
const searchParams = useSearchParams();
const pathname = usePathname();
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [curFAQ, setCurFAQ] = useState<RowsResponse2 | null>(null);
const [faqId, setFAQId] = useState<Data | null>(null);
const [formField, setFormField] = useState<FormFields[] | null>(null);

const itemId = searchParams.get("itemId") ?? null;
const question = searchParams.get("question") ?? null;
const answer = searchParams.get("answer") ?? null;
const action = searchParams.get("action");
const mod = searchParams.get("mod");
const returnURL = searchParams.get("returnURL");

// ✅ Update or add key-value pair
const updateFormField = (key: string, value: any) => {
setFormField((prev) => {
if (!prev) return [{ key, value }];
// Check if key exists
const existingIndex = prev.findIndex((item) => item.key === key);
if (existingIndex !== -1) {
// ✅ Update value
const updated = [...prev]; updated[existingIndex] = { key, value }; return updated;
} else {
// ✅ Add new key-value pair
return [...prev, { key, value }]; }});};

// ✅ regex for UUID v4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );

const { data, isLoading } = useQuery<RowsResponse2 | null>({
queryKey: ["FAQ", faqId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse2>>(`faqs/${itemId}`, {}, 100 );
if (response?.data) { return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
enabled: !!shouldFetch,
//staleTime: 1000 * 5,
});

 useEffect(() => { if (data) { setCurFAQ(data);  }}, [data]);

const coalesce = (val: string | null | undefined): string | null =>   val != null && val !== '' && val !== 'null' ? val : null;

const getFormFieldValue = (fields: FormFields[] | null, key: string): any => {
if (!fields) return null;
const found = fields.find((item) => item.key === key);
return found ? found.value : null;
};

const formFields: InputField[] =  [
{
name: 'question',
label: 'Question',
type: 'text',
placeholder: 'Enter Question',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "question")) ?? coalesce(question) ?? "",
},
{
name: 'answer',
label: 'Answer',
type: 'textarea',
placeholder: 'Enter Answer',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "answer")) ?? coalesce(answer) ?? "",
},
];

return (
<div>
<SubTitle string1={itemId ? 'Update FAQ' : 'New FAQ'} />
<div className="mt-8 p-4">
<div>
<DynamicForm 
apiType={itemId ? `PATCH` : `POST`}
key={pathname} 
apiEndpoint={itemId ? `faqs/${itemId}` : `faqs`}
fields={formFields}
submitButtonText={action === "update" ? "Update FAQ" : "Save"}
className="space-y-6"
updateFormField={updateFormField}
//onSuccess={(data) => { returnHome(); }}
/>
{itemId && returnURL ? <Link
href={`/user-area/support?action=list&mod=faq&sub=faq`}
className="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition my-4"
>
Back
</Link> : null}
</div>
</div>
</div>
);
};