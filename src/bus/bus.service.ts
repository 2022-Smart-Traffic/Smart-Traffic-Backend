import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { xml2json } from 'xml-js'

import { BusStopEntity } from './entities/bus-stop.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BusService {
    constructor(
        private httpService: HttpService,
        @InjectRepository(BusStopEntity) private Repository: Repository<BusStopEntity>
    ) {}

    async getLineList(lineNo: string) {
        const lineInfo = (await lastValueFrom(this.httpService.get(this.getLineListURL(lineNo)))).data;
        const lineList = JSON.parse(xml2json(lineInfo, {compact: true}))?.response?.body?.items?.item
        if (!lineList) throw new NotFoundException();
        return lineList;
    }

    private getLineListURL (lineNo: string) {
        return `http://apis.data.go.kr/6260000/BusanBIMS/busInfo?serviceKey=${process.env.SERVICE_KEY}&lineno=${encodeURI(lineNo)}`;
    }
}
