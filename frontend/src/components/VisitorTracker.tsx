import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logVisitor } from '../services/api';

function detectOS(ua: string): string {
  if (ua.includes('Mac OS X') || ua.includes('Macintosh')) return 'macOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Desktop OS';
}

function detectBrowser(ua: string): { name: string; version: string } {
  let name = 'Chrome';
  let version = '120.0';

  if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.split('Edg/')[1]?.split(' ')[0] || '120.0';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.split('Chrome/')[1]?.split(' ')[0] || '120.0';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    name = 'Safari';
    version = ua.split('Version/')[1]?.split(' ')[0] || '17.0';
  } else if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.split('Firefox/')[1]?.split(' ')[0] || '121.0';
  }

  return { name, version };
}

async function fetchGeoData() {
  const cached = sessionStorage.getItem('dvs_geo_info');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        const geoInfo = {
          ip_address: data.ip,
          country: data.country_name || data.country || 'India',
          state: data.region || 'Gujarat',
          city: data.city || 'Ahmedabad',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        };
        sessionStorage.setItem('dvs_geo_info', JSON.stringify(geoInfo));
        return geoInfo;
      }
    }
  } catch (e) {
    try {
      const res2 = await fetch('https://ip-api.com/json/?fields=query,country,regionName,city,timezone', { signal: AbortSignal.timeout(3000) });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.query) {
          const geoInfo = {
            ip_address: data2.query,
            country: data2.country || 'India',
            state: data2.regionName || 'Gujarat',
            city: data2.city || 'Ahmedabad',
            timezone: data2.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
          };
          sessionStorage.setItem('dvs_geo_info', JSON.stringify(geoInfo));
          return geoInfo;
        }
      }
    } catch (e2) {}
  }

  return null;
}

export default function VisitorTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function recordVisit() {
      try {
        // 1. Session ID (Persisted per tab/browser session)
        let sessionId = sessionStorage.getItem('dvs_visitor_session_id');
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
          sessionStorage.setItem('dvs_visitor_session_id', sessionId);
        }

        // 2. Landing Page
        let landingPage = sessionStorage.getItem('dvs_landing_page');
        if (!landingPage) {
          landingPage = pathname;
          sessionStorage.setItem('dvs_landing_page', landingPage);
        }

        // 3. User Agent & Device info
        const ua = navigator.userAgent || '';
        const deviceType = /Mobi|Android|iPhone|iPad|Tablet/i.test(ua) ? 'Mobile' : 'Desktop';
        const os = detectOS(ua);
        const { name: browser, version: browserVersion } = detectBrowser(ua);
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const language = navigator.language || 'en-US';
        const fallbackTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
        const referrerUrl = document.referrer || 'Direct / None';

        // 4. UTM Parameters
        const searchParams = new URLSearchParams(search);
        const utmParts: string[] = [];
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
          if (searchParams.has(key)) {
            utmParts.push(`${key}=${searchParams.get(key)}`);
          }
        });
        const utmParams = utmParts.length > 0 ? utmParts.join('&') : 'None';

        // 5. Fetch Real Geolocation Data for Unknown Visitors
        const geoInfo = await fetchGeoData();

        const payload: Record<string, any> = {
          session_id: sessionId,
          landing_page: landingPage,
          page_url: pathname,
          referrer_url: referrerUrl,
          device_type: deviceType,
          os,
          browser,
          browser_version: browserVersion,
          screen_resolution: screenResolution,
          language,
          timezone: geoInfo?.timezone || fallbackTimezone,
          utm_params: utmParams,
        };

        if (geoInfo) {
          if (geoInfo.ip_address) payload.ip_address = geoInfo.ip_address;
          if (geoInfo.country) payload.country = geoInfo.country;
          if (geoInfo.state) payload.state = geoInfo.state;
          if (geoInfo.city) payload.city = geoInfo.city;
        }

        if (isMounted) {
          logVisitor(payload).catch((err) => console.error('Visitor log error:', err));
        }
      } catch (e) {
        console.error('Visitor telemetry detection failed:', e);
      }
    }

    recordVisit();

    return () => {
      isMounted = false;
    };
  }, [pathname, search]);

  return null;
}
