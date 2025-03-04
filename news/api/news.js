export default async function handler(req, res) {
    const apiKey = process.env.NEWSKEY; // Stored in Vercel environment variables
    const URL = `https://gnews.io/api/v4/search?q=gaming&token=${apiKey}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Error fetching news");

        res.status(200).json(data); // Send response to frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
