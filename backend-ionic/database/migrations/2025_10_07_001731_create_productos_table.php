<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id(); // Esto crea una columna 'id' con tipo BIGINT y auto incremento
            $table->string('nombre_producto', 20); // Nombre del producto
            $table->string('descripcion', 100); // Descripción del producto
            $table->decimal('precio', 10, 2); // Precio con 10 dígitos y 2 decimales
            $table->integer('stock'); // Cantidad de producto en stock
            $table->string('unidad_medida', 20); // Unidad de medida del producto
            $table->string('marca', 40); // Marca del producto
            $table->string('imagen')->nullable(); // Ruta de la imagen (puede ser null)
            $table->tinyInteger('estado')->default(1); // Estado (activo/inactivo), por defecto será true
            $table->timestamps(); // Crea las columnas 'created_at' y 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos'); // Elimina la tabla 'productos'
    }
};
