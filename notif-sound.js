/* =====================================================================
   notif-sound.js — Daily'put Shop নোটিফিকেশনের সাউন্ড (আলাদা ফাইল)
   index.html-এর পাশেই (একই ফোল্ডারে) রাখুন। index.html এটা নিজে লোড করে।

   ব্যবহার:  NotifSound.play()    — সাউন্ড বাজায়
             NotifSound.unlock()  — (নিজে থেকেই প্রথম ট্যাপে হয়)

   কীভাবে কাজ করে:
   ১) ব্রাউজার ইউজার একবার ট্যাপ/ক্লিক না করা পর্যন্ত সাউন্ড বাজতে দেয় না।
      লগইনের সময় ইউজার ট্যাপ করেই থাকে, তাই সাথে সাথে বাজে।
   ২) পেজ নিজে নিজে খুলে (আগে থেকে লগইন থাকা অবস্থায়) নোটিফিকেশন থাকলে সাউন্ড "অপেক্ষায়" থাকে
      এবং ইউজারের প্রথম ট্যাপেই বেজে যায়।
   ৩) প্রথমে WebAudio, না হলে HTMLAudio (নিজে বানানো ছোট বিপ) — কোনো বাইরের অডিও ফাইল লাগে না।
   ===================================================================== */
(function(){
  'use strict';
  var ctx = null, audioEl = null, wavUrl = null, pending = false, unlocked = false;

  /* ছোট দুই-টোনের বিপ (WAV) নিজে বানানো */
  function makeWav(){
    var sr = 22050, notes = [[880, 0.18], [1175, 0.30]];
    var total = Math.floor(sr * 0.55);
    var buf = new ArrayBuffer(44 + total * 2), v = new DataView(buf);
    function ws(o, str){ for(var i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); }
    ws(0, 'RIFF'); v.setUint32(4, 36 + total * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    ws(36, 'data'); v.setUint32(40, total * 2, true);
    var idx = 0;
    notes.forEach(function(nt){
      var n = Math.floor(sr * nt[1]);
      for(var i = 0; i < n; i++, idx++){
        var env = Math.min(1, i / (sr * 0.01)) * Math.max(0, 1 - i / n);
        v.setInt16(44 + idx * 2, Math.sin(2 * Math.PI * nt[0] * i / sr) * env * 0.8 * 32767, true);
      }
    });
    return URL.createObjectURL(new Blob([buf], {type: 'audio/wav'}));
  }

  function getCtx(){
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      if(!ctx) ctx = new AC();
      return ctx;
    }catch(e){ return null; }
  }
  function beepWebAudio(){
    var c = getCtx();
    if(!c || c.state !== 'running') return false;
    try{
      [[880, 0], [1175, 0.17]].forEach(function(n){
        var t0 = c.currentTime + n[1];
        var osc = c.createOscillator(), g = c.createGain();
        osc.type = 'sine'; osc.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.30);
        osc.connect(g); g.connect(c.destination);
        osc.start(t0); osc.stop(t0 + 0.32);
      });
      return true;
    }catch(e){ return false; }
  }
  function getAudio(){
    if(!audioEl){
      if(!wavUrl) wavUrl = makeWav();
      audioEl = new Audio(wavUrl);
      audioEl.preload = 'auto';
    }
    return audioEl;
  }
  function playHtml(){
    try{
      var a = getAudio();
      a.muted = false; a.volume = 1; a.currentTime = 0;
      var p = a.play();
      if(p && p.then) return p.then(function(){ return true; }, function(){ return false; });
      return Promise.resolve(true);
    }catch(e){ return Promise.resolve(false); }
  }
  function vibrate(){ try{ if(navigator.vibrate) navigator.vibrate([120, 60, 120]); }catch(e){} }

  function play(){
    if(beepWebAudio()){ vibrate(); return; }
    playHtml().then(function(ok){
      if(ok) vibrate();
      else pending = true;          /* ব্রাউজার আটকালে — প্রথম ট্যাপেই বাজবে */
    });
  }

  function unlock(){
    var c = getCtx();
    if(c && c.state === 'suspended'){ try{ c.resume(); }catch(e){} }
    if(pending){ pending = false; play(); return; }
    if(unlocked) return;
    try{
      var a = getAudio();
      a.muted = true;
      var p = a.play();
      var done = function(){ try{ a.pause(); a.currentTime = 0; }catch(e){} a.muted = false; unlocked = true; };
      if(p && p.then) p.then(done, function(){ a.muted = false; });
      else done();
    }catch(e){}
  }

  ['click', 'touchend', 'pointerup', 'keydown'].forEach(function(ev){
    document.addEventListener(ev, unlock, {passive: true});
  });

  window.NotifSound = {play: play, unlock: unlock};
})();
