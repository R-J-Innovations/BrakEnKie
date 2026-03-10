import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-yellow-100 shadow-md overflow-hidden">
          {/* Sky + field scene */}
          <div className="relative h-[340px]">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-50 dark:from-slate-900 dark:to-slate-950" />
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-emerald-400/80 to-emerald-300/20 dark:from-emerald-700/60 dark:to-emerald-700/10" />

            {/* Sun */}
            <div className="absolute right-10 top-10 h-16 w-16 rounded-full bg-yellow-300/80 blur-[1px] dark:bg-yellow-200/30" />

            {/* Clouds */}
            <div className="absolute left-10 top-16 h-10 w-28 rounded-full bg-white/70 blur-[0.5px] dark:bg-white/10" />
            <div className="absolute left-28 top-14 h-8 w-20 rounded-full bg-white/60 blur-[0.5px] dark:bg-white/10" />
            <div className="absolute left-52 top-20 h-9 w-24 rounded-full bg-white/65 blur-[0.5px] dark:bg-white/10" />

            {/* Running dog (simple silhouette) */}
            <div className="absolute bottom-[18%] left-[-120px] animate-[run_3.8s_linear_infinite]">
              <svg
                viewBox="0 0 220 120"
                width="220"
                height="120"
                aria-hidden="true"
                className="text-stone-900/80 dark:text-stone-100/70 drop-shadow"
              >
                {/* Body */}
                <ellipse cx="105" cy="58" rx="60" ry="26" fill="currentColor" />
                {/* Head */}
                <circle cx="172" cy="52" r="18" fill="currentColor" />
                {/* Ear */}
                <path
                  d="M178 34c-10 2-18-10-10-18 8 2 14 10 10 18Z"
                  fill="currentColor"
                />
                {/* Tail */}
                <path
                  d="M48 56c-18-6-26-20-18-30 14 4 24 18 18 30Z"
                  fill="currentColor"
                />
                {/* Legs (stylized) */}
                <path
                  d="M78 78 56 106c-3 4-1 9 4 9h14c3 0 6-2 7-5l9-26"
                  fill="currentColor"
                />
                <path
                  d="M110 80 92 112c-2 4 0 8 4 8h14c3 0 5-2 6-4l10-24"
                  fill="currentColor"
                />
                <path
                  d="M130 78 146 110c2 4 6 6 10 5l13-2c6-1 7-7 4-11l-20-26"
                  fill="currentColor"
                />
                <path
                  d="M96 78 120 106c3 4 8 5 12 2l10-7c4-3 4-9 1-12l-22-20"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <div className="p-10 text-center">
            <p className="text-sm tracking-widest uppercase opacity-70 mb-3">
              404 — Lost in the field
            </p>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              This page ran off!
            </h1>
            <p className="max-w-2xl mx-auto text-lg opacity-80 mb-8">
              The doggy took a sprint through the grass and we can’t find this
              page. Let’s get you back to the kennel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-yellow-500 rounded-lg text-black font-medium"
              >
                Go Home
              </Link>
              <Link
                href="/available"
                className="px-8 py-3 rounded-lg border font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                View Puppies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

