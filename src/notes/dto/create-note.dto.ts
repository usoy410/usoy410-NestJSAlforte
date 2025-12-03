import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
    @IsOptional()
    @IsString()
    note_title?: string;

    @IsString()
    note_description!: string;

    @IsOptional()
    @IsBoolean()
    isImportant?: boolean;

    @IsNumber()
    user_id!: number; // required
}
