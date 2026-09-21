const SUPABASE_URL='https://rrvntqfubjfbnkhujrxo.supabase.co';const SUPABASE_KEY='sb_publishable_denvH8wzX279C8841U1dMg_QFLpSD8n';const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);async function ensureStorySession(){const {data:{session}}=await supabaseClient.auth.getSession();if(session)return session;const {data,error}=await supabaseClient.auth.signInAnonymously();if(error)throw error;return data.session}window.StoryStore={async save(story){await ensureStorySession();const {error}=await supabaseClient.from('stories').insert(story);if(error)throw error},async list(){await ensureStorySession();const {data,error}=await supabaseClient.from('stories').select('id,title,chapter,content,created_at').order('created_at',{ascending:false});if(error)throw error;return data},async remove(id){await ensureStorySession();const {error}=await supabaseClient.from('stories').delete().eq('id',id);if(error)throw error}};
/* Remove escaped line-break artifacts from every rendered screen. */
(()=>{
  const clean=node=>{
    if(!node||node.nodeType!==Node.TEXT_NODE)return;
    const parent=node.parentElement;if(!parent||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(parent.tagName))return;
    const fixed=node.nodeValue.replace(/\\n/g,'\n');
    if(fixed!==node.nodeValue)node.nodeValue=fixed;
  };
  const sweep=root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())clean(node)};
  const start=()=>{sweep(document.body);new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)clean(node);else if(node.nodeType===Node.ELEMENT_NODE)sweep(node)}))).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* The browser calls a Supabase Edge Function. OpenAI credentials remain server-only. */
window.StoryAI={async generate(payload){await ensureStorySession();const {data,error}=await supabaseClient.functions.invoke('story-generate',{body:payload});if(error){let message='AI 서버 연결에 실패했습니다.';try{const detail=await error.context.json();message=detail?.error||message}catch{}throw new Error(message)}if(!data?.ok)throw new Error(data?.error||'AI 생성에 실패했습니다.');return data}};
window.StoryAI.generateEpisode=async function(payload,onProgress){
  const count=text=>String(text||'').replace(/\s/g,'').length;
  const trim=text=>{let seen=0,limit=0;for(const char of text){if(!/\s/.test(char))seen++;if(seen>20050)break;limit++}const clipped=text.slice(0,limit).trim();for(let i=clipped.length-1;i>=0;i--){if(/[.!?]/.test(clipped[i])&&count(clipped.slice(0,i+1))>=20000)return clipped.slice(0,i+1).trim()}return clipped};
  const parts=[];let context=payload.previous||'';
  for(let part=1;part<=4;part++){onProgress?.(part,4);const response=await this.generate({...payload,mode:'episode_part',part,finalPart:part===4,previous:context});parts.push(response.result.text);context=`${payload.previous||''}\n\n${parts.join('\n\n')}`}
  let text=parts.join('\n\n');
  if(count(text)<20000){onProgress?.(5,5);const response=await this.generate({...payload,mode:'episode_part',part:5,finalPart:true,previous:context});text+='\n\n'+response.result.text}
  text=trim(text);if(count(text)<20000||count(text)>20050)throw new Error('정확한 분량의 원고를 만들지 못했습니다. 다시 생성해 주세요.');return{text};
};