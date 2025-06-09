# Spotify Clone

A modern Spotify clone built with Next.js 15, featuring authentication with the Spotify API and a sleek, responsive UI.

## Features

- **Authentication**: Sign in with your Spotify account
- **Browse**: Explore featured playlists, new releases, and categories
- **Search**: Find tracks, artists, albums, and playlists
- **Detailed Views**: View detailed information about tracks, artists, albums, and playlists
- **User Profile**: See your profile information and top artists
- **Audio Features**: View audio analysis for tracks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Authentication**: NextAuth.js with Spotify OAuth
- **API Integration**: Spotify Web API
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Spotify Developer Account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-clone.git
   cd spotify-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Spotify API Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Add `http://localhost:3000/api/auth/callback/spotify` as a redirect URI
4. Copy the Client ID and Client Secret to your `.env.local` file

## Project Structure

```
/src
  /app                   # Next.js app directory
    /api                 # API routes
    /dashboard           # Dashboard pages
    /auth                # Authentication pages
  /components            # React components
    /ui                  # UI components
    /layout              # Layout components
  /lib                   # Utility functions
    /spotify             # Spotify API functions
  /styles                # Global styles
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)
