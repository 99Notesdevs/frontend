const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[var(--primary)] border-solid"></div>
        <p className="mt-4 text-[var(--text-tertiary)] text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
