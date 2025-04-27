const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#6e24b715] text-center">
      <div className="flex flex-col items-center p-13 bg-white shadow-xl rounded-2xl border border-gray-200 gap-2">
        <h1 className="text-9xl font-bold text-[#461773]">404</h1>
        <p className="text-2xl text-gray-700 mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 text-m mt-2">
          It might have been moved or deleted.
        </p>

        <div className="mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer px-6 py-3 bg-[#461773] text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
          >
            Go Home
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 text-gray-400 text-sm">
        <p>
          Need help?{" "}
          <a href="/contact" className="text-[#461773] underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
