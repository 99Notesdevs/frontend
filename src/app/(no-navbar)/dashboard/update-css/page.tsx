"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import {
  Loader2,
  RefreshCw,
  Eye,
  Code,
  Save,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/config/env";
import Cookies from "js-cookie";

// Dynamically import the code editor to avoid SSR issues
const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

// Utility: Convert CSS variable object to :root CSS string
function cssVarsObjectToRootString(vars: Record<string, string>): string {
  return `:root {\n${Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")}\n}`;
}

export default function UpdateCssPage() {
  const [css, setCss] = useState<string | Record<string, string>>("");
  const [originalCss, setOriginalCss] = useState<
    string | Record<string, string>
  >("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Fetch current CSS on component mount
  useEffect(() => {
    const fetchCurrentCss = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${env.API}/admin/ops`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Accepts either a CSS string or an object of variables
          console.log("Fetched CSS:", data);
          const currentCss = JSON.parse(data.data.globalCss) || "";
          setCss(currentCss);
          setOriginalCss(currentCss);
        } else {
          setCss("");
          setOriginalCss("");
        }
      } catch (error) {
        console.error("Failed to fetch CSS:", error);
        toast.error("Failed to load current CSS. Using default CSS.");
        setCss("");
        setOriginalCss("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentCss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update preview when CSS changes
  useEffect(() => {
    if (activeTab === "preview" && previewRef.current) {
      updatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [css, activeTab]);

  const updatePreview = () => {
    if (!previewRef.current) return;
    const previewDocument =
      previewRef.current.contentDocument ||
      (previewRef.current as any).contentWindow.document;

    if (previewDocument) {
      let cssString = "";
      if (typeof css === "object" && css !== null) {
        cssString = cssVarsObjectToRootString(css);
      } else {
        cssString = css as string;
      }

      previewDocument.open();
      previewDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${cssString}
            </style>
          </head>
          <body class="p-6">
            <h1 class="text-2xl font-bold mb-4">Preview</h1>
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-semibold mb-2">Typography</h2>
                <h1 class="text-4xl font-bold">Heading 1</h1>
                <h2 class="text-3xl font-bold">Heading 2</h2>
                <h3 class="text-2xl font-semibold">Heading 3</h3>
                <p class="text-base">This is a paragraph with some text to demonstrate the typography styles.</p>
                <a href="#" class="text-blue-500 hover:underline">This is a link</a>
              </div>
              <div>
                <h2 class="text-xl font-semibold mb-2">Buttons</h2>
                <div class="flex gap-2">
                  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Primary</button>
                  <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Secondary</button>
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold mb-2">Form Elements</h2>
                <div class="space-y-4 max-w-md">
                  <div>
                    <label class="block text-sm font-medium mb-1">Input</label>
                    <input type="text" class="w-full p-2 border rounded" placeholder="Type something...">
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Textarea</label>
                    <textarea class="w-full p-2 border rounded" rows="3" placeholder="Enter some text..."></textarea>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      previewDocument.close();
    }
  };

  const handleSave = async () => {
    const cssToSave =
      typeof css === "object" && css !== null
        ? cssVarsObjectToRootString(css)
        : css;

    if (!cssToSave || !cssToSave.trim()) {
      toast.error("CSS cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${env.API}/admin/ops`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ globalCss: JSON.stringify(css) }),
      });

      if (response.ok) {
        setOriginalCss(css);
        toast.success("CSS updated successfully");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update CSS");
      }
    } catch (error: any) {
      console.error("Error updating CSS:", error);
      toast.error(error.message || "Failed to update CSS");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCss(originalCss);
    toast.success("Changes reverted");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CSS Editor</h1>
            <p className="text-muted-foreground">
              Manage global styles that apply across your entire application
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={css === originalCss || isSaving}
              className="gap-2 transition-all hover:bg-accent/90 hover:text-accent-foreground"
              title="Revert all changes to last saved state"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={css === originalCss || isSaving}
              size="lg"
              className="gap-2 transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-1">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : css === originalCss ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Info className="h-4 w-4 text-amber-500" />
            )}
            <span>
              {isSaving
                ? "Saving..."
                : css === originalCss
                ? "All changes saved"
                : "You have unsaved changes"}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Invalid CSS may break the application</span>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4"
        defaultValue="editor"
      >
        <TabsList className="w-full justify-start rounded-xl p-1 h-auto bg-muted/50">
          <TabsTrigger
            value="editor"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
          >
            <Code className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-0">
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">CSS Editor</CardTitle>
                  <CardDescription>
                    Edit your global styles. Changes will be applied after
                    saving.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs hover:bg-accent/90 hover:text-accent-foreground"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        typeof css === "object" && css !== null
                          ? cssVarsObjectToRootString(css)
                          : css
                      );
                      toast.success("CSS copied to clipboard");
                    }}
                    title="Copy CSS to clipboard"
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100vh-300px)] min-h-[400px] overflow-auto">
                {typeof window !== "undefined" && (
                  <CodeEditor
                    value={
                      typeof css === "object" && css !== null
                        ? cssVarsObjectToRootString(css)
                        : css
                    }
                    language="css"
                    placeholder="/* Enter your CSS here... */"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCss(e.target.value)
                    }
                    padding={20}
                    style={{
                      fontSize: 14,
                      backgroundColor: "#0f172a",
                      fontFamily:
                        "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      minHeight: "100%",
                      lineHeight: "1.5",
                    }}
                    data-color-mode="dark"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {typeof css === "string"
                    ? css.length
                    : Object.keys(css).length}{" "}
                  characters
                </span>
                <span>•</span>
                <span>
                  {typeof css === "string"
                    ? css.split("\n").length
                    : Object.keys(css).length}{" "}
                  lines
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Changes not saved yet</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card className="overflow-hidden border-0 shadow-sm h-[calc(100vh-220px)] min-h-[500px]">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <CardDescription>
                Preview how your styles will look in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="relative h-full after:absolute after:inset-0 after:bg-[rad-gradient(transparent_65%,hsl(var(--background))_95%)] after:pointer-events-none">
                <iframe
                  ref={previewRef}
                  className="w-full h-full border-0"
                  title="CSS Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium">Tips</h3>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Use the preview tab to see changes in real-time</li>
            <li>
              • Changes are automatically saved when you click outside the
              editor
            </li>
            <li>
              • Use{" "}
              <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                Ctrl+Space
              </code>{" "}
              for autocomplete
            </li>
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium">Warning</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Be cautious when modifying global styles as they affect the entire
            application. Always test changes in preview before saving.
          </p>
        </div>
      </div>
    </div>
  );
}
