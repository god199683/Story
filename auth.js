(()=>{
  const normalize=id=>String(id||'').trim().toLowerCase();
  const accountEmail=id=>normalize(id)+'@users.story.local';
  const valid=id=>/^[a-z0-9_-]{3,24}$/i.test(id);
  const render=async()=>{
    const header=document.querySelector('header');if(!header||document.querySelector('#account-button'))return;
    const button=document.createElement('button');button.id='account-button';button.type='button';button.className='account-button';header.append(button);
    const {data:{session}}=await supabaseClient.auth.getSession();
    const user=session?.user;
    const name=user&&!user.is_anonymous?(user.user_metadata?.display_name||user.email?.split('@')[0]):'';
    button.textContent=name?name+' · 계정':'로그인';
    button.onclick=()=>openModal(name);
  };
  const openModal=name=>{
    document.querySelector('#auth-modal')?.remove();
    const modal=document.createElement('div');modal.id='auth-modal';modal.className='auth-modal';modal.innerHTML='<div class="auth-card"><button class="auth-close" type="button" aria-label="닫기">×</button><div class="eyebrow">STORY ACCOUNT</div><h2>'+ (name?'계정 관리':'로그인 또는 가입') +'</h2>'+ (name?'<p class="auth-note">현재 로그인된 계정의 보관함만 표시됩니다.</p><button id="auth-logout" class="auth-primary" type="button">로그아웃</button>':'<p class="auth-note">이메일 없이 아이디와 비밀번호로 사용합니다.</p><label>아이디<input id="auth-id" maxlength="24" autocomplete="username" placeholder="영문·숫자·_·- / 3~24자"></label><label>비밀번호<input id="auth-password" type="password" minlength="8" autocomplete="current-password" placeholder="8자 이상"></label><p id="auth-message" class="auth-message"></p><div class="auth-buttons"><button id="auth-login" class="auth-primary" type="button">로그인</button><button id="auth-signup" class="auth-secondary" type="button">가입하기</button></div>')+'</div>';
    document.body.append(modal);modal.querySelector('.auth-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
    if(name){modal.querySelector('#auth-logout').onclick=async()=>{await supabaseClient.auth.signOut();location.reload();return};return}
    const message=modal.querySelector('#auth-message');
    const submit=async signup=>{const id=modal.querySelector('#auth-id').value,password=modal.querySelector('#auth-password').value;if(!valid(id)){message.textContent='아이디는 영문·숫자·_·-로 3~24자여야 합니다.';return}if(password.length<8){message.textContent='비밀번호는 8자 이상이어야 합니다.';return}message.textContent='처리 중…';await supabaseClient.auth.signOut();const action=signup?supabaseClient.auth.signUp({email:accountEmail(id),password,options:{data:{display_name:id}}}):supabaseClient.auth.signInWithPassword({email:accountEmail(id),password});const {data,error}=await action;if(error){message.textContent=error.message;return}if(signup&&!data.session){message.textContent='Supabase에서 이메일 확인을 꺼야 바로 가입할 수 있습니다.';return}location.reload()};
    modal.querySelector('#auth-login').onclick=()=>submit(false);modal.querySelector('#auth-signup').onclick=()=>submit(true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();