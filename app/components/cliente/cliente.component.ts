import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from '../shared/models/cliente';
import { ClienteService } from '../shared/services/cliente.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
titulo :string="";
clientes=[new Cliente()];
filtro: any;
frmCliente : FormGroup;
  constructor(private srvCliente: ClienteService, private fb: FormBuilder) { 
    this.frmCliente=this.fb.group({
      id:[''],
      idCliente:[''],
      nombre:[''],
      apellido1:[''],
      apellido2:[''],
      telefono:[''],
      celular:[''],
      correo:[''],
      direccion:['']
    });
  }
  onNuevo(){
    this.titulo="Nuevo Cliente";
    this.frmCliente.reset();
  }
  onEliminar(id: any, nombre: string){
    Swal.fire({
      title: `¿Desea eliminar al cliente con el id: ${id}?`,
      text: nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id)
        .subscribe({
          complete:()=>{
            this.onFiltrar();
            Swal.fire(
              'Eliminado con éxito',
              '',
              'success'
            )
          },
          error:(error)=>{
            switch(error){
              case 404:{
                Swal.fire({
                  title:'Este id no se encontró',
                  icon: 'error',
                  showCancelButton:true,
                  showConfirmButton:false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                });
              }break;
              case 412:{
                Swal.fire({
                  title:'Este id ya existe',
                  text:'El cliente tiene un artefacto relacionado',
                  icon: 'info',
                  showCancelButton:true,
                  showConfirmButton:false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                });
              }break;
            }
          }
        })
      }
    })
  }
  onGuardar(){
    const datos= new Cliente(this.frmCliente.value);
    let llamada:Observable<any>
    let texto:string='';
    
    if(datos.id){
      const id=datos.id;  
      llamada=this.srvCliente.guardar(datos,id);
      delete datos.fechaIngreso;
      texto='Cambios realizados correctamente!'
    }else{
      delete datos.id;
      llamada=this.srvCliente.guardar(datos);
      texto='Creado correctamente!';
    }
    llamada.subscribe({
      complete:()=>{
        this.onFiltrar();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: texto,
          showConfirmButton: false,
          timer: 1500
        })
      },
      error:(e)=>{
        switch(e){
          case 404:{
            Swal.fire({
              title:'Este id no encontrado',
              icon: 'error',
              showCancelButton:true,
              showConfirmButton:false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
          }break;
          case 409:{
            Swal.fire({
              title:'Este id ya existe',
              icon: 'error',
              showCancelButton:true,
              showConfirmButton:false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
          }break;
        
        }
        
      }
    });
    
  }
  private onFiltrar(): void{
    this.srvCliente.filtrar(this.filtro,1,10)
    .subscribe(
      data=>{
        this.clientes=Object(data);
      }
    );
  }
  onEditar(id: any){
    this.titulo=`Modificar Cliente`;
    this.srvCliente.buscar(id)
    .subscribe({
      next:(data)=>{
        delete data.fechaIngreso;
        this.frmCliente.setValue(data);
      }
    });
  }
  onImprimir(){
    
  }

  ngOnInit(): void {
    this.filtro={
      idCliente:'',
      nombre:'',
      apellido1:'',
      apellido2:''
    }
    this.onFiltrar();
  }

}
