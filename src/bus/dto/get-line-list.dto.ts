import { IsString } from "class-validator";

export class GetLineListDTO {
    @IsString()
    readonly lineNo: string;
}