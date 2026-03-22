export function ProductCardSkeleton() {
  return (
    <div className="group glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
        <div className="w-full h-full bg-white/10 rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Brand */}
        <div className="h-3 bg-white/10 rounded w-24" />

        {/* Name */}
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </div>

        {/* Rating */}
        <div className="h-3 bg-white/10 rounded w-32" />

        {/* Price */}
        <div className="h-5 bg-white/10 rounded w-40" />

        {/* Install badge */}
        <div className="h-3 bg-white/10 rounded w-48" />

        {/* Button */}
        <div className="h-11 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}
