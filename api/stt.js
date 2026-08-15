export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const audio = formData.get('audio');
    if (!audio) {
      return json({ text: '' });
    }

    const upstreamForm = new FormData();
    upstreamForm.append('file', audio, 'audio.webm');
    upstreamForm.append('model', 'whisper-large-v3-turbo');
    // no forced 'language' param -> lets Whisper auto-detect, works better for mixed Hinglish
    upstreamForm.append('response_format', 'json');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: upstreamForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ text: '', error: errText });
    }

    const data = await res.json();
    return json({ text: data.text || '' });
  } catch (err) {
    return json({ text: '', error: err.message }, 500);
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
