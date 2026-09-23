/* Local enhancement only: models work without JS, external media loads on request. */
(function(){
 'use strict';
 const ro=()=>document.documentElement.lang!=='en';
 document.querySelectorAll('[data-grow]').forEach(root=>{
  const tabs=Array.from(root.querySelectorAll('[data-grow-step]'));
  const panels=Array.from(root.querySelectorAll('[data-grow-panel]'));
  const nav=root.querySelector('.learn-flow');
  if(tabs.length!==4||panels.length!==4)return;
  nav.setAttribute('role','tablist');
  tabs.forEach((tab,i)=>{tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[i].id);panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',tab.id);});
  function select(index,focus=false){
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
   if(focus)tabs[index].focus();
  }
  const initial=panels.findIndex(panel=>'#'+panel.id===location.hash);
  select(initial<0?0:initial);
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',e=>{e.preventDefault();select(i);history.replaceState(null,'',tab.getAttribute('href'));});
   tab.addEventListener('keydown',e=>{
    let target;
    if(e.key==='ArrowRight'||e.key==='ArrowDown')target=(i+1)%tabs.length;
    if(e.key==='ArrowLeft'||e.key==='ArrowUp')target=(i+tabs.length-1)%tabs.length;
    if(e.key==='Home')target=0;
    if(e.key==='End')target=tabs.length-1;
    if(target!==undefined){e.preventDefault();select(target,true);history.replaceState(null,'',tabs[target].getAttribute('href'));}
   });
  });
  window.addEventListener('hashchange',()=>{const i=panels.findIndex(panel=>'#'+panel.id===location.hash);if(i>=0)select(i);});
 });
 document.addEventListener('click',e=>{
  const videoButton=e.target.closest('[data-load-video]');
  if(videoButton){
   const box=videoButton.closest('[data-video-id]');
   if(!box||!/^[-\w]{11}$/.test(box.dataset.videoId))return;
   const iframe=document.createElement('iframe');
   iframe.src='https://www.youtube-nocookie.com/embed/'+box.dataset.videoId+'?rel=0';
   iframe.title=box.dataset.videoTitle;
   iframe.allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
   iframe.allowFullscreen=true;
   iframe.referrerPolicy='strict-origin-when-cross-origin';
   box.replaceChildren(iframe);
   iframe.focus();
  }
  const documentButton=e.target.closest('[data-load-document]');
  if(documentButton){
   const box=documentButton.closest('[data-document-url]');
   if(!box)return;
   const url=new URL(box.dataset.documentUrl,location.href);
   if(url.origin!=='https://coachingfederation.org'||!url.pathname.endsWith('.pdf'))return;
   const iframe=document.createElement('iframe');
   iframe.src=url.href;
   iframe.title=ro()?'Documentul oficial ICF 2025':'Official ICF 2025 document';
   iframe.loading='lazy';
   box.replaceChildren(iframe);
   iframe.focus();
  }
 });
})();
