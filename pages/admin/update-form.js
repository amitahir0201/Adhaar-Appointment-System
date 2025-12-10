// pages/admin/update-form.jsx
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

// Helper to title-case keys (e.g., "fullName" -> "Full Name")
function prettyLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/(^|\s)\w/g, (m) => m.toUpperCase());
}

export default function UpdateForm() {
  const router = useRouter();
  const { formId: queryFormId } = router.query;

  // State
  const [searchId, setSearchId] = useState("");
  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const controllerRef = useRef(null);
  const initialRef = useRef(null);

  // Sync query param to state
  useEffect(() => {
    if (queryFormId) setFormId(queryFormId);
  }, [queryFormId]);

  // Fetch Data
  useEffect(() => {
    if (!formId) return;

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    (async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch from real API
        const res = await fetch(`/api/admin/getAppointmentById?id=${formId}`, {
          signal: controllerRef.current.signal,
        });

        if (!res.ok) {
          throw new Error("Appointment not found");
        }

        const data = await res.json();
        console.log("Fetched appointment data:", data);
        const { _id, ...filtered } = data.appointment || {};
        setFormData(filtered);
        setUpdatedData(filtered);
        initialRef.current = JSON.stringify(filtered);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controllerRef.current?.abort();
  }, [formId]);

  // Toast Timer
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((p) => ({ ...p, [name]: value }));
  };

  const isDirty = () => JSON.stringify(updatedData) !== initialRef.current;

  const handleSaveClick = () => {
    if (!isDirty()) return setToast("No changes detected.");
    setShowConfirmSave(true);
  };

  const doSave = async () => {
    setSaving(true);
    setShowConfirmSave(false);

    // Optimistic Update
    const previous = formData;
    setFormData(updatedData);
    setIsEditing(false);

    try {
      // POST to update API
      console.log(
        "Sending update request with id:",
        formId,
        "data:",
        updatedData
      );
      const res = await fetch(`/api/admin/updateAppointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formId, ...updatedData }),
      });

      const responseData = await res.json();
      console.log("Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save changes");
      }

      setToast("Application Updated Successfully!");
      initialRef.current = JSON.stringify(updatedData);
    } catch (err) {
      console.error("Save error:", err);
      setFormData(previous); // Rollback
      setUpdatedData(previous);
      setToast(err.message || "Save Failed!");
      setIsEditing(true);
    } finally {
      setSaving(false);
    }
  };

  // Manual Search Handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      router.push(`/admin/update-form?formId=${searchId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Shared Header */}
      <AdminHeader />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Title */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Verify Application
              </h1>
              <p className="text-sm text-gray-500">
                View and edit applicant details.
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push("/admin/admin_dashboard")}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition shadow-sm text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* 2. State: No Form ID (Search Mode) */}
          {!formId && (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-lg mx-auto mt-10">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Enter Application ID
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Enter a Form ID to fetch and verify details manually.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FORM-1005"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 rounded font-medium hover:bg-blue-700 transition"
                >
                  Fetch
                </button>
              </form>
            </div>
          )}

          {/* 3. State: Loading / Error */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Fetching Details...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200 text-center my-6">
              {error}
            </div>
          )}

          {/* 4. State: Form Data Loaded */}
          {formData && !loading && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Application ID
                  </span>
                  <div className="text-lg font-mono font-bold text-blue-900">
                    {formId}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isEditing) {
                      setUpdatedData(formData); // Cancel
                      setIsEditing(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    isEditing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {isEditing ? "Cancel Editing" : "Edit Details"}
                </button>
              </div>

              {/* Fields Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => {
                  const isLocked =
                    key === "appointmentDate" ||
                    key === "appointmentSlot" ||
                    key === "status" ||
                    key === "createdAt" ||
                    key === "_id";

                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {prettyLabel(key)}
                      </label>

                      {isEditing && !isLocked ? (
                        <input
                          name={key}
                          value={updatedData[key] || ""}
                          onChange={handleChange}
                          className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                        />
                      ) : (
                        <div
                          className={`p-2.5 rounded border border-transparent ${
                            isEditing && isLocked
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-gray-50 text-gray-800"
                          }`}
                        >
                          {value || "-"}
                          {isEditing && isLocked && (
                            <span className="ml-2 text-[10px] text-gray-400">
                              (Locked)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              {isEditing && (
                <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100 flex justify-between items-center animate-fade-in-up">
                  <div className="text-sm text-yellow-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {isDirty()
                      ? "You have unsaved changes."
                      : "No changes made yet."}
                  </div>
                  <button
                    onClick={handleSaveClick}
                    disabled={saving || !isDirty()}
                    className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AdminFooter />

      {/* Confirmation Modal */}
      {showConfirmSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Save Changes?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              This will update the applicant's record permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmSave(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={doSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce-in">
          {toast}
        </div>
      )}
    </div>
  );
}
