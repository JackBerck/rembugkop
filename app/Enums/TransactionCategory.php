<?php

namespace App\Enums;

enum TransactionCategory: string
{
    case AssetRental = 'asset_rental';
    case Dues = 'dues';
    case AssetProcurement = 'asset_procurement';
    case Operational = 'operational';
    case Other = 'other';
}
