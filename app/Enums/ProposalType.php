<?php

namespace App\Enums;

enum ProposalType: string
{
    case AssetProcurement = 'asset_procurement';
    case Policy = 'policy';
    case Other = 'other';
}
