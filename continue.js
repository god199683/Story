const $=s=>document.querySelector(s);const key='origin-story-session';const clean=s=>(s||'').replace(/해리 포터|마블|디즈니|스타워즈|원피스|나루토|귀멸|지브리|픽사|넷플릭스/gi,'고유한 창작 요소').trim();const seed=s=>[...s].reduce((n,c)=>n+c.charCodeAt(0),0);const pick=(a,n)=>a[Math.abs(n)%a.length];const nonSpace=s=>s.replace(/\s/g,'').length;let session;try{session=JSON.parse(localStorage.getItem(key)||'null')}catch{}const input=$('#previous-story'),button=$('#next-episode');function count(){const n=nonSpace(input.value);$('#continue-count').textContent=n.toLocaleString()+' / 20,050';button.disabled=n>20050}function cast(data){const own=clean(data.character),hero=own?own.split(/[,.\n]/)[0].trim():pick(['서린','도윤','하진','유나','지호','민서'],seed(data.title)),other=['시우','가온','다온','태린','아린'].find(x=>x!==hero&&!own.includes(x));return{hero,other}}function trimTo(text,max){let out='',n=0;for(const ch of text){if(!/\s/.test(ch)){if(n>=max)break;n++}out+=ch}return out.trim()}function makeEpisode(data,number){const {hero,other}=cast(data),keys=(clean(data.keywords)||'낯선 신호, 약속').split(',').map(x=>x.trim()),a=keys[0],b=keys[1]||'약속',s=seed(data.title)+number;let body='지난 이야기에서 남겨진 선택은 아직 끝나지 않았다. '+hero+'은(는) '+a+'에 얽힌 흔적을 따라 조용히 발걸음을 옮겼다.\n\n그때 '+other+'이(가) '+b+'에 관한 뜻밖의 사실을 전했다. 두 사람은 같은 장면을 보고도 서로 다른 결론에 닿았고, 그 차이는 다음 선택을 더욱 어렵게 만들었다.';const beats=['낯선 흔적은 오래된 골목 끝에서 멈췄고, '+hero+'은(는) 그곳에 남겨진 작은 물건을 발견했다.','아무도 말하지 않았던 기억이 문득 떠올랐다. '+other+'의 표정에는 망설임과 결심이 동시에 스쳐 갔다.','서로의 생각은 달랐지만, 두 사람은 지금 물러설 수 없다는 점만은 알고 있었다.','바람의 방향이 바뀌자 주변 풍경도 조금씩 낯설게 보이기 시작했다. '+hero+'은(는) 이유를 찾기 위해 한 걸음 더 다가갔다.','멀리서 들려온 소리는 평범한 신호처럼 들렸지만, '+b+'을 알고 있는 사람에게는 분명한 경고였다.','잠시 멈춘 시간 속에서 '+hero+'은(는) 자신이 무엇을 두려워하는지 깨달았다. 그리고 그 두려움보다 중요한 것을 떠올렸다.'];let i=0;while(nonSpace(body)<20025){const beat=beats[(s+i)%beats.length];body+='\n\n'+beat+' '+hero+'은(는) 주변을 천천히 살피며 이전과 달라진 점을 마음속에 새겼다. '+other+'은(는) 말없이 곁을 지켰고, 두 사람 사이에는 설명하지 않아도 알 수 있는 긴장감이 흘렀다. 그 순간에도 '+a+'의 비밀은 조금씩 더 깊어지고 있었다.';i++}body=trimTo(body,20050);const total=nonSpace(body),html='<h2>'+data.title+'</h2><div class="meta">제 '+number+'화 · 공백 제외 '+total.toLocaleString()+'자</div><p>'+body.replace(/\n/g,'<br>')+'</p>';return{html,body,total}}async function saveEpisode(html,number){if(!window.StoryStore)return;try{await StoryStore.save({title:session.data.title,chapter:'EPISODE '+number,content:html})}catch(error){console.warn('자동 보관에 실패했습니다.',error)}}function setNextLabel(){const n=(session.chapter||0)+1;$('#next-label').textContent='제 '+n+'화';button.innerHTML='<span>✦</span> 제 '+n+'화 만들기'}if(!session?.data){$('#continue-empty').innerHTML='<div class="empty-icon">✦</div><h2>먼저 이야기를 기획해 주세요</h2><p><a href="index.html">기획 페이지로 이동하기 →</a></p>';button.disabled=true}else{$('#continue-title').textContent=session.data.title+' · 다음 편';input.value=session.contentText||'';input.oninput=count;button.onclick=async()=>{if(nonSpace(input.value)>20050)return;const number=(session.chapter||0)+1,result=makeEpisode(session.data,number);session={...session,chapter:number,contentText:result.body,contentHtml:result.html};localStorage.setItem(key,JSON.stringify(session));$('#continue-content').innerHTML=result.html;$('#continue-result-label').textContent='EPISODE '+number;$('#continue-empty').hidden=true;$('#continue-result').hidden=false;input.value=result.body;count();setNextLabel();$('#continue-result').scrollTop=0;saveEpisode(result.html,number)};$('#continue-copy').onclick=async()=>{await navigator.clipboard.writeText($('#continue-content').innerText);$('#continue-copy').textContent='복사됨';setTimeout(()=>$('#continue-copy').textContent='복사',1200)};count();setNextLabel()}
const resultNext=$('#continue-next');if(resultNext){const syncResultNext=()=>{const n=(session.chapter||0)+1;const action=document.querySelector('#continue-action');if(action)action.hidden=document.querySelector('#continue-result').hidden;resultNext.textContent='\uB2E4\uC74C: \uC81C '+n+'\uD654 \uB9CC\uB4E4\uAE30 \u2192'};const oldSetNextLabel=setNextLabel;setNextLabel=()=>{oldSetNextLabel();syncResultNext()};resultNext.onclick=()=>button.click();syncResultNext()};
/* episode history navigation */
(()=>{
  if(!session?.data)return;
  const action=document.querySelector('#continue-action');
  const next=document.querySelector('#continue-next');
  const previous=document.querySelector('#previous-stage');
  const result=document.querySelector('#continue-result');
  const empty=document.querySelector('#continue-empty');
  let history=Array.isArray(session.history)&&session.history.length?session.history:[{chapter:session.chapter||0,contentText:session.contentText||'',contentHtml:session.contentHtml||''}];
  let shown=-1;
  const save=()=>{session={...session,history};localStorage.setItem(key,JSON.stringify(session))};
  const show=(index)=>{
    const item=history[index];if(!item)return;
    shown=index;
    document.querySelector('#continue-content').innerHTML=item.contentHtml;
    document.querySelector('#continue-result-label').textContent=item.chapter?'EPISODE '+item.chapter:'PROLOGUE';
    input.value=item.contentText;count();
    empty.hidden=true;result.hidden=false;action.hidden=false;button.hidden=true;
    previous.textContent=index>0?'\u2190 \uc774\uc804: \uc81c '+history[index-1].chapter+'\ud654 \ubcf4\uae30':'\u2190 \ud504\ub864\ub85c\uadf8 \uae30\ud68d\uc73c\ub85c';
    next.textContent=index<history.length-1?'\ub2e4\uc74c: \uc81c '+history[index+1].chapter+'\ud654 \ubcf4\uae30 \u2192':'\ub2e4\uc74c: \uc81c '+((item.chapter||0)+1)+'\ud654 \ub9cc\ub4e4\uae30 \u2192';
    result.scrollTop=0;
  };
  const create=async()=>{
    if(nonSpace(input.value)>20050)return;
    const base=shown>=0?history[shown]:history[history.length-1];
    const number=(base.chapter||0)+1;
    const made=makeEpisode(session.data,number);
    const item={chapter:number,contentText:made.body,contentHtml:made.html};
    if(shown>=0&&shown<history.length-1)history=history.slice(0,shown+1);
    history.push(item);session={...session,chapter:number,contentText:made.body,contentHtml:made.html,history};save();
    show(history.length-1);saveEpisode(made.html,number);
  };
  button.onclick=create;
  next.onclick=()=>shown<history.length-1?show(shown+1):create();
  previous.onclick=()=>{if(shown>0)show(shown-1);else location.href='index.html?view=prologue'};
  if(session.history?.length&&session.chapter>0)show(history.length-1);
})();
/* apply particle correction to long episode text */
(()=>{
  const batchim=ch=>{const code=ch.charCodeAt(0)-44032;return code>=0&&code<11172&&code%28!==0};
  const naturalize=text=>String(text).replace(/([가-힣])은\(는\)/g,(_,ch)=>ch+(batchim(ch)?'은':'는')).replace(/([가-힣])이\(가\)/g,(_,ch)=>ch+(batchim(ch)?'이':'가')).replace(/([가-힣])을\(를\)/g,(_,ch)=>ch+(batchim(ch)?'을':'를'));
  const source=makeEpisode;makeEpisode=(...args)=>{const made=source(...args);made.body=naturalize(made.body);made.html=naturalize(made.html);return made};
})();