<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        $defaults = [
            'site_address' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
            'site_phone' => '+91 98765 43210 / +91 79 4000 8888',
            'site_email' => 'divyesh@dvsrealty.com',
            'site_working_hours' => 'Mon - Sat: 9:00 AM - 8:00 PM IST',
        ];

        return response()->json(array_merge($defaults, $settings->toArray()));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_address' => 'nullable|string',
            'site_phone' => 'nullable|string',
            'site_email' => 'nullable|string|email',
            'site_working_hours' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value ?? '');
        }

        $settings = Setting::all()->pluck('value', 'key');
        $defaults = [
            'site_address' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
            'site_phone' => '+91 98765 43210 / +91 79 4000 8888',
            'site_email' => 'divyesh@dvsrealty.com',
            'site_working_hours' => 'Mon - Sat: 9:00 AM - 8:00 PM IST',
        ];

        return response()->json([
            'message' => 'Site contact settings updated successfully.',
            'data' => array_merge($defaults, $settings->toArray()),
        ]);
    }
}
