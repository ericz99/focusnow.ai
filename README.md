# Focusnow.ai

Focusnow.ai is an AI-powered voice transcription service utilizing Whisper and Deepgram models. It allows users to transcribe their audio output into text and then employs GPT-4 to generate valid responses based on the transcriptions.

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

    Copy the sample `.env.sample` file in the root directory and place it into `.env`:


### Demo

1. Copilot Demo

<video src="./public/copilot-demo1.mp4" width="1000" height="1000" controls></video>

<video src="./public/copilot-demo.mp4" width="1000" height="1000" controls></video>

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

3. Open your browser and navigate to `http://localhost:3000/app/dashboard` to see the application in action.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.


