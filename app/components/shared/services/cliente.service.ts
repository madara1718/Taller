import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError,retry } from 'rxjs';
import { Cliente } from 'src/app/components/shared/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
SRV:string ='http://tallerbd';

  constructor(private http: HttpClient) { }
  httpOptions={
    headers: new HttpHeaders({
      'Content-Type':'Application/json'
    })
  }
  filtrar(parametros:any,pag:number,lim:number):Observable<Cliente>{
    let params=new HttpParams;
    for(const prop in parametros){
      if(prop){
        params=params.append(prop, parametros[prop]);
      }
    }
   return this.http.get<Cliente>(`${this.SRV}/filtro/cliente/${pag}/${lim}`,{params:params})
    .pipe(retry(1),catchError(this.handleError));

  }

  buscar(id: any):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.SRV}/cliente/${id}`)
    .pipe(retry(1),catchError(this.handleError));
  }
  guardar(datos:any,id?:number): Observable<any>{
    if(id){
      //modificar
      return this.http.put<Cliente>(`${this.SRV}/cliente/${id}`,datos)
      .pipe(retry(1),catchError(this.handleError));
    }else{
      //crear
      return this.http.post<Cliente>(`${this.SRV}/cliente`,datos)
      .pipe(retry(1),catchError(this.handleError));
    }
  }
  eliminar(id : any){
    return this.http.delete<Cliente>(`${this.SRV}/cliente/${id}`)
      .pipe(retry(1),catchError(this.handleError));
  }

  private handleError(error:any){
    return throwError(()=>{
      return error.status;
    });
  }


}
