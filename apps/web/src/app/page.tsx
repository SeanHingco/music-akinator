"use client";
import { useState } from "react";
import { AxisKey, QUESTIONS } from "@/lib/questions";

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

export default function Home() {
  // dev tools
  const [health, setHealth] = useState<string>("…");
  const [dev, setDev] = useState<boolean>(false);

  // state for questions and recommendations
  const [recCount, setRecCount] = useState<number | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [step, setStep] = useState(0);
  const initialAnswers = Object.fromEntries(
    QUESTIONS.map((q) => [q.axis, null]),
  ) as Record<AxisKey, number | null>;
  const [answers, setAnswers] =
    useState<Record<AxisKey, number | null>>(initialAnswers);

  const userAxes = {
    warm_bright: answers.warm_bright ?? 0,
    lofi_polished: answers.lofi_polished ?? 0,
    acoustic_electronic: answers.acoustic_electronic ?? 0,
    intimate_anthemic: answers.intimate_anthemic ?? 0,
  };

  // initialize question state based on step
  const total = QUESTIONS.length;
  const isLastStep = step === total - 1;
  const currentQ = QUESTIONS[step];
  const currentAxis = currentQ.axis;
  const selectedValue = answers[currentAxis];

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="relative max-w-xl w-full rounded-2xl shadow p-8 space-y-4">
        <div className="relative max-w-xl w-full rounded-2xl shadow p-8 space-y-4">
          <button
            type="button"
            className="absolute top-3 right-3 px-2 py-1 rounded-lg border text-xs disabled:opacity-50 hover:text-black transition hover:bg-gray-50 hover:cursor-pointer"
            onClick={() => setDev((d) => !d)}
            aria-expanded={dev}
            aria-controls="dev-panel"
            title="Toggle Dev Tools"
          >
            {"Dev"}
          </button>
        </div>
        {dev && (
          <div
            id="dev-panel"
            className="mt-1 rounded-sm p-3 bg-black-50 border space-y-1"
          >
            {/* Health button */}
            <button
              className="px-4 py-2 rounded-xl border hover:bg-gray-50 hover:text-black transition"
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
            <div>Health: {health}</div>
          </div>
        )}

        {/* Header */}
        <h1 className="text-3xl font-semibold">Music Akinator</h1>
        <>
          {/* Question prompts */}
          <div className="text-sm opacity-60">
            Question {step + 1} of {total}{" "}
          </div>
          <p className="text-lg">{currentQ.prompt}</p>
          <div className="flex gap-2 flex-wrap">
            {[-1, -0.5, 0, 0.5, 1].map((value) => (
              <button
                key={value}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [currentAxis]: value }))
                }
                className={[
                  "px-3 py-1 rounded-xl border transition",
                  selectedValue === value
                    ? "bg-black text-white border-green-300"
                    : "bg-white-30 hover:bg-gray-50 hover:text-black hover:cursor-pointer",
                ].join(" ")}
                aria-pressed={selectedValue === value}
              >
                {value > 0 ? `+${value}` : value}
              </button>
            ))}
          </div>
          <div className="text-sm opacity-70">
            Selected: {selectedValue ?? "_"}
          </div>
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <button
              type="button"
              className="mt-3 px-4 py-2 rounded-xl border disabled:opacity-50 hover:text-black transition hover:bg-gray-50 hover:cursor-pointer"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
            >
              Back
            </button>
            {/* Next Button or See Results Button */}
            {!isLastStep ? (
              <button
                type="button"
                className="mt-3 px-4 py-2 rounded-xl border disabled:opacity-50 hover:text-black transition hover:bg-gray-50 hover:cursor-pointer"
                disabled={selectedValue === null}
                onClick={() => setStep(Math.min(step + 1, total - 1))}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="mt-3 px-4 py-2 rounded-xl border disabled:opacity-50 hover:text-black transition hover:bg-gray-50 hover:cursor-pointer"
                disabled={selectedValue === null}
                onClick={async () => {
                  try {
                    const res = await fetch(
                      "http://localhost:8000/recommendations",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_axes: userAxes, limit: 3 }),
                      },
                    );
                    const data: RecResponse = await res.json();
                    setRecCount(data.results.length);
                    setTracks(data.results);
                  } catch (e) {
                    setRecCount(-1);
                  }
                }}
              >
                See Results
              </button>
            )}
          </div>
        </>

        {/* Button outputs */}
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
