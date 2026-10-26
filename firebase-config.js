/* =====================================================================
   firebase-config.js — Firebase সংযোগের তথ্য (আলাদা ফাইল)
   index.html-এর পাশেই (একই ফোল্ডারে) রাখুন।

   গুরুত্বপূর্ণ: Firebase-এর এই তথ্য (apiKey ইত্যাদি) গোপন চাবি নয় — ওয়েবসাইট চললে ব্রাউজারে সবসময় দেখা যায়,
   আলাদা ফাইলে রাখলেও কেউ চাইলে দেখতে পারে। ডেটাবেস আসলে সুরক্ষিত থাকে Firebase "Rules" দিয়ে —
   তাই Rules-এ শুধু এডমিন লিখতে পারে, আর ব্যক্তিগত তথ্য শুধু মালিক পড়তে পারে এমন করে রাখা হয়েছে।
   ===================================================================== */
window.FIREBASE_CONFIG =  {
  apiKey: "AIzaSyA8LSh2jpV1malxcWHPDXjoTmm16fp8Wkg",
  authDomain: "daily-put-shop.firebaseapp.com",
  databaseURL: "https://daily-put-shop-default-rtdb.firebaseio.com",
  projectId: "daily-put-shop",
  storageBucket: "daily-put-shop.firebasestorage.app",
  messagingSenderId: "1015257897316",
  appId: "1:1015257897316:web:3da4cf96a6576afc784271",
  measurementId: "G-X3FMQCPX70"
};
