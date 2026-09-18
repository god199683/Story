const $ = (s) => document.querySelector(s);
const forbidden = /해리 포터|마블|디즈니|스타워즈|원피스|나루토|귀멸|지브리|픽사|넷플릭스|[\w가-힣]+ 스타일로|[\w가-힣]+처럼 써/gi;
const clean = (text) => text.replace(forbidden, '고유한 창작 요소').replace(/\s{2,}/g, ' ').trim();
const pick = (items, seed) => items[Math.abs(seed) % items.length];
function makeStory(data) {
  const seed = [...data.title].reduce((n,c)=>n+c.charCodeAt(0),0);
  const keys = (clean(data.keywords) || '낯선 신호, 숨겨진 약속, 변화').split(',').map(x=>x.trim()).filter(Boolean);
  const a = keys[0] || '낯선 신호', b = keys[1] || '숨겨진 약속', c = keys[2] || '변화';
  const hero = data.character ? clean(data.character).split(/[,.\n]/)[0] : pick(['기록을 지키는 사람', '혼자 길을 떠난 여행자', '평범한 하루를 사랑하는 청년', '잊힌 노래를 수집하는 소녀'], seed);
  const goals = ['사라진 진실을 세상에 돌려놓기 위해', '자신이 믿어 온 규칙을 깨뜨리기 위해', '되돌릴 수 없는 약속을 지키기 위해', '누군가의 내일을 바꾸기 위해'];
  const twists = ['가장 믿었던 단서가 누군가가 남긴 작별 인사였다는 사실', '모두가 두려워하던 존재가 사실은 이 세계를 지켜 온 마지막 수호자라는 사실', '문제를 해결하는 열쇠가 주인공이 외면해 온 자신의 기억이라는 사실', '두 사람이 서로에게서 잃어버린 미래를 발견한다는 사실'];
  const opening = [`비가 그친 뒤, ${a}은(는) 평소보다 선명한 빛을 냈다.`, `${hero}은(는) 그 빛을 보자마자 오래전 ${b}에 대해 들었던 이야기를 떠올렸다.`, `아무도 믿지 않을 만큼 조용한 변화였지만, 그날부터 세계의 작은 균열은 하나씩 목소리를 내기 시작했다.`];
  return `<h2>${data.title}</h2><div class="meta">${data.genre} · ${data.tone} · ORIGINAL CONCEPT</div>
  <h3>한 줄 로그라인</h3><p>${a}이(가) 일상을 뒤흔든 날, ${hero}은(는) ${pick(goals, seed + 3)} 미지의 길로 들어선다.</p>
  <h3>이야기 개요</h3><p>이 세계에서 ${a}은(는) 단순한 소재가 아니라 모두의 선택을 비추는 장치다. ${hero}은(는) ${b}을(를) 계기로 자신만의 목표를 갖게 되고, ${c}을(를) 둘러싼 갈등 속에서 예상치 못한 동료와 맞선다. 이야기의 중반에는 ${pick(twists, seed + 9)} 드러난다. 주인공은 정답을 찾는 대신, 스스로 어떤 사람이 될지 선택해야 한다.</p>
  <h3>첫 장면</h3><p>${opening.join('\n')}</p>`;
}
$('#story-form').addEventListener('submit', (e) => { e.preventDefault(); const data={title:$('#title').value.trim(),genre:$('#genre').value,tone:$('#tone').value,keywords:$('#keywords').value,character:$('#character').value}; $('#story-content').innerHTML=makeStory(data); $('#empty-state').hidden=true; $('#story-result').hidden=false; });
document.addEventListener('keydown',(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter') $('#story-form').requestSubmit()});
$('#copy-btn').onclick=async()=>{await navigator.clipboard.writeText($('#story-content').innerText); $('#copy-btn').textContent='복사됨';setTimeout(()=>$('#copy-btn').textContent='복사',1300)};
$('#save-btn').onclick=()=>{const blob=new Blob([$('#story-content').innerText],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${$('#title').value||'original-story'}.txt`;a.click();URL.revokeObjectURL(a.href)};
