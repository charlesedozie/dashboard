import type { Metadata } from 'next'
import { redirect } from 'next/navigation';

export default function RedirectServerComponent() {
  redirect('/user-area/dboard');
}