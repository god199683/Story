(()=>{
  const by=id=>document.getElementById(id), esc=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const paragraphs=text=>esc(text).split(/\n{2,}/).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('');
  const input=by('previous-story'), button=by('next-episode'), next=by('continue-next');
  const read=()=>{try{return JSON.parse(localStorage.getItem('origin-story-session')||'null')}catch{return null}};
  const write=value=>localStorage.setItem('origin-story-session',JSON.stringify(value));
  const make=async()=>{
    const current=read();if(!current?.data)return;
    if(input.value.replace(/\s/g,'').length>20050)return;
    const history=current.history?.length?current.history:[{chapter:current.chapter||0,contentText:current.contentText||'',contentHtml:current.contentHtml||''}];
    const base=history[history.length-1], number=(base.chapter||0)+1, total=Number(current.data.totalEpisodes)||0, finish=Boolean(window.__storyFinishRequested)||(total>0&&number>=total);
    button.disabled=true;button.innerHTML='원고를 쓰는 중…';
    try{
      const response=await StoryAI.generate({mode:'episode',story:current.data,plan:current.data.aiPlan||{},previous:input.value||base.contentText,episode:number,finish});
      const text=response.result.text, html=`<h2>${esc(current.data.title)}</h2><div class="meta">제 ${number}화 · 공백 제외 ${text.replace(/\s/g,'').length.toLocaleString()}자${finish?' · 완결':''}</div>${paragraphs(text)}`;
      history.push({chapter:number,contentText:text,contentHtml:html});write({...current,chapter:number,contentText:text,contentHtml:html,history});
      try{await StoryStore.save({title:current.data.title,chapter:`EPISODE ${number}`,content:html})}catch{}
      location.reload();
    }catch(error){alert(error.message||'다음 화 생성에 실패했습니다.');button.disabled=false;button.innerHTML=`<span>✦</span> 제 ${number}화 만들기`}
    finally{window.__storyFinishRequested=false}
  };
  if(button) button.onclick=make;
  if(next) next.onclick=()=>make();
})();