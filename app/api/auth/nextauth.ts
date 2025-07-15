import NextAuth from 'next-auth';
import PatreonProvider from 'next-auth/providers/patreon';

const patreonClientId = process.env.PATREON_CLIENT_ID;
const patreonClientSecret = process.env.PATREON_CLIENT_SECRET;

if (!patreonClientId || !patreonClientSecret) {
  throw new Error('Missing required Patreon environment variables');
}

export default NextAuth({
  providers: [
    PatreonProvider({
      clientId: patreonClientId,
      clientSecret: patreonClientSecret,
      // It's recommended to request the necessary scopes
      authorization: {
        params: {
          scope: 'identity campaigns identity.memberships',
        },
      },
    }),
  ],
  // Add other NextAuth.js configurations as needed
});