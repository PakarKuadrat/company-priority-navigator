const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });

export default async function handler(request) {
  if (request.method !== "POST") {
    return json({ saved: false, error: "Method not allowed" }, 405);
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!scriptUrl || !sharedSecret) {
    return json(
      { saved: false, error: "Google Sheets integration is not configured" },
      500,
    );
  }

  try {
    const payload = await request.json();

    if (!payload.name || !payload.company || !payload.gmail || !payload.priority) {
      return json({ saved: false, error: "Required response data is missing" }, 400);
    }

    const googleResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        ...payload,
        sharedSecret,
      }),
      redirect: "follow",
    });

    const responseText = await googleResponse.text();
    let googleResult;

    try {
      googleResult = JSON.parse(responseText);
    } catch {
      throw new Error(
        responseText.includes("You need access")
          ? "Google Apps Script access is restricted"
          : "Google Apps Script returned an invalid response",
      );
    }

    if (!googleResponse.ok || googleResult.ok === false) {
      throw new Error(googleResult.error || "Google Sheets rejected the response");
    }

    return json({ saved: true });
  } catch (error) {
    console.error("Google Sheets submission failed:", error);
    return json(
      {
        saved: false,
        error: error instanceof Error ? error.message : "Submission failed",
      },
      502,
    );
  }
}

export const config = {
  path: "/api/responses",
};
