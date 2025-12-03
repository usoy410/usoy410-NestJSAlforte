import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    note_title?: string;

    @IsOptional()
    @IsString()
    note_description?: string;

    @IsOptional()
    @IsBoolean()
    isImportant?: boolean;
}
