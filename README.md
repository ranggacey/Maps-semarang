# Spotify Clone

A modern Spotify clone built with Next.js 15 and the Spotify Web API.

## Features

- User authentication with Spotify OAuth
- Browse music categories, playlists, albums, and artists
- Search for tracks, artists, albums, and playlists
- View detailed information for tracks, artists, albums, and playlists
- Responsive design that works on mobile and desktop
- Player controls with volume adjustment and track progress

## Technologies Used

- Next.js 15
- NextAuth.js for authentication
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Spotify Developer account

### Setting up Spotify Developer Account

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Create a new application
4. Note your Client ID and Client Secret
5. Add the following Redirect URIs in your Spotify App settings:
   - For development: `http://localhost:3000/api/auth/callback/spotify`, `http://localhost:3001/api/auth/callback/spotify`, `http://localhost:3002/api/auth/callback/spotify`, `http://localhost:3003/api/auth/callback/spotify`
   - For production: `https://maps-semarang.vercel.app/api/auth/callback/spotify`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-clone.git
   cd spotify-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_URL=http://localhost:3000  # Use https://maps-semarang.vercel.app for production
   NEXTAUTH_SECRET=your_random_string_for_jwt_encryption
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Mode

This application includes a demo mode that allows you to explore the UI without needing to authenticate with Spotify. In development mode, you'll see a "Use Demo Account" button on the login page.

## Deployment

The application is deployed at [https://maps-semarang.vercel.app](https://maps-semarang.vercel.app).

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)
