<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    // Método LOGIN con token
    public function login(Request $request)
    {
        try {
            // Validar datos
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "status" => 400,
                    "message" => "Error de validación",
                    "errors" => $validator->errors(),
                    "login" => false
                ], 400);
            }

            // Buscar usuario
            $usuario = Usuario::where('email', $request->email)
                            ->where('estado', 1)
                            ->first();

            if (!$usuario) {
                return response()->json([
                    "status" => 400,
                    "message" => "Usuario no encontrado o inactivo",
                    "login" => false
                ], 400);
            }

            // Verificar contraseña
            if (Hash::check($request->password, $usuario->password)) {
                // Crear token
                $token = $usuario->createAuthToken();
                
                return response()->json([
                    "status" => 200,
                    "message" => "Login exitoso",
                    "user" => [
                        "id" => $usuario->id,
                        "nombre" => $usuario->nombre,
                        "email" => $usuario->email
                    ],
                    "token" => $token,
                    "login" => true
                ], 200);
            } else {
                return response()->json([
                    "status" => 400,
                    "message" => "Contraseña incorrecta",
                    "login" => false
                ], 400);
            }

        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "error" => "Error interno del servidor: " . $e->getMessage(),
                "login" => false
            ], 500);
        }
    }

    // Método REGISTER con token automático
    public function register(Request $request)
    {
        try {
            // Validar datos
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255',
                'email' => 'required|email|unique:usuarios',
                'password' => 'required|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    "status" => 400,
                    "message" => "Error de validación",
                    "errors" => $validator->errors()
                ], 400);
            }

            // Crear usuario
            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'email' => $request->email,
                'password' => $request->password,
                'estado' => 1
            ]);

            // Crear token automáticamente después del registro
            $token = $usuario->createAuthToken();

            return response()->json([
                "status" => 201,
                "message" => "Usuario registrado exitosamente",
                "user" => [
                    "id" => $usuario->id,
                    "nombre" => $usuario->nombre,
                    "email" => $usuario->email
                ],
                "token" => $token
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "error" => "Error interno del servidor: " . $e->getMessage()
            ], 500);
        }
    }

    // Método LOGOUT (opcional)
    public function logout(Request $request)
    {
        try {
            // Eliminar todos los tokens del usuario
            $request->user()->tokens()->delete();
            
            return response()->json([
                "status" => 200,
                "message" => "Logout exitoso"
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "error" => "Error interno del servidor: " . $e->getMessage()
            ], 500);
        }
    }

    // Método para obtener perfil de usuario (protegido)
    public function profile(Request $request)
    {
        try {
            return response()->json([
                "status" => 200,
                "user" => [
                    "id" => $request->user()->id,
                    "nombre" => $request->user()->nombre,
                    "email" => $request->user()->email
                ]
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "error" => "Error interno del servidor: " . $e->getMessage()
            ], 500);
        }
    }
}