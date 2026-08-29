const DEVICE_ID_STORAGE_KEY = 'deviceId';

// A persistent, per-browser identifier — not tied to the logged-in user —
// sent as X-Device-Id on login/refresh so scire-auth can recognize "this
// device" across sessions (device/session listing, 2FA trusted-device skip).
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }
  return deviceId;
}
