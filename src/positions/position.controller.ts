// this is the controller of the event
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PositionsService } from "./positions.service";

@Controller("positions")
export class PositionController {
    constructor(private positionsService: PositionsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllPosition() {
        return this.positionsService.getAllPosition();
    }

    @UseGuards(JwtAuthGuard)
    @Get(":position_id")
    async getOne(@Param("position_id") position_id: number) {
        return this.positionsService.findPositionById(+position_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("")
    async createPosition(@Body() body: { position_code: string; position_name: string }, @Req() req: any) {
        // console.log(" BODY:", body);
        return this.positionsService.createPosition(body.position_code, body.position_name, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":position_id")
    async updatePosition(@Param("position_id") position_id: number, @Body() body: any) {
        return this.positionsService.updatePosition(+position_id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":position_id")
    async removePosition(@Param("position_id") position_id: number) {
        return this.positionsService.removePosition(+position_id);
    }
}
