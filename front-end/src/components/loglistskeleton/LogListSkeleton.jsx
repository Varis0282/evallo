const LogListSkeleton = ({ count = 3 }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>

            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="px-6 py-4 border-b border-gray-100 border-l-4 border-l-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>

                    <div className="mb-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LogListSkeleton;
