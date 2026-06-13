import { useState } from 'react';

export default function App() {
 const [showSignup,setShowSignup]=useState(false);
 const [loggedIn,setLoggedIn]=useState(false);

 if(loggedIn){
  return <div className="w-[255px] h-[355px] bg-slate-900 text-white flex items-center justify-center">AI Companion Home</div>
 }

 return (
 <div className="w-[255px] h-[355px] bg-slate-900 text-white p-4">
  <h1 className="text-center font-bold mb-4">AI Companion</h1>
  <input className="w-full p-2 rounded text-black mb-2" placeholder="Email"/>
  <input className="w-full p-2 rounded text-black mb-2" placeholder="Password" type="password"/>
  <button className="w-full bg-blue-600 p-2 rounded" onClick={()=>setLoggedIn(true)}>Login</button>
  <button className="w-full mt-2 border p-2 rounded" onClick={()=>setShowSignup(true)}>Sign Up</button>
  {showSignup && <div className="fixed inset-0 flex items-center justify-center bg-black/70">
   <div className="bg-white p-4 rounded w-56 text-black">
    <input className="w-full border p-2 mb-2" placeholder="Username"/>
    <input className="w-full border p-2 mb-2" placeholder="Email"/>
    <input className="w-full border p-2 mb-2" placeholder="Password"/>
    <button className="w-full bg-green-600 text-white p-2 rounded">Create Account</button>
   </div>
  </div>}
 </div>)
}