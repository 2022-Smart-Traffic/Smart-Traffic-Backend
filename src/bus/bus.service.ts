import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { xml2json } from 'xml-js'

import { BusStopEntity } from './entities/bus-stop.entity';
import { lastValueFrom } from 'rxjs';
import { GetBusStopListDTO } from 'src/bus/dto/get-bus-stop-list.dto';

@Injectable()
export class BusService {
    constructor(
        private httpService: HttpService,
        @InjectRepository(BusStopEntity) private busStopRepository: Repository<BusStopEntity>
    ) {}

    async getLineList(lineNo: string) {
        const lineInfo = (await lastValueFrom(this.httpService.get(this.getLineListURL(lineNo)))).data;
        const lineList = JSON.parse(xml2json(lineInfo, {compact: true}))?.response?.body?.items?.item
        if (!lineList) throw new NotFoundException();
        return lineList;
    }

    async getBusStopList(dto: GetBusStopListDTO) {
        const { lineNo, lineId } = dto;
        
        const busStopInfo = (await lastValueFrom(this.httpService.get(this.getBusStopListURL(lineId)))).data;
        const busStopList = JSON.parse(xml2json(busStopInfo, {compact: true}))?.response?.body?.items?.item
        if (!busStopList) throw new NotFoundException();

        const busStopPosInfo = await this.busStopRepository.find({
            where: {
                busName: lineNo
            }
        });
        if (!busStopPosInfo) throw new NotFoundException();

        return busStopPosInfo.map(busStop => {
            return {
                id: (Object.values(busStopList)
                        .filter((busData: any) => busData.bstopidx._text == busStop.idx)[0] as any)?.nodeid?._text,
                name: busStop.busName,
                posX: busStop.gpsX,
                posY: busStop.gpsY,
                idx: busStop.idx
            }
        });
    }

    private getLineListURL (lineNo: string) {
        return `http://apis.data.go.kr/6260000/BusanBIMS/busInfo?serviceKey=${process.env.SERVICE_KEY}&lineno=${encodeURI(lineNo)}`;
    }

    private getBusStopListURL (lineId: number) {
        return `http://apis.data.go.kr/6260000/BusanBIMS/busInfoByRouteId?serviceKey=${process.env.SERVICE_KEY}&lineid=${lineId}`;
    }
}
