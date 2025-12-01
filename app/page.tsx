/****
 * Root page - layout.tsx handles all routing.
 * This page should never be rendered as layout routes to /register, /auth, or /dashboard.
 */
export default function Home() {
  return (
    <div className="text-center text-white text-3xl mt-20">
      SAGE Onboarding UI is alive ⚡️
    </div>
  );
}
