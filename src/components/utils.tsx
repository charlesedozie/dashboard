'use client';

//import { ShieldAlert, LockKeyhole } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchData } from "@/utils/fetchData"; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css';
import {getUserField} from "@/utils/curUser";
import Link from "next/link";
import DynamicForm from "./newItem";
import postForm from "@/utils/postForm";
//import { useQuery } from "@tanstack/react-query";
//const generateId = () => crypto.randomUUID();
import { InputField, Subject, Data, ApiResponse, RowsResponse1 } from "@/types";
import { getUrlParams } from "@/utils/curUser";
import { useTheme } from "next-themes";


type Event = {
id: string;
title: string;
description: string;
date: string; // ISO format: "2025-09-02"
};

interface UserCalendarProps {
userId: string;
}

type SearchFormInputs = {
query: string;
};

interface Item {
id?: string;
name?: string;
description?: string;
}

export function SearchForm() {
const router = useRouter();
const pathname = usePathname();
const [searchFor, setSearchFor] = useState<string>("");
const params = useParams();
const section = params?.section ?? "defaultSection";
useEffect(() => {
    if (!pathname) return;

    // Extract last part of the route (e.g. "lessons" from "/user-area/lessons")
    const section = pathname.split("/").pop() || "";

    switch (section.toLowerCase()) {
      case "lessons":
        setSearchFor("lessons");
        break;
      case "students":
        setSearchFor("students");
        break;
      case "quizzes":
        setSearchFor("quizzes");
        break;
      case "mock":
        setSearchFor("mock");
        break;
      case "leaderboard":
        setSearchFor("leaderboard");
        break;
      case "support":
        setSearchFor("support");
        break;
      case "admin-control":
        setSearchFor("tutors");
        break;
      default:
        setSearchFor("dboard"); // fallback
        break;
    }
  }, [pathname]);

const {
register,
handleSubmit,
formState: { errors },
} = useForm<SearchFormInputs>();

const onSubmit = (data: SearchFormInputs) => {
router.push(`/user-area/${searchFor}?action=search&mod=search&section=${section}&q=${encodeURIComponent(data.query)}`);
};

return (<form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full"
>
  <div className="relative">
    {/* Search icon on the left */}
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
      <Search size={20} />
    </span>

    <input
      type="text"
      placeholder={`Search ${searchFor}`}
      {...register('query', { required: true })}
      className={`border rounded-xl pl-8 pr-3 py-2 w-full focus:outline-none focus:ring-1 ${
        errors.query
          ? 'border-red-400 focus:ring-red-300'
          : 'border-gray-200 focus:ring-gray-300'
      }`}
    />
  </div>
</form>

);
}



export function SearchPage() {
const searchParams = useSearchParams();
const query = searchParams.get("q"); // Example URL: /items?q=math
const section = searchParams.get("section"); // Example URL: /items?q=math

const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

let searchItem = '';
switch (section) {
case "dboard":
searchItem = '<Dboard />'
break
case "admin-control":
searchItem = '<AdminControl />'
break
case "students":
searchItem = '<Students />'
break
case "leaderboard":
searchItem = '<Leaderboard />'
break
case "lessons":
searchItem = '<Lesson />'
break
case "quizzes":
searchItem = '<Quiz />'
break
case "support":
searchItem = '<Support />'
break
case "mock":
searchItem = '<Mock />'
break
default:
searchItem = ''
}

useEffect(() => {
if (!query) return; // Skip if no query

const fetchItems = async () => {
setLoading(true);
setError(null);
try {
// Pass query as part of the API path
//console.log("Fetching data with query:", query);
const data = await fetchData<Item[]>(`user/all?fullName=${encodeURIComponent(query)}`);
if (data) { 
//console.log("Data fetched successfully:", data);
setItems(data);
} else {
//console.warn("No data returned from server");
setItems([]);
setError("No data returned from server");
//console.log("No data returned from server");
}} catch (err) {
const errorMsg = err instanceof Error ? err.message : "Failed to fetch data";
console.error("Error fetching data:", errorMsg, err);
setError(errorMsg);
} finally {
setLoading(false);
}
};

fetchItems();
}, [query]);

if (!query) return <p className="text-red-500">No search query provided.</p>;
if (loading) return <p>Loading results...</p>;
//if (error) return <p className="text-red-500">Error: {error}</p>;

return (
<div>{section ? section : 'no section'} end section {encodeURIComponent(query) ? encodeURIComponent(query) : 'no q irem'} search endpoint {`user/all?fullName=${encodeURIComponent(query)}`}
<h2 className="text-xl font-bold mb-2">Search Results for "{query}"</h2>
{items.length > 0 ? (
<ul className="space-y-2">
{items?.map((item) => (
<li key={item.id} className="p-2 border rounded">
<strong>{item.name}</strong>
{item.description && <p className="text-gray-600">{item.description}</p>}
</li>
))}
</ul>
) : (
<p>No results found.</p>
)}
</div>
);
}


export function UserCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[] | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { theme } = useTheme(); 

  
const formatDate = (date: Date) => {
  // Format as YYYY-MM-DD using local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const tileClassName = ({ date }: { date: Date }) => {
  const dateStr = formatDate(date);
  const todayStr = formatDate(new Date());
  const hasEvent = events.some((event) => event.date === dateStr);

  if (dateStr === todayStr) return "custom-today";
  if (hasEvent) return "custom-event";
  return "";
};

const tileContent = ({ date }: { date: Date }) => {
  const dateStr = formatDate(date);
  const dayEvents = events.filter((event) => event.date === dateStr);
  return dayEvents.length > 0 ? (
    <div className={`event-dot ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}>●</div>
  ) : null;
};

  return (
    <section>
      <div
        className={`p-4 rounded-lg shadow-md relative transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <Calendar
          tileContent={tileContent}
          tileClassName={tileClassName}
          prev2Label={null}
          next2Label={null}
          className={theme === "dark" ? "dark-calendar" : ""}
        />

        <section className="my-5 text-xs">
          <Link
            href="/user-area/dboard?action=list&mod=calendar"
            aria-label="Go to Calendar Page"
            title="Go to Calendar Page"
            className={`def-link-style px-4 py-1 rounded-xl transition ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Manage Calendar
          </Link>
        </section></div>
    </section>
  );
}




export function CreateTutor(){	
const [subject, setSubject] = useState<Subject[]>([]);
const [items, setItems] = useState<Data | null>(null);
const { section, mod, id, action, itemId } = getUrlParams();
const { theme } = useTheme();
const isDark = theme === "dark";

const isUpdate = !!(
    action &&
    mod &&
    itemId &&
    action === "update" &&
    mod === "tutor"
  );

useEffect(() => {
async function loadSubject() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("subjects");
if (data?.data) {
const newArray = data.data.map(item => ({
label: String(item.title ?? ''),
value: String(item.id ?? '')
}));
// Sort ascending by label
const sortedArray = newArray.sort((a, b) => a.label.localeCompare(b.label));
if(subject !== sortedArray){ setSubject(sortedArray); }
}} 
catch (error) { console.error("Error fetching data:", error); }}
loadSubject(); }, []);
const formFields: InputField[] = 	  
[
{
name: 'fullName',
label: 'Name',
type: 'text',
placeholder: 'Enter name',
required: true,
className: 'w-full',
defVal: items?.fullName ?? null,
},
{
name: 'gender',
label: 'Gender',
type: 'select',
required: true,
className: 'w-full',
defVal: items?.gender ?? null,
options: [
{ value: 'male', label: 'Male' },
{ value: 'female', label: 'Female' },
],
},
{
name: 'email',
label: 'Email',
type: 'email',
placeholder: 'Enter email',
required: true,
className: 'w-full',
defVal: items?.email ?? null,
},
{
name: 'phone',
label: 'Phone Number',
type: 'text',
placeholder: 'Enter phone number',
required: true,
className: 'w-full',
defVal: items?.phone ?? null,
},
{
name: "subjects",
label: "Select Subjects (Control Select for Multiple)",
type: "select",
multiple: true,  // ✅ multiple selection enabled
required: true,
className: "w-full",
options: subject,
defVal: items?.subjects ?? null,
multipleAPI: 'subjects/user/link-many'
},
{
name: 'password',
label: 'pr=9w&2D2',
type: 'hidden',
required: false,
className: 'w-full',
defVal: items?.password ?? 'pr=9w&2D2',
},
{
name: 'role',
label: 'User Type',
type: 'select',
required: true,
className: 'w-full',
defVal: items?.role ?? 'TUTOR',
options: [
{ value: 'TUTOR', label: 'Tutor' },
{ value: 'ADMIN', label: 'Admin' },
],
},
];

const userRole = getUserField<string>("role");
const apiEndpoint = itemId ? `user/${itemId}` : `user`;
const apiType = itemId ? `PUT` : `POST`;
const canView = !!userRole && ["super_admin"].includes(userRole.toLowerCase());
if (!canView) { return <AccessDenied />; }

return (
<div className={`${isDark ? "bg-black text-white" : "bg-white text-black"} p-2`}>
<h1 className="text-2xl font-bold mb-4">{itemId ? `EDIT ACCOUNT` : "Add New Account"} {itemId}</h1>
<section>
<DynamicForm
apiEndpoint={apiEndpoint}
apiType={apiType}
fields={formFields}
submitButtonText={itemId ? `Update User` : "Add User"}
className="space-y-6"
onSuccess={(data) => { postForm(`/api/send-email`, data, 'pr=9w&2D2');
}}
/></section>
</div>
);
};

export function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-8 max-w-md text-center rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-red-500 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page.
        </p>
      </div>
    </div>
  );
}
