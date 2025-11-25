import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // reset previous result
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      alert("Prediction failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-200 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🌾 Crop Disease Classifier
        </h1>

        {/* Upload Section */}
        <label
          htmlFor="fileInput"
          className="cursor-pointer border-2 border-dashed border-green-400 rounded-xl p-6 w-full block mb-4 hover:bg-green-50 transition"
        >
          {file ? (
            <p className="text-green-700 font-medium">{file.name}</p>
          ) : (
            <p className="text-gray-500">Click or drag an image here</p>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview Card */}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Selected Crop"
              className="rounded-xl shadow-lg w-full h-64 object-cover border border-green-200"
            />
          </div>
        )}

        {/* Predict Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {/* Result Card */}
        {result && (
          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
            <h2 className="text-lg font-semibold text-green-800">Prediction</h2>
            <p className="text-gray-700 mt-2">
              <span className="font-bold">Class:</span>{" "}
              {result.predicted_class}
            </p>
            <p className="text-gray-700">
              <span className="font-bold">Confidence:</span>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
