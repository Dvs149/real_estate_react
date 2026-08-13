<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['nullable', 'string', 'in:user,agent'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? 'user',
            'status' => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Account registered successfully',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials provided.',
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is deactivated. Please contact support.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'string'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
