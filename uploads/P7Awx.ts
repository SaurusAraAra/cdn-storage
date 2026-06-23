import { NextRequest, NextResponse } from "next/server";

const IMAGE_API = "https://api.synoxcloud.xyz/ai-generate/text-2-image";
const TIMEOUT_MS = 60000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, ratio } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt ilustrasi diperlukan." }, { status: 400 });
    }

    const imagePrompt = prompt.trim().substring(0, 500);
    const imageRatio = ratio || "16:9";

    const url = `${IMAGE_API}?prompt=${encodeURIComponent(imagePrompt)}&ratio=${encodeURIComponent(imageRatio)}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`[story-image] API error ${response.status}`);
      return NextResponse.json(
        { error: "Gagal membuat ilustrasi." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      status?: boolean;
      data?: {
        url?: string;
        status?: boolean;
      };
    };

    const imageUrl = data.data?.url;

    if (!imageUrl) {
      console.error("[story-image] No image URL:", JSON.stringify(data).substring(0, 300));
      return NextResponse.json(
        { error: "Tidak ada gambar yang dihasilkan." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, image: imageUrl });
  } catch (error) {
    console.error("[story-image] Route error:", error);
    const msg = error instanceof DOMException && error.name === "AbortError"
      ? "Timeout ilustrasi. Coba lagi."
      : "Gagal membuat ilustrasi.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}