import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bus_stop')
export class BusStopEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @Column({
        length: 12,
        nullable: false
    })
    busStopId: string;

    @Column({
        length: 8,
        nullable: false
    })
    busName: string;

    @Column({
        length: 16,
        nullable: false
    })
    busStopName: string;

    @Column({
        type: 'float',
        nullable: false
    })
    gpsX: number;

    @Column({
        type: 'float',
        nullable: false
    })
    gpsY: number;
    
    @Column({
        type: 'tinyint',
        nullable: false
    })
    idx: number;
}
