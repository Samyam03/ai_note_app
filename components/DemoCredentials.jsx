const DEMO_ACCOUNTS = [
  {
    email: "test@email.com",
    password: "ExploreNow!2025",
    label: "Demo Account 1",
  },
  {
    email: "sam@gmail.com",
    password: "TalentPortal@2025",
    label: "Demo Account 2",
  },
  {
    email: "view@example.com",
    password: "TryThisDemo!88",
    label: "Demo Account 3",
  },
];

export default function DemoCredentials() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Try NoteGenius Now
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Use these demo credentials to explore the app and experience the power of AI-powered note-taking
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_ACCOUNTS.map((credential, index) => (
            <div
              key={credential.email}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-slate-900">{credential.label}</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="bg-white rounded-lg p-3 border border-slate-300 font-mono text-sm text-slate-800 break-all">
                    {credential.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="bg-white rounded-lg p-3 border border-slate-300 font-mono text-sm text-slate-800">
                    {credential.password}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-amber-800">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                !
              </div>
              <span className="text-sm font-medium">
                These are demo accounts for testing purposes. Your data will be shared with other demo users.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
