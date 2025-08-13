"use client";
import { useState } from "react";

type AxisVector = {
  warm_bright: number;
  lofi_polished: number;
  acoustic_electronic: number;
  intimate_anthemic: number;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  axes: AxisVector;
  score: number;
};

type RecResponse = { results: Track[] };

const userAxes = {
  warm_bright: 0.1,
  lofi_polished: 0.0,
  acoustic_electronic: 0.2,
  intimate_anthemic: -0.1,
};

export default function Home() {
  const [health, setHealth] = useState<string>("…");
  const [recCount, setRecCount] = useState<number | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl w-full rounded-2xl shadow p-8 space-y-4">
        {/* Header */}
        <h1 className="text-3xl font-semibold">Music Akinator</h1>
        {/* Health button */}
        <button
          className="px-4 py-2 rounded-xl border"
          onClick={async () => {
            try {
              const res = await fetch("http://localhost:8000/health");
              const j = await res.json();
              setHealth(j.status ?? "unknown");
            } catch {
              setHealth("error");
            }
          }}
        >
          Ping API
        </button>
        {/* Recs button */}
        <button
          className="px-4 py-2 rounded-xl border"
          onClick={async () => {
            try {
              const res = await fetch("http://localhost:8000/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_axes: userAxes, limit: 3 }),
              });
              const data = await res.json() as RecResponse;
              setRecCount(data.results.length);
              setTracks(data.results);
            } catch (e) {
              setRecCount(-1);
            }
          }}
        >
          Get recommendations
        </button>
        {/* Button outputs */}
        <div>Health: {health}</div>
        <div>Recs: {recCount ?? "…"}</div>
        <ul className="divide-y mt-2">
          {tracks.map((t) => (
            <li key={t.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm opacity-70">{t.artist}</div>
              </div>
              <div className="text-sm opacity-70">{t.score.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}