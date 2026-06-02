// Browser notifications. The web Notification API works for in-session
// alerts and (in many PWAs) for true push when paired with a service worker
// + FCM/APNs backend. The latter requires server work we leave for Phase 3.

export async function requestNotifPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try { return await Notification.requestPermission(); }
  catch { return 'denied'; }
}

export function fireNotification(title, body, opts = {}) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png', ...opts });
    n.onclick = () => { try { window.focus(); } catch {} };
  } catch {}
}
