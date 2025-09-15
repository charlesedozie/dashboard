"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import { ProfilePicture, EmailUpdate } from "./forms";  // Assuming this import is correct
import ChangePassword from "./changePassword";

export default function App(options: FProps) {
  const handleEmailUpdate = (newEmail: string) => {
    console.log("Updated Email:", newEmail);
    // Call your API endpoint here, e.g.
    // await fetch("/api/update-email", { method: "POST", body: JSON.stringify({ email: newEmail }) });
  };
	
  return (
    <section className='w-full'>
      <SubTitle string1='Profile Settings' string2='Manage Personal Information' />
      <section className='mt-7'>
        <ProfilePicture 
          currentImageUrl="/default-avatar.png"  // 👈 Required prop; use dynamic user data (e.g., {user.imageUrl})
        />
      </section>

      <section className='mt-7'>
        <EmailUpdate 
          icon='name' 
          label='Name' 
          tagLine="Your fullname that is displayed to the students." 
          currentEmail="John Doe" 
          onSubmitEmail={handleEmailUpdate} 
        />
      </section>

      <section className='mt-7'>
        <EmailUpdate 
          icon='email' 
          label='Email Address' 
          tagLine="Your primary email for notifications and login" 
          inputType='email' 
          currentEmail="user@example3.com" 
          onSubmitEmail={handleEmailUpdate} 
        />
      </section>

      <section className='mt-7'>
        <EmailUpdate 
          icon='phone' 
          label='Phone Number' 
          tagLine="Contact number for urgent communications" 
          currentEmail="+234803xxxxxxx" 
          onSubmitEmail={handleEmailUpdate} 
        />
      </section>

      <section className='mt-7'>
        <ChangePassword />
      </section>
    </section>
  );
}