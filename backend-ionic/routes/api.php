<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

// Rutas públicas
Route::post('login', [UsuarioController::class, 'login']);
Route::post('register', [UsuarioController::class, 'register']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [UsuarioController::class, 'logout']);
    Route::get('profile', [UsuarioController::class, 'profile']);
});