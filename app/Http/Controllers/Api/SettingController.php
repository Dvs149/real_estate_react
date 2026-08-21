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
        
        $defaultNav = json_encode([
            ['id' => 'home', 'name' => 'Home', 'href' => '/', 'enabled' => true],
            ['id' => 'buy', 'name' => 'Buy', 'href' => '/properties?purpose=buy', 'enabled' => true],
            ['id' => 'rent', 'name' => 'Rent', 'href' => '/properties?purpose=rent', 'enabled' => true],
            ['id' => 'properties', 'name' => 'Properties', 'href' => '/properties', 'enabled' => true],
            ['id' => 'agents', 'name' => 'Agents', 'href' => '/agents', 'enabled' => true],
            ['id' => 'blog', 'name' => 'Blog', 'href' => '/blog', 'enabled' => true],
            ['id' => 'about', 'name' => 'About', 'href' => '/about', 'enabled' => true],
            ['id' => 'contact', 'name' => 'Contact', 'href' => '/contact', 'enabled' => true],
        ]);

        $defaults = [
            'site_address' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
            'site_phone' => '+91 98765 43210 / +91 79 4000 8888',
            'site_email' => 'divyesh@dvsrealty.com',
            'site_working_hours' => 'Mon - Sat: 9:00 AM - 8:00 PM IST',
            'nav_menu_config' => $defaultNav,
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
            'nav_menu_config' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value ?? '');
        }

        $settings = Setting::all()->pluck('value', 'key');
        $defaultNav = json_encode([
            ['id' => 'home', 'name' => 'Home', 'href' => '/', 'enabled' => true],
            ['id' => 'buy', 'name' => 'Buy', 'href' => '/properties?purpose=buy', 'enabled' => true],
            ['id' => 'rent', 'name' => 'Rent', 'href' => '/properties?purpose=rent', 'enabled' => true],
            ['id' => 'properties', 'name' => 'Properties', 'href' => '/properties', 'enabled' => true],
            ['id' => 'agents', 'name' => 'Agents', 'href' => '/agents', 'enabled' => true],
            ['id' => 'blog', 'name' => 'Blog', 'href' => '/blog', 'enabled' => true],
            ['id' => 'about', 'name' => 'About', 'href' => '/about', 'enabled' => true],
            ['id' => 'contact', 'name' => 'Contact', 'href' => '/contact', 'enabled' => true],
        ]);

        $defaults = [
            'site_address' => 'Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
            'site_phone' => '+91 98765 43210 / +91 79 4000 8888',
            'site_email' => 'divyesh@dvsrealty.com',
            'site_working_hours' => 'Mon - Sat: 9:00 AM - 8:00 PM IST',
            'nav_menu_config' => $defaultNav,
        ];

        return response()->json([
            'message' => 'Site contact settings updated successfully.',
            'data' => array_merge($defaults, $settings->toArray()),
        ]);
    }
}
