import { IsString, IsNumber } from "class-validator";

export class GetBusStopListDTO {
    @IsString()
    readonly lineNo: string;

    @IsNumber()
    readonly lineId: number;
}