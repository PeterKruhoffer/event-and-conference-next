export default function NodeLoading() {
  return (
    <article className="relative left-1/2 w-[calc(100vw-3rem)] max-w-6xl -translate-x-1/2 animate-pulse">
      <div className="mb-4 h-14 w-3/4 bg-gray-200 sm:h-16" />
      <div className="mb-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200" />
            <div className="h-5 w-40 bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="aspect-[48/25] w-full bg-gray-200" />
      <div className="mt-6 max-w-3xl space-y-3">
        <div className="h-5 w-full bg-gray-200" />
        <div className="h-5 w-11/12 bg-gray-200" />
        <div className="h-5 w-2/3 bg-gray-200" />
      </div>
    </article>
  )
}
