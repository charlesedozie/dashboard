"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, CircleUserRound } from "lucide-react";
import { fetchData } from "@/utils/fetchData";
import { useQuery } from "@tanstack/react-query";
import { Data, ApiResponse, RowsResponse1, RowsResponse } from "@/types";
import LoadingIndicator from "@/components/loadingIndicator";
import ShowContent from "@/components/showContent";
import ShowQuestion from "@/components/showQuestion";
import ApproveReject from "@/components/approveReject";
import { useTheme } from "next-themes";


export default function StudentTable() {
const [currentPage, setCurrentPage] = useState(1);
const [lessonTopics, setLessonTopics] = useState<RowsResponse | null>(null);
const [quizQuestions, setQuizQuestions] = useState<RowsResponse | null>(null);
const [mockQuestions, setMockQuestions] = useState<RowsResponse | null>(null);
const [allContent, setAllContent] = useState<RowsResponse | null>(null);
const [lessons, setLessons] = useState<Data[]>([]);
const [quiz, setQuiz] = useState<Data[]>([]);
const [mock, setMock] = useState<Data[]>([]);
const [subject, setSubject] = useState<Data[]>([]);
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 10;
const totalPages = Math.ceil((allContent?.rows?.length || 0) / pageSize);

const { theme } = useTheme();
const isDark = theme === "dark";

function removeItemFromContent(contentId: string, type: string) {
  // Remove from lesson topics
  if (type === "Topic (Lesson)") {
    setLessonTopics((prev) => ({
      ...prev,
      rows: prev?.rows?.filter((row) => row.id !== contentId) || [],
    }));
  }

  // Remove from quiz questions
  if (type === "Question (Quiz)") {
    setQuizQuestions((prev) => ({
      ...prev,
      rows: prev?.rows?.filter((row) => row.id !== contentId) || [],
    }));
  }

  // Remove from mock questions
  if (type === "Question (Mock)") {
    setMockQuestions((prev) => ({
      ...prev,
      rows: prev?.rows?.filter((row) => row.id !== contentId) || [],
    }));
  }

  // Also update combined list
  setAllContent((prev) => {
    const newRows = prev?.rows?.filter((row) => row.id !== contentId) || [];
    return { ...prev, rows: newRows };
  });

  // ✅ Adjust pagination dynamically when an item is removed
  setCurrentPage((prevPage) => {
    const totalItems = (allContent?.rows?.length || 0) - 1; // one less item
    const newTotalPages = Math.ceil(totalItems / pageSize);
    // if the current page becomes empty after deletion, go back one page
    return Math.min(prevPage, newTotalPages || 1);
  });
}

/*
function removeItemFromContent(contentId: string, type: string) {
  // Remove from lesson topics
  if (type === "Topic (Lesson)") {
    setLessonTopics(prev => ({
      ...prev,
      rows: prev?.rows?.filter(row => row.id !== contentId) || [],
    }));
  }

  // Remove from quiz questions
  if (type === "Question (Quiz)") {
    setQuizQuestions(prev => ({
      ...prev,
      rows: prev?.rows?.filter(row => row.id !== contentId) || [],
    }));
  }

  // Remove from mock questions
  if (type === "Question (Mock)") {
    setMockQuestions(prev => ({
      ...prev,
      rows: prev?.rows?.filter(row => row.id !== contentId) || [],
    }));
  }

  // Also update combined list
  setAllContent(prev => ({
    ...prev,
    rows: prev?.rows?.filter(row => row.id !== contentId) || [],
  }));
}
*/

const { data: dataQuiz, isLoading:loadingQuiz, isFetching:fetchingQuiz, refetch:refetchQuiz } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["quizzes"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("quizzes", {}, 1000);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 60 * 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if (dataQuiz?.data?.rows?.length) {
const sorted = [...dataQuiz.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(quiz !== sorted){setQuiz(sorted);}
} 
}, [dataQuiz]);


const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["lessons"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("lessons", {}, 100);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 60 * 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});


//interface Props { data: Data; }
useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if (data?.data?.rows?.length) {
const sorted = [...data.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(lessons !== sorted){setLessons(sorted);}
} 
}, [data]);


const { data: dataMock, isLoading: mockLoading, isFetching: mockFetching, refetch: refetchMockData } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["mock-exams"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("mock-exams", {}, 100);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 60 * 20 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

//interface Props { data: Data; }
useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if (dataMock?.data?.rows?.length) {
const sorted = [...dataMock.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(mock !== sorted){setMock(sorted);}
} 
}, [dataMock]);





















function isValidImageUrl(url?: string): boolean {
if (!url) return false;
// Check if it's an absolute or relative image URL
const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
try {
// ✅ Try constructing a URL (works for absolute URLs)
new URL(url);
return imagePattern.test(url);
} catch {
// ✅ Also allow relative URLs like "/uploads/avatar.jpg"
return imagePattern.test(url);
}}

const { data:dataUsers = [] } = useQuery({
  queryKey: ["userInfo"],
  queryFn: async () => {
    const response = await fetchData<ApiResponse<RowsResponse1>>("user/all?role=TUTOR", {}, 100);
    return response?.data ?? [];
  },
  staleTime: Infinity, // ✅ don’t refetch on every render
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});


function getUserInfo(userId: string, users?: Data[]) {
if (!users || users.length === 0) { return { fullName: "Unknown User", avatar: "" }; }
const user = users.find((u) => u.id === userId);
if (!user) { return { fullName: "Unknown User", avatar: "" }; }
const fullName = `${user.fullName}`.trim();
return { fullName, avatar: user.avatar || "", };
}

const { data: dataSubjects, isLoading: loadingSubjects, isFetching: fetchingSubjects } = useQuery<ApiResponse<RowsResponse1>>({
  queryKey: ["subjects"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse1>>("subjects", {}, 1000);
  if (!response) {
    throw new Error("No data returned from subjects endpoint");
  }
  return response;
  },
staleTime: 60 * 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

function getSubjectName(subjectId: string, dataSubjects?: ApiResponse<RowsResponse1>): string {
if (!subjectId || !dataSubjects?.data) return "Unknown";
const users = Array.isArray(dataSubjects.data) ? dataSubjects.data : [];
const user = users.find((u: any) => u.id === subjectId);
return user?.title || "Unknown";}







const { data:curTopicData, isLoading:curTopicIsLoading, refetch:refetchCurTopic } = useQuery<RowsResponse | null>({
queryKey: ["lesson-topics"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(`lesson-topics?status=PENDING`, {}, 1000 );
if (response?.data) {
return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
//enabled: !!shouldFetch,
staleTime: 1000 * 60 * 10,
refetchOnWindowFocus: false,
});

useEffect(() => { if (curTopicData) { setLessonTopics(curTopicData); }}, [curTopicData]);

const { data:mockData, isLoading:mockIsLoading, refetch:refetchMock } = useQuery<RowsResponse | null>({
queryKey: ["mock-questions"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(`mock-questions?status=PENDING`, {}, 1000 );
if (response?.data) {
//if(curTopic !== response.data){setCurTopic(response.data);}
return response.data; } return null; },
staleTime: 1000 * 60 * 10,
refetchOnWindowFocus: false,
});

useEffect(() => { if (mockData) { setMockQuestions(mockData); }}, [mockData]);

const { data:quizData, isLoading:quizIsLoading, refetch:refetchQuizQuestion } = useQuery<RowsResponse | null>({
queryKey: ["quiz-questions"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(`quiz-questions?status=PENDING`, {}, 1000 );
if (response?.data) {
return response.data; } return null; },
staleTime: 1000 * 60 * 10,
refetchOnWindowFocus: false,
});

useEffect(() => { if (quizData) { setQuizQuestions(quizData); }}, [quizData]);


// Combine all three datasets into one
useEffect(() => {
if (lessonTopics || mockQuestions || quizQuestions) {
setAllContent({
rows: [
...(lessonTopics?.rows || []),
...(mockQuestions?.rows || []),
...(quizQuestions?.rows || []),
],
});
}
}, [lessonTopics, mockQuestions, quizQuestions]);





//interface Props { data: Data; }
/*

*/

function getSubjectIdById(id: string, dataset: Data[]): string | null {
  if (!id || !Array.isArray(dataset)) return null;

  const found = dataset.find((item) => {
    return (
      item.id === id ||
      item.lessonId === id ||
      item.quizId === id ||
      item.mockExamId === id
    );
  });

  if (!found) { return null; }
  return found.subjectId || null;
}
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const currentStudents = (allContent?.rows || []).slice(startIndex, endIndex);

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

if(curTopicIsLoading || mockIsLoading || quizIsLoading) {return <LoadingIndicator />;}
return (
<section>
<div className="w-full">
<div className="overflow-x-auto">
<table className="w-full border-collapse text-gray-500">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<tr>
<th className="py-2 text-left text-sm border-b border-gray-200">
S/N
</th>
<th className="py-2 text-left text-sm border-b border-gray-200">
Tutor
</th>
<th className="py-2 text-left text-sm border-b border-gray-200">
Subject
</th>
<th className="py-2 text-left text-sm border-b border-gray-200">
Type
</th>
<th className="py-2 text-center text-sm border-b border-gray-200">
Review
</th>
<th className="py-2 text-center text-sm border-b border-gray-200">
Actions
</th>
</tr>
</thead>
<tbody>
{allContent?.rows && allContent.rows.length > 0 ? (
currentStudents?.map((content, index) => {
// Determine the content type
const type = content.lessonId
? "Topic (Lesson)"
: content.quizId
? "Question (Quiz)"
: content.mockExamId
? "Question (Mock)"
: "Unknown";


const contentId = content.lessonId || content.quizId || content.mockExamId || null;
//const itemId = content.lessonId ? `${content.lessonId}` : content.quizId ? `${content.quizId}` : content.mockExamId ? `${content.mockExamId}` : null;



  const subjectId = content.lessonId
  ? getSubjectIdById(content.lessonId, lessons)
  : content.quizId
  ? getSubjectIdById(content.quizId, quiz)
  : content.mockExamId
  ? getSubjectIdById(content.mockExamId, mock)
  : null;

// Extract fields safely
const title = content.title || content.question || "Untitled";
const { fullName, avatar } = getUserInfo(content.userId ?? "", dataUsers);

return (
<tr key={content.id || index} className={`border-b p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<td className="py-2 border-b border-gray-200 align-middle">
{index + 1}
</td>

{/* Tutor Column */}
<td className="py-2 border-b border-gray-200 align-middle">
<div className="flex items-center gap-3">
{isValidImageUrl(avatar)
? <img src={avatar} alt={fullName} className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white object-cover"
/> : <CircleUserRound className="w-10 h-10 rounded-full object-cover" />}
<span className='text-sm'>{fullName}</span>
</div>
</td>

{/* Subject */}
<td className="py-2 border-b text-sm border-gray-200 align-middle">
{getSubjectName(subjectId ?? "", dataSubjects)}
</td>

{/* Type */}
<td className="py-2 border-b text-sm border-gray-200 align-middle">{type}</td>

{/* Review Button */}
<td className="text-center py-2 border-b border-gray-200 align-middle">
{type === "Topic (Lesson)" ? <ShowContent
triggerIcon={<button className={`bg-transparent border-0 border-b px-3 text-xs py-2 pointer 
${isDark ? "border-gray-600 text-white hover:bg-blue-700" : "border-gray-400 text-gray-700 hover:border-gray-600 focus:outline-none" }`}>View Info</button>}
title={content.title || ''}
description={content.description || ''}
duration={`${content.duration} mins` || "N/A"}
videoUrl1={content.videoCaptionUrl || ''}
videoUrl2={content.videoOrFileUrl || ''}
mainContent={content.mainContent || ''}
/> : null}

{type === "Question (Quiz)" || type === "Question (Mock)" ? 
<ShowQuestion
triggerIcon={
<button className={`bg-transparent border-0 border-b px-3 text-xs py-2 pointer 
${isDark ? "border-gray-600 text-white hover:bg-blue-700" : "border-gray-400 text-gray-700 hover:border-gray-600 focus:outline-none" }`}>View Info</button>
}
question={content.question || ''}
answer={content.correctAnswer || ''}
type={`${content.type}` || "N/A"}
avatar={content.file || ''}
options={content.options || []}
/> : null}
</td>

{/* Actions */}
<td className="text-center py-2 border-b border-gray-200">
<div className="flex justify-center space-x-2">
{type === "Topic (Lesson)" ? <ApproveReject
apiEndpoint={`lesson-topics/${content.id || ''}`}
hiddenFields={{ status: "APPROVED" }}
label="Approve"
placeholder=""
defaultValue=''
btnValue='Approve'
name="approve"
onSuccess={() => removeItemFromContent(content.id || '', "Topic (Lesson)")}

/> : null}

{type === "Topic (Lesson)" ? <ApproveReject
apiEndpoint={`lesson-topics/${content.id || ''}`}
hiddenFields={{ status: "REJECTED" }}
label="Reject"
placeholder=""
defaultValue=''
btnValue='Reject'
name="reject"
onSuccess={() => removeItemFromContent(content.id || '', "Topic (Lesson)")}
/> : null}







{type === "Question (Quiz)" ? <ApproveReject
apiEndpoint={`quiz-questions/${content.id || ''}`}
hiddenFields={{ status: "APPROVED" }}
label="Approve"
placeholder=""
defaultValue=''
btnValue='Approve'
name="approve"
onSuccess={() => removeItemFromContent(content.id || '', "Question (Quiz)")}
/> : null}

{type === "Question (Quiz)" ? <ApproveReject
apiEndpoint={`quiz-questions/${content.id || ''}`}
hiddenFields={{ status: "REJECTED" }}
label="Reject"
placeholder=""
defaultValue=''
btnValue='Reject'
name="reject"
onSuccess={() => removeItemFromContent(content.id || '', "Question (Quiz)")}
/> : null}




{type === "Question (Mock)" ? <ApproveReject
apiEndpoint={`mock-questions/${content.id || ''}`}
hiddenFields={{ status: "APPROVED" }}
label="Approve"
placeholder=""
defaultValue=''
btnValue='Approve'
name="approve"
onSuccess={() => removeItemFromContent(content.id || '', "Question (Mock)")}
/> : null}

{type === "Question (Mock)" ? <ApproveReject
apiEndpoint={`mock-questions/${content.id || ''}`}
hiddenFields={{ status: "REJECTED" }}
label="Reject"
placeholder=""
defaultValue=''
btnValue='Reject'
name="reject"
onSuccess={() => removeItemFromContent(content.id || '', "Question (Mock)")}
/> : null}
</div>
</td>
</tr>
);
})
) : ( null )}
</tbody>

</table>
</div>

{/* Pagination */}
<div className={`${isDark ? null : "bg-white text-gray-600"} flex justify-between items-center my-10 text-sm`}>
<div>
{startIndex + 1}-{Math.min(endIndex, allContent?.rows?.length || 0)} of{" "}
{allContent?.rows?.length || 0}
</div>
<div className="flex items-center gap-2">
<button
onClick={goFirst}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
</button>
<button
onClick={goPrev}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button
onClick={goNext}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
</button>
<button
onClick={goLast}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
</button>
</div>
</div>
</div>
</section>
);
}