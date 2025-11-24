import { type FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex justify-center">
          <img src='icon_color.png' className='mr-2'/>Unexpected turbulence!
        </h2>
        <p className="mb-6 text-muted-foreground">
          We were unable to load the data
          <br />
          Please try again later
        </p>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded transition duration-200"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
