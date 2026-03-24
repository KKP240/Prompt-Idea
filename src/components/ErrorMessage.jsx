export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-xl">
      <h3 className="text-red-700">Error Occured</h3>
      <p className="text-red-600 font-light">{message}</p>
    </div>
  );
}
