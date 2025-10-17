'use client';

//import { ShieldAlert, LockKeyhole } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { useSearchParams } from "next/navigation";
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
const {
register,
handleSubmit,
formState: { errors },
} = useForm<SearchFormInputs>();

const onSubmit = (data: SearchFormInputs) => {
router.push(`/user-area/dboard?action=search&mod=search&q=${encodeURIComponent(data.query)}`);
};

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
        setSearchFor("quizz");
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
        setSearchFor(""); // fallback
        break;
    }
  }, [pathname]);

return (<form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full silver"
>
  <div className="relative bg-white">
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

const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
if (!query) return; // Skip if no query

const fetchItems = async () => {
setLoading(true);
setError(null);
try {
// Pass query as part of the API path
const data = await fetchData<Item[]>(`lessons?subjectId=${encodeURIComponent(query)}&userId=${encodeURIComponent(query)}&title=${encodeURIComponent(query)}&subtitle=${encodeURIComponent(query)}&description=${encodeURIComponent(query)}&mainContent=${encodeURIComponent(query)}&videoOrFileUrl=${encodeURIComponent(query)}&avatarOrCover=${encodeURIComponent(query)}&publishedAt=${encodeURIComponent(query)}&fileType=${encodeURIComponent(query)}&limit=${encodeURIComponent(query)}&offset=${encodeURIComponent(query)}`);
console.log(encodeURIComponent(query));
console.log(`encodeURIComponent(query)`);
if (data) {
setItems(data);
} else {
setItems([]);
setError("No data returned from server");
}
} catch (err) {
setError(err instanceof Error ? err.message : "Failed to fetch data");
} finally {
setLoading(false);
}
};

fetchItems();
}, [query]);

if (!query) return <p className="text-red-500">No search query provided.</p>;
if (loading) return <p>Loading results...</p>;
if (error) return <p className="text-red-500">Error: {error}</p>;

return (
<div className="p-4">
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


/*
useEffect(() => {
async function fetchEvents() {
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}/events`);
if (!res.ok) throw new Error('Failed to fetch events');
const data: Event[] = await res.json();
setEvents(data);
} catch (err) {
console.error(err);
}
}
fetchEvents();
}, [userId]);
*/
const handleDateClick = (value: Date) => {
const selectedDate = value.toISOString().split('T')[0];
const dayEvents = events.filter(ev => ev.date === selectedDate);

if (dayEvents.length > 0) {
setSelectedEvents(dayEvents);
setShowPopup(true);
} else {
router.push(`/user-area/dboard?action=detail&mod=calendar&itemid=${selectedDate}`);
}
};

const tileClassName = ({ date }: { date: Date }) => {
const dateStr = date.toISOString().split('T')[0];
const todayStr = new Date().toISOString().split('T')[0];
const hasEvent = events.some(event => event.date === dateStr);

if (dateStr === todayStr) return 'custom-today';
if (hasEvent) return 'custom-event';
return '';
};

const tileContent = ({ date }: { date: Date }) => {
const dateStr = date.toISOString().split('T')[0];
const dayEvents = events.filter(event => event.date === dateStr);
return dayEvents.length > 0 ? <div className="event-dot">●</div> : null;
};

return (
<section>
<div className="p-4 bg-white rounded-lg shadow-md relative">
<Calendar 
tileContent={tileContent}
tileClassName={tileClassName}
prev2Label={null}   // removes "jump to previous year" arrow
next2Label={null}   // removes "jump to next year" arrow
/>


{showPopup && selectedEvents && (
<div className="popup">
<h3 className="popup-title">Events</h3>
<ul className="popup-list">
{selectedEvents.map(ev => (
<li key={ev.id} className="popup-item">
<strong>{ev.title}</strong>
<p>{ev.description}</p>
</li>
))}
</ul>
<button className="popup-close" onClick={() => setShowPopup(false)}>
Close
</button>
</div>
)}
<section className='my-5 text-xs text-[#777777]'><Link
href="/user-area/dboard?action=list&mod=calendar" 
aria-label={`Go to Calendar Page`}
title={`Go to Calendar Page`}
className="def-link-style px-4 py-1 bg-gray-200 rounded-xl hover:bg-gray-100 transition"
>
Manage Calendar
</Link></section>
</div>
</section>
);
}


export function CreateTutor(){	
const [subject, setSubject] = useState<Subject[]>([]);
const [items, setItems] = useState<Data | null>(null);
const { section, mod, id, action, itemId } = getUrlParams();

const isUpdate = !!(
    action &&
    mod &&
    itemId &&
    action === "update" &&
    mod === "tutor"
  );


console.log('items', items)
useEffect(() => {
async function loadSubject() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("subjects");
//console.log('herer');
//console.log(data.data);
//console.log('herer');
if (data?.data) {
// Sort in descending order (newest to oldest)
// Map the data to label/value
const newArray = data.data.map(item => ({
label: String(item.title ?? ''),
value: String(item.id ?? '')
}));
// Sort ascending by label
const sortedArray = newArray.sort((a, b) => a.label.localeCompare(b.label));
if(subject !== sortedArray){setSubject(sortedArray);}
}} 
catch (error) { console.error("Error fetching data:", error); }}
loadSubject(); }, []);
console.log(items)
const formFields: InputField[] = 	  
[
{
name: 'fullName',
label: 'Tutor Name',
type: 'text',
placeholder: 'Enter name',
required: true,
className: 'w-full',
defVal: items?.fullName ?? null,
},
{
name: 'gender',
label: 'Tutor Gender',
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
label: 'Tutor Email',
type: 'email',
placeholder: 'Enter email',
required: true,
className: 'w-full',
defVal: items?.email ?? null,
},
{
name: 'phone',
label: 'Tutor Phone Number',
type: 'text',
placeholder: 'Enter phone number',
required: true,
className: 'w-full',
defVal: items?.phone ?? null,
},
{
name: "subjects",
label: "Select Tutor Subjects (Control Select for Multiple)",
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
<div className="p-4">
<h1 className="text-2xl font-bold mb-4">{itemId ? `EDIT ACCOUNT` : "Add New Account"} {itemId}</h1>
<section className="bg-white p-4">
<DynamicForm
apiEndpoint={apiEndpoint}
apiType={apiType}
fields={formFields}
submitButtonText={itemId ? `Update User` : "Add User"}
className="space-y-6"
onSuccess={(data) => { postForm(`${process.env.NEXT_PUBLIC_EMAIL}`, data, 'pr=9w&2D2');
//console.log("Form successfully submitted:", data);
}}
/></section>
</div>
);
};

export function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-8 max-w-md text-center bg-white rounded-2xl shadow-lg">
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
