
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read API key from .env file
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const keyMatch = envContent.match(/VITE_POLLINATIONS_API_KEY=(.+)/);
const KEY = keyMatch ? keyMatch[1].trim().replace(/^["']|["']$/g, '') : '';

if (!KEY) {
    console.error('VITE_POLLINATIONS_API_KEY not found in .env file');
    process.exit(1);
}

const PROMPT = "a simple red dress";

const urls = [
    `https://gen.pollinations.ai/image/${encodeURIComponent(PROMPT)}?width=800&height=1050&model=flux&seed=1000&enhance=true&nologo=true&safe=true&key=${KEY}`
];

function test(url) {
    return new Promise((resolve) => {
        console.log(`Testing: ${url}`);
        https.get(url, (res) => {
            console.log(`Status: ${res.statusCode}`);
            resolve();
        }).on('error', (err) => {
            console.log(`Error: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    for (const url of urls) {
        await test(url);
    }
}

run();
