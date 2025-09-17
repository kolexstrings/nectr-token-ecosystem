import { NextRequest, NextResponse } from "next/server";

const TWITTER_API = "https://api.twitter.com/2";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle") || "KoladeOlukoya";
  const maxResults = Number(req.nextUrl.searchParams.get("limit") || 5);

  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing TWITTER_BEARER_TOKEN" },
      { status: 500 }
    );
  }

  try {
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
      return NextResponse.json(
        { error: `User lookup failed: ${text}` },
        { status: userRes.status }
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
      return NextResponse.json(
        { error: `Tweets fetch failed: ${text}` },
        { status: tweetsRes.status }
      );
    }
    const data = await tweetsRes.json();

    return NextResponse.json({ user: user.data, ...data }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
