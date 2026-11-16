const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BuildingSummary {
  name: string;
  sector: string;
  floor_area: number;
  epc_letter: string;
}

interface AnalyzeRequest {
  buildings: BuildingSummary[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { buildings }: AnalyzeRequest = await req.json();

    if (!Array.isArray(buildings) || buildings.length === 0) {
      return new Response(
        JSON.stringify({ error: "No buildings provided for analysis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "The analysis service is not configured. Please contact support." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const buildingData = buildings.map((b) => ({
      name: b.name,
      sector: b.sector,
      floor_area: b.floor_area,
      epc_letter: b.epc_letter,
    }));

    const prompt = `You are an energy efficiency consultant analysing UK commercial properties for MEES 2031 compliance. Below is a filtered list of ${buildings.length} buildings. Provide a concise 3-4 sentence analysis in plain prose (no markdown, no bullet points, no headers) covering: the overall EPC rating distribution, notable patterns in floor area vs rating, and any risk areas for MEES 2031 compliance. Keep it practical and actionable.

Buildings (JSON):
${JSON.stringify(buildingData)}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "The analysis service is temporarily unavailable. Please try again in a moment." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const analysisText = data?.content?.[0]?.text;

    if (!analysisText) {
      return new Response(
        JSON.stringify({ error: "The analysis service returned an unexpected response. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("analyze function error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong while analysing the buildings. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
