"use client";

export default function Home() {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        min-h-screen
        p-8
        pb-20
        gap-16
        sm:p-20
        font-[family-name:var(--font-geist-sans)]
        text-center
        bg-black
        relative
        overflow-hidden
      "
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-8 sm:p-12 border border-white/10 shadow-2xl transition-all duration-300 hover:bg-white/10">
        <h1
          className="
          text-4xl
          sm:text-6xl
          md:text-7xl
          font-bold
          bg-gradient-to-r
          from-white
          via-gray-200
          to-gray-400
          bg-clip-text
          text-transparent
          leading-tight
          tracking-tight
          mb-4
        "
        >
          Hello World
        </h1>

        <p
          className="
          text-base
          sm:text-lg
          text-gray-400
          font-light
          opacity-80
        "
        >
          Males ngodinf
        </p>
      </div>
    </div>
  );
}
