export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY belum dipasang di Cloudflare." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gagal menghubungi Gemini API." }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const hasilTeks =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respons.";

    return new Response(JSON.stringify({ reply: hasilTeks }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
