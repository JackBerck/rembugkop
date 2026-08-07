<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Manual = 'manual';
    case Gateway = 'gateway';
}
