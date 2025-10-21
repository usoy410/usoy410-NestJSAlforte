// this is the controller of the event
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllEvent() {
    return this.eventsService.getAllEvent();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.eventsService.findEventById(+id);
  }

  @Post('AddEvent')
  async createEvent(@Body() body: { title: string; description: string; location: string }) {
    console.log('addEvent BODY:', body);
    return this.eventsService.createEvent(body.title, body.description, body.location);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.updateEvent(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeEvent(@Param('id') id: string) {
    return this.eventsService.removeEvent(+id);
  }
}
