import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NotesService } from "./notes.service";

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        username: string;
        role: string;
    };
}

@Controller("notes")
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private notesService: NotesService) {}

    @Get()
    async getAll(@Req() req: AuthenticatedRequest) {
        return this.notesService.getAll(req.user.userId);
    }

    @Get(":id")
    async getOne(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
        return this.notesService.findById(+id, req.user.userId);
    }

    @Post()
    async create(@Body() dto: CreateNoteDto, @Req() req: AuthenticatedRequest) {
        let title: string | null = dto.note_title || null;

        if (title && title.trim() === "") {
            title = null;
        }

        return this.notesService.createNote(title, dto.note_description, dto.isImportant ?? false, req.user.userId);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() dto: UpdateNoteDto, @Req() req: AuthenticatedRequest) {
        return this.notesService.update(+id, dto, req.user.userId);
    }

    @Delete(":id")
    async remove(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
        return this.notesService.remove(+id, req.user.userId);
    }
}
