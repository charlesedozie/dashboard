"use client";

//import Image from "next/image";
//import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import DropDownAPI from "./dropDownAPI";
import { Themes } from "@/types";
//import SelectForm from "./selectSubmit";
import { useState, useEffect } from "react";
//import SwitchButton from "@/components/switchButton";
import { useTheme } from "@/utils/useTheme";

export default function App(options: FProps)  {
  const { theme, changeTheme } = useTheme();
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

return (<section className='w-full bg-white dark:bg-gray-900 text-black dark:text-white'>
 <SubTitle string1='App Preferences' string2='Customize your app experience and security settings' />

<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
<span className="text-base font-bold">Theme Mode</span> <br />
<span>Choose your preferred app appearance</span>
</span>

{/* Dropdown menu */}
<DropDownAPI
apiEndpoint="/api/update-role"
options={Themes}
defaultState="Light"
hiddenFields={{ userId: "123" }}
label=""
onOptionChange={(value) => changeTheme(value as "Light" | "Dark")} // ✅ Change theme on selection
/>
</section>
<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
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
