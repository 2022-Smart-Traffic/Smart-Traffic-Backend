import { Controller, Get, Query } from '@nestjs/common';
import { GetBusStopListDTO } from 'src/bus/dto/get-bus-stop-list.dto';
import { GetLineListDTO } from 'src/bus/dto/get-line-list.dto';
import { BusService } from './bus.service';

@Controller('bus')
export class BusController {
    constructor(private readonly busService: BusService) {}

    @Get('/search')
    getLineList(
        @Query() dto: GetLineListDTO
    ) {
        return this.busService.getLineList(dto.lineNo);
    }

    @Get('/busStop')
    getBusStopList(
        @Query() dto: GetBusStopListDTO
    ) {
        return this.busService.getBusStopList(dto);
    }
}
