"use client"

import { X, AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function FirebaseSetupModal({ onClose }: { onClose: () => void }) {
  const [copiedRules, setCopiedRules] = useState(false)
  const [copiedConfig, setCopiedConfig] = useState(false)

  const securityRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`

  const firebaseConfig = `Project ID: cnc-electric
Console URL: https://console.firebase.google.com/project/cnc-electric`

  const copyToClipboard = (text: string, type: "rules" | "config") => {
    navigator.clipboard.writeText(text)
    if (type === "rules") {
      setCopiedRules(true)
      setTimeout(() => setCopiedRules(false), 2000)
    } else {
      setCopiedConfig(true)
      setTimeout(() => setCopiedConfig(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Firebase Setup Required</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              Firestore Database is not configured. Please follow the steps below to enable it.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Setup Steps:</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Open Firebase Console</h4>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <code className="text-sm text-gray-700">{firebaseConfig}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(firebaseConfig, "config")}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {copiedConfig ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedConfig ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      onClick={() =>
                        window.open("https://console.firebase.google.com/project/cnc-electric/firestore", "_blank")
                      }
                      variant="default"
                      size="sm"
                      className="gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Console
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Create Firestore Database</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Click on "Firestore Database" in the left sidebar</li>
                    <li>Click "Create database" button</li>
                    <li>Select "Start in test mode" (for development)</li>
                    <li>Choose your preferred location</li>
                    <li>Click "Enable"</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Configure Security Rules</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Go to the "Rules" tab and replace the existing rules with:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 mb-2 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">{securityRules}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(securityRules, "rules")}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {copiedRules ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedRules ? "Copied!" : "Copy Rules"}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Note: These rules allow all access for development. Update them for production!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Publish Rules & Refresh</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Click "Publish" to save the security rules</li>
                    <li>Wait a few seconds for changes to propagate</li>
                    <li>Refresh this page and try registering again</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Need help?</strong> If you're still having issues after following these steps, make sure:
            </p>
            <ul className="list-disc list-inside text-blue-700 text-sm mt-2 space-y-1">
              <li>Firestore Database is enabled (not Realtime Database)</li>
              <li>Security rules are published</li>
              <li>You've waited 10-30 seconds after publishing rules</li>
              <li>You've refreshed the page</li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  )
}
