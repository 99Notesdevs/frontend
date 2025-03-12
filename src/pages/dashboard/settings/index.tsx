import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 py-16">
        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Customize your experience and manage your preferences</p>
        </div>

        <div className="grid gap-8">
          {/* Appearance Card */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-gray-500 dark:text-gray-400">Customize how the dashboard looks and feels</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label htmlFor="dark-mode" className="text-sm font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="dark-mode" className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800/50"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label htmlFor="compact-view" className="text-sm font-medium text-gray-900 dark:text-white">
                      Compact View
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Use a more compact layout for the dashboard</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="compact-view" className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800/50"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Settings Card */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editor Settings</h2>
                  <p className="text-gray-500 dark:text-gray-400">Configure your article editor preferences</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label htmlFor="auto-save" className="text-sm font-medium text-gray-900 dark:text-white">
                      Auto Save
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Automatically save your articles while editing</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="auto-save" className="peer sr-only" defaultChecked />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800/50"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label htmlFor="spell-check" className="text-sm font-medium text-gray-900 dark:text-white">
                      Spell Check
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Enable spell checking in the editor</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="spell-check" className="peer sr-only" defaultChecked />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800/50"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Card */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
                  <p className="text-gray-500 dark:text-gray-400">Manage your account settings</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label htmlFor="notifications" className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Receive email notifications about your articles</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" id="notifications" className="peer sr-only" />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800/50"></div>
                  </label>
                </div>
                <div className="flex justify-end pt-4">
                  <button className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

