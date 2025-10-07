<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $productos = Producto::all();
            return response()->json([
                'status' => 200,
                'productos' => $productos
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
                'nombre_producto' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'precio' => 'required|numeric',
                'stock' => 'required|integer',
                'unidad_medida' => 'required|string|max:20',
                'marca' => 'required|string|max:50',
                'imagen' => 'nullable|string',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Crear producto
            $producto = Producto::create($request->all());

            return response()->json([
                'status' => 201,
                'message' => 'Producto creado exitosamente',
                'producto' => $producto
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
            $producto = Producto::find($id);
            if (!$producto) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'producto' => $producto
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
            $producto = Producto::find($id);
            if (!$producto) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            // Validar datos
            $validator = Validator::make($request->all(), [
                'nombre_producto' => 'sometimes|string|max:255',
                'descripcion' => 'sometimes|string',
                'precio' => 'sometimes|numeric',
                'stock' => 'sometimes|integer',
                'unidad_medida' => 'sometimes|string|max:20',
                'marca' => 'sometimes|string|max:50',
                'imagen' => 'nullable|string',
                'estado' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Actualizar producto
            $producto->update($request->all());

            return response()->json([
                'status' => 200,
                'message' => 'Producto actualizado exitosamente',
                'producto' => $producto
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
            $producto = Producto::find($id);
            if (!$producto) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            $producto->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Producto eliminado exitosamente'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }
}
