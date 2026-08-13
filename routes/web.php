<?php

use Illuminate\Support\Facades\Route;

Route::get('{any}', function () {
    $pathDist = public_path('dist/index.html');
    if (file_exists($pathDist)) {
        return response()->file($pathDist);
    }

    $pathRoot = public_path('index.html');
    if (file_exists($pathRoot)) {
        return response()->file($pathRoot);
    }

    return response('Front-end index.html not found. Please build the frontend app.', 404);
})->where('any', '^(?!api|sanctum|storage).*$');
