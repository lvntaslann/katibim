import "server-only";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export type DeviceType = "desktop" | "mobile" | "tablet" | "other";

export function resolveGeo(ip: string | null) {
  const hit = ip ? geoip.lookup(ip) : null;
  return {
    country: hit?.country || null,
    region: hit?.region || null,
    city: hit?.city || null,
  };
}

export function resolveDevice(userAgent: string | null) {
  const { device, browser, os } = new UAParser(userAgent ?? "").getResult();
  const deviceType: DeviceType =
    device.type === "mobile" ? "mobile" : device.type === "tablet" ? "tablet" : device.type ? "other" : "desktop";
  return {
    deviceType,
    browser: browser.name || null,
    os: os.name || null,
  };
}
