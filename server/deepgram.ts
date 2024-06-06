import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

export default deepgram;
