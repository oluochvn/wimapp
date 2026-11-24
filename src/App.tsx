import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import NetworkMap, { type NetworkMapActivity } from './NetworkMap'
import './App.css'

type IconName =
  | 'activity'
  | 'bell'
  | 'check'
  | 'chevron'
  | 'computer'
  | 'dashboard'
  | 'dots'
  | 'globe'
  | 'laptop'
  | 'map'
  | 'monitor'
  | 'phone'
  | 'plus'
  | 'router'
  | 'scan'
  | 'search'
  | 'settings'
  | 'shield'
  | 'signal'
  | 'sliders'
  | 'wifi'
  | 'x'
const iconShapes: Record<IconName, ReactNode> = {
  activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  computer: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  laptop: <><rect x="5" y="4" width="14" height="11" rx="1.5" /><path d="M2 19h20l-1.5-4H3.5L2 19Z" /></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15m6-12v15" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  plus: <><path d="M12 5v14m-7-7h14" /></>,
  router: <><rect x="3" y="10" width="18" height="10" rx="2" /><path d="M7 10V6m10 4V6M7 15h.01M11 15h.01M15 15h.01M19 15h.01M9 6a4 4 0 0 1 6 0" /></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3M4 12h16" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.7Z" transform="translate(-1 -1)" /></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  signal: <><path d="M2 8.8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-11 3a5 5 0 0 1 8 0m-4 4h.01" /></>,
  sliders: <><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4" /></>,
  wifi: <><path d="M5 12.5a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0M12 20h.01M2 9a16 16 0 0 1 20 0" /></>,
  x: <><path d="m18 6-12 12M6 6l12 12" /></>,
}

function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconShapes[name]}
    </svg>
  )
}
type PageName = 'Overview' | 'Network map' | 'Devices' | 'Activity' | 'Settings'
type Device = {
  name: string
  type: 'Network device'
  ip: string
  mac: string
  interface: string
  status: 'Online'
  icon: 'computer'
}
type NetworkInterface = {
  name: string
  ipv4: string[]
  mac: string | null
  is_up: boolean | null
}
type SystemStatus = {
  hostname: string
  platform: string
}
type WifiStatus = {
  supported: boolean
  connected?: boolean
  ssid?: string | null
  bssid?: string | null
  signal?: string | null
  radio_type?: string | null
  message?: string
}
type ScanResult = {
  network: string
  device_count: number
  devices: Array<{ ip: string; mac: string; interface: string }>
}
async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  const responseText = await response.text()
  let body: unknown
  if (responseText.trim()) {
    try {
      body = JSON.parse(responseText)
    } catch {
      body = responseText
    }
  }

  if (!response.ok) {
    const detail = typeof body === 'object' && body !== null && 'detail' in body
      ? String(body.detail)
      : typeof body === 'string'
        ? body
        : `Request failed (${response.status} ${response.statusText})`
    throw new Error(detail)
  }

  if (body === undefined) {
    throw new Error(`The API returned an empty response for ${path}.`)
  }
  if (typeof body !== 'object' || body === null) {
    throw new Error(`The API returned an invalid response for ${path}.`)
  }
  return body as T
}
function toDevices(scan: ScanResult): Device[] {
  return scan.devices.map((device) => ({
    name: `Host ${device.ip}`,
    type: 'Network device',
    ip: device.ip,
    mac: device.mac,
    interface: device.interface,
    status: 'Online',
    icon: 'computer',
  }))
}
function isPrivateIPv4(value: string): boolean {
  const octets = value.split('.').map((part) => {
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return Number.NaN
    return Number(part)
  })

  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false
  }

  const [first, second] = octets
  return first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168)
}

const navItems: { label: PageName; icon: IconName }[] = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Network map', icon: 'map' },
  { label: 'Devices', icon: 'computer' },
  { label: 'Activity', icon: 'activity' },
]

function App() {
  const [activeNav, setActiveNav] = useState<PageName>('Overview')
  const [query, setQuery] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanMessage, setScanMessage] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [system, setSystem] = useState<SystemStatus | null>(null)
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([])
  const [wifi, setWifi] = useState<WifiStatus | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [activity, setActivity] = useState<NetworkMapActivity[]>([])
  const [scanNetwork, setScanNetwork] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [routerIp, setRouterIp] = useState('')
  const [routerUrl, setRouterUrl] = useState('')
  const [routerError, setRouterError] = useState('')
  const refreshData = useCallback(async () => {
    setApiError('')
    try {
      const [systemData, interfaceData, wifiData] = await Promise.all([
        fetchApi<SystemStatus>('/api/system'),
        fetchApi<{ interfaces: NetworkInterface[] }>('/api/interfaces'),
        fetchApi<WifiStatus>('/api/wifi'),
      ])
      setSystem(systemData)
      setInterfaces(interfaceData.interfaces)
      setWifi(wifiData)
      setLastUpdated(new Date())
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to reach the WiMap backend.')
    } finally {
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    void Promise.resolve().then(refreshData)
  }, [refreshData])

  const filteredDevices = useMemo(
    () => devices.filter((device) =>
      `${device.name} ${device.ip} ${device.mac} ${device.interface}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [devices, query],
  )
  const startScan = async (network = scanNetwork) => {
    if (isScanning) return
    setIsScanning(true)
    setScanMessage('')
    setApiError('')
    const networkQuery = network.trim()
      ? `?${new URLSearchParams({ network: network.trim() }).toString()}`
      : ''
    setActivity((current) => [{
      id: `${Date.now()}-started`,
      kind: 'scan' as const,
      message: 'Network scan started',
      details: network.trim()
        ? `The backend is scanning ${network.trim()}.`
        : 'The backend is auto-detecting the local network.',
      occurredAt: new Date().toISOString(),
    }, ...current].slice(0, 20))
    try {
      const result = await fetchApi<ScanResult>(`/api/scan${networkQuery}`, { method: 'POST' })
      setDevices(toDevices(result))
      setScanMessage(`Scan complete · ${result.device_count} device${result.device_count === 1 ? '' : 's'} found on ${result.network}`)
      setLastUpdated(new Date())
      setActivity((current) => [{
        id: `${Date.now()}-complete`,
        kind: 'scan' as const,
        message: 'Network scan completed',
        details: `${result.device_count} device${result.device_count === 1 ? '' : 's'} found on ${result.network}.`,
        occurredAt: new Date().toISOString(),
      }, ...current].slice(0, 20))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network scan failed.'
      setApiError(message)
      setActivity((current) => [{
        id: `${Date.now()}-failed`,
        kind: 'error' as const,
        message: 'Network scan failed',
        details: message,
        occurredAt: new Date().toISOString(),
      }, ...current].slice(0, 20))
    } finally {
      setIsScanning(false)
    }
  }
  const activeInterfaceCount = interfaces.filter((networkInterface) => networkInterface.is_up).length
  const primaryAddress = interfaces.find((networkInterface) => networkInterface.is_up && networkInterface.ipv4.length > 0)?.ipv4[0]
  const navigateTo = (page: PageName) => {
    setActiveNav(page)
    setApiError('')
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="WiMap home" onClick={() => navigateTo('Overview')}>
          <span className="brand-mark"><Icon name="signal" size={21} /></span>
          <span>wimap<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="network-switcher">
          <span className="network-switcher-icon"><Icon name="wifi" size={16} /></span>
          <span className="network-switcher-copy"><strong>{system?.hostname ?? 'Local machine'}</strong><small>{primaryAddress ?? 'No active IPv4 address'}</small></span>
          <span className="switcher-caret">⌄</span>
        </button>

        <div className="nav-label">MENU</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => navigateTo(item.label)}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.label === 'Devices' && <span className="nav-count">{devices.length}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-label tools-label">PREFERENCES</div>
        <nav className="primary-nav">
          <button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} onClick={() => navigateTo('Settings')}>
            <Icon name="settings" size={18} /><span>Settings</span>
          </button>
          <button className="nav-item" onClick={() => setShowNotifications((shown) => !shown)}>
            <Icon name="bell" size={18} /><span>Notifications</span><span className="notification-dot" />
          </button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="upgrade-card">
          <span className="upgrade-icon"><Icon name="shield" size={18} /></span>
          <strong>{system ? 'Backend connected' : 'Backend status'}</strong>
          <p>{system ? system.hostname : 'Waiting for API connection.'}</p>
          <div className="upgrade-status"><span />{system ? 'API available' : 'Not connected'}</div>
        </div>
        <button className="profile-button">
          <span className="avatar">JD</span>
          <span className="profile-copy"><strong>Jordan Davis</strong><small>Home administrator</small></span>
          <Icon name="dots" size={18} />
        </button>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <span className="last-synced"><span className={`live-dot ${system ? '' : 'offline-dot'}`} />{system ? 'Backend connected' : 'Backend offline'}</span>
            <div className="notification-wrap">
              <button className={`icon-button ${showNotifications ? 'pressed' : ''}`} aria-label="Toggle notifications" onClick={() => setShowNotifications((shown) => !shown)}>
                <Icon name="bell" size={19} /><span className="bell-dot" />
              </button>
              {showNotifications && <div className="notification-popover"><strong>All caught up</strong><p>Your network is healthy. No new alerts.</p></div>}
            </div>
            <span className="top-avatar">JD</span>
          </div>
        </header>
        <div className="page-content">
          {activeNav === 'Settings' ? (
            <section className="settings-view panel">
              <div className="settings-view-header">
                <div>
                  <h1>Settings</h1>
                  <p className="page-subtitle">Backend connection and local network status.</p>
                </div>
                <button className="outline-button" onClick={() => void refreshData()}><Icon name="activity" size={15} /> Refresh status</button>
              </div>
              {apiError && <p className="api-error" role="alert">{apiError}</p>}
              <dl className="settings-list">
                <div><dt>Backend</dt><dd className={system ? 'settings-connected' : 'settings-disconnected'}>{system ? 'Connected' : 'Unavailable'}</dd></div>
                <div><dt>Host name</dt><dd>{system?.hostname ?? 'Not available'}</dd></div>
                <div><dt>Platform</dt><dd>{system?.platform ?? 'Not available'}</dd></div>
                <div><dt>Active network interfaces</dt><dd>{activeInterfaceCount}</dd></div>
                <div><dt>Wi-Fi</dt><dd>{wifi?.connected ? wifi.ssid ?? 'Connected' : wifi?.message ?? 'Not connected'}</dd></div>
                <div><dt>Last data refresh</dt><dd>{lastUpdated?.toLocaleString() ?? 'Not refreshed yet'}</dd></div>
              </dl>
            </section>
          ) : activeNav === 'Network map' || activeNav === 'Devices' || activeNav === 'Activity' ? (
            <NetworkMap
              view={activeNav}
              devices={devices}
              activity={activity}
              isScanning={isScanning}
              scanNetwork={scanNetwork}
              onScanNetworkChange={setScanNetwork}
              onScan={(network) => void startScan(network)}
            />
          ) : (
            <>
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" />{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</div>
              <h1>WiMap network overview <span className="wave">✦</span></h1>
              <p className="page-subtitle">Live network and Wi-Fi information from this computer.</p>
            </div>
            <div className="scan-controls">
              <label className="scan-network-field">
                <span>Subnet CIDR · max /24</span>
                <input
                  value={scanNetwork}
                  onChange={(event) => setScanNetwork(event.target.value)}
                  placeholder="Auto-detect or e.g. 192.168.1.0/24"
                  aria-label="Private network subnet in CIDR notation"
                />
                <small>A plain IP scans one host; use /24 or smaller for a segment.</small>
              </label>
              <button className={`scan-button ${isScanning ? 'scanning' : ''}`} onClick={() => void startScan()} disabled={isScanning}>
                <Icon name="scan" size={17} />{isScanning ? 'Scanning network...' : 'Scan network'}
              </button>
            </div>
          </section>
          {scanMessage && <div className="scan-toast"><span className="toast-check"><Icon name="check" size={14} /></span>{scanMessage}</div>}
          {apiError && <div className="api-error" role="alert">{apiError}</div>}
          <section className="stats-grid" aria-label="Network summary">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon devices-icon"><Icon name="computer" size={19} /></span><span className="stat-trend">{devices.length ? 'Latest scan' : 'Not scanned'}</span></div>
              <div className="stat-value">{isLoading ? '…' : devices.length}<span className="stat-unit"> devices</span></div>
              <div className="stat-caption">Devices discovered by the latest scan</div>
              <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon router-icon"><Icon name="router" size={19} /></span><span className="status-tag"><span />{isLoading ? 'Loading' : 'Interfaces'}</span></div>
              <div className="stat-value">{isLoading ? '…' : activeInterfaceCount}<span className="stat-unit"> active</span></div>
              <div className="stat-caption">Network interfaces currently up</div>
              <div className="router-bars"><span /><span /><span /><span /><span /><small>{primaryAddress ?? 'No active IPv4'}</small></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon security-icon"><Icon name="wifi" size={19} /></span><span className="secure-tag">{wifi?.connected ? 'Connected' : 'Wi-Fi'}</span></div>
              <div className="stat-value">{wifi?.connected ? wifi.ssid || 'Connected' : wifi?.supported === false ? 'Unavailable' : isLoading ? '…' : 'Not connected'}</div>
              <div className="stat-caption">{wifi?.signal ? `Signal ${wifi.signal}` : wifi?.message ?? 'Wi-Fi status from the backend'}</div>
              <div className="health-track"><span style={{ width: wifi?.connected ? '100%' : '0%' }} /></div>
            </article>
            <article className="stat-card bandwidth-card">
              <div className="stat-top"><span className="stat-icon bandwidth-icon"><Icon name="computer" size={19} /></span><span className="bandwidth-time">SYSTEM</span></div>
              <div className="stat-value">{system?.hostname ?? (isLoading ? '…' : 'Unavailable')}</div>
              <div className="stat-caption">{system?.platform ?? 'Host system reported by the backend'}</div>
              <div className="bandwidth-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
          </section>
          <section className="map-panel panel">
            <div className="panel-heading">
              <div>
                <div className="panel-title-row"><h2>Network interfaces</h2><span className="map-live"><span />LIVE</span></div>
                <p className="panel-subtitle">Interfaces and addresses reported by this computer</p>
              </div>
              <button className="outline-button map-options" onClick={() => void refreshData()} disabled={isLoading}><Icon name="activity" size={15} /> Refresh</button>
            </div>
            <div className="network-interface-list">
              {interfaces.map((networkInterface) => (
                <article className="interface-card" key={networkInterface.name}>
                  <span className="interface-card-icon"><Icon name="router" size={18} /></span>
                  <span className="interface-card-copy">
                    <strong>{networkInterface.name}</strong>
                    <small>{networkInterface.ipv4.length ? networkInterface.ipv4.join(', ') : 'No IPv4 address'}</small>
                  </span>
                  <span className={`interface-state ${networkInterface.is_up ? 'interface-up' : 'interface-down'}`}>
                    <i />{networkInterface.is_up ? 'Up' : 'Down'}
                  </span>
                </article>
              ))}
              {!isLoading && interfaces.length === 0 && <p className="interface-empty">No network interfaces were reported.</p>}
            </div>
            <div className="map-footer">
              <div className="map-summary"><span className="summary-icon"><Icon name="wifi" size={15} /></span><span><strong>{wifi?.connected ? wifi.ssid || 'Wi-Fi connected' : 'Wi-Fi not connected'}</strong><small>{wifi?.bssid ?? wifi?.message ?? 'Wi-Fi details from this computer'}</small></span></div>
              <div className="map-footer-divider" />
              <div className="map-summary"><span className="summary-icon clients-summary"><Icon name="computer" size={15} /></span><span><strong>{devices.length} discovered devices</strong><small>{lastUpdated ? `Scanned ${lastUpdated.toLocaleTimeString()}` : 'Run a scan to discover local devices'}</small></span></div>
              <button className="text-button" onClick={() => navigateTo('Devices')}>View discovered devices <Icon name="chevron" size={15} /></button>
            </div>
          </section>
          <section className="router-access panel">
            <div>
              <h2>Open router sign-in</h2>
              <p className="panel-subtitle">Enter your router’s private IPv4 address to open its web interface. You’ll still need to sign in with credentials set on the router.</p>
            </div>
            <form
              className="router-access-form"
              onSubmit={(event) => {
                event.preventDefault()
                const address = routerIp.trim()
                if (!isPrivateIPv4(address)) {
                  setRouterError('Enter a valid private IPv4 address, such as 192.168.1.1.')
                  setRouterUrl('')
                  return
                }
                setRouterError('')
                setRouterUrl(`http://${address}/`)
              }}
            >
              <label className="router-ip-field">
                <span>Router IP address</span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="192.168.1.1"
                  value={routerIp}
                  onChange={(event) => {
                    setRouterIp(event.target.value)
                    setRouterUrl('')
                    setRouterError('')
                  }}
                  aria-invalid={Boolean(routerError)}
                  aria-describedby={routerError ? 'router-ip-error' : undefined}
                />
              </label>
              <button className="scan-button" type="submit">Use address</button>
              {routerUrl && <a className="outline-button router-open-link" href={routerUrl} target="_blank" rel="noopener noreferrer">Open router sign-in</a>}
            </form>
            {routerError && <p className="router-error" id="router-ip-error" role="alert">{routerError}</p>}
          </section>
          <section className="devices-panel panel">
            <div className="devices-heading">
              <div><h2>Discovered devices <span className="heading-count">{devices.length}</span></h2><p className="panel-subtitle">Hosts that responded to the latest local network scan</p></div>
              <label className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search devices..." aria-label="Search devices" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><Icon name="x" size={14} /></button>}</label>
            </div>
            <div className="device-table-wrap">
              <table className="device-table">
                <thead><tr><th>DEVICE</th><th>IP ADDRESS</th><th>MAC ADDRESS</th><th>STATUS</th><th>INTERFACE</th><th /></tr></thead>
                <tbody>
                  {filteredDevices.map((device) => (
                    <tr key={device.name} className={selectedDevice?.name === device.name ? 'selected-row' : ''} onClick={() => setSelectedDevice(device)}>
                      <td><span className="table-device-icon"><Icon name={device.icon} size={17} /></span><span className="device-name">{device.name}<small>{device.type}</small></span></td>
                      <td className="ip-address">{device.ip}</td>
                      <td className="ip-address">{device.mac}</td>
                      <td><span className={`device-status ${device.status === 'Online' ? 'online-status' : 'idle-status'}`}><i />{device.status}</span></td>
                      <td>{device.interface}</td>
                      <td><button className="row-more" aria-label={`More about ${device.name}`} onClick={(event) => { event.stopPropagation(); setSelectedDevice(device) }}><Icon name="dots" size={17} /></button></td>
                    </tr>
                  ))}
                  {filteredDevices.length === 0 && <tr><td className="empty-state" colSpan={6}>{query ? `No devices match “${query}”.` : isLoading ? 'Connecting to the backend…' : 'No scan results yet. Use “Scan network” to discover local devices.'}</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredDevices.length}</strong> of <strong>{devices.length}</strong> devices</span>{query && <button className="text-button" onClick={() => { navigateTo('Devices'); setQuery('') }}>Clear search <Icon name="chevron" size={15} /></button>}</div>
          </section>
          <footer className="page-footer"><span>WiMap · Local network monitor</span><span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Waiting for backend'} <i /></span></footer>
            </>
          )}
        </div>
      </main>
      {selectedDevice && (
        <div className="detail-backdrop" onClick={() => setSelectedDevice(null)}>
          <aside className="device-detail" onClick={(event) => event.stopPropagation()}>
            <div className="detail-top"><span className="detail-device-icon"><Icon name={selectedDevice.icon} size={21} /></span><button className="icon-button" aria-label="Close device details" onClick={() => setSelectedDevice(null)}><Icon name="x" size={19} /></button></div>
            <span className="detail-label">DEVICE DETAILS</span>
            <h2>{selectedDevice.name}</h2>
            <span className={`device-status ${selectedDevice.status === 'Online' ? 'online-status' : 'idle-status'}`}><i />{selectedDevice.status}</span>
            <div className="detail-divider" />
            <div className="detail-row"><span>Device type</span><strong>{selectedDevice.type}</strong></div>
            <div className="detail-row"><span>IP address</span><strong>{selectedDevice.ip}</strong></div>
            <div className="detail-row"><span>MAC address</span><strong>{selectedDevice.mac}</strong></div>
            <div className="detail-row"><span>Network interface</span><strong>{selectedDevice.interface}</strong></div>
            <button className="detail-action" onClick={() => setSelectedDevice(null)}>Done</button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
