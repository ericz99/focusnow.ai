# Focusnow.ai

Focusnow.ai is an AI-powered voice transcription service utilizing Whisper and Deepgram models. It allows users to transcribe their audio output into text and then employs GPT-4 to generate valid responses based on the transcriptions.

## Dev Note

This is not a final finished stage product but a working MVP product that has all working functionality. 

## Features

- **Voice Transcription**: Convert audio files to text using state-of-the-art AI models Whisper and Deepgram.
- **Text Analysis**: Utilize GPT-4 to generate meaningful responses from the transcribed text.
- **User-Friendly Interface**: Built with Next.js and styled with TailwindCSS and Shadcn for a modern and responsive design.
- **Real-Time Interaction**: Implemented with Pusher for real-time updates.
- **Rate Limiting**: Upstash Ratelimit ensures fair usage and prevents abuse.
- **Analytics**: Integrated with PostHog for user analytics and behavior tracking.
- **File Handling**: Uploadthings is used for efficient file uploads and management.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **Next.js**: React framework for building the frontend.
- **Prisma**: ORM for database management.
- **TailwindCSS** & **Shadcn**: CSS frameworks for styling.
- **PostHog**: Analytics and event tracking.
- **Pusher**: Real-time event broadcasting.
- **Upstash Ratelimit**: Rate limiting middleware.
- **Uploadthings**: File upload management.

## Getting Started

### Prerequisites

- **Node.js** (v14.x or later)
- **npm** or **yarn**

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ericz99/focusnow.ai.git
    cd focusnow.ai
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. Set up environment variables:

    Copy the sample `.env.example` file in the root directory and place it into `.env`:


### Folder Structure

- `/app` where the main application lives in Next.js application
- `/components` all components for the application
- `/config` all configuration, such as stripe config
- `/core` basic llm and vectordb, but its not being used as of now because we're using ai/rsc from vercel
- `/extension` this was an experimental extension web audio api collector that I created, but right now its useless.
- `/lib` all logic from hooks, stores and other misc stuff
- `/model` this is mainly for voice activity detection using silero vad model
- `/prisma` where all your database migration and schemas will live in
- `/public` any assets
- `/scripts` scripts that you will need, not being used right now
- `/server` any backend classes that needs to be instantiated once

### Running the Application

1. Migrate the database schema:

    ```bash
    npx prisma migrate dev
    ```

2. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000/app/dashboard` to see the application in action. But you will need to login and create and account to see the application in action.

4. You must upload resume and/or cover letters, create an job application you're applying for, then create a new copilot session, and finally you can launch it.

5. After launching you will meet with an configuration page where you have to select a chrome tab to listen audio from, and this is important because you want to transcribe incoming audio data from that chrome tab, to get any response back from copilot.

6. After you selected, just click continue, then run start. To start or end session, click on respective buttons.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.


