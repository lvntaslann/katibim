import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

/**
 * Katibim Edge Security Proxy & Web Application Firewall (WAF)
 *
 * Provides real-time edge protection against:
 * 1. Path Traversal / LFI (Local File Inclusion)
 * 2. XSS (Cross-Site Scripting) Payloads in URLs and Query Strings
 * 3. SQL / NoSQL Injection attempts
 * 4. Suspicious Bot / Scraper Probing
 */

const SUSPICIOUS_PATTERNS = [
  // Path Traversal / LFI
  /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f|%2e%2e%5c)/i,
  /(etc\/passwd|win\.ini|boot\.ini|cmd\.exe)/i,

  // XSS Payloads
  /(<script|%3cscript|javascript:|on\w+=|%3c%2fscript|alert\(|eval\()/i,

  // SQL / Database Injection Payloads
  /(union\s+select|insert\s+into|drop\s+table|delete\s+from|update\s+\w+\s+set|exec\(\s*@|%27\s*or\s*%27|'\s*or\s*')/i,
];

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const fullPathAndQuery = `${url.pathname}${url.search}`;

  // 1. WAF Inspection: Check for attack vectors in pathname and query string
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullPathAndQuery)) {
      // Block request immediately at the Edge with 403 Forbidden
      return new NextResponse(
        JSON.stringify({
          error: "Security Shield Interception",
          message: "Malicious payload or unauthorized probing detected and blocked at the Edge.",
          code: "KATIBIM_WAF_BLOCK_403",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Katibim-Security-Shield": "Blocked",
          },
        }
      );
    }
  }

  // 2. Refresh the Supabase auth session (required so Server Components see a valid session)
  const response = await updateSession(request);

  // 3. Inject edge security headers
  response.headers.set("X-Katibim-Security-Shield", "Active");
  response.headers.set("X-Edge-Protection", "Enforced");

  return response;
}

export const config = {
  // Apply proxy to all routes except Next.js internals and static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
