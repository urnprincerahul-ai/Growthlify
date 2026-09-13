"use client"

import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

export function FirebaseSetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">Firebase Setup Required</h1>
          </div>

          <p className="text-gray-600 mb-6">
            Your app needs Firestore Database to be enabled. Follow these steps to complete the setup:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Open Firebase Console</h3>
                <p className="text-gray-600 mb-2">Go to Firebase Console and select your project</p>
                <a
                  href="https://console.firebase.google.com/project/cnc-electric/firestore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Open Firebase Console
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Create Firestore Database</h3>
                <p className="text-gray-600">Click "Create database" button</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Choose Test Mode</h3>
                <p className="text-gray-600">Select "Start in test mode" for development</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Select Location</h3>
                <p className="text-gray-600">Choose your preferred database location (e.g., asia-south1)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Enable Database</h3>
                <p className="text-gray-600">Click "Enable" and wait for setup to complete</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Important Note:</h4>
            <p className="text-sm text-gray-600">
              Test mode allows all reads and writes for 30 days. Before going to production, make sure to update your
              security rules to protect your data.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">After completing setup, refresh this page to continue</p>
          </div>
        </div>
      </div>
    </div>
  )
}
