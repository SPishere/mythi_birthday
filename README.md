This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Mythi's Birthday Website

This is a fun and interactive birthday website for Mythi with real-time message board and cake clicking game.

## Google Sheets Integration

This application uses Google Sheets as a database to store messages and cake clicks, making it:
- Reliable for data persistence
- Accessible from anywhere
- Real-time with multiple users
- Independent of the hosting environment's file system

## Setup Instructions

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "MythiBirthday" (or any name you prefer)
3. Set up the sheet with the following structure:
   - Cell A1: "Messages" (header)
   - Cell B1: "CakeClicks" (header)
   - Cell B2: "0" (initial cake click count)

### 2. Set up Google Cloud API Access

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API for your project
4. Create API credentials (API Key) with access to Google Sheets API
5. Restrict the API key to only allow Google Sheets API calls (for security)

### 3. Configure the Application

1. Open `/src/app/api/sheet/route.ts`
2. Replace these values with your actual values:
   ```typescript
   const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID'; // From your Google Sheet URL
   const API_KEY = 'REPLACE_WITH_YOUR_API_KEY'; // From Google Cloud Console
   ```

3. Make sure your Google Sheet is accessible (public or shared appropriately)

### 4. Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
