"use client";
export default function MapPage() {
  return (
    <main className="min-h-screen p-4 bg-blue-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">🌍 Nearby Hospital Map</h1>
      <iframe
        title="Hospital Map"
        src="https://www.google.com/maps?q=hospitals+near+me&output=embed"
        className="w-full h-[80vh] rounded-xl border"
        allowFullScreen
        loading="lazy"
      />
    </main>
  );
}
