import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'স্নিগ্ধা — তোমার ২৩তম জন্মদিন ♡',description:'একটু ভালোবাসা, ২৩টি শুভকামনা, আর একটা ছোট্ট সারপ্রাইজ। শুধু তোমার জন্য, স্নিগ্ধা।',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="bn"><body>{children}</body></html>}
