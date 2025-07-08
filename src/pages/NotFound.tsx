import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100">
      <div className="max-w-2xl mx-4 p-8 bg-white rounded-2xl shadow-lg border border-cyan-200 transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-cyan-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-cyan-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-cyan-800 mb-4">404</h1>

          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Emergency! Page Not Found
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            The medical resource you're looking for isn't available.
            Our team has been alerted and is working to diagnose this issue.
          </p>

          <div className="mb-8 w-full">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-200">
                    Diagnostic Code
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-cyan-600">
                    404-{location.pathname.substring(1).replace(/\//g, '-') || 'root'}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-200">
                <div
                  style={{ width: "70%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 animate-pulse"
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-md transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Return to Home
            </a>

            <a
              href="/contact"
              className="px-6 py-3 border border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-medium rounded-lg shadow-sm transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Support
            </a>
          </div>

          <div className="mt-8 text-sm text-cyan-700">
            <p>If this is a medical emergency, please call your local emergency number immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;