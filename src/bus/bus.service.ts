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
        const lineRes = (await lastValueFrom(this.httpService.get(this.getLineListURL(lineNo)))).data;
        const lineList = JSON.parse(xml2json(lineRes, {compact: true}))?.response?.body?.items?.item
        if (!lineList) throw new NotFoundException();
        return lineList;
    }

    async getBusStopList(dto: GetBusStopListDTO) {
        const { lineNo, lineId } = dto;
        
        const busStopRes = (await lastValueFrom(this.httpService.get(this.getBusStopListURL(lineId)))).data;
        const busStopList = JSON.parse(xml2json(busStopRes, {compact: true}))?.response?.body?.items?.item
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
                        .filter((busData: any) => busData.bstopidx._text == busStop.idx)[0] as any),
                name: busStop.busStopName,
                posX: busStop.gpsX,
                posY: busStop.gpsY,
                idx: busStop.idx
            }
        });
    }

    async getBusSeatInfo() {
        const seat = [
            [0, 0, 0, 0, -1, 0, -1, 0, -1, 0, -1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
            [0, 0, 0, 0, 0, 0, -1, 0, -1, 0, -1],
            [-1, 0, -1, 0, 0, 0, -1, 0, -1, 0, -1]
        ]
        seat.forEach((rows, i) => {
            rows.forEach((value, j) => {
                if (value == -1) {
                    if (Math.floor(Math.random() * 2) == 0) {
                        seat[i][j] = 1;
                    }
                }
            })
        });
        return seat;
    }

    private getLineListURL (lineNo: string) {
        return `http://apis.data.go.kr/6260000/BusanBIMS/busInfo?serviceKey=${process.env.SERVICE_KEY}&lineno=${encodeURI(lineNo)}`;
    }

    private getBusStopListURL (lineId: number) {
        return `http://apis.data.go.kr/6260000/BusanBIMS/busInfoByRouteId?serviceKey=${process.env.SERVICE_KEY}&lineid=${lineId}`;
    }
}
