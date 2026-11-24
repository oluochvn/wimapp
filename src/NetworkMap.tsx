import './App.css'

export type NetworkMapDevice = {
  name: string
  ip: string
  mac: string
  interface: string
  status: string
}

export type NetworkMapActivity = {
  id: string
  kind: 'scan' | 'error'
  message: string
  details: string
  occurredAt: string
}

type NetworkMapView = 'Network map' | 'Devices' | 'Activity'

type NetworkMapProps = {
  view: NetworkMapView
  devices: NetworkMapDevice[]
  activity: NetworkMapActivity[]
  isScanning: boolean
  scanNetwork: string
  onScanNetworkChange: (network: string) => void
  onScan: (network: string) => void
}
function NetworkMap({
  view,
  devices,
  activity,
  isScanning,
  scanNetwork,
  onScanNetworkChange,
  onScan,
}: NetworkMapProps) {
  const showDevices = view !== 'Activity'
  const showActivity = view !== 'Devices'

  return (
    <div className="network-map-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />LOCAL NETWORK</div>
          <h1>{view}</h1>
          <p className="page-subtitle">Discovered hosts and scan activity reported by the backend.</p>
        </div>
        <div className="scan-controls">
          <label className="scan-network-field">
            <span>Subnet CIDR · max /24</span>
            <input
              value={scanNetwork}
              onChange={(event) => onScanNetworkChange(event.target.value)}
              placeholder="Auto-detect or e.g. 192.168.1.0/24"
              aria-label="Private network subnet in CIDR notation"
            />
            <small>A plain IP scans one host; use /24 or smaller for a segment.</small>
          </label>
          <button className={`scan-button ${isScanning ? 'scanning' : ''}`} onClick={() => onScan(scanNetwork)} disabled={isScanning}>
            {isScanning ? 'Scanning network...' : 'Scan network'}
          </button>
        </div>
      </section>

      <div className={`network-map-sections ${showDevices && showActivity ? '' : 'single-section'}`}>
        {showDevices && (
          <section className="panel network-map-panel">
            <div className="network-map-panel-heading">
              <div>
                <h2>Discovered devices <span className="heading-count">{devices.length}</span></h2>
                <p className="panel-subtitle">Devices that responded to the latest ARP scan</p>
              </div>
            </div>
            {devices.length ? (
              <div className="network-map-device-list">
                {devices.map((device) => (
                  <article className="network-map-device" key={`${device.ip}-${device.mac}`}>
                    <span className="network-map-device-dot" aria-hidden="true" />
                    <span className="network-map-device-info">
                      <strong>{device.name}</strong>
                      <small>{device.ip} · {device.mac}</small>
                      <small>Interface: {device.interface}</small>
                    </span>
                    <span className="device-status online-status"><i />{device.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="network-map-empty">No scan results yet. Start a scan to discover devices on your local network.</p>
            )}
          </section>
        )}

        {showActivity && (
          <section className="panel network-map-panel">
            <div className="network-map-panel-heading">
              <div>
                <h2>Recent activity</h2>
                <p className="panel-subtitle">Events recorded during this browser session</p>
              </div>
            </div>
            {activity.length ? (
              <ol className="network-activity-list">
                {activity.map((event) => (
                  <li className="network-activity-item" key={event.id}>
                    <span className={`network-activity-marker ${event.kind === 'error' ? 'activity-error' : ''}`} />
                    <div className="network-activity-copy">
                      <strong>{event.message}</strong>
                      <p>{event.details}</p>
                      <time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleString()}</time>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="network-map-empty">No activity yet. Start a scan to record the first event.</p>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default NetworkMap
