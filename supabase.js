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
window.StoryAI={async generate(payload){await ensureStorySession();const {data,error}=await supabaseClient.functions.invoke('story-generate',{body:payload});if(error)throw error;if(!data?.ok)throw new Error(data?.error||'AI 생성에 실패했습니다.');return data}};