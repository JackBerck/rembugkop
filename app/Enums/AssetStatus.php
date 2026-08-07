<?php

namespace App\Enums;

enum AssetStatus: string
{
    case Available = 'available';
    case Maintenance = 'maintenance';
    case Inactive = 'inactive';
}
