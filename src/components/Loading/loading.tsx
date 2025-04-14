const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 border-solid"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
