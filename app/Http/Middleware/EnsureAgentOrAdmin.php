<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAgentOrAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !in_array($request->user()->role, ['admin', 'agent'])) {
            return response()->json([
                'message' => 'Unauthorized. Admin or Agent privileges required.'
            ], 403);
        }

        return $next($request);
    }
}
