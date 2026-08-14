<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorLog;
use Illuminate\Http\Request;

class VisitorLogController extends Controller
{
    /**
     * Record a new visitor log unless the same user/IP/session has visited within the last 2 hours.
     */
    public function log(Request $request)
    {
        $clientIp = $request->input('ip_address');
        $serverIp = $request->ip();
        $ip = ($clientIp && in_array($serverIp, ['127.0.0.1', '::1', 'localhost'])) ? $clientIp : ($serverIp ?: ($clientIp ?: '127.0.0.1'));
        $user = $request->user();
        $userId = $user?->id;
        $sessionId = $request->input('session_id');
        $twoHoursAgo = now()->subHours(2);

        // De-duplication check: Look for visit in last 2 hours from same user, session, or IP
        $existing = VisitorLog::where('created_at', '>=', $twoHoursAgo)
            ->where(function ($query) use ($ip, $userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                }
                if ($sessionId) {
                    $query->orWhere('session_id', $sessionId);
                }
                $query->orWhere('ip_address', $ip);
            })
            ->latest()
            ->first();

        if ($existing) {
            return response()->json([
                'logged' => false,
                'message' => 'Visit already recorded within the last 2 hours.',
                'data' => $existing,
            ]);
        }

        // Determine if New Visitor or Returning Visitor across all time
        $hasPreviousVisit = VisitorLog::where(function ($query) use ($ip, $userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            }
            if ($sessionId) {
                $query->orWhere('session_id', $sessionId);
            }
            $query->orWhere('ip_address', $ip);
        })->exists();

        $visitorStatus = $hasPreviousVisit ? 'Returning Visitor' : 'New Visitor';

        // Parse user agent basics if not sent by client
        $userAgent = substr($request->header('User-Agent', ''), 0, 500);

        $log = VisitorLog::create([
            'user_id' => $userId,
            'ip_address' => $ip,
            'country' => $request->input('country', 'India'),
            'state' => $request->input('state', 'Gujarat'),
            'city' => $request->input('city', 'Ahmedabad'),
            'timezone' => $request->input('timezone', 'Asia/Kolkata'),
            'device_type' => $request->input('device_type', 'Desktop'),
            'os' => $request->input('os', 'macOS'),
            'browser' => $request->input('browser', 'Chrome'),
            'browser_version' => $request->input('browser_version', '120.0'),
            'screen_resolution' => $request->input('screen_resolution', '1920x1080'),
            'language' => $request->input('language', 'en-US'),
            'referrer_url' => $request->input('referrer_url', 'Direct / None'),
            'landing_page' => substr($request->input('landing_page', '/'), 0, 255),
            'page_url' => substr($request->input('page_url', '/'), 0, 255),
            'utm_params' => $request->input('utm_params', 'None'),
            'session_id' => $sessionId ?: ('sess_' . substr(md5(uniqid()), 0, 10) . '_' . time()),
            'visitor_status' => $visitorStatus,
            'user_agent' => $userAgent,
        ]);

        return response()->json([
            'logged' => true,
            'message' => 'New visitor log recorded successfully.',
            'data' => $log,
        ], 201);
    }

    /**
     * Get list of visitor logs with pagination & summary stats for Admin dashboard.
     */
    public function index(Request $request)
    {
        $query = VisitorLog::with('user')->orderBy('id', 'desc');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('page_url', 'like', "%{$search}%")
                  ->orWhere('browser', 'like', "%{$search}%")
                  ->orWhere('os', 'like', "%{$search}%")
                  ->orWhere('visitor_status', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 10);
        $logs = $query->paginate($perPage);

        $totalVisits = VisitorLog::count();
        $uniqueIps = VisitorLog::distinct('ip_address')->count('ip_address');
        $todayVisits = VisitorLog::whereDate('created_at', now()->today())->count();
        $last24hVisits = VisitorLog::where('created_at', '>=', now()->subHours(24))->count();

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'stats' => [
                'total_visits' => $totalVisits,
                'unique_ips' => $uniqueIps,
                'today_visits' => $todayVisits,
                'last_24h_visits' => $last24hVisits,
            ],
        ]);
    }
}
