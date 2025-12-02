import { Injectable, NotFoundException } from "@nestjs/common";
import { OkPacket, RowDataPacket } from "mysql2";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class PositionsService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async createPosition(position_code: string, position_name: string, userId: number) {
        try {
            const [result] = await this.pool().execute<OkPacket>(
                "INSERT INTO positions (position_code, position_name, id) VALUES (?,?, ?)",
                [position_code, position_name, userId]
            );
            return {
                position_id: result.insertId,
                position_code: position_code,
                position_name: position_name,
                id: userId,
            };
        } catch (err: any) {
            if (err.code === "ER_DUP_ENTRY") {
                throw new Error("nothing");
            }
            throw err;
        }
    }

    async findByPositionName(position_name: string) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            "SELECT position_id, position_code, position_name, id, created_at, updated_at FROM positions WHERE position_name = ?",
            [position_name]
        );

        return rows[0];
    }

    async findPositionById(position_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            "SELECT position_id, position_code, position_name,id, created_at, updated_at FROM positions WHERE position_id = ?",
            [position_id]
        );

        return rows[0];
    }

    async getAllPosition() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            "SELECT position_id, position_code, position_name, id, created_at, updated_at FROM positions"
        );
        return rows;
    }

    async updatePosition(position_id: number, partial: { position_code?: string; position_name?: string }) {
        const existing = await this.findPositionById(position_id);
        if (!existing) {
            throw new NotFoundException("Position not found");
        }

        const fields: string[] = [];
        const values: any[] = [];

        if (partial.position_code) {
            fields.push("position_code = ?");
            values.push(partial.position_code);
        }

        if (partial.position_name) {
            fields.push("position_name = ?");
            values.push(partial.position_name);
        }

        if (fields.length === 0) {
            return existing;
        }

        values.push(position_id);
        const sql = `UPDATE positions SET ${fields.join(", ")} WHERE position_id = ?`;
        await this.pool().execute(sql, values);
        return this.findPositionById(position_id);
    }

    async removePosition(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>("DELETE FROM positions WHERE position_id = ?", [position_id]);
        if (res.affectedRows > 0) {
            return { message: "successfully deleted" };
        }
    }
}
