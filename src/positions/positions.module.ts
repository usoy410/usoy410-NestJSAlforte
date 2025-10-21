import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { PositionController } from "./position.controller";
import { PositionsService } from "./positions.service";

@Module({
    imports: [DatabaseModule],
    controllers: [PositionController],
    providers: [PositionsService],
    exports: [PositionsService],
})
export class PositionsModule {}
