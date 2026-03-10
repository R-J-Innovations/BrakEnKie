export default function ShopPage() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8 text-[var(--accent)]">Shop</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <p className="opacity-45 text-base font-light">BrakEnKie merchandise and accessories.</p>
      </div>

      {/* Coming Soon focal point */}
      <div className="flex items-center justify-center py-24">
        <div className="text-center bg-[var(--card)] border border-[var(--accent)]/15 px-16 py-20 max-w-lg w-full">
          <div className="h-px w-12 bg-[var(--accent)]/40 mx-auto mb-10" />
          <p className="text-5xl md:text-6xl font-serif font-light tracking-wide text-[var(--accent)]">
            Coming Soon<span className="animate-pulse">...</span>
          </p>
          <div className="h-px w-12 bg-[var(--accent)]/40 mx-auto mt-10" />
        </div>
      </div>

    </main>
  );
}
