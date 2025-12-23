import { type NextRequest } from "next/server";

import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {

const targetUrl = 'http://example.com';

try{
    const response = await fetch(targetUrl);

    if (!response.ok){
        throw new Error('Failed to fetch page: ${response.statusText}');
    }


const htmlString = await response.text();

const $ = cheerio.load(htmlString);

const title = $('h1').text();

return Response.json({ title: title});


}
catch(error){
    console.error(error);

    if (error instanceof Error){
        return Response.json(
            { message: 'error scraping page', error: error.message },
            { status: 500 }
        );
    }

    return Response.json(
        { message: 'an unknown error occurred' },
        { status: 500 }
    );
}
}