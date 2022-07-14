import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { BusService } from './bus.service';

@Controller('bus')
export class BusController {
    constructor(private readonly busService: BusService) {}
}
