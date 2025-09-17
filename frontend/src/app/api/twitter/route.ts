import { NextRequest, NextResponse } from "next/server";

const TWITTER_API = "https://api.twitter.com/2";

type CacheEntry = { payload: unknown; ts: number };
const cache: Record<string, CacheEntry> = {};
const lastCall: Record<string, number> = {};
const DEFAULT_TTL_MS = 300_000; // 5 minutes
const MIN_INTERVAL_MS = 10_000; // throttle upstream per handle

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle") || "KoladeOlukoya";
  const maxResults = Number(req.nextUrl.searchParams.get("limit") || 5);
  const ttl = Number(req.nextUrl.searchParams.get("ttl") || DEFAULT_TTL_MS);

  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing TWITTER_BEARER_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const key = `${handle}:${Math.min(Math.max(maxResults, 1), 10)}`;
    const now = Date.now();
    const cached = cache[key];
    const last = lastCall[handle] || 0;
    if (cached && now - cached.ts < ttl) {
      return NextResponse.json(cached.payload, {
        status: 200,
        headers: {
          "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
        },
      });
    }
    if (now - last < MIN_INTERVAL_MS && cached) {
      return NextResponse.json(cached.payload, {
        status: 200,
        headers: {
          "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
        },
      });
    }
    lastCall[handle] = now;
    // 1) Lookup user by username
    const userRes = await fetch(
      `${TWITTER_API}/users/by/username/${encodeURIComponent(
        handle
      )}?user.fields=id,username,name,profile_image_url`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!userRes.ok) {
      const text = await userRes.text();
      if (userRes.status === 429 && cached) {
        return NextResponse.json(cached.payload, {
          status: 200,
          headers: {
            "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
            "X-Notice": "Twitter 429 - served cached",
          },
        });
      }
      return NextResponse.json(
        { user: null, data: [], error: `User lookup failed: ${text}` },
        { status: 200, headers: { "X-Notice": `Upstream ${userRes.status}` } }
      );
    }
    const user = await userRes.json();
    const userId = user?.data?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2) Get recent tweets
    const tweetsRes = await fetch(
      `${TWITTER_API}/users/${userId}/tweets?max_results=${Math.min(
        Math.max(maxResults, 1),
        10
      )}&tweet.fields=created_at,public_metrics&expansions=attachments.media_keys,author_id&media.fields=url,preview_image_url,width,height`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!tweetsRes.ok) {
      const text = await tweetsRes.text();
      if (tweetsRes.status === 429 && cached) {
        return NextResponse.json(cached.payload, {
          status: 200,
          headers: {
            "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
            "X-Notice": "Twitter 429 - served cached",
          },
        });
      }
      // Fallback to recent search by handle (different rate bucket)
      const searchUrl = `${TWITTER_API}/tweets/search/recent?query=${encodeURIComponent(
        `from:${handle} -is:retweet -is:reply`
      )}&max_results=${Math.min(
        Math.max(maxResults, 1),
        10
      )}&tweet.fields=created_at,public_metrics`;
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const payload = { user: user.data, ...searchData };
        cache[key] = { payload, ts: now };
        return NextResponse.json(payload, {
          status: 200,
          headers: {
            "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
          },
        });
      }
      return NextResponse.json(
        { user: null, data: [], error: `Tweets fetch failed: ${text}` },
        { status: 200, headers: { "X-Notice": `Upstream ${tweetsRes.status}` } }
      );
    }
    const data = await tweetsRes.json();

    const payload = { user: user.data, ...data };
    cache[key] = { payload, ts: now };
    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}` },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
