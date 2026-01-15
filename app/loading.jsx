export default function Loading() {
  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange animate-pulse"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange blur-lg opacity-50 animate-pulse"></div>
        </div>
        <div className="text-pb-text-muted text-sm">Loading...</div>
      </div>
    </div>
  );
}
