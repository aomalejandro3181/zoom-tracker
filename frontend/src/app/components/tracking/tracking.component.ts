import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { Paquete, CreatePaqueteDto } from 'src/app/interfaces/paquetes';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  paquetes: Paquete[] = [];

  formPaquete = new FormGroup({
    codigoGuia: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    destinatario: new FormControl('', [Validators.required]),
    ciudadDestino: new FormControl('',[Validators.required, Validators.maxLength(60)]),
    pesoKg: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    estado: new FormControl('', [Validators.required])
  });

  isLoading = false;
  loadingTable = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  updatingStates: {[ key: number]: boolean} = {};

  constructor(private api: ApiService){}

  ngOnInit() {
    this.loadPaquetes();
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 10000);
  }

  loadPaquetes(estado?: string){
    this.loadingTable = true;

    this.api.getPaquetes(estado).subscribe({
      next: (data) => {
        this.paquetes = data;
        this.loadingTable = false;
      },
      error: (error) => {
        this.showMessage('Error al cargar paquetes: ' + (error.error?.message || error.message), 'error');
        this.loadingTable = false;
        console.error('Error loading paquetes:', error);
      }
    })
  }

  onSubmit(){
    if(this.formPaquete.valid){
      this.isLoading = true;
      const formValue = this.formPaquete.value;
      console.log('Valor del formulario:', formValue);
      const dto: CreatePaqueteDto = {
        codigoGuia: formValue.codigoGuia as string,
        destinatario: formValue.destinatario as string,
        ciudadDestino: formValue.ciudadDestino!,
        pesoKg: Number(formValue.pesoKg),
        estado: formValue.estado!,
      };

      this.api.createPaquete(dto).subscribe({
        next: () => {
          this.showMessage('Paquete registrado exitosamente', 'success');
          this.formPaquete.reset();
          this.loadPaquetes();
          this.isLoading = false;
        },
        error: (error) => {
          this.showMessage(`Error al registrar paquete ${error.error?.message || error.message}` ,'error')
          this.isLoading = false;
        }
      })
    }
  }

  onEstadoUpdate(paquete: Paquete){
    this.updatingStates[paquete.id] = true;

    this.api.updatePaquete(paquete.id, {estado: paquete.estado}).subscribe({
      next: (response) => {
        this.showMessage('Estado actualizado exitosamente', 'success');
        this.updatingStates[paquete.id] = false;
      },
      error: (error) => {
        this.showMessage(`Error al actualizar estado ${error.error?.message || error.message}`,'error')
        this.updatingStates[paquete.id] = false;
      }
    })
  }

  onEstadoChange(event: Event){
    const target = event.target as HTMLSelectElement;
    const estado = target.value;
    this.loadPaquetes(estado || undefined);
  }
}
