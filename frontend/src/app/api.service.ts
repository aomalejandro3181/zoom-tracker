import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Paquete, CreatePaqueteDto, UpdatePaqueteDto } from "./interfaces/paquetes";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getPaquetes(estado?: string): Observable<Paquete[]>{
    let params = new HttpParams();

    if(estado){
      params = params.set('estado', estado);
    }

    return this.http.get<Paquete[]>(`${this.baseUrl}/paquetes`, {params});
  }

  createPaquete(paquete:CreatePaqueteDto):Observable<Paquete>{
    return this.http.post<Paquete>(`${this.baseUrl}/paquetes`, paquete);
  }

  updatePaquete(id: number, dto: UpdatePaqueteDto):Observable<Paquete>{
    return this.http.patch<Paquete>(`${this.baseUrl}/paquetes/${id}/estado`,dto);
  }
}
