
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read API key from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envContent = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf-8');
const keyMatch = envContent.match(/VITE_POLLINATIONS_API_KEY=(.+)/);
const KEY = keyMatch ? keyMatch[1].trim().replace(/^["']|["']$/g, '') : '';

if (!KEY) {
    console.error('VITE_POLLINATIONS_API_KEY not found in .env file');
    process.exit(1);
}

const PROMPT = "a simple red dress";

const urls = [
    `https://image.pollinations.ai/prompt/${encodeURIComponent(PROMPT)}?width=800&height=1000&model=flux&seed=1000&enhance=true&nologo=true&safe=true`,
    `https://gen.pollinations.ai/image/${encodeURIComponent(PROMPT)}?width=800&height=1000&model=flux&seed=1000&enhance=true&nologo=true&key=${KEY}`,
    `https://pollinations.ai/p/${encodeURIComponent(PROMPT)}?width=800&height=1000&model=flux&seed=1000&enhance=true&nologo=true`
];

async function test() {
    for (const url of urls) {
        console.log(`Testing: ${url}`);
        try {
            const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
            console.log(`Success! Status: ${res.status}, Size: ${res.data.length} bytes`);
        } catch (err: any) {
            console.log(`Failed! Status: ${err.response?.status || 'Error'}, Message: ${err.message}`);
        }
    }
}

test();
