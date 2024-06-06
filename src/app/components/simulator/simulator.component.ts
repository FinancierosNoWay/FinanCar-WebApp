import { Component } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent{

  currentDate: string;
  opcionSeleccionada: string = 'sostenible';
  mensaje: string = ''; // Variable para almacenar el mensaje
  precioAuto: number = 64200;
  saldo: number = 0;
  tasaEfectivaAnual: number = 8;
  tasaEfectivaMensual: number = 0;
  numeroCuotas: number = 60;
  cuota: number = 0.0;
  periodoGracia: number = 0.0;
  cuotaInicial: number = 4815;
  periodoGraciaNumerico: number = 0;
  tipoCambio: number = 3.5;
  BBP: number = 31100;
  SeguroDregravamen: number = 0.0280;
  SeguroInmueble: number = 0.30;
  valorSeguroDregravamen: number = 0.00;
  valorSeguroInmueble: number = 0.00;

  tasaFinal: number = 0.0;
  degravamenMensual: number = 0.0;
  numeroCuotasTemp: number = this.numeroCuotas;


  tasaEfectivaInvalid: boolean = false;
  cuotaInicialInvalid: boolean = false;
  numeroCuotasInvalid: boolean = false;
  precioViviendaInvalid: boolean = false;
  mostrarTabla: boolean = false;
  periodoGraciaTotal: boolean = false;
  periodoGraciaParcial: boolean = false;
  Sostenible: boolean = true;
  NoSostenible: boolean = false;
  enDolares: boolean = false;
  foundMatch: boolean = false;

  cronograma: number[] = [];
  cuotaArr: number[] = [];
  saldoFinal: number[] = [];
  saldoInicial: number[] = [];
  interes: number[] = [];
  amortizacion: number[] = [];
  inmueble: number[] = [];
  degravamen: number[] = [];
  historyData: Data;
  data: Data[] = [];

  constructor(private dataService: DataService, private authService: AuthService,     private router: Router) {
    this.currentDate = new Date().toLocaleDateString();
    this.resetArrays();
    this.historyData = {} as Data;
    this.ComprobarData();

  }


  resetArrays(): void {
    this.cronograma = Array.from({ length: this.numeroCuotas }, (_, i) => i + 1);
    this.saldoFinal = [];
    this.saldoInicial = [];
    this.interes = [];
    this.amortizacion = [];
    this.cuotaArr = [];
  }

  ComprobarData(): boolean {
    this.dataService.getList().subscribe((datos: Data[]) => {
          console.log(datos);
          datos.forEach((dato: Data) => {
            if (dato['userId'] === this.authService.getUser()?.id) {
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

  convertirADolares(valor: number): number {
    return valor / this.tipoCambio;
  }

  obtenerFecha(index: number): string {
    const fechaActual = new Date();
    const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + index, fechaActual.getDate());

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();

    return `${dia}-${mes}-${anio}`;

  }

  togglePeriodoGracia(opcion: string): void {
    this.periodoGraciaTotal = opcion === 'total';
    this.periodoGraciaParcial = opcion === 'parcial';
  }

  toggleSostenibilidad(): void {
    if (this.opcionSeleccionada === 'sostenible') {
      this.Sostenible = true;
      this.NoSostenible = false;
    } else if (this.opcionSeleccionada === 'nosostenible') {
      this.Sostenible = false;
      this.NoSostenible = true;
    } else {
      this.Sostenible = false;
      this.NoSostenible = false;
    }
    this.CalcularBBP();
  }

  calcularCuotaInicial(): void {
    if (this.enDolares) {
      this.cuotaInicial = this.convertirADolares(this.precioAuto * 0.075);
    } else {
      this.cuotaInicial = this.precioAuto * 0.075;
    }
    this.resetArrays();
  }

  CalcularBBP(): void {
    switch (this.opcionSeleccionada) {
      case 'nosostenible':

        if (this.precioAuto >= 64200 && this.precioAuto <= 93100) {
          this.BBP = 25700;
        } else if (this.precioAuto > 93100 && this.precioAuto <= 139400) {
          this.BBP = 21400;
        } else if (this.precioAuto > 139400 && this.precioAuto <= 232200) {
          this.BBP = 19600;
        } else if (this.precioAuto > 232200 && this.precioAuto <= 343900) {
          this.BBP = 10800;
        } else if (!this.NoSostenible) {
          this.BBP = 0;
        }
        break;

      case 'sostenible':

        if (this.precioAuto >= 64200 && this.precioAuto <= 93100) {
          this.BBP = 31100;
        } else if (this.precioAuto > 93100 && this.precioAuto <= 139400) {
          this.BBP = 26800;
        } else if (this.precioAuto > 139400 && this.precioAuto <= 232200) {
          this.BBP = 25000;
        } else if (this.precioAuto > 232200 && this.precioAuto <= 343900) {
          this.BBP = 16200;
        } else if (!this.NoSostenible)  {
          this.BBP = 0;
        }
        break;

      default:
        this.BBP = 0;
    }

  }

  validarPrecioAuto(): void {
    this.precioViviendaInvalid = this.precioAuto < 64200 || this.precioAuto > 464200;
    this.CalcularBBP();
    this.calcularCuotaInicial();
    this.resetArrays();
  }

  validarNumeroCuotas(): void {
    this.numeroCuotasInvalid = this.numeroCuotas < 60 || this.numeroCuotas > 300;
    this.resetArrays();
  }

  validarTasaEfectiva(): void {
    this.tasaEfectivaInvalid = this.tasaEfectivaAnual < 6.9 || this.tasaEfectivaAnual > 13.9;
    this.resetArrays();
  }

  validarCuotaInicial(): void {
    this.cuotaInicialInvalid = this.cuotaInicial < 0.075 * this.precioAuto;
    this.resetArrays();
  }

  CambioTasa(): void{
    this.tasaEfectivaMensual = Math.pow(1+ (this.tasaEfectivaAnual/100),(1/12))-1
  }


  GenerarCuota(): void {
    this.CambioTasa();
    this.cuotaArr = [];
    this.saldo = this.precioAuto - this.cuotaInicial - this.BBP;
    this.tasaFinal = this.tasaEfectivaMensual + (this.SeguroDregravamen/100);
    this.valorSeguroInmueble = (this.precioAuto/12) * (this.SeguroInmueble/100);

    console.log(this.tasaFinal);


    if (this.enDolares) {
      this.saldo = this.convertirADolares(this.saldo);

    }

    if(this.periodoGraciaTotal == true || this.periodoGraciaParcial == true) {
      this.numeroCuotasTemp = this.numeroCuotas - this.periodoGraciaNumerico;
    } else {
      this.numeroCuotasTemp = this.numeroCuotas;
    }

    this.cuota =
      (this.saldo *
      ((this.tasaFinal * Math.pow(1 + this.tasaFinal , this.numeroCuotasTemp)) /
        (Math.pow(1 + this.tasaFinal , this.numeroCuotasTemp) - 1))) + this.valorSeguroInmueble;

    this.cuota = Number(this.cuota.toFixed(2));

    for (let i = 0; i < this.numeroCuotas; i++) {
      if (i < this.periodoGraciaNumerico && this.periodoGraciaTotal) {
        this.cuotaArr.push(0);
      } else if (i < this.periodoGraciaNumerico && this.periodoGraciaParcial) {
        this.cuotaArr.push(0);
      } else {
        this.cuotaArr.push(Number(this.cuota.toFixed(2)));
      }
    }
  }


  calcularSaldoFinal(): void {
    this.saldoFinal = [];
    this.interes = [];
    this.amortizacion = [];
    this.inmueble = [];
    this.degravamen = [];
    this.valorSeguroInmueble = (this.precioAuto/12) * (this.SeguroInmueble/100);

    switch (true) {
      case this.periodoGraciaParcial:
        this.GenerarCuota();

        for (let i = 0; i < this.numeroCuotas; i++) {

          if (i < this.periodoGraciaNumerico) {
            this.saldoInicial.push(Number(this.saldo.toFixed(2)));

            const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
            this.interes.push(Number(interes.toFixed(2)));

            this.cuotaArr[i] = Number(interes.toFixed(2));

            this.saldoFinal.push(Number(this.saldo.toFixed(2)));

            this.amortizacion.push(0);
            this.degravamen.push(0);
            this.inmueble.push(0);
          } else {
            this.saldoInicial.push(Number(this.saldo.toFixed(2)));

            const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
            this.interes.push(Number(interes.toFixed(2)));

            const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen/100);
            this.degravamen.push(Number(degravamenTemp.toFixed(2)));

            const amortizacion = this.cuota - this.interes[i] - degravamenTemp - this.valorSeguroInmueble;
            this.amortizacion.push(Number(amortizacion.toFixed(2)));

            this.saldo -= this.amortizacion[i];
            this.saldoFinal.push(Number(this.saldo.toFixed(2)));

            this.inmueble.push(Number(this.valorSeguroInmueble.toFixed(2)));
          }
        }
        this.amortizacion[this.numeroCuotas-1]=this.saldoFinal[this.numeroCuotas-2]
        this.saldoFinal[this.numeroCuotas-1]=0.00;
        break;

      case this.periodoGraciaTotal:
        this.GenerarCuota();

        for (let i = 0; i < this.periodoGraciaNumerico; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));

          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
          this.interes.push(Number(interes.toFixed(2)));

          this.saldo += this.interes[i];
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));

          this.amortizacion.push(0);
          this.degravamen.push(0);
          this.inmueble.push(0);
        }

        this.cuota =
          (this.saldo *
          ((this.tasaFinal * Math.pow(1 + this.tasaFinal , this.numeroCuotasTemp)) /
          (Math.pow(1 + this.tasaFinal , this.numeroCuotasTemp) - 1))) + this.valorSeguroInmueble;

        for(let i = this.periodoGraciaNumerico; i < this.numeroCuotas; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));

          this.cuotaArr[i] = Number(this.cuota.toFixed(2));

          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
          this.interes.push(Number(interes.toFixed(2)));

          const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen/100);
          this.degravamen.push(Number(degravamenTemp.toFixed(2)));

          const amortizacion = this.cuota - this.interes[i] - degravamenTemp - this.valorSeguroInmueble;
          this.amortizacion.push(Number(amortizacion.toFixed(2)));

          this.saldo -= this.amortizacion[i];
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));

          this.inmueble.push(Number(this.valorSeguroInmueble.toFixed(2)));
        }
        this.amortizacion[this.numeroCuotas-1]=this.saldoFinal[this.numeroCuotas-2]
        this.saldoFinal[this.numeroCuotas-1]=0.00;
        break;

      default:
        this.GenerarCuota();


        for (let i = 0; i < this.numeroCuotas; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));

          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual );
          this.interes.push(Number(interes.toFixed(2)));

          const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen/100);
          this.degravamen.push(Number(degravamenTemp.toFixed(2)));

          const amortizacion = this.cuota - this.interes[i] - degravamenTemp - this.valorSeguroInmueble;
          this.amortizacion.push(Number(amortizacion.toFixed(2)));

          this.saldo -= this.amortizacion[i];
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));
          this.inmueble.push(Number(this.valorSeguroInmueble.toFixed(2)));
        }
        this.amortizacion[this.numeroCuotas-1]=this.saldoFinal[this.numeroCuotas-2]
        this.saldoFinal[this.numeroCuotas-1]=0.00;
        break;
    }
    if (this.enDolares) {
      this.saldoInicial = this.saldoInicial.map((saldo) => this.convertirADolares(saldo));
      this.interes = this.interes.map((interes) => this.convertirADolares(interes));
      this.amortizacion = this.amortizacion.map((amortizacion) => this.convertirADolares(amortizacion));
      this.saldoFinal = this.saldoFinal.map((saldoFinal) => this.convertirADolares(saldoFinal));
    }
  }

  ontenerMoneda (): string {
    if(this.enDolares == false) {
      return "Soles";
    } else {
      return "Dolares";
    }
  }

  obtenerGraciaParcial (): number {
    if(this.periodoGraciaParcial == true && this.periodoGraciaTotal == false){
      return this.periodoGraciaNumerico;
    } else if(this.periodoGraciaTotal == true && this.periodoGraciaParcial == false){
      return 0;
    } else {
      return 0;
    }
  }

  obtenerGraciaTotal (): number {
    if(this.periodoGraciaParcial == true && this.periodoGraciaTotal == false){
      return 0;
    } else if(this.periodoGraciaTotal == true && this.periodoGraciaParcial == false){
      return this.periodoGraciaNumerico;
    } else {
      return this.periodoGraciaNumerico;
    }
  }

  Operacion() {
    if (!this.precioViviendaInvalid && !this.tasaEfectivaInvalid && !this.cuotaInicialInvalid && !this.numeroCuotasInvalid) {

      this.calcularSaldoFinal();

      this.generarCronograma();
      this.mostrarTabla = true;
      console.log(this.periodoGraciaParcial);
      console.log(this.periodoGraciaTotal);
    }
    else {
      this.cuota = 0;
      this.resetArrays();
      this.cronograma = [];

      this.mostrarTabla = false;
    }
  }
  prepareCreditoData(): Data {
    const monedaN = this.ontenerMoneda();
    const precioViviendaN = Number(this.precioAuto.toFixed(2));
    const cuotaInicialN = Number(this.cuotaInicial.toFixed(2));
    const tasaEfectivaN = Number(this.tasaEfectivaAnual.toFixed(2));
    const numeroCuotasN = Number(this.numeroCuotas.toFixed(2));
    const periodoGraciaN = Number(this.periodoGraciaNumerico.toFixed(2));
    const periodoGraciaParcialN = this.obtenerGraciaParcial();
    const periodoGraciaTotalN = this.obtenerGraciaTotal();
    const cuotaN = Number(this.cuota.toFixed(2));
    const userIdN = this.authService.getUser()?.id;

    return {
      moneda: monedaN,
      precioVivienda: precioViviendaN,
      cuotaInicial: cuotaInicialN,
      tasaEfectiva: tasaEfectivaN,
      numeroCuotas: numeroCuotasN,
      periodoGracia: periodoGraciaN,
      periodoGraciaParcial: periodoGraciaParcialN,
      periodoGraciaTotal: periodoGraciaTotalN,
      cuota: cuotaN,
      userId: userIdN
    };
  }
  AgregarCredito(): void {
    const creditoData = this.prepareCreditoData();  // Call the new function

    this.dataService.createItem(creditoData).subscribe(
      res => {
        console.log("Usuario agregado exitosamente");
        alert("Solicito su credito correctamente");
      },
      error => {
        console.log("Ocurrió un error al agregar el usuario");
        console.log(error);
      }
    );
  }
  ocultarMensajeDespuesDe(tiempo: number): void {
    timer(tiempo).subscribe(() => {
      this.mensaje = ''; // Restablece el mensaje después del tiempo especificado
    });
  }
  SolicitarCredito(): void {
    if (this.ComprobarData()) {
      this.mensaje = "Ya solicitaste un credito, no puedes solicitar otro.";
      this.ocultarMensajeDespuesDe(2000);
    } else {
      this.AgregarCredito();
      this.router.navigate(['data']);
    }
  }
  generarCronograma(): void {
    this.cronograma = [];
    for (let i = 0; i < this.numeroCuotas; i++) {
      this.cronograma.push(i + 1);
    }
  }
  goToCarsComponent():void {
    this.router.navigate(['/cars']); // Suponiendo que la ruta al CarsComponent sea 'cars'
  }
}
