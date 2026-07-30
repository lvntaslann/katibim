import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getClientIp } from "@/lib/tracking/get-client-ip";
import { isRateLimited } from "@/lib/tracking/rate-limit";
import { resolveDevice, resolveGeo } from "@/lib/tracking/geo-device";
import { parseTrackPayload } from "@/lib/tracking/payload";

export const runtime = "nodejs"; // geoip-lite/ua-parser-js need fs access, not Edge-compatible

const MAX_BODY_BYTES = 2048;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (ip && isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
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
    const geo = resolveGeo(ip);
    const device = resolveDevice(request.headers.get("user-agent"));

    const { data, error } = await supabase.rpc("track_pageview", {
      p_client_session_id: payload.client_session_id,
      p_anonymous_client_id: payload.anonymous_client_id,
      p_user_id: payload.user_id,
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
