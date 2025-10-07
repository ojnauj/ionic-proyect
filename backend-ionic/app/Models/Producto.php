<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

        protected $fillable = [
        'nombre_producto',
        'descripcion',
        'precio',
        'stock',
        'unidad_medida',
        'marca',
        'imagen',
        'estado'
    ];

        protected $casts = [
        'estado' => 'boolean'
    ];
}
