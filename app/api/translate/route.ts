import { NextResponse } from 'next/server';

// A function to translate text using Google Translate API.
async function translateText(textArray) {
    const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY';
    const url = `https://translation.googleapis.com/language/translate/v2`;  

    const responses = await Promise.all( 
        textArray.map(async (text) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    target: 'en',
                    key: apiKey
                }),
            });
            // Handle response status
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error: ${error.error.message}`);
            }
            const data = await response.json();
            return data.data.translations[0].translatedText;
        })
    );
    return responses;
}

export async function POST(req) {
    try {
        const { texts } = await req.json();
        // Validate input
        if (!Array.isArray(texts) || !texts.length) {
            return NextResponse.json({ error: 'Invalid input: texts should be a non-empty array.' }, { status: 400 });
        }
        const translations = await translateText(texts);
        return NextResponse.json({ translations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
