// i imported the position module
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.modules";
import { DatabaseModule } from "./database/database.module";
import { EventsModule } from "./events/events.module";
import { NotesModule } from "./notes/notes.module";
import { PositionsModule } from "./positions/positions.module";
import { UsersModule } from "./users/users.module";
@Module({
    imports: [DatabaseModule, UsersModule, AuthModule, EventsModule, NotesModule, PositionsModule],
})
export class AppModule {}
