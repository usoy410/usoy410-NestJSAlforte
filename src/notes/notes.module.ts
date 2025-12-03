import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.modules";
import { DatabaseModule } from "../database/database.module";
import { NotesController } from "./note.controller";
import { NotesService } from "./notes.service";

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [NotesController],
    providers: [NotesService],
    exports: [NotesService],
})
export class NotesModule {}
