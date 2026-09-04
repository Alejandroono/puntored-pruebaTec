import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PuntoredService {
  private token: string | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async auth(): Promise<string> {
    const baseUrl = this.config.get<string>('PUNTORED_BASE_URL');
    const user = this.config.get<string>('PUNTORED_USER');
    const password = this.config.get<string>('PUNTORED_PASSWORD');
    const apiKey = this.config.get<string>('PUNTORED_API_KEY');


    const response = await firstValueFrom(
      this.http.post(`${baseUrl}/auth`, { user, password }, {
        headers: { 'x-api-key': apiKey },
      })
    );

    this.token = response.data.token;
    if (!this.token) throw new Error('No se pudo obtener el token de Puntored');
    return this.token;
  }

  async getSuppliers() {
    if (!this.token) await this.auth();
    const baseUrl = this.config.get<string>('PUNTORED_BASE_URL');
    const response = await firstValueFrom(
      this.http.get(`${baseUrl}/getSuppliers`, {
        headers: { authorization: this.token },
      })
    );
    return response.data;
  }

  async buy(cellPhone: string, value: number, supplierId: string) {
    if (!this.token) await this.auth();
    const baseUrl = this.config.get<string>('PUNTORED_BASE_URL');
    const response = await firstValueFrom(
      this.http.post(`${baseUrl}/buy`, { cellPhone, value, supplierId }, {
        headers: { authorization: this.token },
      })
    );
    return response.data;
  }
}
