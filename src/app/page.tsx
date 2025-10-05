import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Link
        href="/nkl-2068"
        className="text-center cursor-pointer hover:opacity-80 transition-opacity"
      >
        <h1
          className="text-white leading-none"
          style={{
            fontFamily: 'var(--font-creepster)',
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
          }}
        >
          MURHA-
          <br />
          KAVERIT
        </h1>
      </Link>
    </div>
  );
}
