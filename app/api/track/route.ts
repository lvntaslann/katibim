import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { createClient } from "@/utils/supabase/server";
import { getClientIp } from "@/lib/tracking/get-client-ip";
import { isRateLimited } from "@/lib/tracking/rate-limit";
import { resolveDevice, resolveGeo } from "@/lib/tracking/geo-device";
import { parseTrackPayload } from "@/lib/tracking/payload";

export const runtime = "nodejs"; // geoip-lite/ua-parser-js need fs access, not Edge-compatible

const MAX_BODY_BYTES = 2048;

async function readBodyWithinLimit(request: Request): Promise<{ body: string; tooLarge: boolean }> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) return { body: "", tooLarge: true };

  const reader = request.body?.getReader();
  if (!reader) return { body: "", tooLarge: false };

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { body: "", tooLarge: true };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { body: new TextDecoder().decode(body), tooLarge: false };
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new NextResponse(null, { status: 415 });
  }

  const { body: raw, tooLarge } = await readBodyWithinLimit(request);
  if (tooLarge) {
    return new NextResponse(null, { status: 413 });
  }

  let payload;
  try {
    payload = parseTrackPayload(JSON.parse(raw));
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const supabase = createServiceClient();

  if (payload.kind === "pageview") {
    // The service-role client bypasses RLS, so never accept an identity from
    // the request body. Resolve it from the signed Supabase auth cookie.
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    const geo = resolveGeo(ip);
    const device = resolveDevice(request.headers.get("user-agent"));

    const { data, error } = await supabase.rpc("track_pageview", {
      p_client_session_id: payload.client_session_id,
      p_anonymous_client_id: payload.anonymous_client_id,
      p_user_id: user?.id ?? null,
      p_path: payload.path,
      p_referrer: payload.referrer,
      p_country: geo.country,
      p_region: geo.region,
      p_city: geo.city,
      p_device_type: device.deviceType,
      p_browser: device.browser,
      p_os: device.os,
    });

    if (error) {
      console.error("track_pageview failed:", error.message);
      return new NextResponse(null, { status: 500 });
    }

    return NextResponse.json({ ok: true, eventId: data });
  }

  if (payload.kind === "duration") {
    const { error } = await supabase.rpc("track_patch_duration", {
      p_client_session_id: payload.client_session_id,
      p_event_id: payload.event_id,
      p_duration_sec: payload.duration_sec,
    });

    if (error) {
      console.error("track_patch_duration failed:", error.message);
      return new NextResponse(null, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  }

  // payload.kind === "event"
  const { error } = await supabase.rpc("track_custom_event", {
    p_client_session_id: payload.client_session_id,
    p_event_type: payload.event_type,
    p_metadata: payload.metadata ?? null,
  });

  if (error) {
    console.error("track_custom_event failed:", error.message);
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
