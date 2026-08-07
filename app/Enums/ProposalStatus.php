<?php

namespace App\Enums;

enum ProposalStatus: string
{
    case Draft = 'draft';
    case Open = 'open';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Executed = 'executed';
}
