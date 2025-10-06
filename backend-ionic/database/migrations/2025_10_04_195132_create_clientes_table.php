<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_cliente', 20);
            $table->string('tipo_documento', 30);
            $table->string('numero_documento', 20);
            $table->string('nombres');
            $table->string('direccion');
            $table->string('telefono', 9);
            $table->string('correo');
            $table->tinyInteger('estado')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
