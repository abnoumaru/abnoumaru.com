export async function onRequestGet(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID is not configured", { status: 500 });
  }

  const origin = new URL(context.request.url).origin;
  const redirectUri = `${origin}/api/callback`;

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo,user");
  authUrl.searchParams.set("state", crypto.randomUUID());

  return Response.redirect(authUrl.toString(), 302);
}
