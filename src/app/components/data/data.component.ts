import { Component, ViewChild } from '@angular/core';
import { Data } from 'src/app/models/data';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  MaxCuotas: boolean = false;
  Paid:boolean=false;
  pagos: any[] = [];
  fechaInicio: Date = new Date(); // Fecha de inicio de los pagos
  numeroCuotas: number = 0; // Número total de cuotas permitidas
  foundMatch: boolean = false;

  historyData: Data;
  data: Data[] = [];
  displayedColumns: string[] = ['numero', 'moneda', 'precioVivienda', 'cuotaInicial', 'tasaEfectiva', 'numeroCuotas', 'periodoGraciaTotal', 'periodoGraciaParcial', 'cuota', 'acciones'];

  dataSource = new MatTableDataSource<Data>(this.data);
  clickedRows = new Set<Data>();

  constructor(private authService: AuthService, private dataService: DataService, private liveAnnouncer: LiveAnnouncer) {
    this.historyData = {} as Data;
    this.getNumeroCuotas();
    this.ComprobarData();
  }

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator

  ngOnInit(): void {
    this.getHistory();
    this.dataSource.paginator = this.paginator;
  }

  getHistory(): void {
    this.dataService.getList().subscribe((datos: Data[]) => {
        console.log(datos);
        this.dataSource.data = datos.filter((dato: Data) => dato.userId === this.authService.getUser()?.id);
      },
      (error) => {
        console.log('Error al obtener los datos:', error);
      }
    )
  }
  deleteData(id: number): void {
    this.dataService.deleteItem(id).subscribe(
      () => {
        console.log('Data deleted successfully');
        this.dataSource.data = this.dataSource.data.filter(data => data.id !== id);
      },
      (error) => {
        console.error('Error deleting data:', error);
      }
    );
  }
  VerificarCuotas(): boolean {
    return this.numeroCuotas == 0;
  }
  agregarPago(): void {
    if (this.pagos.length < this.numeroCuotas && this.ComprobarData()) {
      const numeroPago = this.pagos.length + 1;
      const fechaPago = this.calcularFechaPago(numeroPago - 1);
      this.pagos.push({ numero: numeroPago, fechaPago: fechaPago, pagado: false });
    } else if (!this.ComprobarData()){
      alert('No se pueden agregar pagos porque no solicitaste un crédito');
      this.MaxCuotas = true;
    }
    else  {
      alert('Ya se han agregado todas las cuotas permitidas.');
      this.Paid = true;
    }
  }

  calcularFechaPago(numeroPago: number): Date {
    const fechaPago = new Date(this.fechaInicio);
    fechaPago.setMonth(fechaPago.getMonth() + numeroPago);
    return fechaPago;
  }
  ComprobarData(): boolean {
    this.dataService.getList().subscribe((datos: Data[]) => {
          console.log(datos);
          datos.forEach((dato: Data) => {
            if (dato.userId === this.authService.getUser()?.id) {
              this.foundMatch = true;
              return;
            }
          });
        },
        (error) => {
          console.log('Error al obtener los datos:', error);
        });

    return this.foundMatch;
  }

  getNumeroCuotas(): void {
    this.dataService.getNumeroCuotas().subscribe(
      (numero: number) => {
        this.numeroCuotas = numero/2;
      },
      (error) => {
        console.error('Error al obtener el número de cuotas:', error);
      }
    );
  }

}
