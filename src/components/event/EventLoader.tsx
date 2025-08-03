export function EventLoader() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-[22rem] cursor-pointer w-full"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200" />

          <div className="p-4 flex flex-col justify-between flex-grow gap-3">
            {/* Title skeleton */}
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            {/* Description skeleton lines */}
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />

            {/* Footer section */}
            <div className="flex justify-between items-center mt-auto">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
