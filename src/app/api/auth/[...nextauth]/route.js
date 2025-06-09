import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";

const scopes = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "user-top-read",
  "user-read-recently-played",
  "user-follow-read",
].join(" ");

const providers = [
  SpotifyProvider({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    authorization: {
      params: { scope: scopes },
    },
  }),
];

// Add credentials provider for development mode
if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Return mock user data for development
        return {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@example.com",
          image: "https://i.scdn.co/image/ab6775700000ee85d3ef5008b3a397e7ac4f3c54",
          accessToken: "mock-access-token",
        };
      },
    })
  );
}

const handler = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.user.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST }; 