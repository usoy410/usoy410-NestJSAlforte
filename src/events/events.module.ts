// the module for the event
import { Module } from '@nestjs/common'
import { EventsService } from './events.service'
import { EventController } from './event.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
