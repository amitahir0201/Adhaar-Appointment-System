// pages/admin/update-form.jsx
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Verify / Update Form - Structure only
 * - Loads a single form by formId (replace fetchForm/updateForm with real API)
 * - Edit fields (except date/slot) and save optimistically
 */

async function fetchForm(formId) {
  // Replace with GET /api/getAppointment?formId=...
  await new Promise((r) => setTimeout(r, 250));
  return {
    formId,
    fullName: "Example User",
    date: "2025-01-01",
    slot: "Morning",
    phone: "9999999999",
    address: "Somewhere",
    status: "pending",
  };
}
async function updateFormApi(payload) {
  // Replace with POST /api/updateAppointment
  await new Promise((r) => setTimeout(r, 300));
  return { ok: true, updated: payload };
}

export default function VerifyForm() {
  const router = useRouter();
  const { formId } = router.query;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const initialRef = useRef(null);

  useEffect(() => {
    if (!formId) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchForm(formId);
        if (!active) return;
        setForm(data);
        setDraft(data);
        initialRef.current = JSON.stringify(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => (active = false);
  }, [formId]);

  function isDirty() {
    return JSON.stringify(draft) !== initialRef.current;
  }

  function setField(name, value) {
    setDraft((p) => ({ ...p, [name]: value }));
  }

  async function save() {
    if (!isDirty()) {
      setEditing(false);
      setToast("No changes");
      return;
    }
    setSaving(true);
    const backup = form;
    setForm(draft); // optimistic
    try {
      const res = await updateFormApi({ formId, ...draft });
      if (!res?.ok) throw new Error("Save failed");
      initialRef.current = JSON.stringify(draft);
      setEditing(false);
      setToast("Saved");
      // if server returns canonical, merge it:
      if (res.updated) {
        setForm(res.updated);
        setDraft(res.updated);
      }
    } catch (err) {
      console.error(err);
      setForm(backup); // rollback
      setDraft(backup);
      setToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  // warn on unload
  useEffect(() => {
    const handler = (e) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draft]);

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (!form) return <div className="p-6 text-center text-gray-500">No form selected</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Verify Application</h1>
            <div className="text-sm text-gray-600">Form ID: <span className="font-mono">{formId}</span></div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/admin_dashboard"><a className="px-3 py-1 border rounded">Back</a></Link>
            <button onClick={() => setEditing((v) => !v)} className="px-3 py-1 bg-yellow-500 text-white rounded">
              {editing ? "Editing" : "Edit"}
            </button>
          </div>
        </header>

        <div className="bg-white p-4 rounded shadow">
          <div className="space-y-3">
            {Object.entries(form).map(([k, v]) => {
              if (k === "formId") return null;
              const locked = k === "date" || k === "slot";
              return (
                <div key={k} className="flex md:items-center gap-4 border p-3 rounded">
                  <div className="w-1/3 text-sm text-gray-600">{k.replace(/_/g, " ").replace(/\b\w/g, (m)=>m.toUpperCase())}</div>
                  <div className="flex-1">
                    {editing ? (
                      locked ? (
                        <div className="p-2 bg-gray-50 rounded">{String(v)}</div>
                      ) : (
                        <input value={draft[k] ?? ""} onChange={(e) => setField(k, e.target.value)} className="w-full border p-2 rounded" />
                      )
                    ) : (
                      <div className="text-gray-800">{String(v ?? "-")}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">{isDirty() ? "Unsaved changes" : "All changes saved"}</div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => { setDraft(form); setEditing(false); setToast("Discarded"); }} className="px-3 py-1 border rounded">Cancel</button>
                  <button onClick={save} disabled={saving} className="px-3 py-1 bg-green-600 text-white rounded">{saving ? "Saving..." : "Save"}</button>
                </>
              ) : (
                <button onClick={() => router.push("/admin/admin_dashboard")} className="px-3 py-1 bg-blue-600 text-white rounded">Done</button>
              )}
            </div>
          </div>
        </div>

        {toast && <div className="fixed right-6 bottom-6 bg-gray-900 text-white px-4 py-2 rounded">{toast}</div>}
      </div>
    </div>
  );
}
