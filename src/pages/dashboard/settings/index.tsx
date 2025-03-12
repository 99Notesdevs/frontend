import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 pt-40">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
      <div className="grid gap-6">
        {/* Appearance Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the dashboard looks and feels</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="dark-mode" className="text-sm font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" id="dark-mode" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="compact-view" className="text-sm font-medium text-gray-900 dark:text-white">
                    Compact View
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use a more compact layout for the dashboard
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" id="compact-view" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Settings Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editor Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure your article editor preferences</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="auto-save" className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto Save
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically save your articles while editing
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" id="auto-save" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="spell-check" className="text-sm font-medium text-gray-900 dark:text-white">
                    Spell Check
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable spell checking in the editor</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" id="spell-check" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="notifications" className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications about your articles
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" id="notifications" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
              <div className="flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-offset-gray-900">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

