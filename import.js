const $=s=>document.querySelector(s);
const nonSpace=s=>String(s||'').replace(/\s/g,'').length;
const cap=(text,max)=>{let out='',n=0;for(const ch of String(text||'')){if(!/\s/.test(ch)){if(n>=max)break;n++}out+=ch}return out.trim()};
const story=$('#import-story'),count=$('#import-count');
story.oninput=()=>{const n=nonSpace(story.value);count.textContent='공백 제외 '+n.toLocaleString()+'자'+(n>20050?' · 다음 화에는 마지막 20,050자를 사용합니다.':' · 긴 원고는 마지막 20,050자를 문맥으로 사용합니다.')};
$('#import-form').onsubmit=e=>{e.preventDefault();const original=story.value.trim();if(!original)return;const text=cap(original,20050);const data={title:'외부 원고 이어쓰기',genre:'자유 형식',keywords:'',character:'',totalEpisodes:0,variant:Date.now(),imported:true};const html='<h2>외부 원고</h2><div class="meta">직전 이야기</div><p>'+text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')+'</p>';localStorage.setItem('origin-story-session',JSON.stringify({data,chapter:0,contentText:text,contentHtml:html,history:[{chapter:0,contentText:text,contentHtml:html}]}));location.href='continue.html'};
story.oninput();