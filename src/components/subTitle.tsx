"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types'; 

export default function App(options: FProps)  {
return (
<section className='w-full'>
{options.string1 ? <h2 className="text-2xl font-semibold mb-2">{options.string1}</h2> : null}
{options.string2 ? <p className='mt-3 text-sm'>{options.string2}</p> : null}
</section>);
}
