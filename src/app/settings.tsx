"use client";
export default function SettingsPage() {
  return (
    <main className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <label className="block">Voice Mode: <input type="checkbox" /></label>
      <label className="block">Language: <select><option>English</option><option>Hindi</option></select></label>
      <label className="block">Notifications: <input type="checkbox" /></label>
    </main>
  );
}