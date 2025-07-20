"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/config/api/route";

interface AdminLog {
  id: number;
  method: string;
  endpoint: string;
  status: string;
  user: string | null;
  userId: number | null;
  details: any; // Will store parsed details
  createdAt: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const response = await api.get(`/admin-logs?skip=${skip}&take=${limit}`) as { success: boolean; data: AdminLog[] };

      if (!response.success) {
        throw new Error("Failed to fetch logs");
      }

      const data = response.data;

      // Parse details if they exist
      const parsedLogs = data.map((log: any) => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null
      }));
      
      setLogs(parsedLogs);
      
      // If we get fewer items than the limit, there are no more items
      setHasMore(parsedLogs.length === limit);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const canGoPrev = page > 1;
  const canGoNext = hasMore;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Logs</h1>
        <div className="text-sm text-gray-500">
          Page {page}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="rounded-md border overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No logs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-medium">
                        {log.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.status.startsWith("2")
                              ? "bg-green-100 text-green-800"
                              : log.status.startsWith("4") || log.status.startsWith("5")
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.user || "System"}
                        {log.userId && ` (${log.userId})`}
                      </td>
                      <td className="px-6 py-4 whitespace-pre-wrap max-w-xs break-words text-sm">
                        {log.details ? (
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {logs.length} logs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!canGoPrev || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={!canGoNext || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}