import { Injectable } from "@nestjs/common";
import { OkPacket, RowDataPacket } from "mysql2";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class NotesService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    // CREATE NOTE
    async createNote(note_title: string | null, note_description: string, isImportant: boolean, user_id: number) {
        const [result] = await this.pool().execute<OkPacket>(
            "INSERT INTO notes (note_title, note_description, isImportant, user_id) VALUES (?, ?, ?, ?)",
            [note_title, note_description, isImportant, user_id]
        );

        return {
            id: result.insertId,
            user_id,
            note_title,
            note_description,
            isImportant,
        };
    }

    // FIND NOTE BY TITLE
    async findByTitle(note_title: string) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT id, note_title, note_description, isImportant, created_at, updated_at
             FROM notes WHERE note_title = ?`,
            [note_title]
        );
        return rows[0];
    }

    // FIND BY IMPORTANCE
    async findByImportance(isImportant: boolean) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT id, note_title, note_description, isImportant, created_at, updated_at
             FROM notes WHERE isImportant = ?`,
            [isImportant]
        );
        return rows[0];
    }

    // FIND BY ID
    async findById(id: number, user_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>("SELECT * FROM notes WHERE id = ? AND user_id = ?", [
            id,
            user_id,
        ]);

        return rows[0];
    }

    // GET ALL NOTES
    async getAll(user_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
            [user_id]
        );

        return rows;
    }

    // UPDATE NOTE
    async update(
        id: number,
        partial: {
            note_title?: string;
            note_description?: string;
            isImportant?: boolean;
        },
        user_id: number
    ) {
        const fields: string[] = [];
        const values: any[] = [];

        if (partial.note_title !== undefined) {
            fields.push("note_title = ?");
            values.push(partial.note_title);
        }

        if (partial.note_description !== undefined) {
            fields.push("note_description = ?");
            values.push(partial.note_description);
        }

        if (partial.isImportant !== undefined) {
            fields.push("isImportant = ?");
            values.push(partial.isImportant);
        }

        if (fields.length === 0) {
            return this.findById(id, user_id);
        }

        values.push(id);
        values.push(user_id);

        const sql = `UPDATE notes SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`;
        await this.pool().execute(sql, values);

        return this.findById(id, user_id);
    }

    // DELETE NOTE
    async remove(id: number, user_id: number) {
        const [res] = await this.pool().execute<OkPacket>("DELETE FROM notes WHERE id = ? AND user_id = ?", [
            id,
            user_id,
        ]);
        return res.affectedRows > 0;
    }
}
