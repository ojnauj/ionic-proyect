<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $clientes = Cliente::all();
            return response()->json([
                'status' => 200,
                'clientes' => $clientes
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validar datos
            $validator = Validator::make($request->all(), [
                'tipo_cliente' => 'required|string|max:20',
                'tipo_documento' => 'required|string|max:30',
                'numero_documento' => 'required|string|max:20',
                'nombres' => 'required|string',
                'direccion' => 'required|string',
                'telefono' => 'required|string|size:9',
                'correo' => 'required|email',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Crear cliente
            $cliente = Cliente::create($request->all());

            return response()->json([
                'status' => 201,
                'message' => 'Cliente creado exitosamente',
                'cliente' => $cliente
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $cliente = Cliente::find($id);
            if (!$cliente) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Cliente no encontrado'
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'cliente' => $cliente
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $cliente = Cliente::find($id);
            if (!$cliente) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Cliente no encontrado'
                ], 404);
            }

            // Validar datos
            $validator = Validator::make($request->all(), [
                'tipo_cliente' => 'sometimes|string|max:20',
                'tipo_documento' => 'sometimes|string|max:30',
                'numero_documento' => 'sometimes|string|max:20',
                'nombres' => 'sometimes|string',
                'direccion' => 'sometimes|string',
                'telefono' => 'sometimes|string|size:9',
                'correo' => 'sometimes|email',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Actualizar cliente
            $cliente->update($request->all());

            return response()->json([
                'status' => 200,
                'message' => 'Cliente actualizado exitosamente',
                'cliente' => $cliente
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $cliente = Cliente::find($id);
            if (!$cliente) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Cliente no encontrado'
                ], 404);
            }

            $cliente->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Cliente eliminado exitosamente'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }
}
