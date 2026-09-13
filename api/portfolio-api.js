export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyipFgAjiMuZr2Oy3RjTBpcjDe7dz9NhlSRo0kS1CW_rbD0AI1v4cKz8v6g5Q2b4tcsgg/exec",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const text = await response.text();

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}