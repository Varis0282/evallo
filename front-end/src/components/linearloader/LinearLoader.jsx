const LinearLoader = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-2 bg-gray-200">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          style={{
            animation: 'shimmer 1.5s infinite linear'
          }}
        ></div>
      </div>
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  )
}

export default LinearLoader 