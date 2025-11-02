import { Kanit, Exo_2, Rajdhani, Poppins } from 'next/font/google';

export const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-kanit',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // Include 700 if you want bold
  variable: '--font-poppins',
  display: 'swap',
});

export const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-exo2',
});

export const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
    variable: '--font-rajdhani',
});