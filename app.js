const $=s=>document.querySelector(s);let data={},chapter=0,continuation=false;const bad=/해리 포터|마블|디즈니|스타워즈|원피스|나루토|귀멸|지브리|픽사|넷플릭스|[\\w가-힣]+ 스타일로|[\\w가-힣]+처럼 써/gi;const clean=s=>(s||'').replace(bad,'고유한 창작 요소').replace(/\\s{2,}/g,' ').trim();const pick=(a,n)=>a[Math.abs(n)%a.length];const seed=s=>[...s].reduce((n,c)=>n+c.charCodeAt(0),0);function blueprint(d){const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|')),k=(clean(d.keywords)||d.title+'에 얽힌 비밀, 예상치 못한 선택, 관계의 변화').split(',').map(x=>x.trim()).filter(Boolean),a=k[0],b=k[1]||'숨겨진 약속',c=k[2]||'변화',hero=d.character?clean(d.character).split(/[,.\\n]/)[0]:'평범한 일상에 균열을 발견한 한 사람';return '<h2>'+d.title+'</h2><div class="meta">'+d.genre+'</div><h3>핵심 질문</h3><p>“'+a+'을(를) 마주한 사람은, 무엇을 지켜야 하는가?”</p><h3>주인공과 출발점</h3><p>'+hero+'은(는) '+b+'에 얽힌 작은 사건을 계기로, 자신이 알던 세계가 완전하지 않았음을 알게 된다.</p><h3>전개 방향</h3><p>1막에서는 '+a+'이(가) 일상을 흔든다. 2막에서는 '+c+'을(를) 둘러싼 선택이 주인공을 시험한다. 마지막에는 가장 소중한 것을 포기하거나 새로운 약속을 선택해야 한다.</p><h3>이야기의 결</h3><p>'+pick(['인물의 감정과 선택을 따라가는 서정적인 성장담','비밀이 차례로 드러나는 긴장감 있는 여정','상처 입은 사람들이 서로를 이해하게 되는 따뜻한 이야기'],n)+'</p>'}function prose(d,prev){const k=(clean(d.keywords)||d.title+'에 남겨진 단서, 뜻밖의 약속').split(',').map(x=>x.trim()),a=k[0],b=k[1]||'약속',hero=d.character?clean(d.character).split(/[,.\\n]/)[0]:'그 사람',lead=chapter===0&&!continuation?'도시는 아직 '+a+'의 이름을 알지 못했다.':'지난 이야기의 끝에서 남겨진 말은, '+hero+'의 마음속에서 오래 울렸다.',bridge=prev?' 이전의 선택은 사라지지 않았고, 그 흔적은 다음 장면의 문을 열었다.':'';return '<h2>'+d.title+'</h2><div class="meta">'+(chapter===0&&!continuation?'프롤로그':'제 '+chapter+'화')+'</div><p>'+lead+'\\n\\n'+hero+'은(는) '+b+'을 떠올리며 조용히 발걸음을 옮겼다. 모든 것이 평소와 같아 보였지만, 낯선 기척은 이미 일상 깊숙이 스며들고 있었다.'+bridge+'\\n\\n창문 너머로 빛이 흔들렸다. 그것은 누군가에게는 우연일 수 있었지만, '+hero+'에게는 결코 지나칠 수 없는 신호였다. 그는 잠시 숨을 고른 뒤, 아직 이름 붙지 않은 이야기 속으로 들어섰다.</p>'}function setStep(i){document.querySelectorAll('.stepper span').forEach((e,n)=>e.classList.toggle('active',n===i))}$('#plan-form').onsubmit=e=>{e.preventDefault();data={title:$('#title').value.trim(),genre:$('#genre').value,keywords:$('#keywords').value,character:$('#character').value,totalEpisodes:Number($('#total-episodes').value)||0,variant:Date.now()};$('#plan-content').innerHTML=blueprint(data);$('#empty-state').hidden=true;$('#story-result').hidden=true;$('#plan-result').hidden=false;$('#plan-result').scrollTop=0};$('#accept-plan').onclick=()=>{chapter=0;$('#plan-form').hidden=true;$('#writing-panel').hidden=false;$('#writing-title').textContent=data.title;$('#chapter-label').textContent='프롤로그';$('#story-next').innerHTML='<span>✦</span> 프롤로그 또는 다음 편 생성하기';setStep(1);$('#writing-panel').scrollTop=0};$('#back-plan').onclick=()=>{$('#writing-panel').hidden=true;$('#plan-form').hidden=false;setStep(0)};$('#previous').oninput=()=>{const n=$('#previous').value.replace(/\\s/g,'').length;$('#count').textContent=n.toLocaleString()+' / 20,050';$('#story-next').disabled=n>20050};$('#story-next').onclick=()=>{const prev=document.getElementById("previous").value;continuation=Boolean(prev.trim());$('#story-content').innerHTML=prose(data,prev);$('#plan-result').hidden=true;$('#story-result').hidden=false;$('#story-label').textContent=chapter===0&&!continuation?'PROLOGUE':'EPISODE '+chapter;$('#story-result').scrollTop=0;if(chapter===0){chapter=continuation?2:1;$('#chapter-label').textContent='제 1화';$('#writing-hint').textContent='이전 이야기의 내용을 넣으면 다음 화를 이어 씁니다.';$('#previous-wrap').hidden=false;$('#story-next').innerHTML='<span>✦</span> 다음 이야기 생성하기';setStep(2)}else{chapter++;$('#chapter-label').textContent='제 '+chapter+'화';$('#previous').value='';$('#count').textContent='0 / 20,050'}};$('#copy-btn').onclick=async()=>{await navigator.clipboard.writeText($('#story-content').innerText);$('#copy-btn').textContent='복사됨';setTimeout(()=>$('#copy-btn').textContent='복사',1200)};$('#save-btn').onclick=()=>{const b=new Blob([$('#story-content').innerText],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(data.title||'story')+'.txt';a.click();URL.revokeObjectURL(a.href)}
function videoPrompt(){const kind=chapter<=1?'프롤로그':'제 '+(chapter-1)+'화',key=clean(data.keywords)||'이야기의 핵심 소재',hero=data.character?clean(data.character).split(/[,.\\n]/)[0]:'주인공';return '[한국 틱톡 세로 영상 제작 프롬프트]\\n\\n언어와 시장: 모든 화면 글자, 내레이션, 대사는 자연스러운 한국어. 한국 시청자용 TikTok 숏폼.\\n형식: 9:16 세로 영상, 35~45초, 감성적인 시네마틱 드라마 티저. 실존 인물·기존 작품·로고·캐릭터를 사용하지 않는 완전한 오리지널 영상.\\n\\n소재: 「'+data.title+'」 '+kind+' — '+key+'\\n주인공: '+hero+'\\n장면 구성\\n0–3초 | 차가운 푸른빛의 한국 도시 또는 이야기 배경을 빠르게 보여 준다. 화면 자막: “모든 이야기는, 작은 신호에서 시작됐다.”\\n4–12초 | '+hero+'의 표정과 손동작을 클로즈업. 이야기의 핵심 단서가 등장한다. 내레이션: “그날, 나는 아무도 믿지 않을 이야기를 마주했다.”\\n13–25초 | 단서를 따라 움직이는 역동적인 장면 3개를 빠른 리듬으로 연결. 자막은 한 화면에 한 문장만, 큰 흰색 한글로 표시.\\n26–35초 | 감정이 고조되는 결정적 선택의 순간. 내레이션: “돌아갈 수 없다는 걸 알면서도, 나는 한 걸음 더 나아갔다.”\\n36–45초 | 다음 화를 궁금하게 만드는 미완의 장면으로 끝낸다. 화면 자막: “다음 이야기는 어떻게 될까?”\\n\\n음성: 20~30대 한국어 화자, 낮고 또렷하며 몰입감 있는 내레이션. 배경음보다 음성이 항상 선명해야 한다.\\n배경음·효과음: 처음에는 잔잔한 피아노와 은은한 신시사이저, 13초부터 긴장감 있는 저음 펄스, 마지막은 여운이 남는 단음 피아노. 장면 전환에 약한 바람·발걸음·종이 넘기는 효과음을 자연스럽게 사용.\\n영상 연출: 부드러운 카메라 이동, 얕은 심도, 푸른 하늘색과 흰색의 깨끗한 컬러 톤. 과도한 번쩍임·공포 연출·영문 자막은 사용하지 않는다.'}$('#video-btn').onclick=()=>{$('#video-content').textContent=videoPrompt();$('#video-result').hidden=false;$('#video-result').scrollTop=0};$('#video-copy').onclick=async()=>{await navigator.clipboard.writeText($('#video-content').textContent);$('#video-copy').textContent='복사됨';setTimeout(()=>$('#video-copy').textContent='복사',1200)};

const archiveKey='origin-story-archive';function archivedStories(){try{return JSON.parse(localStorage.getItem(archiveKey)||'[]')}catch{return[]}}$('#archive-story').onclick=()=>{const content=$('#story-content').innerHTML;if(!content)return;const list=archivedStories(),label=$('#story-label').textContent;list.unshift({id:Date.now(),title:data.title||$('#title').value||'제목 없는 이야기',chapter:label,date:new Date().toLocaleString('ko-KR'),content});localStorage.setItem(archiveKey,JSON.stringify(list));$('#archive-story').textContent='보관됨';setTimeout(()=>$('#archive-story').textContent='보관',1200)};
function suggestedCast(d){const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|')),own=clean(d.character),hero=own?own.split(/[,.\\n]/)[0].trim():pick(['서린','도윤','하진','유나','지호','민서','이든','채온'],n),pool=['서린','도윤','하진','유나','지호','민서','이든','채온','시우','가온','다온','태린','로운','아린','현우','나겸'].filter(name=>name!==hero&&!own.includes(name)),roles=[['단서를 쥔 조력자','주인공이 놓친 사실을 가장 먼저 알아차린다.'],['예상 밖의 경쟁자','같은 목표를 향하지만 전혀 다른 방법을 택한다.'],['비밀을 감춘 연결고리','과거의 약속과 현재의 사건을 이어 준다.']];return [{name:hero,role:'주인공',desc:own||'평범한 일상 속 작은 균열을 발견하고 변화의 중심에 서게 된다.'},...roles.map((r,i)=>({name:pool[(n+i*3)%pool.length],role:r[0],desc:r[1]}))]}function blueprint(d){const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|')),k=(clean(d.keywords)||d.title+'에 얽힌 비밀, 예상치 못한 선택, 관계의 변화').split(',').map(x=>x.trim()).filter(Boolean),a=k[0],b=k[1]||'숨겨진 약속',c=k[2]||'변화',cast=suggestedCast(d),hero=cast[0].name;return '<h2>'+d.title+'</h2><div class="meta">'+d.genre+'</div><h3>핵심 질문</h3><p>“'+a+'을(를) 마주한 사람은, 무엇을 지켜야 하는가?”</p><h3>주인공과 출발점</h3><p>'+hero+'은(는) '+b+'에 얽힌 작은 사건을 계기로, 자신이 알던 세계가 완전하지 않았음을 알게 된다.</p><h3>등장인물 구성</h3><p>'+cast.map(x=>'• '+x.name+' — '+x.role+': '+x.desc).join('\\n')+'</p><h3>전개 방향</h3><p>1막에서는 '+a+'이(가) 일상을 흔든다. 2막에서는 '+c+'을(를) 둘러싼 선택이 주인공을 시험한다. 마지막에는 가장 소중한 것을 포기하거나 새로운 약속을 선택해야 한다.</p><h3>이야기의 결</h3><p>'+pick(['인물의 감정과 선택을 따라가는 서정적인 성장담','비밀이 차례로 드러나는 긴장감 있는 여정','상처 입은 사람들이 서로를 이해하게 되는 따뜻한 이야기'],n)+'</p>'}function prose(d,prev){const k=(clean(d.keywords)||d.title+'에 남겨진 단서, 뜻밖의 약속').split(',').map(x=>x.trim()),a=k[0],b=k[1]||'약속',cast=suggestedCast(d),hero=cast[0].name,ally=cast[1].name,lead=chapter===0&&!continuation?'도시는 아직 '+a+'의 이름을 알지 못했다.':'지난 이야기의 끝에서 남겨진 말은, '+hero+'의 마음속에서 오래 울렸다.',bridge=prev?' 이전의 선택은 사라지지 않았고, 그 흔적은 다음 장면의 문을 열었다.':'';return '<h2>'+d.title+'</h2><div class="meta">'+(chapter===0&&!continuation?'프롤로그':'제 '+chapter+'화')+'</div><p>'+lead+'\\n\\n'+hero+'은(는) '+b+'을 떠올리며 조용히 발걸음을 옮겼다. 그때, '+ally+'이(가) 뜻밖의 말을 건넸다. 모든 것이 평소와 같아 보였지만, 낯선 기척은 이미 일상 깊숙이 스며들고 있었다.'+bridge+'\\n\\n창문 너머로 빛이 흔들렸다. 그것은 누군가에게는 우연일 수 있었지만, '+hero+'에게는 결코 지나칠 수 없는 신호였다. 그는 '+ally+'과(와) 시선을 나눈 뒤, 아직 이름 붙지 않은 이야기 속으로 들어섰다.</p>'}
$('#archive-story').onclick=async()=>{const content=$('#story-content').innerHTML;if(!content)return;const button=$('#archive-story');button.disabled=true;button.textContent='보관 중…';try{await StoryStore.save({title:data.title||$('#title').value||'제목 없는 이야기',chapter:$('#story-label').textContent,content});button.textContent='보관됨'}catch(error){alert('보관하지 못했습니다. Supabase 설정을 확인해 주세요.');button.textContent='보관'}finally{button.disabled=false}};
$('#accept-plan').onclick=()=>{chapter=0;continuation=false;const html=prose(data,'').replace(/\\n/g,'<br>');const holder=document.createElement('div');holder.innerHTML=html;localStorage.setItem('origin-story-session',JSON.stringify({data,chapter:0,contentText:holder.querySelector('p')?.innerText||''}));$('#plan-result').hidden=true;$('#writing-panel').hidden=true;$('#plan-form').hidden=true;$('#story-content').innerHTML=html;$('#story-label').textContent='PROLOGUE';$('#empty-state').hidden=true;$('#story-result').hidden=false;let next=$('#prologue-next');if(!next){next=document.createElement('a');next.id='prologue-next';next.className='prologue-next';next.href='continue.html';next.textContent='다음: 제 1화 만들기 →';$('#story-result').append(next)}$('#story-result').scrollTop=0;setStep(1)};
async function autoStoreCurrentStory(){const content=$('#story-content').innerHTML;if(!content||!window.StoryStore)return;const button=$('#archive-story');try{await StoryStore.save({title:data.title||$('#title').value||'제목 없는 이야기',chapter:$('#story-label').textContent,content});button.textContent='자동 보관됨';button.disabled=true}catch(error){button.textContent='보관 필요';button.disabled=false}}const prologueHandler=$('#accept-plan').onclick;$('#accept-plan').onclick=()=>{prologueHandler();autoStoreCurrentStory()};
const latestPrologueHandler=$('#accept-plan').onclick;$('#accept-plan').onclick=()=>{latestPrologueHandler();const current=JSON.parse(localStorage.getItem('origin-story-session')||'{}');current.contentHtml=$('#story-content').innerHTML;localStorage.setItem('origin-story-session',JSON.stringify(current));if(!$('#back-to-plan')){const back=document.createElement('button');back.id='back-to-plan';back.className='back-stage';back.type='button';back.textContent='← 이전 단계 수정';back.onclick=()=>{$('#story-result').hidden=true;$('#plan-form').hidden=false;$('#plan-result').hidden=false;setStep(0);$('#plan-result').scrollTop=0};$('#story-result').append(back)}};(function(){const params=new URLSearchParams(location.search);if(params.get('view')!=='prologue')return;try{const saved=JSON.parse(localStorage.getItem('origin-story-session')||'null');if(!saved?.data||!saved?.contentHtml)return;data=saved.data;$('#plan-form').hidden=true;$('#writing-panel').hidden=true;$('#empty-state').hidden=true;$('#story-content').innerHTML=saved.contentHtml;$('#story-label').textContent='PROLOGUE';$('#story-result').hidden=false;setStep(1)}catch{}})();
(function(){if(new URLSearchParams(location.search).get('view')!=='prologue')return;if(!$('#prologue-next')&&!$('#story-result').hidden){const next=document.createElement('a');next.id='prologue-next';next.className='prologue-next';next.href='continue.html';next.textContent='\uB2E4\uC74C: \uC81C 1\uD654 \uB9CC\uB4E4\uAE30 \u2192';$('#story-result').append(next)}})();
/* keep only the result-side action after a prologue is created */
(()=>{
  const accept=$('#accept-plan');const writer=$('#story-next');const back=$('#back-plan');
  if(!accept||!writer)return;
  const createPrologue=accept.onclick;
  accept.onclick=()=>{createPrologue();writer.hidden=true};
  if(back){const backToPlan=back.onclick;back.onclick=()=>{if(backToPlan)backToPlan();writer.hidden=false}};
})();
/* natural Korean particles and result actions outside the story scroll */
(()=>{
  const batchim=ch=>{const code=ch.charCodeAt(0)-44032;return code>=0&&code<11172&&code%28!==0};
  const naturalize=text=>String(text).replace(/([가-힣])은\(는\)/g,(_,ch)=>ch+(batchim(ch)?'은':'는')).replace(/([가-힣])이\(가\)/g,(_,ch)=>ch+(batchim(ch)?'이':'가')).replace(/([가-힣])을\(를\)/g,(_,ch)=>ch+(batchim(ch)?'을':'를')).replace(/([가-힣])과\(와\)/g,(_,ch)=>ch+(batchim(ch)?'과':'와'));
  if(typeof prose==='function'){const source=prose;prose=(...args)=>naturalize(source(...args))}
  if(typeof makeEpisode==='function'){const source=makeEpisode;makeEpisode=(...args)=>{const made=source(...args);made.body=naturalize(made.body);made.html=naturalize(made.html);return made}}
  const moveActions=()=>{const result=$('#story-result');if(!result||result.hidden)return;const output=result.parentElement;let next=$('#prologue-next');if(!next){next=document.createElement('a');next.id='prologue-next';next.className='prologue-next';next.href='continue.html';next.textContent='\ub2e4\uc74c: \uc81c 1\ud654 \ub9cc\ub4e4\uae30 \u2192'}if(next.parentElement!==output)output.append(next);const back=$('#back-to-plan');if(back&&back.parentElement!==output)output.append(back)};
  const accept=$('#accept-plan');if(accept){const create=accept.onclick;accept.onclick=()=>{create();moveActions()}}
  moveActions();
})();
/* Open the current story plan for editing without clearing its values. */
(()=>{
  if(new URLSearchParams(location.search).get('edit')!=='plan')return;
  let saved;try{saved=JSON.parse(localStorage.getItem('origin-story-session')||'null')}catch{}
  if(!saved?.data)return;
  data=saved.data;
  const fields={title:'title',genre:'genre',totalEpisodes:'total-episodes',keywords:'keywords',character:'character'};
  Object.entries(fields).forEach(([key,id])=>{const field=$('#'+id);if(field&&data[key]!=null)field.value=data[key]});
  $('#plan-form').hidden=false;$('#writing-panel').hidden=true;$('#plan-result').hidden=true;$('#story-result').hidden=true;$('#empty-state').hidden=false;
  if(typeof setStep==='function')setStep(0);
})();
/* Give repeated planning attempts genuinely different narrative directions. */
(()=>{
  const source=blueprint;
  blueprint=d=>{
    const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|'));
    const key=(clean(d.keywords)||d.title+'에 남겨진 단서').split(',')[0].trim();
    const openings=[
      key+'이(가) 평범한 하루를 멈추게 만드는 순간에서 시작한다.',
      '주인공이 '+key+'에 관한 금지된 기록을 발견하는 장면으로 문을 연다.',
      key+'을(를) 둘러싼 오해가 예상치 못한 만남으로 이어지는 장면에서 출발한다.',
      '사라진 흔적과 '+key+'이(가) 동시에 나타나는 밤, 주인공의 선택을 첫 장면으로 삼는다.'
    ];
    return source(d).replace('<h3>핵심 질문</h3>','<h3>기획의 첫 장면</h3><p>'+openings[Math.abs(n)%openings.length]+'</p><h3>핵심 질문</h3>');
  };
})();
/* Always expose the route from a prologue back to its plan. */
(()=>{
  const result=$('#story-result');if(!result)return;
  const output=result.parentElement;
  let plan=$('#prologue-plan-edit');
  if(!plan){plan=document.createElement('a');plan.id='prologue-plan-edit';plan.className='prologue-plan-edit';plan.href='index.html?edit=plan';plan.textContent='\u2190 \uae30\ud68d\uc73c\ub85c \ub3cc\uc544\uac00\uae30';output.append(plan)}
  const sync=()=>{plan.hidden=result.hidden};
  const accept=$('#accept-plan');if(accept){const create=accept.onclick;accept.onclick=()=>{create();sync()}}
  new MutationObserver(sync).observe(result,{attributes:true,attributeFilter:['hidden']});sync();
})();
/* Build distinct plans: scene, conflict, resolution, and cast roles all vary together. */
(()=>{
  const particle=(word,type)=>{const last=word?.[word.length-1]||'';const code=last.charCodeAt(0)-44032;const final=code>=0&&code<11172&&code%28!==0;return type==='topic'?(final?'은':'는'):type==='subject'?(final?'이':'가'):(final?'을':'를')};
  blueprint=d=>{
    const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|'));
    const keys=(clean(d.keywords)||d.title+'에 얽힌 비밀, 예상치 못한 선택, 관계의 변화').split(',').map(v=>v.trim()).filter(Boolean);
    const [a,b='숨겨진 약속',c='변화']=keys;
    const cast=suggestedCast(d),hero=cast[0].name;
    const paths=[
      {open:hero+particle(hero,'topic')+' '+a+'이 남긴 흔적을 발견하는 순간, 일상이 낯선 방향으로 기울기 시작한다.',middle:b+'을 둘러싼 서로 다른 증언이 드러나며 누구를 믿을지 선택해야 한다.',end:c+'의 대가를 받아들이고 스스로 진실을 공개할지 결정한다.'},
      {open:a+particle(a,'subject')+' 사라진 날의 기록이 '+hero+' 앞에 도착하면서 이야기가 시작된다.',middle:'가장 가까운 사람의 거짓말이 드러나고, '+hero+particle(hero,'topic')+' 단서를 잃을 위기에 놓인다.',end:'돌이킬 수 없는 선택으로 관계를 지킬지, 숨겨진 사실을 세상에 알릴지 결단한다.'},
      {open:hero+particle(hero,'topic')+' '+b+'을 지키려다 우연히 '+a+particle(a,'object')+' 마주하고 위험한 거래에 휘말린다.',middle:c+'을 원하는 경쟁자가 먼저 움직이며 주인공의 계획을 뒤집는다.',end:'모두가 피하려 한 장소에서 진짜 목적을 깨닫고, 자신만의 방식으로 문제를 끝낸다.'},
      {open:'평범해 보이던 행사 한가운데서 '+a+particle(a,'subject')+' 나타나며 '+hero+'의 과거를 흔든다.',middle:'동료와 적의 경계가 무너지면서 '+b+'의 의미가 완전히 달라진다.',end:c+'을 포기하는 대신 더 중요한 사람을 선택하고, 다음 이야기의 문을 연다.'}
    ];
    const path=paths[Math.abs(n)%paths.length];
    const roleSets=[['주인공','기록의 해석자','목적이 다른 동행자','비밀의 증인'],['주인공','뜻밖의 협력자','진실을 감춘 경쟁자','사건의 열쇠'],['주인공','먼저 위험을 감지한 인물','거래를 제안한 인물','과거를 아는 인물'],['주인공','계획을 흔드는 조력자','반대편의 안내자','마지막 선택의 증인']][Math.abs(n)%4];
    return '<h2>'+d.title+'</h2><div class="meta">'+d.genre+'</div><h3>핵심 질문</h3><p>“'+a+particle(a,'object')+' 마주한 '+hero+particle(hero,'topic')+' 무엇을 지켜야 하는가?”</p><h3>기획의 첫 장면</h3><p>'+path.open+'</p><h3>등장인물 구성</h3><div class="cast-grid">'+cast.map((x,i)=>'<article class="cast-card"><strong>'+x.name+'</strong><span>'+roleSets[i]+'</span><p>'+x.desc+'</p></article>').join('')+'</div><h3>전개 흐름</h3><ol class="plan-beats"><li><b>시작</b>'+path.open+'</li><li><b>전환</b>'+path.middle+'</li><li><b>결말</b>'+path.end+'</li></ol><h3>이야기의 결</h3><p>'+pick(['긴장감 있는 미스터리와 인물 간 신뢰의 변화가 중심이 되는 이야기','선택의 대가와 관계의 균열을 따라가는 감정 중심 드라마','비밀을 추적하는 과정에서 세계관이 넓어지는 모험 서사','서로 다른 욕망이 충돌하며 예상을 뒤집는 스릴러'],n)+'</p>';
  };
})();
/* Keep the generated blueprint visible when returning from a prologue. */
(()=>{
  if(new URLSearchParams(location.search).get('edit')!=='plan')return;
  setTimeout(()=>{
    if(!data?.title)return;
    $('#plan-content').innerHTML=blueprint(data);
    $('#plan-form').hidden=false;$('#writing-panel').hidden=true;$('#story-result').hidden=true;$('#empty-state').hidden=true;$('#plan-result').hidden=false;$('#plan-result').scrollTop=0;
    if(typeof setStep==='function')setStep(0);
  },0);
})();
/* Rewrite the plan in natural Korean even when the user writes long free-form settings. */
(()=>{
  const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  blueprint=d=>{
    const n=seed([d.title,d.genre,d.keywords,d.character,d.variant].join('|'));
    const setting=clean(d.keywords)||'사용자가 정한 세계와 사건';
    const pieces=setting.split(/[,\n]/).map(v=>v.trim()).filter(Boolean);
    const motif=(pieces.find(v=>v.length<=28)||'핵심 사건').replace(/[.?!]$/,'');
    const cast=suggestedCast(d),hero=cast[0].name;const hasBatchim=word=>{const code=(word||'').slice(-1).charCodeAt(0)-44032;return code>=0&&code<11172&&code%28!==0};const topic=word=>word+(hasBatchim(word)?'은':'는');const object=word=>word+(hasBatchim(word)?'을':'를');
    const flows=[
      ['익숙한 일상에 작은 균열이 생기고, '+topic(hero)+' 그 원인을 외면하지 못한다.','첫 단서를 따라갈수록 가까운 사람들의 말이 서로 어긋나기 시작한다.','진실을 숨기는 편이 안전하다는 유혹을 뿌리치고, '+topic(hero)+' 스스로 답을 선택한다.'],
      ['예상하지 못한 사건이 '+hero+'의 일상 한가운데로 들어오며 이야기가 시작된다.','도움을 주던 인물의 목적이 드러나고, '+topic(hero)+' 신뢰와 의심 사이에서 흔들린다.','가장 소중한 것을 지키기 위해, '+topic(hero)+' 한 번도 선택하지 않았던 길을 택한다.'],
      ['오래 묻혀 있던 비밀이 모습을 드러내자, '+topic(hero)+' 과거의 선택을 다시 마주한다.','같은 목표를 가진 이들이 서로 다른 방법을 고집하면서 갈등은 더 깊어진다.','모든 사실이 드러난 자리에서, '+topic(hero)+' 관계와 진실을 함께 지킬 방법을 찾아낸다.'],
      ['평범한 하루의 끝에서 발견한 낯선 흔적이 '+object(hero)+' 새로운 세계로 이끈다.','한 걸음 나아갈 때마다 예상 밖의 대가가 따르고, 동료들 사이의 약속도 시험받는다.','마지막 순간 '+topic(hero)+' 두려움 대신 책임을 선택하며 다음 세계의 문을 연다.']
    ][Math.abs(n)%4];
    const roles=[['주인공','이야기의 중심에서 선택을 내리는 인물'],['조력자','주인공이 놓친 단서를 먼저 발견하는 인물'],['경쟁자','같은 목표를 두고 다른 답을 찾는 인물'],['연결고리','과거와 현재를 잇는 비밀을 가진 인물']];
    return '<h2>'+escapeHtml(d.title)+'</h2><div class="meta">'+escapeHtml(d.genre)+'</div><h3>반영한 이야기 설정</h3><p class="plan-setting">'+escapeHtml(setting).replace(/\n/g,'<br>')+'</p><h3>핵심 소재</h3><p><b>'+escapeHtml(motif)+'</b></p><p>이 기획은 사용자가 정한 설정을 중심으로, 인물의 선택과 관계 변화를 따라갑니다.</p><h3>기획의 첫 장면</h3><p>'+flows[0]+'</p><h3>등장인물 구성</h3><div class="cast-grid">'+cast.map((x,i)=>'<article class="cast-card"><strong>'+escapeHtml(x.name)+'</strong><span>'+roles[i][0]+'</span><p>'+roles[i][1]+'<br>'+escapeHtml(x.desc)+'</p></article>').join('')+'</div><h3>전개 흐름</h3><ol class="plan-beats"><li><b>시작</b>'+flows[0]+'</li><li><b>전환</b>'+flows[1]+'</li><li><b>결말</b>'+flows[2]+'</li></ol><h3>이야기의 결</h3><p>'+pick(['인물의 감정과 선택을 차분히 따라가는 드라마','숨겨진 사실을 하나씩 밝혀 가는 미스터리','관계의 변화가 사건을 움직이는 성장 이야기','선택의 대가가 남는 긴장감 있는 서사'],n)+'</p>';
  };
})();
/* Do not append free-form premise text to Korean particles inside prose. */
(()=>{
  const safeKeywords=data=>{
    const genre=String(data.genre||'');
    if(genre.includes('스릴러')||genre.includes('미스터리'))return '사건의 단서, 숨겨진 진실, 결정적 선택';
    if(genre.includes('로맨스'))return '뜻밖의 만남, 오래된 약속, 관계의 변화';
    if(genre.includes('판타지')||genre.includes('애니'))return '낯선 세계의 단서, 봉인된 약속, 새로운 길';
    if(genre.includes('SF'))return '미지의 기록, 사라진 규칙, 중요한 선택';
    return '예상 밖의 사건, 숨겨진 약속, 관계의 변화';
  };
  const source=prose;prose=(data,previous)=>source({...data,keywords:safeKeywords(data)},previous);
})();
/* Treat the entered title as a working title and refine it for the plan. */
(()=>{
  const refineTitle=(draft,data)=>{
    const title=String(draft||'').trim();if(!title||title.includes(' — '))return title;
    const genre=String(data.genre||''),n=seed([title,genre,data.keywords,data.variant].join('|'));
    const tags=genre.includes('스릴러')||genre.includes('미스터리')?['사라진 기록','감춰진 진실','마지막 목격자','닫힌 문 너머']:
      genre.includes('로맨스')?['마지막 편지','우리의 약속','비가 그친 뒤','서로를 향한 길']:
      genre.includes('SF')?['잃어버린 좌표','기억의 경계','새벽의 신호','다른 세계의 문']:
      genre.includes('판타지')||genre.includes('애니')?['봉인된 약속','별이 지는 밤','잊힌 왕국','달빛의 기록']:
      ['숨겨진 약속','사라진 계절','마지막 선택','낯선 내일'];
    return title+' — '+tags[Math.abs(n)%tags.length];
  };
  const form=$('#plan-form'),submit=form?.onsubmit;if(form&&submit){form.onsubmit=e=>{submit(e);const draft=data.title,refined=refineTitle(draft,data);if(refined&&refined!==draft){data={...data,title:refined,draftTitle:draft};$('#title').value=refined;$('#plan-content').innerHTML=blueprint(data)}}}
  const source=blueprint;blueprint=d=>{const html=source(d);if(!d.draftTitle)return html;const safe=String(d.draftTitle).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));return html.replace('</div><h3>반영한 이야기 설정</h3>','</div><p class="draft-title">입력한 가제: '+safe+'</p><h3>반영한 이야기 설정</h3>')};
})();
/* Enrich prologues with dialogue, inner thought, and a brief second viewpoint. */
(()=>{
  const source=prose;
  prose=(data,previous)=>{
    const cast=suggestedCast(data),hero=cast[0].name,other=cast[1].name;
    const scene='“이상해. 분명 어제와는 달라졌어.” '+hero+'의 목소리는 낮았지만 흔들리지 않았다.<br><br><em>&#39;이제 와서 모른 척할 수는 없어.&#39;</em><br><br>한편, '+other+'의 시선에서는 같은 장면이 전혀 다르게 보였다. '+other+'은 말하지 못한 사실을 삼킨 채, '+hero+'이 내릴 다음 선택을 지켜보았다.<br><br>';
    return source(data,previous).replace('<p>','<p>'+scene);
  };
})();
/* Keep the user premise visible in the prose without attaching particles to it. */
(()=>{
  const source=prose;
  const escape=value=>String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  prose=(data,previous)=>{
    const setting=clean(data.keywords).trim();if(!setting)return source(data,previous);
    const excerpt=setting.length>700?setting.slice(0,700)+'…':setting;
    const premise='그날 이후, 모두가 피할 수 없게 된 현실은 분명했다.<br>“'+escape(excerpt).replace(/\n/g,'<br>')+'”<br><br>';
    return source(data,previous).replace('<p>','<p>'+premise);
  };
})();