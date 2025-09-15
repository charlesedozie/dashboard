'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/utils/fetchData"; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css';
import Link from "next/link";
import DynamicForm from "./newItem";
import { Data, ApiResponse } from "@/types";
const generateId = () => crypto.randomUUID();

type InputField = {
  name: string;
  label: string;
  type: "number" | "email" | "hidden" | "select" | "textarea" | "image" | "text" | "password" | "file" | "radio";
  placeholder?: string;
  required: boolean;
  className: string;
  options?: { value: string; label: string }[];
};


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

const {
register,
handleSubmit,
formState: { errors },
} = useForm<SearchFormInputs>();

const onSubmit = (data: SearchFormInputs) => {
router.push(`/user-area/dboard?action=search&mod=search&q=${encodeURIComponent(data.query)}`);
};

return (
<form onSubmit={handleSubmit(onSubmit)} className="w-72 silver">
<div className="relative">
{/* Search icon on the left */}
<span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
<Search size={20} />
</span>

<input
type="text"
placeholder="Search for students, lessons, quizzes etc."
{...register('query', { required: true })}
className={`border rounded-xl pl-8 pr-3 py-2 w-full focus:outline-none focus:ring-1 ${
errors.query
? 'border-gray-200 focus:ring-gray-300'
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
const data = await fetchData<Item[]>(`${encodeURIComponent(query)}`);
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
{items.map((item) => (
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
onClickDay={handleDateClick}
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
	
const formFields: InputField[] = 	  
[
{
name: 'fullName',
label: 'Tutor Name',
type: 'text',
placeholder: 'Enter name',
required: true,
className: 'w-full',
},
{
name: 'gender',
label: 'Tutor Gender',
type: 'select',
required: true,
className: 'w-full',
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
},
{
name: 'phone',
label: 'Tutor Phone Number',
type: 'text',
placeholder: 'Enter phone number',
required: true,
className: 'w-full',
},
{
name: 'role',
label: 'TUTOR',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'isEmailVerified',
label: 'bolFalse',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'avatar',
label: 'avatar',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'password',
label: 'password',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'cityId',
label: generateId(),
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'country',
label: 'country',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'referral',
label: 'referral',
type: 'hidden',
required: false,
className: 'w-full',
},
{
name: 'username',
label: 'username',
type: 'hidden',
required: false,
className: 'w-full',
},
];

return (
<div className="p-4">
<h1 className="text-2xl font-bold mb-4">Add New Tutor</h1>
<DynamicForm
apiEndpoint={`user`}
fields={formFields}
submitButtonText="Add Tutor"
className="space-y-6"
/>
</div>
);
};
