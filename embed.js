const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Missing ID");
  }

  const url = `https://luluvdoo.com/d/${id}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://lulustream.com/",
        "Origin": "https://lulustream.com",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1"
      }
    });

    const $ = cheerio.load(response.data);

    const iframe = $("iframe").first();
    const pageTitle = $("title").text().trim() || "LuluStream-Embeds-NoAds made by ScriptSRC.com";

    if (!iframe.length) {
      return res.status(404).send("The iframe was not found.");
    }

    iframe.attr("sandbox", "allow-same-origin allow-scripts");

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #000;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        ${$.html(iframe)}
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).send("Error processing URL.");
  }
};