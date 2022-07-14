import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusStopEntity } from './entities/bus-stop.entity';

@Injectable()
export class BusService {
    constructor(
        @InjectRepository(BusStopEntity) private Repository: Repository<BusStopEntity>
    ) {}
}
