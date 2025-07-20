"use client";
import { useEffect, useState } from "react";
import { api } from "@/config/api/route";
import { toast, Toaster } from "react-hot-toast";
import { Save, Lock, Unlock, AlertCircle, CheckCircle2 } from "lucide-react";

// Custom toast notification
const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    duration: 3000,
    icon: <CheckCircle2 className="text-green-500 text-xl" />,
    className: "bg-white border border-green-200 shadow-lg rounded-lg",
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    duration: 3000,
    icon: <AlertCircle className="text-red-500 text-xl" />,
    className: "bg-white border border-red-200 shadow-lg rounded-lg",
  });
};

export default function AdminPermissions() {
  const [isContentLocked, setIsContentLocked] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState({
    content: false,
    header: false,
    footer: false,
    practice: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [headerScript, setHeaderScript] = useState<string>("");
  const [footerScript, setFooterScript] = useState<string>("");
  const [practiceQuestions, setPracticeQuestions] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchAdminOps = async () => {
    try {
      const response = (await api.get(`/admin/ops`)) as {
        success: boolean;
        data: any;
      };
      if (response.success) {
        const data = response.data;
        setIsContentLocked(data.globalRestrictions);
        setHeaderScript(data.globalHeadScripts?.join("\n") || "");
        setFooterScript(data.globalBodyScripts?.join("\n") || "");
        setPracticeQuestions(data.practiceQuestions);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error fetching admin ops:", error);
    }
  };

  useEffect(() => {
    fetchAdminOps();
  }, []);

  const toggleGlobalRestrictions = async () => {
    setIsSaving((prev) => ({ ...prev, content: true }));
    setError(null);
    try {
      const response = (await api.put(`/admin/ops`, {
        globalRestrictions: !isContentLocked,
      })) as { success: boolean };
      if (response.success) {
        const newState = !isContentLocked;
        setIsContentLocked(newState);
        showSuccessToast(
          newState
            ? "Content locked successfully"
            : "Content unlocked successfully"
        );
      } else {
        throw new Error("Failed to update restrictions");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSaving((prev) => ({ ...prev, content: false }));
    }
  };

  const updateHeaderScripts = async () => {
    setIsSaving((prev) => ({ ...prev, header: true }));
    setError(null);
    try {
      const response = (await api.put(`/admin/ops`, {
        globalHeadScripts: headerScript
          .split("\n")
          .filter((script) => script.trim()),
      })) as { success: boolean };
      if (response.success) {
        const ops = (await api.get(`/admin/ops`)) as {
          success: boolean;
          data: any;
        };
        if (ops.success) {
          setHeaderScript(ops.data.globalHeadScripts?.join("\n") || "");
          showSuccessToast("Header scripts updated successfully");
        }
      } else {
        throw new Error("Failed to update header scripts");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSaving((prev) => ({ ...prev, header: false }));
    }
  };

  const updateFooterScripts = async () => {
    setIsSaving((prev) => ({ ...prev, footer: true }));
    setError(null);
    try {
      const response = (await api.put(`/admin/ops`, {
        globalBodyScripts: footerScript
          .split("\n")
          .filter((script) => script.trim()),
      })) as { success: boolean };
      if (response.success) {
        const ops = (await api.get(`/admin/ops`)) as {
          success: boolean;
          data: any;
        };
        if (ops.success) {
          setFooterScript(ops.data.globalBodyScripts?.join("\n") || "");
          showSuccessToast("Footer scripts updated successfully");
        }
      } else {
        throw new Error("Failed to update footer scripts");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSaving((prev) => ({ ...prev, footer: false }));
    }
  };

  const updatePracticeQuestions = async () => {
    setIsSaving((prev) => ({ ...prev, practice: true }));
    setError(null);
    try {
      const response = (await api.put(`/admin/ops`, {
        practiceQuestions: practiceQuestions,
      })) as { success: boolean };
      if (response.success) {
        const ops = (await api.get(`/admin/ops`)) as {
          success: boolean;
          data: any;
        };
        if (ops.success) {
          setPracticeQuestions(ops.data.practiceQuestions);
          showSuccessToast("Practice questions limit updated successfully");
        }
      } else {
        throw new Error("Failed to update practice questions");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSaving((prev) => ({ ...prev, practice: false }));
    }
  };

  // Check if all data is loaded
  if (!isInitialized && isContentLocked === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Toaster />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Permissions</h1>
        <p className="text-gray-600 mt-2">Manage global settings and scripts</p>
      </div>

      {/* Content Lock Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Content Restrictions
            </h2>
            <p className="text-gray-600">
              Control global access to the content
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isContentLocked
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isContentLocked ? "Locked" : "Unlocked"}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={toggleGlobalRestrictions}
            disabled={isSaving.content}
            className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isSaving.content
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isContentLocked
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSaving.content ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {isContentLocked ? (
                  <Unlock className="w-4 h-4 mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                {isContentLocked ? "Unlock Content" : "Lock Content"}
              </>
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            {isContentLocked
              ? "Content is currently locked and not accessible to users."
              : "Content is currently accessible to all users."}
          </p>
        </div>
      </div>

      {/* Header Scripts Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Global Header Scripts
        </h2>
        <p className="text-gray-600 mb-4">
          Add scripts that will be injected into the &lt;head&gt; section of
          every page
        </p>

        <div className="mb-4">
          <label
            htmlFor="header-scripts"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Scripts (one per line)
          </label>
          <textarea
            id="header-scripts"
            value={headerScript}
            onChange={(e) => setHeaderScript(e.target.value)}
            placeholder="<script>console.log('Header script')</script>"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-mono text-sm"
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={updateHeaderScripts}
            disabled={isSaving.header}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving.header ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving.header ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Header Scripts
              </>
            )}
          </button>
          <span className="ml-3 text-sm text-gray-500">
            {headerScript.split("\n").filter(Boolean).length} script(s)
            configured
          </span>
        </div>
      </div>

      {/* Footer Scripts Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Global Footer Scripts
        </h2>
        <p className="text-gray-600 mb-4">
          Add scripts that will be injected just before the closing
          &lt;/body&gt; tag
        </p>

        <div className="mb-4">
          <label
            htmlFor="footer-scripts"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Scripts (one per line)
          </label>
          <textarea
            id="footer-scripts"
            value={footerScript}
            onChange={(e) => setFooterScript(e.target.value)}
            placeholder="<script>console.log('Footer script')</script>"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-mono text-sm"
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={updateFooterScripts}
            disabled={isSaving.footer}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving.footer ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving.footer ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Footer Scripts
              </>
            )}
          </button>
          <span className="ml-3 text-sm text-gray-500">
            {footerScript.split("\n").filter(Boolean).length} script(s)
            configured
          </span>
        </div>
      </div>

      {/* Practice Questions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Practice Questions
        </h2>
        <p className="text-gray-600 mb-4">
          Set the maximum number of practice questions users can attempt
        </p>

        <div className="max-w-md">
          <label
            htmlFor="practice-questions"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Practice Questions Allowed
          </label>
          <div className="flex">
            <input
              type="number"
              id="practice-questions"
              min="0"
              value={practiceQuestions}
              onChange={(e) => setPracticeQuestions(Number(e.target.value))}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of questions"
            />
            <button
              onClick={updatePracticeQuestions}
              disabled={isSaving.practice}
              className={`inline-flex items-center px-4 py-2 border border-l-0 border-[var(--admin-bg-dark)] text-sm font-medium rounded-r-md text-white bg-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSaving.practice ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSaving.practice ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Set to 0 to disable practice questions
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
