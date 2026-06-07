export default function EventsLoading() {
  return (
    <>
      <div className="mb-10 h-16 w-64 animate-pulse bg-gray-200" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-24 bg-gray-200" />
            <div className="h-8 w-3/4 bg-gray-200" />
            <div className="h-5 w-1/2 bg-gray-200" />
          </div>
          <hr className="my-20" />
        </div>
      ))}
    </>
  )
}
