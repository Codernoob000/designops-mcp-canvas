'use client'

import { useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type ComponentSchema = {
  component: string
  id?: string
  props?: Record<string, unknown>
  children?: ComponentSchema[]
}

type McpPayload = {
  pageType: string
  generatedBy?: string
  iqSource?: string
  layout: ComponentSchema[]
}

// ── Sample Payloads (from your MCP server output) ────────────────────────────

const SAMPLE_LANDING: McpPayload = {
  pageType: 'landing-page',
  generatedBy: 'DesignOps MCP Server v1.0',
  iqSource: 'Microsoft Foundry IQ (simulated)',
  layout: [
    {
      component: 'NavBar',
      props: { brand: 'DesignOps', links: ['Docs', 'Pricing', 'GitHub'] },
    },
    {
      component: 'Hero',
      props: {
        headline: 'Ship design systems at the speed of thought.',
        subtext:
          'AI-grounded layout tokens, served directly into your IDE via MCP.',
        cta: 'Get Started Free',
        ctaSecondary: 'View on GitHub',
        badge: 'Powered by Microsoft Foundry IQ',
      },
    },
    {
      component: 'FeatureGrid',
      props: {
        features: [
          { icon: '⚡', title: 'MCP-Native', desc: 'Works inside GitHub Copilot.' },
          { icon: '🔒', title: 'IQ-Grounded', desc: 'No hallucinated design tokens.' },
          { icon: '🎨', title: 'Live Canvas', desc: 'Render schemas instantly.' },
        ],
      },
    },
    {
      component: 'Footer',
      props: { text: '© 2026 DesignOps. Built for Microsoft Agents League.' },
    },
  ],
}

const SAMPLE_FORM: McpPayload = {
  pageType: 'dynamic-form',
  generatedBy: 'DesignOps MCP Server v1.0',
  iqSource: 'Microsoft Foundry IQ (simulated)',
  layout: [
    {
      component: 'FormContainer',
      props: { title: 'Create New Project', subtitle: 'All fields are IQ-validated.' },
      children: [
        {
          component: 'FormField',
          props: { label: 'Project Name', type: 'text', placeholder: 'e.g. DesignOps Canvas' },
        },
        {
          component: 'FormField',
          props: {
            label: 'Design Track',
            type: 'select',
            options: ['Creative Apps', 'Productivity Tools', 'Developer Experience'],
          },
        },
        {
          component: 'FormField',
          props: { label: 'Description', type: 'textarea', placeholder: 'Describe your project...' },
        },
        {
          component: 'FormField',
          props: { label: 'Enable IQ Grounding', type: 'toggle', checked: true },
        },
        {
          component: 'FormActions',
          props: { submit: 'Create Project', cancel: 'Discard' },
        },
      ],
    },
  ],
}

// ── Component Renderers ───────────────────────────────────────────────────────

function NavBar({ props }: { props?: Record<string, unknown> }) {
  const links = (props?.links as string[]) ?? []
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-canvas-border">
      <span className="font-mono text-sm font-semibold text-iq-cyan tracking-widest uppercase">
        {String(props?.brand ?? 'Brand')}
      </span>
      <div className="flex gap-6">
        {links.map((l) => (
          <button key={l} className="text-xs text-gray-400 hover:text-white transition-colors font-sans">
            {l}
          </button>
        ))}
      </div>
    </nav>
  )
}

function Hero({ props }: { props?: Record<string, unknown> }) {
  return (
    <section className="px-8 py-16 text-center relative">
      {props?.badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-iq-violet/40 bg-iq-violet/10 text-iq-pulse text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-iq-pulse animate-pulse-slow" />
          {String(props.badge)}
        </span>
      )}
      <h1 className="text-3xl font-bold text-white leading-tight max-w-2xl mx-auto mb-4 font-sans">
        {String(props?.headline ?? 'Headline')}
      </h1>
      <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 leading-relaxed font-sans">
        {String(props?.subtext ?? '')}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {props?.cta && (
          <button className="px-5 py-2.5 rounded-lg bg-iq-cyan text-canvas-bg text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
            {String(props.cta)}
          </button>
        )}
        {props?.ctaSecondary && (
          <button className="px-5 py-2.5 rounded-lg border border-canvas-muted text-gray-300 text-sm font-sans hover:border-gray-500 transition-colors">
            {String(props.ctaSecondary)}
          </button>
        )}
      </div>
    </section>
  )
}

function FeatureGrid({ props }: { props?: Record<string, unknown> }) {
  const features = (props?.features as Array<{ icon: string; title: string; desc: string }>) ?? []
  return (
    <section className="px-8 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-canvas-border bg-canvas-panel hover:border-iq-cyan/30 transition-colors"
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="text-sm font-semibold text-white mb-1 font-sans">{f.title}</div>
            <div className="text-xs text-gray-500 font-sans leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer({ props }: { props?: Record<string, unknown> }) {
  return (
    <footer className="px-8 py-5 border-t border-canvas-border">
      <p className="text-xs text-gray-600 font-mono text-center">{String(props?.text ?? '')}</p>
    </footer>
  )
}

function FormField({ props }: { props?: Record<string, unknown> }) {
  const [toggled, setToggled] = useState(Boolean(props?.checked))
  const type = String(props?.type ?? 'text')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400 font-sans">
        {String(props?.label ?? 'Field')}
      </label>
      {type === 'text' && (
        <input
          type="text"
          placeholder={String(props?.placeholder ?? '')}
          className="px-3 py-2 rounded-lg bg-canvas-bg border border-canvas-border text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-iq-cyan/50 transition-colors"
        />
      )}
      {type === 'textarea' && (
        <textarea
          placeholder={String(props?.placeholder ?? '')}
          rows={3}
          className="px-3 py-2 rounded-lg bg-canvas-bg border border-canvas-border text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-iq-cyan/50 resize-none transition-colors"
        />
      )}
      {type === 'select' && (
        <select className="px-3 py-2 rounded-lg bg-canvas-bg border border-canvas-border text-sm text-white font-mono focus:outline-none focus:border-iq-cyan/50 transition-colors">
          {(props?.options as string[] ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
      {type === 'toggle' && (
        <button
          onClick={() => setToggled((v) => !v)}
          className={`w-10 h-5 rounded-full transition-colors relative ${
            toggled ? 'bg-iq-cyan' : 'bg-canvas-muted'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-canvas-bg transition-transform ${
              toggled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      )}
    </div>
  )
}

function FormActions({ props }: { props?: Record<string, unknown> }) {
  return (
    <div className="flex gap-3 pt-2">
      <button className="px-4 py-2 rounded-lg bg-iq-cyan text-canvas-bg text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
        {String(props?.submit ?? 'Submit')}
      </button>
      <button className="px-4 py-2 rounded-lg border border-canvas-border text-gray-400 text-sm font-sans hover:border-gray-500 transition-colors">
        {String(props?.cancel ?? 'Cancel')}
      </button>
    </div>
  )
}

function FormContainer({
  props,
  children,
}: {
  props?: Record<string, unknown>
  children?: ComponentSchema[]
}) {
  return (
    <div className="px-8 py-10 flex justify-center">
      <div className="w-full max-w-md p-6 rounded-2xl border border-canvas-border bg-canvas-panel">
        <h2 className="text-lg font-semibold text-white mb-1 font-sans">
          {String(props?.title ?? 'Form')}
        </h2>
        <p className="text-xs text-gray-500 mb-6 font-sans">{String(props?.subtitle ?? '')}</p>
        <div className="flex flex-col gap-5">
          {children?.map((child, i) => (
            <SchemaNode key={i} node={child} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Schema Node Dispatcher ────────────────────────────────────────────────────

function SchemaNode({ node }: { node: ComponentSchema }) {
  const p = node.props
  switch (node.component) {
    case 'NavBar':         return <NavBar props={p} />
    case 'Hero':           return <Hero props={p} />
    case 'FeatureGrid':    return <FeatureGrid props={p} />
    case 'Footer':         return <Footer props={p} />
    case 'FormContainer':  return <FormContainer props={p} children={node.children} />
    case 'FormField':      return <FormField props={p} />
    case 'FormActions':    return <FormActions props={p} />
    default:
      return (
        <div className="px-4 py-3 rounded-lg border border-dashed border-canvas-muted text-xs text-gray-600 font-mono">
          Unknown component: <span className="text-yellow-500">{node.component}</span>
        </div>
      )
  }
}

function IqValidationPanel({ steps }: { 
  steps: {label: string; status: 'pending' | 'ok' | 'running'}[] 
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-iq-violet animate-pulse-slow" />
        <span className="text-xs font-mono text-iq-pulse uppercase tracking-widest">
          Foundry IQ Grounding
        </span>
      </div>
      <div className="w-full max-w-xs flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border border-canvas-border flex items-center justify-center shrink-0">
              {step.status === 'running' && (
                <span className="w-2 h-2 rounded-full bg-iq-cyan animate-pulse" />
              )}
              {step.status === 'ok' && (
                <span className="text-iq-cyan text-xs">✓</span>
              )}
              {step.status === 'pending' && (
                <span className="w-1.5 h-1.5 rounded-full bg-canvas-muted" />
              )}
            </div>
            <span className={`text-xs font-mono transition-colors ${
              step.status === 'ok'      ? 'text-iq-cyan' :
              step.status === 'running' ? 'text-white' :
              'text-gray-600'
            }`}>
              {step.label}
            </span>
            {step.status === 'ok' && (
              <span className="ml-auto text-xs font-mono text-iq-cyan/60">PASS</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
// ── Signal Bar ────────────────────────────────────────────────────────────────

function SignalBar({ active }: { active: boolean }) {
  return (
    <div className="h-px bg-canvas-border overflow-hidden">
      {active && (
        <div
          key={Date.now()}
          className="h-full bg-gradient-to-r from-transparent via-iq-cyan to-transparent animate-signal"
          style={{ width: '100%' }}
        />
      )}
    </div>
  )
}


// ── Main Page ─────────────────────────────────────────────────────────────────
// ── Main Page ─────────────────────────────────────────────────────────────────
// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Page() {
  const [rawJson, setRawJson] = useState(JSON.stringify(SAMPLE_LANDING, null, 2))
  const [payload, setPayload] = useState<McpPayload | null>(SAMPLE_LANDING)
  const [error, setError] = useState<string | null>(null)
  const [signaling, setSignaling] = useState(false)
  const [iqSteps, setIqSteps] = useState<{label: string; status: 'pending' | 'ok' | 'running'}[]>([])

  const triggerRender = useCallback(() => {
    setError(null)
    try {
      const parsed = JSON.parse(rawJson) as McpPayload
      if (!Array.isArray(parsed.layout)) throw new Error('Missing "layout" array in payload.')

      const steps = [
        { label: 'Schema integrity check', status: 'pending' as const },
        { label: 'Token validation against IQ rules', status: 'pending' as const },
        { label: 'Foundry IQ approval', status: 'pending' as const },
      ]

      setIqSteps(steps)
      setSignaling(true)
      setPayload(null)

      // Step 1
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 0 ? {...x, status: 'running'} : x))
      }, 80)
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 0 ? {...x, status: 'ok'} : x))
      }, 280)

      // Step 2
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 1 ? {...x, status: 'running'} : x))
      }, 320)
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 1 ? {...x, status: 'ok'} : x))
      }, 520)

      // Step 3
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 2 ? {...x, status: 'running'} : x))
      }, 560)
      setTimeout(() => {
        setIqSteps(s => s.map((x, i) => i === 2 ? {...x, status: 'ok'} : x))
        setTimeout(() => {
          setPayload(parsed)
          setSignaling(false)
          setIqSteps([])
        }, 300)
      }, 780)

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }, [rawJson])

  const loadSample = (p: McpPayload) => {
    setRawJson(JSON.stringify(p, null, 2))
    setPayload(null)
    setError(null)
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-canvas-bg overflow-hidden">

      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-iq-cyan animate-pulse-slow" />
          <span className="text-xs font-mono text-gray-400">
            DesignOps <span className="text-iq-cyan">Visual Canvas</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-iq-violet/30 bg-iq-violet/10">
          <span className="w-1.5 h-1.5 rounded-full bg-iq-pulse animate-pulse-slow" />
          <span className="text-xs font-mono text-iq-pulse">Foundry IQ Connected</span>
        </div>
        <div className="text-xs font-mono text-gray-600 hidden sm:block">
          Microsoft Agents League · Creative Apps
        </div>
      </header>

      {/* Split Pane Container */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT — JSON Editor Column */}
        <div className="w-[45%] flex flex-col border-r border-canvas-border h-full bg-canvas-surface">
          {/* Header Row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-canvas-border shrink-0 bg-canvas-bg">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
              MCP Schema Input
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => loadSample(SAMPLE_LANDING)}
                className="px-2.5 py-1 rounded text-xs font-mono text-gray-400 border border-canvas-border hover:text-iq-cyan hover:border-iq-cyan/40 transition-colors"
              >
                landing-page
              </button>
              <button
                onClick={() => loadSample(SAMPLE_FORM)}
                className="px-2.5 py-1 rounded text-xs font-mono text-gray-400 border border-canvas-border hover:text-iq-cyan hover:border-iq-cyan/40 transition-colors"
              >
                dynamic-form
              </button>
            </div>
          </div>

          {/* Textarea filling absolute maximum height between header and footer bar */}
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full px-5 py-4 bg-canvas-surface text-gray-300 text-xs font-mono resize-none focus:outline-none leading-relaxed overflow-y-auto"
            style={{ caretColor: '#00D9F5' }}
          />

          {/* Fixed Bottom Action Bar */}
          <div className="mt-auto px-4 py-3 border-t border-canvas-border shrink-0 flex items-center gap-3 bg-canvas-bg">
            <button
              onClick={triggerRender}
              disabled={signaling}
              className="flex-1 py-2.5 rounded-lg bg-iq-cyan text-canvas-bg text-sm font-semibold font-sans hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden"
            >
              {signaling ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-canvas-bg animate-bounce" />
                  Transmitting…
                </span>
              ) : (
                '→ Render via IQ'
              )}
            </button>
            {error && (
              <span className="text-xs text-red-400 font-mono truncate max-w-[140px]" title={error}>
                ⚠ {error}
              </span>
            )}
          </div>
        </div>

        {/* Signal Bridge Axis */}
        <div className="absolute left-[45%] top-0 bottom-0 z-20 pointer-events-none">
          <SignalBar active={signaling} />
        </div>

        {/* RIGHT — Live Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-canvas-border shrink-0 bg-canvas-bg">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
              Live Canvas
            </span>
            {payload && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-600">pageType:</span>
                <span className="text-xs font-mono text-iq-cyan">{payload.pageType}</span>
                <span className="text-xs font-mono text-gray-600 ml-2">components:</span>
                <span className="text-xs font-mono text-iq-cyan">{payload.layout.length}</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-canvas-surface">
            {signaling && iqSteps.length > 0 ? (
              <IqValidationPanel steps={iqSteps} />
            ) : payload ? (
              <div className="animate-fade-in min-h-full">
                {/* Simulated browser chrome */}
                <div className="sticky top-0 z-10 flex items-center gap-1.5 px-3 py-2 bg-canvas-bg/80 backdrop-blur border-b border-canvas-border">
                  <span className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <span className="w-2 h-2 rounded-full bg-green-500/60" />
                  <span className="flex-1 mx-3 px-3 py-1 rounded bg-canvas-panel text-gray-600 text-xs font-mono text-center">
                    localhost:3001 · {payload.pageType}
                  </span>
                </div>

                {/* Rendered components */}
                <div className="bg-canvas-panel">
                  {payload.layout.map((node, i) => (
                    <SchemaNode key={i} node={node} />
                  ))}
                </div>

                {/* IQ Attribution */}
                {payload.iqSource && (
                  <div className="px-4 py-2 flex items-center gap-2 bg-canvas-bg border-t border-canvas-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-iq-violet" />
                    <span className="text-xs font-mono text-gray-600">
                      Grounded by: {payload.iqSource}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
                <div className="w-12 h-12 rounded-xl border border-canvas-border flex items-center justify-center text-2xl">
                  🧩
                </div>
                <p className="text-sm text-gray-500 font-sans">Paste your MCP schema and click Render.</p>
                <p className="text-xs text-gray-700 font-mono">
                  Output from <span className="text-iq-cyan">get_brand_layout_schema()</span> goes in the editor →
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}