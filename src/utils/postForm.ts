// utils/postEmail.ts

/**
 * Send email data to PHP API endpoint as form variables
 */
export default async function postEmail(
url: string,
data: {
email: string;
id: string; // must match SECRET_ID on PHP side
fullName?: string;
tempPass?: string;
otp?: string;
},
userpass: string,
): Promise<any> {
console.log("[postEmail] mail url:", url);
console.log("[postEmail] data:", data); 
console.log("[postEmail] data toname:", data.fullName); 
console.log("[postEmail] data userpass:", userpass); 
console.log("[postEmail] data rec:", data.email); 

const postData = {
email: data.email,
id: 'N9HnMguA9-x3oXjUZn4cZ91_M8DLoGc1OVgwh9yJxI8',
fullName:data.fullName || '',
tempPass: userpass || '',
otp: data.otp || '',
}

try {
console.log("[postEmail] Sending to:", url);
const response = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
 body: JSON.stringify(postData),
});

const result = await response.json();
console.log("[postEmail] Raw response:", result);
return result;
} catch (error: any) {
console.error("[postEmail] Error:", error.message || error);
throw new Error("postEmail failed: " + (error.message || error));
}

}
