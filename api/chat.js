export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const messages = body.messages || [];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.9,
        max_tokens: 120,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ emotion: 'neutral', text: 'bro net thoda gadbad hai, dubara bol', error: errText });
    }

    const data = await res.json();
    let parsed = { emotion: 'neutral', text: '' };
    try {
      parsed = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      parsed = { emotion: 'neutral', text: data.choices?.[0]?.message?.content || '' };
    }
    return json(parsed);
  } catch (err) {
    return json({ emotion: 'neutral', text: '', error: err.message }, 500);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
