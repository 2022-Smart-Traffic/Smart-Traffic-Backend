import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusStopEntity } from 'src/bus/entities/bus-stop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        BusStopEntity
    ]),
  ],
  controllers: [BusController],
  providers: [BusService]
})

export class BusModule {}
