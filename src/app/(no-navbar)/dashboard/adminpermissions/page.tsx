'use client';
import { useEffect, useState } from "react";
import { isLocked } from "@/lib/islocked";
import axios from "axios";
import { env } from "@/config/env";
import Cookies from "js-cookie";

export default function AdminPermissions() {
    const [isContentLocked, setIsContentLocked] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [headerScript, setHeaderScript] = useState<string>("");
    const [footerScript, setFooterScript] = useState<string>("");
    const [practiceQuestions, setPracticeQuestions] = useState<number>(0);
    const fetchAdminOps = async () => {
        try {
            const response = await axios.get(`${env.API}/admin/ops`);
            if (response.data.success) {
                const data = response.data.data;
                setIsContentLocked(data.globalRestrictions);
                setHeaderScript(data.globalHeadScripts?.join('\n') || "");
                setFooterScript(data.globalBodyScripts?.join('\n') || "");
                setPracticeQuestions(data.practiceQuestions);
            }
        } catch (error) {
            console.error("Error fetching admin ops:", error);
        }
    };

    useEffect(() => {
        fetchAdminOps();
    }, []);

    const toggleGlobalRestrictions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${env.API}/admin/ops`, {
                globalRestrictions: !isContentLocked
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.data.success) {
                setIsContentLocked(!isContentLocked);
            } else {
                throw new Error('Failed to update restrictions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const updateHeaderScripts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${env.API}/admin/ops`, {
                globalHeadScripts: headerScript.split('\n').filter(script => script.trim())
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.data.success) {
                // Refresh header scripts
                const ops = await axios.get(`${env.API}/admin/ops`);
                if (ops.data.success) {
                    setHeaderScript(ops.data.data.globalHeadScripts?.join('\n') || "");
                }
            } else {
                throw new Error('Failed to update header scripts');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const updateFooterScripts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${env.API}/admin/ops`, {
                globalBodyScripts: footerScript.split('\n').filter(script => script.trim())
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.data.success) {
                // Refresh footer scripts
                const ops = await axios.get(`${env.API}/admin/ops`);
                if (ops.data.success) {
                    setFooterScript(ops.data.data.globalBodyScripts?.join('\n') || "");
                }
            } else {
                throw new Error('Failed to update footer scripts');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    const updatePracticeQuestions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${env.API}/admin/ops`, {
                practiceQuestions: practiceQuestions
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.data.success) {
                // Refresh practice questions
                const ops = await axios.get(`${env.API}/admin/ops`);
                if (ops.data.success) {
                    setPracticeQuestions(ops.data.data.practiceQuestions);
                }
            } else {
                throw new Error('Failed to update practice questions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="p-6 space-y-10 sm:mt-5 lg:mt-2">
            <h1 className="text-3xl font-bold mb-4 text-center">Admin Permissions</h1>

            {/* Content Lock Section */}
            <div className="space-y-4">
                <div>
                    <p className="text-lg mb-4">Global Content Restrictions:</p>
                    <p className={isContentLocked ? "text-red-500" : "text-green-500"}>
                        {isContentLocked ? "Content is locked" : "Content is not locked"}
                    </p>
                </div>
                <button
                    onClick={toggleGlobalRestrictions}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg ${
                        isLoading
                            ? 'bg-slate-300 cursor-not-allowed'
                            : isContentLocked
                            ? 'bg-slate-900 hover:bg-slate-800'
                            : 'bg-slate-700 hover:bg-slate-600'
                    } text-white font-medium`}
                >
                    {isLoading ? 'Loading...' : isContentLocked ? 'Unlock Content' : 'Lock Content'}
                </button>
            </div>

            {/* Header Scripts Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Global Header Scripts</h2>
                <textarea
                    value={headerScript}
                    onChange={(e) => setHeaderScript(e.target.value)}
                    placeholder="Enter header scripts (one per line)"
                    rows={5}
                    className="w-full p-4 border rounded-lg border-slate-300 bg-white"
                />
                <button
                    onClick={updateHeaderScripts}
                    disabled={isLoading}
                    className={`px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } font-medium`}
                >
                    {isLoading ? 'Saving...' : 'Save Header Scripts'}
                </button>
            </div>

            {/* Footer Scripts Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Global Footer Scripts</h2>
                <textarea
                    value={footerScript}
                    onChange={(e) => setFooterScript(e.target.value)}
                    placeholder="Enter footer scripts (one per line)"
                    rows={5}
                    className="w-full p-4 border rounded-lg border-slate-300 bg-white"
                />
                <button
                    onClick={updateFooterScripts}
                    disabled={isLoading}
                    className={`px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } font-medium`}
                >
                    {isLoading ? 'Saving...' : 'Save Footer Scripts'}
                </button>
            </div>

            {/* Practice Questions Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Practice Questions</h2>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Number of Practice Questions
                </label>
                <input
                    type="number"
                    value={practiceQuestions}
                    onChange={(e) => setPracticeQuestions(Number(e.target.value))}
                    className="w-full p-4 border rounded-lg border-slate-300 bg-white"
                />
                <button
                    onClick={updatePracticeQuestions}
                    disabled={isLoading}
                    className={`px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } font-medium`}
                >
                    {isLoading ? 'Saving...' : 'Save Practice Questions'}
                </button>
            </div>

            {error && (
                <div className="mt-4 text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
}