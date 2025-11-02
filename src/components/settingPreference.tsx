"use client";

import { FProps } from '@/types';
import SubTitle from "./subTitle";
import { useState, useEffect } from "react";
import ThemeToggle from '@/components/themeToggle'

export default function App(options: FProps)  {
const [size, setSize] = useState<number>(16);

// Load saved size on first render
useEffect(() => {
const savedSize = localStorage.getItem("fontSize");
if (savedSize) {
setSize(Number(savedSize));
document.documentElement.style.setProperty("--base-font-size", `${savedSize}px`);
}
}, []);

// Handle slider change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const newSize = Number(e.target.value);
setSize(newSize);
document.documentElement.style.setProperty("--base-font-size", `${newSize}px`);
localStorage.setItem("fontSize", String(newSize)); // Save preference
};

return (<section className='w-full'>
 <SubTitle string1='App Preferences' string2='Customize your app experience and security settings' />
<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className="text-base font-bold">Theme Mode</span> <br />
<span>Choose your preferred app appearance</span>
</span>
<ThemeToggle />
</section>
<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className="text-base font-bold">Font Size</span> <br />
<span>Adjust the font size to improve readability</span>
</span>

 <div className="w-full max-w-[100px] mx-auto p-2">
      <input
        id="fontSizeSlider"
        type="range"
        min="12"
        max="28"
        step="1"
        value={size}
        onChange={handleChange}
        className="w-full accent-blue-600 cursor-pointer"
      />
    </div>

</section>
</section>
  );
}
