"use client"

import { Copy, Eye, EyeOff, Flame, Server, Settings, Sparkles, Trash2, Zap } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { clearEdgeCache } from '../../lib/api'
import { APIConfig } from '../../lib/types'

interface SettingsPageProps {
  apiConfig: APIConfig
  onUpdateConfig: (newConfig: APIConfig) => void
}

export default function SettingsPage({ apiConfig, onUpdateConfig }: SettingsPageProps) {
  const [workerUrl, setWorkerUrl] = useState(apiConfig.workerUrl)
  const [authToken, setAuthToken] = useState(apiConfig.authToken)
  const [cacheEnabled, setCacheEnabled] = useState(apiConfig.cacheEnabled)
  const [cacheTtl, setCacheTtl] = useState(apiConfig.cacheTtl)
  const [simulateLatency, setSimulateLatency] = useState(apiConfig.simulateLatency)
  const [showToken, setShowToken] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(false)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)

  const triggerFeedback = (msg: string) => {
    setShowFeedback(msg)
    setTimeout(() => setShowFeedback(null), 3000)
  }

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault()
    onUpdateConfig({
      workerUrl: workerUrl.trim(),
      authToken: authToken.trim(),
      cacheEnabled,
      cacheTtl: Number(cacheTtl) || 30,
      simulateLatency,
    })
    triggerFeedback('Settings updated and cached dynamically!')
  }

  const handleClearCacheMemory = () => {
    clearEdgeCache()
    triggerFeedback('Simulated Cloudflare edge cluster cache invalidated.')
  }

  const handleCopyCodeSnippet = () => {
    const payloadSnippet = `// POST request payload blueprint for your Cloudflare Worker endpoint
const fetchFgaCheck = async () => {
  const response = await fetch("${workerUrl || 'https://your-worker.workers.dev'}/api/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${authToken ? '••••••••' : 'YOUR_SECRET_TOKEN'}"
    },
    body: JSON.stringify({
      tenantId: "tenant_purejoy_99",
      userId: "dev_sarah",
      resource: "deployments/production",
      action: "create",
      context: {
        max_clearance_level: 3,
        mfa_required: true
      }
    })
  });
  const decision = await response.json();
};`

    navigator.clipboard.writeText(payloadSnippet)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
    triggerFeedback('Code template copied to clipboard!')
  }

  return (
    <div id="settings_workspace" className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 font-sans">
      {showFeedback ? (
        <div className="fixed top-6 right-6 z-50 bg-[#09090b] border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded text-xs font-mono shadow-xl flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span>{showFeedback}</span>
        </div>
      ) : null}

      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-sm font-bold text-white tracking-widest uppercase flex items-center space-x-2.5 font-mono">
          <Settings className="h-4 w-4 text-zinc-450" />
          <span>Configuration Settings</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Hook up the FGA Management Console with your real Cloudflare Workers integration,
          configure edge-caching policies, and adjust latency simulators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-12 lg:col-span-7">
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-5 shadow" id="form_config_update">
            <div className="border-b border-zinc-850 pb-3">
              <h2 className="text-[10px] uppercase font-bold text-white tracking-wider flex items-center space-x-2 font-mono">
                <Server className="h-4 w-4 text-zinc-450" />
                <span>Integration Endpoints</span>
              </h2>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                Cloudflare Worker API Route URL
              </label>
              <input
                id="setting_worker_url"
                type="url"
                value={workerUrl}
                onChange={(e) => setWorkerUrl(e.target.value)}
                placeholder="https://fga-auth.purejoy.workers.dev"
                className="w-full bg-[#09090b] border border-zinc-800 focus:border-indigo-505 focus:border-indigo-500 rounded px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                Authorization Token Headers
              </label>
              <div className="relative">
                <input
                  id="setting_auth_token"
                  type={showToken ? 'text' : 'password'}
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Bearer token_secret_hash_0109"
                  className="w-full bg-[#09090b] border border-zinc-800 focus:border-indigo-505 focus:border-indigo-500 rounded px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-800 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-5 mt-4 space-y-4">
              <h3 className="text-[10px] uppercase font-bold text-white tracking-widest flex items-center space-x-2 pb-1 font-mono">
                <Zap className="h-4 w-4 text-indigo-400" />
                <span>Simulated Performance Engine</span>
              </h3>

              <div className="flex items-center justify-between bg-[#09090b]/40 p-3 rounded border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold font-mono text-white block uppercase">Edge Relations Caching</span>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">
                    Memoize validation decisions to eliminate edge roundtrip checks.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="setting_cache_enabled"
                    type="checkbox"
                    checked={cacheEnabled}
                    onChange={(e) => setCacheEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.75 after:left-0.5 after:bg-zinc-400 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              {cacheEnabled ? (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                    Cache Tuples Time-to-Live (Seconds)
                  </label>
                  <input
                    id="setting_cache_ttl"
                    type="number"
                    min={5}
                    max={3600}
                    value={cacheTtl}
                    onChange={(e) => setCacheTtl(Number(e.target.value) || 30)}
                    className="w-24 bg-[#09090b] border border-zinc-800 focus:border-indigo-500 rounded px-3 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
              ) : null}

              <div className="flex items-center justify-between bg-[#09090b]/40 p-3 rounded border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold font-mono text-white block uppercase">Simulate Edge Server Latency</span>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Mock normal edge networking overhead from 80ms - 200ms.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="setting_latency_enabled"
                    type="checkbox"
                    checked={simulateLatency}
                    onChange={(e) => setSimulateLatency(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.75 after:left-0.5 after:bg-zinc-400 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn_save_settings"
                type="submit"
                className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold font-mono tracking-wider text-[10px] uppercase py-2 px-5 rounded cursor-pointer transition-all"
              >
                Apply Workspace Changes
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4 shadow">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <h3 className="text-[10px] uppercase font-bold text-white tracking-widest flex items-center space-x-2 font-mono">
                <Flame className="h-4 w-4 text-rose-500" />
                <span>Invalidation Utilities</span>
              </h3>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
              Flush cached tuples. Invalidating edge caches forces future relation evaluations to query primary policy definitions.
            </p>
            <button
              id="btn_clear_edge_cache"
              type="button"
              onClick={handleClearCacheMemory}
              className="bg-transparent hover:bg-rose-950/10 text-rose-400 border border-rose-500/20 hover:border-rose-500/50 font-mono text-[10px] uppercase tracking-wider font-bold py-2 px-4 rounded w-full transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Full Cache Invalidation</span>
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden shadow">
            <div className="bg-[#09090b] px-4 py-2 flex items-center justify-between border-b border-zinc-800">
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">SDK PAYLOAD</span>
              <button
                id="btn_copy_schema_snippet"
                type="button"
                onClick={handleCopyCodeSnippet}
                className="text-zinc-400 hover:text-white font-mono text-[9px] uppercase font-bold tracking-widest flex items-center space-x-1 cursor-pointer bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded"
              >
                <Copy className="h-3 w-3 text-indigo-400" />
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#09090b]/40 text-zinc-400 font-mono text-[10px] max-h-56 overflow-y-auto leading-relaxed scrollbar-none">{`// POST request payload blueprint\nconst fetchFgaCheck = async () => {\n  const response = await fetch(\"${workerUrl || 'https://your-worker.workers.dev'}/api/check\", {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\",\n      \"Authorization\": \"Bearer ${authToken ? '••••••••' : 'YOUR_TOKEN'}\"\n    },\n    body: JSON.stringify({\n      tenantId: \"tenant_purejoy_99\",\n      userId: \"dev_sarah\",\n      resource: \"deployments/production\",\n      action: \"create\",\n      context: {\n        max_clearance_level: 3,\n        mfa_required: true\n      }\n    })\n  });\n  const decision = await response.json(); \n};`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
