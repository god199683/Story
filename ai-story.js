(()=>{
  const by=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const paragraphs=text=>esc(text).split(/\n{2,}/).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('');
  const setBusy=(button,on,label)=>{button.disabled=on;button.dataset.label??=button.innerHTML;button.innerHTML=on?label:button.dataset.label};
  const form=by('plan-form'), planButton=form?.querySelector('[type="submit"]'), accept=by('accept-plan');
  let plan=null;
  const renderPlan=value=>{
    plan=value; data={...data,title:value.title||data.title,aiPlan:value};
    by('title').value=data.title;
    by('plan-content').innerHTML=`<h2>${esc(value.title||data.title)}</h2><div class="meta">${esc(data.genre)}</div><h3>한 줄 기획</h3><p>${esc(value.logline)}</p><h3>기획의 첫 장면</h3><p>${esc(value.opening)}</p><h3>핵심 갈등</h3><p>${esc(value.conflict)}</p><h3>전개 방향</h3><p>${esc(value.arc)}</p><h3>등장인물 구성</h3><div class="cast-grid">${(value.characters||[]).map(person=>`<article class="cast-card"><strong>${esc(person.name)}</strong><span>${esc(person.role)}</span><p>${esc(person.description)}</p></article>`).join('')}</div><h3>이야기의 결</h3><p>${esc(value.tone)}</p>`;
    by('empty-state').hidden=true;by('story-result').hidden=true;by('plan-result').hidden=false;by('plan-result').scrollTop=0;
  };
  if(form) form.onsubmit=async event=>{
    event.preventDefault();
    data={title:by('title').value.trim(),genre:by('genre').value,keywords:by('keywords').value,character:by('character').value,totalEpisodes:Number(by('total-episodes').value)||0,variant:Date.now()};
    setBusy(planButton,true,'기획을 구상하는 중…');
    try{const response=await StoryAI.generate({mode:'plan',story:data});renderPlan(response.result)}catch(error){alert(error.message||'기획 생성에 실패했습니다.')}finally{setBusy(planButton,false)};
  };
  const showPrologue=async()=>{
    if(!plan){alert('먼저 기획을 생성해 주세요.');return}
    setBusy(accept,true,'프롤로그를 쓰는 중…');
    try{
      const response=await StoryAI.generate({mode:'prologue',story:data,plan});
      const text=response.result.text;
      chapter=0;continuation=false;
      by('story-content').innerHTML=`<h2>${esc(data.title)}</h2><div class="meta">프롤로그</div>${paragraphs(text)}`;
      by('story-label').textContent='PROLOGUE';by('plan-result').hidden=true;by('writing-panel').hidden=true;form.hidden=true;by('story-result').hidden=false;by('story-result').scrollTop=0;
      localStorage.setItem('origin-story-session',JSON.stringify({data,chapter:0,contentText:text,contentHtml:by('story-content').innerHTML,history:[{chapter:0,contentText:text,contentHtml:by('story-content').innerHTML}]}));
      try{await StoryStore.save({title:data.title,chapter:'PROLOGUE',content:by('story-content').innerHTML})}catch{}
      document.querySelectorAll('#prologue-next,#back-to-plan,#prologue-plan-edit').forEach(x=>x.remove());
      const next=document.createElement('a');next.id='prologue-next';next.className='prologue-next';next.href='continue.html';next.textContent='다음: 제 1화 만들기 →';
      const back=document.createElement('a');back.id='prologue-plan-edit';back.className='prologue-plan-edit';back.href='index.html?edit=plan';back.textContent='← 기획으로 돌아가기';
      const output=by('story-result').parentElement;output.append(next,back);
    }catch(error){alert(error.message||'프롤로그 생성에 실패했습니다.')}finally{setBusy(accept,false)};
  };
  if(accept) accept.onclick=showPrologue;
  const saved=(()=>{try{return JSON.parse(localStorage.getItem('origin-story-session')||'null')}catch{return null}})();
  if(saved?.data?.aiPlan) plan=saved.data.aiPlan;
})();