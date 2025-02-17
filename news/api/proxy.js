export default async function handler(req, res) {
    const API_KEY = process.env.news_api; // Get the API key from Vercel environment variable
    const query = req.query.q || 'gaming';  // Default to 'gaming' if no query is provided

    const URL = `https://gnews.io/api/v4/search?q=${query}&token=${API_KEY}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        res.status(200).json(data); // Send the response back to the frontend
    } catch (error) {
        res.status(500).json({ error: 'Error fetching news' });
    }
}
