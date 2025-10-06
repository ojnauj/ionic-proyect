<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'tipo_cliente',
        'tipo_documento',
        'numero_documento',
        'nombres',
        'direccion',
        'telefono',
        'correo',
        'estado'
    ];

    protected $casts = [
        'estado' => 'boolean'
    ];
}
