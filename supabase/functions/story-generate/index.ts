const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://god199683.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });
const withoutSpace = (text: string) => text.replace(/\s/g, '').length;
const stripMarkup = (text: string) => text.replace(/```(?:json)?/gi, '').replace(/<[^>]+>/g, '').trim();

function publishedKey() {
  const keys = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS');
  if (keys) return JSON.parse(keys).default;
  return Deno.env.get('SUPABASE_ANON_KEY');
}
function secretKey() {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (keys) return JSON.parse(keys).default;
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
}

async function openAI(input: string, maxOutputTokens: number, jsonSchema?: object) {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY Secret이 아직 등록되지 않았습니다.');
  const body: Record<string, unknown> = {
    model: 'gpt-5.6-terra',
    input,
    max_output_tokens: maxOutputTokens,
    reasoning: { effort: 'none' },
    store: false,
  };
  if (jsonSchema) body.text = { format: { type: 'json_schema', name: 'story_plan', strict: true, schema: jsonSchema } };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'OpenAI 요청에 실패했습니다.');
  const text = payload.output_text || (payload.output || []).flatMap((item: any) => item.content || []).filter((part: any) => part.type === 'output_text').map((part: any) => part.text || '').join('');
  if (!text) {
    const refusal = (payload.output || []).flatMap((item: any) => item.content || []).find((part: any) => part.type === 'refusal')?.refusal;
    throw new Error(refusal || payload.incomplete_details?.reason || 'AI가 글을 반환하지 않았습니다. 다시 시도해 주세요.');
  }
  return text;
}

function planPrompt(story: Record<string, unknown>) {
  return `당신은 한국어 오리지널 장편 서사 기획자입니다. 다음 사용자의 가제를 바탕으로, 특정 기존 작품·작가·실존 인물의 설정과 문체를 모방하지 않는 새로운 기획을 만드세요. 사용자가 쓴 설정 문장을 그대로 인용하거나 요약 나열하지 말고, 그 의미를 사건·인물·갈등·장면으로 재해석하세요. 캐릭터 입력이 있으면 그 캐릭터의 핵심만 존중하되 자연스러운 서사 인물로 발전시키세요. 동일한 가제라도 매번 다른 사건 구조와 인물 관계를 제안하세요.

가제: ${story.title || ''}
장르: ${story.genre || ''}
이야기 설정: ${story.keywords || ''}
사용자 캐릭터: ${story.character || '없음'}
총 편수: ${story.totalEpisodes || '미정'}

JSON만 반환하세요.`;
}

const planSchema = {
  type: 'object', additionalProperties: false,
  required: ['title', 'logline', 'opening', 'conflict', 'arc', 'tone', 'characters'],
  properties: {
    title: { type: 'string' }, logline: { type: 'string' }, opening: { type: 'string' },
    conflict: { type: 'string' }, arc: { type: 'string' }, tone: { type: 'string' },
    characters: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', additionalProperties: false, required: ['name', 'role', 'description'], properties: { name: { type: 'string' }, role: { type: 'string' }, description: { type: 'string' } } } },
  },
};

function episodePrompt(story: Record<string, unknown>, mode: string, previous: string, plan: unknown, episode: number, finish: boolean) {
  const kind = mode === 'prologue' ? '프롤로그' : `제 ${episode}화`;
  const length = mode === 'prologue' ? '1,500~3,000자' : '공백을 제외하고 반드시 20,000자 이상 20,050자 이하';
  return `당신은 한국어 장편소설 작가입니다. 아래 기획과 직전 원고를 바탕으로 ${kind}를 씁니다. 기존 작품·작가·실존 인물·프랜차이즈의 표현, 줄거리, 고유 설정을 모방하지 마세요. 설정을 설명문으로 복사하거나 '지난 이야기에서'라고 요약하지 말고, 행동·장면·대화·갈등 속에 녹이세요. 자연스러운 한국어 문법을 지키고, 은(는)·이(가) 같은 괄호형 조사를 절대 쓰지 마세요. 대사는 큰따옴표, 마음속 말은 작은따옴표로 쓰세요. 한 인물의 시점에만 고정하지 말고 필요할 때 다른 인물의 관찰을 짧게 섞으세요. 출력은 제목·화수·목록·해설·마크다운 없이 본문만 써야 합니다. 마지막은 반드시 완결된 문장으로 끝나야 합니다. 제1화 이후에는 공백 제외 20,025자 전후를 목표로 하며, 20,000자보다 짧게 끝내면 안 됩니다.

분량: ${length}
가제 및 작품명: ${story.title || ''}
장르: ${story.genre || ''}
기획: ${JSON.stringify(plan || {})}
직전 원고: ${previous || '없음'}
${finish ? '이번 화는 이야기를 자연스럽고 여운 있게 완결하세요.' : '이번 화는 다음 화를 기대하게 하는 사건의 전환점에서 끝내세요.'}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ ok: false, error: 'POST 요청만 허용됩니다.' }, 405);
  try {
    const auth = req.headers.get('Authorization');
    const url = Deno.env.get('SUPABASE_URL')!;
    const publishable = publishedKey();
    const service = secretKey();
    if (!auth || !publishable || !service) throw new Error('인증 설정을 확인해 주세요.');
    const userResponse = await fetch(`${url}/auth/v1/user`, { headers: { apikey: publishable, Authorization: auth } });
    if (!userResponse.ok) return json({ ok: false, error: '로그인 후 다시 시도해 주세요.' }, 401);
    const user = await userResponse.json();
    const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const usageUrl = `${url}/rest/v1/ai_generation_requests?user_id=eq.${user.id}&created_at=gte.${encodeURIComponent(windowStart)}&select=id`;
    const usage = await fetch(usageUrl, { headers: { apikey: service, Authorization: `Bearer ${service}` } });
    if (!usage.ok) throw new Error('AI 요청 제한 테이블을 준비해야 합니다. supabase-setup.sql을 다시 실행해 주세요.');
    if ((await usage.json()).length >= 8) return json({ ok: false, error: '안전을 위해 시간당 AI 생성은 8회로 제한됩니다. 잠시 후 다시 시도해 주세요.' }, 429);
    const request = await req.json();
    const mode = request.mode;
    if (!['plan', 'prologue', 'episode'].includes(mode)) return json({ ok: false, error: '올바르지 않은 생성 요청입니다.' }, 400);
    let result: unknown;
    if (mode === 'plan') {
      const text = await openAI(planPrompt(request.story || {}), 2400, planSchema);
      result = JSON.parse(stripMarkup(text));
    } else {
      const prompt = episodePrompt(request.story || {}, mode, request.previous || '', request.plan, Number(request.episode || 0), Boolean(request.finish));
      let text = stripMarkup(await openAI(prompt, mode === 'prologue' ? 5000 : 22000));
      if (mode === 'episode' && withoutSpace(text) > 20050) {
        let count = 0, cut = 0;
        for (const char of text) { if (!/\s/.test(char)) count++; if (count > 20050) break; cut++; }
        const clipped = text.slice(0, cut);
        const end = Math.max(clipped.lastIndexOf('.'), clipped.lastIndexOf('!'), clipped.lastIndexOf('?'));
        text = (end >= 0 && withoutSpace(clipped.slice(0, end + 1)) >= 20000 ? clipped.slice(0, end + 1) : clipped).trim();
      }
      if (mode === 'episode' && (withoutSpace(text) < 20000 || withoutSpace(text) > 20050)) throw new Error('정확한 분량의 원고를 만들지 못했습니다. 다시 생성해 주세요.');
      result = { text };
    }
    await fetch(`${url}/rest/v1/ai_generation_requests`, { method: 'POST', headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: user.id }) });
    return json({ ok: true, result });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' }, 500);
  }
});