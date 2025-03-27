const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-purple-100 text-center">
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
            onClick={() => (window.location.href = "/home")}
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

// import errorIcon from "/public/error.png";

// export default function ErrorPage() {
//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-b from-white to-purple-100 ">
//       <div className="relative text-center">
//         {/* Error Image */}
//         <img src={errorIcon} alt="404 Error" className="w-150 h-150 mx-auto" />

//         {/* Overlay Text */}
//         <div className="absolute gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center shadow-xl rounded-2xl bg-white mt-42  h-85 w-110 flex flex-col justify-center">
//           <h1 className="text-7xl font-bold text-[#461773]">404 Error</h1>
//           <p className="text-lg mt-2 text-gray-600">
//             The page you are looking for does not exist.
//           </p>
//           <button
//             href="/home"
//             className="mt-6 w-50 mx-30 items-center  bg-[#461773] text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
