import NextAuth from "next-auth";
import PatreonProvider from "next-auth/providers/patreon";

// Enable Edge Runtime for Cloudflare Pages
export const runtime = "edge";

const patreonClientId = process.env.PATREON_CLIENT_ID;
const patreonClientSecret = process.env.PATREON_CLIENT_SECRET;

if (!patreonClientId || !patreonClientSecret) {
  throw new Error("Missing required Patreon environment variables");
}

const handler = NextAuth({
  providers: [
    PatreonProvider({
      clientId: patreonClientId,
      clientSecret: patreonClientSecret,
      // It's recommended to request the necessary scopes
      authorization: {
        params: {
          scope: "identity campaigns identity.memberships",
        },
      },
    }),
  ],
  // Add other NextAuth.js configurations as needed
});

export { handler as GET, handler as POST };
