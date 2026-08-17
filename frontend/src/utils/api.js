// Vite exposes only variables that start with VITE_.  Locally, this falls
// back to FastAPI's default address; on Vercel set VITE_API_URL to the
// public Render URL, followed by /api.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const solveSwimProblem = async (grid) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(`${API_URL}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Serveri u përgjigj me status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Gabim gjatë komunikimit me backend-in:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};
