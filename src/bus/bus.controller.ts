import { Controller, Get, Query } from '@nestjs/common';
import { BusService } from './bus.service';

@Controller('bus')
export class BusController {
    constructor(private readonly busService: BusService) {}

    @Get('/search')
    getLineList(
        @Query('lineNo') lineNo: string
    ) {
        return this.busService.getLineList(lineNo);
    }
}
