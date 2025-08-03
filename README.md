# Evently 🌃

Evently is a responsive web application that allows authenticated users to view events based on their tier (Free, Silver, Gold, Platinum). Users can only see events that are available to their tier or lower. Built with modern web technologies, Evently provides a clean and intuitive interface for browsing tier-based events.

## 🚀 Live Demo

- [LIVE LINK](https://evently-1gzk.vercel.app/)

## Features

- **Tier-Based Event Access**: Events are filtered based on the user's tier, ensuring restricted access to higher-tier events.
- **Authentication**: Secure user authentication via Clerk.dev.
- **Database**: Event data managed with Supabase (PostgreSQL).
- **Responsive UI**: Styled with Tailwind CSS for a seamless experience across devices.

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Authentication**: Clerk.dev
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS , ShadCN components

## Setup Instructions

### Prerequisites

- **Node.js**: Version 14 or higher. Download it from [nodejs.org](https://nodejs.org/).

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sourav0809/evently.git
   cd evently
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

   - **Clerk Keys**: Get your publishable and secret keys from the [Clerk dashboard](https://dashboard.clerk.dev/).
   - **Supabase Keys**: Find your URL and service role key in the [Supabase dashboard](https://app.supabase.com/).

4. **Start the Development Server**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:3000` to see the app in action.

## Demo User Credentials

Use these credentials to test the app with different tiers:

- **Free Tier**

  - Email: `pathaksourav231@gmail.com`
  - Password: `Demo@722160`

## Notes

- The event listing page is restricted to authenticated users only.
- Events are stored in a Supabase table named `events` with fields: `id`, `title`, `description`, `event_date`, `image_url`, and `tier`.
- The app filters events dynamically based on the user's tier, stored in Clerk metadata.
