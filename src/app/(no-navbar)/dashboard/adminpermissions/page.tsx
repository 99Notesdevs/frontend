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

    const fetchAdminOps = async () => {
        try {
            const response = await axios.get(`${env.API}/admin/ops`);
            if (response.data.success) {
                const data = response.data.data;
                setIsContentLocked(data.globalRestrictions);
                setHeaderScript(data.globalHeadScripts?.join('\n') || "");
                setFooterScript(data.globalBodyScripts?.join('\n') || "");
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

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-2xl font-bold">Admin Permissions</h1>

            {/* Content Lock Section */}
            <div className="space-y-4">
                <div>
                    <p className="text-lg mb-2">Global Content Restrictions:</p>
                    <p className={isContentLocked ? "text-red-500" : "text-green-500"}>
                        {isContentLocked ? "Content is locked" : "Content is not locked"}
                    </p>
                </div>
                <button
                    onClick={toggleGlobalRestrictions}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded ${
                        isLoading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isContentLocked
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
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
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={updateHeaderScripts}
                    disabled={isLoading}
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={updateFooterScripts}
                    disabled={isLoading}
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Saving...' : 'Save Footer Scripts'}
                </button>
            </div>

            {error && (
                <div className="mt-4 text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
}