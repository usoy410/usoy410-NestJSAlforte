// i added a new crud for events

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class EventsService {
  constructor(private db: DatabaseService) { }

  private pool = () => this.db.getPool();

  async createEvent(title: string, description: string, location: string) {
    try {
      const [result] = await this.pool().execute<OkPacket>(
        'INSERT INTO eventx (title, descriptionx, location) VALUES (?, ?, ?)',
        [title, description, location],
      );
      return {
        id: result.insertId,
        title: title,
        description: description,
        location: location
      };
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(`the event "${title}" already exist. update it instead`);
      }
      throw err;
    }
  }


  async findByTitle(title: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, title, descriptionx, location FROM eventx WHERE title = ?',
      [title],
    );

    return rows[0];
  }

  async findEventById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, title, descriptionx, created_at FROM eventx WHERE id = ?',
      [id],
    );

    return rows[0];
  }

  async getAllEvent() {
    const [rows] = await this.pool().execute<RowDataPacket[]>('SELECT id, title, descriptionx, location,  created_at FROM eventx');
    return rows;
  }

  async updateEvent(id: number, partial: { title?: string; description?: string; location?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.title) {
      fields.push('title = ?');
      values.push(partial.title);
    }

    if (partial.description) {
      fields.push('descriptionx = ?');
      values.push(partial.description);
    }

    if (partial.location) {
      fields.push('location = ?');
      values.push(partial.location);
    }

    if (fields.length === 0) {
      return await this.findEventById(id);
    }

    values.push(id);
    const sql = `Update eventx SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);
    return this.findEventById(id);
  }

  async removeEvent(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM eventx WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }

    async setEventRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute<any>('UPDATE eventx SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
  }

  async findByEventRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, title,descriptionx,location FROM eventx WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}
