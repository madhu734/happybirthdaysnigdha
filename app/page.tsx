'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Heart, Music2, VolumeX, X, Sparkles, RotateCcw, Mail, Send, CheckCircle2, LoaderCircle } from 'lucide-react';

const wishes = ['তোমার প্রতিটি সকাল শুরু হোক একটুখানি আনন্দ নিয়ে।','তোমার স্বপ্নগুলো একটু একটু করে সত্যি হোক।','নিজের মতো করে বাঁচার সাহস কখনো হারিয়ো না।','তোমার হাসিটা এমনই উজ্জ্বল থাকুক।','মন খারাপের দিনেও ভালোবাসা তোমাকে ঘিরে রাখুক।','নতুন বছরটা নিয়ে আসুক নতুন প্রিয় স্মৃতি।','ছোট ছোট সুখগুলো তোমার চোখ এড়িয়ে না যাক।','নিজের জন্যও একটু সময় রেখো, প্রতিদিন।','তোমার পরিশ্রম সুন্দর ফল এনে দিক।','যেখানে যাও, আপন মানুষ খুঁজে পাও।','তোমার জীবনে শান্তির অভাব না হোক।','হঠাৎ পাওয়া ভালো খবরে ভরে উঠুক দিনগুলো।','নিজেকে ভালোবাসার আরও কারণ খুঁজে পাও।','পছন্দের জায়গাগুলোয় ঘুরে আসা হোক।','অনেক প্রাণখোলা হাসির মুহূর্ত জমুক।','তোমার মনের কথাগুলো মন দিয়ে শোনার মানুষ থাকুক।','তোমার সব ভালো উদ্যোগ সুন্দরভাবে এগিয়ে যাক।','নতুন কিছু শেখার আনন্দ পেতে থাকো।','কঠিন দিনগুলো পেরিয়ে আরও সুন্দর দিন আসুক।','তোমার চারপাশ ভালো মানুষে ভরে থাকুক।','মনে রেখো, তুমি ভালোবাসা পাওয়ার যোগ্য।','এই বছর নিজের কাছে আরও প্রিয় হয়ে ওঠো।','আজ, আগামীকাল, প্রতিদিন—ভীষণ ভালো থেকো, স্নিগ্ধা।'];

function Flower({className=''}:{className?:string}) {return <svg className={className} viewBox="0 0 300 400" fill="none" aria-hidden="true"><path d="M149 385C170 300 122 215 154 134M156 279C100 262 65 218 63 180M152 316C211 276 230 232 231 203" stroke="#69816B" strokeWidth="3"/><path d="M151 277C91 280 75 252 73 226C114 225 141 247 151 277ZM151 313C202 309 222 282 223 258C185 260 161 281 151 313ZM140 223C120 198 116 173 126 153C150 173 154 200 140 223Z" fill="#8F9C7D"/><g fill="#D97C91"><ellipse cx="151" cy="107" rx="31" ry="54" transform="rotate(-15 151 107)"/><ellipse cx="113" cy="129" rx="31" ry="54" transform="rotate(-65 113 129)"/><ellipse cx="183" cy="128" rx="31" ry="54" transform="rotate(53 183 128)"/><ellipse cx="170" cy="163" rx="30" ry="45" transform="rotate(134 170 163)"/><ellipse cx="128" cy="164" rx="30" ry="43" transform="rotate(35 128 164)"/></g><g fill="#F2B4C0" opacity=".85"><ellipse cx="153" cy="127" rx="17" ry="37"/><ellipse cx="140" cy="143" rx="18" ry="34" transform="rotate(-65 140 143)"/><ellipse cx="168" cy="145" rx="17" ry="34" transform="rotate(65 168 145)"/></g><circle cx="152" cy="151" r="16" fill="#A85266"/><circle cx="152" cy="151" r="9" fill="#E8C68C"/><g fill="#E3A2AD"><ellipse cx="62" cy="173" rx="14" ry="23" transform="rotate(-35 62 173)"/><ellipse cx="79" cy="173" rx="13" ry="23" transform="rotate(30 79 173)"/><ellipse cx="231" cy="197" rx="13" ry="23" transform="rotate(-30 231 197)"/><ellipse cx="247" cy="199" rx="12" ry="23" transform="rotate(35 247 199)"/></g></svg>}

export default function Home(){
 const [letter,setLetter]=useState(false); const [blown,setBlown]=useState(false); const [wish,setWish]=useState<number|null>(null); const [music,setMusic]=useState(false); const [burst,setBurst]=useState(0); const audio=useRef<AudioContext|null>(null); const timer=useRef<ReturnType<typeof setInterval>|null>(null); const letterButton=useRef<HTMLButtonElement>(null); const closeButton=useRef<HTMLButtonElement>(null);
 const [wishText,setWishText]=useState(''); const [sendingWish,setSendingWish]=useState(false); const [wishResult,setWishResult]=useState<{ok:boolean;message:string}|null>(null); const pendingWish=useRef<{id:string;text:string}|null>(null); const sendingLock=useRef(false);
 const celebrate=()=>{setBurst(v=>v+1);};
 useEffect(()=>{if(!letter)return; closeButton.current?.focus(); const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setLetter(false);if(e.key==='Tab'){e.preventDefault();closeButton.current?.focus();}};document.addEventListener('keydown',key);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=old;letterButton.current?.focus();};},[letter]);
 useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);void audio.current?.close();},[]);
 async function toggleMusic(){if(music){if(timer.current)clearInterval(timer.current);await audio.current?.suspend();setMusic(false);return;}try {const ctx=audio.current??new AudioContext();audio.current=ctx;await ctx.resume();let i=0;const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66];const play=()=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=notes[i++%notes.length];g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.075,ctx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1.6);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+1.7);};play();timer.current=setInterval(play,650);setMusic(true);}catch{setMusic(false);}}
 async function sendWish(event: React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  const text=wishText.trim();
  if(sendingLock.current)return;
  if(!text){setWishResult({ok:false,message:'তোমার উইশটা লিখে তারপর পাঠাও।'});return;}
  if(!pendingWish.current || pendingWish.current.text!==text){
   const bytes=crypto.getRandomValues(new Uint8Array(15));
   pendingWish.current={id:Array.from(bytes,b=>'abcdefghijklmnopqrstuvwxyz0123456789'[b%36]).join(''),text};
  }
  sendingLock.current=true;setSendingWish(true);setWishResult(null);
  try{
   let success = false;
   let errMessage = '';
   try {
     const response = await fetch('/api/wishes', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ text, submissionId: pendingWish.current.id }),
       signal: AbortSignal.timeout(10000)
     });
     const data = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;
     if (response.ok && data?.success === true) {
       success = true;
     } else if (data?.error) {
       errMessage = data.error;
     }
   } catch {
     // Local route failed; fallback to PocketBase direct
   }

   if (!success) {
     try {
       const pbResponse = await fetch('https://spb.tmadhu.me/api/collections/wish/records', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: pendingWish.current.id, text }),
         signal: AbortSignal.timeout(12000)
       });
       const pbData = await pbResponse.json().catch(() => null) as { id?: string; text?: string; message?: string } | null;
       if (pbResponse.ok && pbData?.id) {
         success = true;
       } else if (pbData?.message) {
         errMessage = pbData.message;
       }
     } catch {
       // Direct call failed
     }
   }

   if (success) {
     setWishResult({ ok: true, message: 'তোমার উইশটা জমা হয়েছে, স্নিগ্ধা। তোমার ইচ্ছেটা সত্যি হোক! ♡' });
     setWishText('');
     pendingWish.current = null;
     setBlown(true);
     celebrate();
   } else {
     setWishResult({ ok: false, message: errMessage || 'উইশটা জমা হয়েছে কি না নিশ্চিত হওয়া যায়নি। তোমার লেখা এখানেই আছে—একটু পরে আবার চেষ্টা করো।' });
   }
  }catch{
   setWishResult({ ok: false, message: 'সংযোগ পাওয়া যাচ্ছে না, তাই জমা হয়েছে কি না নিশ্চিত নই। তোমার লেখা এখানেই আছে—একটু পরে আবার চেষ্টা করো।' });
  }
  finally{
   sendingLock.current = false;
   setSendingWish(false);
  }
 }
 return <><div className="paper-grain"/><header><a className="brand" href="#home">s<span>♡</span><small>ONLY FOR YOU</small></a><nav><a href="#letter">একটু ভালোবাসা</a><a href="#memories">স্মৃতির পাতা</a><a href="#wish">একটা উইশ</a></nav><button className="sound" onClick={toggleMusic} aria-label={music?'সুর বন্ধ করো':'সুর চালু করো'} aria-pressed={music}>{music?<Music2 size={17}/>:<VolumeX size={17}/>}<span>{music?'সুর চলছে':'একটু সুর'}</span></button></header>
 <main><section className="hero" id="home"><div className="hero-copy"><div className="eyebrow"><span/> A LITTLE CELEBRATION OF YOU</div><p className="hello">আজকের গল্পটা শুধু তোমার…</p><h1>শুভ জন্মদিন,<br/><em>স্নিগ্ধা</em><span className="drawn-heart">♡</span></h1><p className="intro">পৃথিবীতে তোমার ২৩টি বছর।<br/>আর আমার কাছে, তোমাকে উদ্‌যাপন করার<br className="desktop-break"/> অসংখ্য ছোট্ট কারণ।</p><button className="primary" ref={letterButton} onClick={()=>{setLetter(true);celebrate();}}>তোমার সারপ্রাইজ খোলো <ArrowRight size={18}/></button><div className="handwritten hero-note">made with a little magic & a lot of love</div></div><div className="hero-art"><span className="orbit o1">✧</span><span className="orbit o2">✦</span><div className="postcard"><div className="postcard-top">THE BIRTHDAY EDITION <span>♡</span></div><div className="age">23<span>twenty-three & blooming</span></div><Flower className="hero-flower"/><div className="postcard-bottom">a whole new chapter,<br/><i>beautifully yours.</i></div></div><div className="round-stamp">HAPPY BIRTHDAY<br/><Heart size={23}/><span>MY FAVOURITE HUMAN</span></div><span className="art-note handwritten">তোমার জন্য, ভালোবাসায়।</span></div><a className="scroll-note" href="#letter">আরও একটু নিচে, আরও একটু ভালোবাসা <ArrowDown size={14}/></a></section>
 <div className="ribbon"><span>23 YEARS OF YOU</span><span>✧</span><span>A THOUSAND LITTLE WISHES</span><span>✧</span><span>ONE VERY SPECIAL GIRL</span><span>✧</span><span>23 YEARS OF YOU</span></div>
 <section className="letter-section section" id="letter"><div className="section-number">01 / A NOTE FROM THE HEART</div><div className="letter-layout"><div><h2>কিছু কথা,<br/><em>শুধু তোমার জন্য।</em></h2><p className="subtext">সব অনুভূতি তো এক লাইনে বলা যায় না।<br/>তাই তোমার জন্য রেখে দিলাম একটা ছোট্ট চিঠি।</p><span className="handwritten side-note">স্নিগ্ধা, এটা মন দিয়ে পড়ো ♡</span></div><button className="envelope" onClick={()=>setLetter(true)} aria-label="ভালোবাসার চিঠি খোলো"><span className="envelope-flap"/><span className="envelope-paper">প্রিয় স্নিগ্ধা,<br/><i>তোমার জন্য কিছু কথা…</i></span><span className="envelope-front"/><span className="wax"><Heart size={24}/></span><span className="envelope-caption">চিঠিটা খুলতে ছুঁয়ে দাও <ArrowRight size={15}/></span></button></div></section>
 <section className="memories section" id="memories"><div className="section-number">02 / LITTLE MOMENTS, BIG FEELINGS</div><h2>একটা ছোট্ট <em>স্মৃতির অ্যালবাম।</em></h2><p className="subtext">কিছু ছবি, যেগুলো দেখলেই মন ভালো হয়ে যায়।</p><div className="photo-row">{[{title:'তোমার সেই প্রিয় হাসি',src:'/snigdha-portrait.jpg',alt:'স্নিগ্ধার প্রিয় হাসি'},{title:'একটা সুন্দর মুহূর্ত',src:'/snigdha.jpg',alt:'স্নিগ্ধার সুন্দর মুহূর্ত'},{title:'আরও অনেক গল্প বাকি',src:'/snigdha-story.jpg',alt:'স্নিগ্ধার স্মৃতি'}].map((item,i)=><div className={'polaroid p'+i} key={item.title}><span className="tape"/><div className="photo-placeholder"><img src={item.src} alt={item.alt} className="photo-polaroid-img"/></div><p>{item.title} <span>♡</span></p></div>)}</div><p className="album-footnote">তোমার প্রতিটা স্মৃতি, প্রতিটা হাসিমুখ এভাবেই অমূল্য হয়ে থাকুক… ♡</p></section>
 <section className="wishes section" id="wishes"><div className="wish-heading"><div><div className="section-number">03 / TWENTY-THREE LITTLE WISHES</div><h2>২৩ বছরে,<br/><em>২৩টি শুভকামনা।</em></h2></div><p className="subtext">প্রতিটি সংখ্যার আড়ালে ছোট্ট একটা চাওয়া।<br/>যেকোনো একটায় ছুঁয়ে দেখো।</p></div><div className="wish-grid">{wishes.map((w,i)=><button key={i} className={wish===i?'selected':''} onClick={()=>setWish(i)} aria-label={`${i+1} নম্বর শুভকামনা`} aria-pressed={wish===i}>{String(i+1).padStart(2,'0')}<Heart size={12}/></button>)}</div><div className="wish-message" aria-live="polite"><Sparkles size={20}/><p>{wish===null?'তোমার জন্য ভালো কিছু অপেক্ষা করছে। একটা সংখ্যা বেছে নাও।':wishes[wish]}</p>{wish!==null&&<small>{String(wish+1).padStart(2,'0')} / 23</small>}</div></section>
 <section className="cake-section section" id="wish"><div className="section-number">04 / SAVE A WISH FOR YOURSELF</div><h2>চোখ বন্ধ করো। <em>একটা উইশ করো।</em></h2><p className="subtext">চোখ বন্ধ করে একটা ইচ্ছে করো। চাইলে নিচে লিখে আমাকে পাঠাও।</p><div className={'cake-scene '+(blown?'blown':'')} aria-hidden="true"><div className="candle-number">{['2','3'].map(n=><div key={n}><span className="flame"/>{n}</div>)}</div><div className="cake-top"/><div className="cake-body"><span>♡</span><span>♡</span><span>♡</span><span>♡</span><span>♡</span></div><div className="cake-base"/><div className="cake-plate"/></div><div className="cake-status" aria-live="polite">{blown?'তোমার মনের ইচ্ছেটা সত্যি হোক, স্নিগ্ধা! ♡':'তোমার নতুন অধ্যায়টা হোক ভীষণ সুন্দর।'}</div><button className="primary" onClick={()=>{if(blown){setBlown(false);}else{setBlown(true);celebrate();}}}>{blown?<><RotateCcw size={17}/> আবার উইশ করি</>:<>মোমবাতি নিভিয়ে দাও <Sparkles size={18}/></>}</button><form className="wish-form" onSubmit={sendWish} aria-busy={sendingWish}>
  <span className="section-number">A WISH FROM YOU, SAVED WITH LOVE</span>
  <label htmlFor="birthday-wish">তোমার মনের ইচ্ছেটা কী?</label>
  <p id="wish-help">পাঠালে তোমার কথাগুলো আমার কাছে জমা থাকবে। ♡</p>
  <textarea id="birthday-wish" name="wish" value={wishText} onChange={e=>{setWishText(e.target.value);setWishResult(null);}} placeholder="এই নতুন বছরে আমি চাই…" maxLength={2000} required disabled={sendingWish} aria-describedby="wish-help wish-count" rows={4}/>
  <div className="wish-form-bottom"><span id="wish-count">{wishText.length.toLocaleString('bn-BD')} / ২০০০</span><button className="primary" type="submit" disabled={sendingWish||!wishText.trim()}>{sendingWish?<><LoaderCircle size={17} className="loading-spin"/> পাঠানো হচ্ছে…</>:<>আমার উইশ পাঠাই <Send size={16}/></>}</button></div>
  <div className={'wish-result '+(wishResult?.ok?'success':'')} role="status" aria-live="polite">{wishResult&&<>{wishResult.ok&&<CheckCircle2 size={19}/>}<span>{wishResult.message}</span></>}</div>
 </form><p className="handwritten cake-note">here’s to you, and all the magic ahead.</p></section>
 <footer><div className="footer-heart">♡</div><p>আজকের দিনটা তোমার। ভালোবাসাটাও।</p><span>HAPPY 23RD, SNIGDHA · MADE WITH LOVE</span><a href="#home">আবার শুরু থেকে ↑</a></footer></main>
 {letter&&<div className="modal-backdrop" onClick={()=>setLetter(false)}><div className="letter-modal" role="dialog" aria-modal="true" aria-labelledby="letter-title" onClick={e=>e.stopPropagation()}><button className="close" ref={closeButton} onClick={()=>setLetter(false)} aria-label="চিঠি বন্ধ করো"><X size={22}/></button><Mail className="letter-icon" size={28}/><div className="letter-header-group"><img src="/snigdha-face.jpg" alt="স্নিগ্ধা" className="letter-avatar"/><div><span className="section-number">A LITTLE LETTER, A LOT OF LOVE</span><h2 id="letter-title">প্রিয় স্নিগ্ধা,</h2></div></div><p>শুভ ২৩তম জন্মদিন, ভালোবাসা। ♡</p><p>আজ তোমাকে শুধু এটুকুই বলতে চাই—তুমি আমার কাছে ভীষণ স্পেশাল। তোমার জন্য এমন একটা উপহার বানাতে চেয়েছি, যেটা যখন ইচ্ছে খুলে দেখতে পারবে, আর মনে হবে, কেউ একজন তোমাকে খুব ভালোবাসে।</p><p>এই নতুন বছরটা তোমার জীবনে অনেক শান্তি, প্রাণখোলা হাসি আর সুন্দর সুযোগ নিয়ে আসুক। তোমার স্বপ্নগুলো বড় হোক, আর সেগুলোর দিকে এগিয়ে যাওয়ার সাহসটা আরও বড় হোক।</p><p>সব দিন একরকম হবে না। তবু মন খারাপের কোনো দিনে এই পাতাটা খুলে মনে কোরো—তুমি ভীষণ প্রিয়, আর তোমার হাসিটা আমার কাছে খুব দামি।</p><p>নিজের মতো থেকো। সুন্দর থেকো। অনেক অনেক ভালো থেকো।<br/>আজকের দিনটা শুধু তোমার।</p><div className="signature">অনেক ভালোবাসায়,<br/><span>তোমার মানুষটা ♡</span></div></div></div>}
 {burst>0&&<div className="confetti" key={burst} aria-hidden="true">{Array.from({length:55},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,background:['#b95870','#e5ad6b','#8e9b7c','#eeb5c2'][i%4],animationDelay:`${(i%11)*.08}s`,transform:`rotate(${i*31}deg)`}}/>)}</div>}</>;
}
