import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

interface Cars {
  image: string;
  car_brand: string;
  description: string;
  price: string;
  id: string;
}
@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent {
  cars: Cars[] = [
    {
      image: "https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/performance/2024-corvette-z06/colorizer/01-images/v2/black.jpg?imwidth=960",
      car_brand: "Chevrolet",
      description: "El Chevrolet Corvette Z06 2024 es un superdeportivo estadounidense con un motor V8 de 6.2 litros sobrealimentado que produce 670 caballos de fuerza. Es la versión más potente del Corvette hasta la fecha.",
      price: "86.695 USD",
      id: "1"
    },
    {
      image: "https://bucket.dealervenom.com/2024/02/2024-Toyota-GR86-Premium-Model-Left.jpg?fm=pjpg&ixlib=php-3.3.1",
      car_brand: "Toyota",
      description: "El Toyota GR86 2024 es un coupé deportivo de tracción trasera con un motor bóxer de cuatro cilindros y 2.4 litros que produce 228 caballos de fuerza. Es un coche ligero y ágil, perfecto para la conducción en carretera.",
      price: "27.785 USD",
      id: "2"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1LjZK5UEOGRrZikTGcFwwRW5ABlpeGMFulg&s",
      car_brand: "Ford",
      description: "El Ford Mustang GT 2024 es un muscle car estadounidense con un motor V8 de 5.0 litros que produce 450 caballos de fuerza. Es un coche potente y con un sonido increíble, perfecto para los amantes de la velocidad.",
      price: "39.395 USD",
      id: "3"
    },
    {
      image: "https://hips.hearstapps.com/hmg-prod/images/2025-hyundai-ioniq-5-front-shot-65e5e536d5666.jpg?crop=0.587xw:0.663xh;0.191xw,0.274xh&resize=768:*",
      car_brand: "Hyundai",
      description: "El Hyundai Ioniq 5 2024 es un SUV eléctrico con una batería de 77.4 kWh que ofrece una autonomía de hasta 481 km. Es un coche espacioso, cómodo y con un diseño futurista.",
      price: "43.650 USD",
      id: "4"
    },
    {
      image: "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1699530005/autoexpress/2023/11/Kia%20EV6%20exclusive%20image.jpg",
      car_brand: "Kia",
      description: "El Kia EV6 2024 es un SUV eléctrico con una batería de 77.4 kWh que ofrece una autonomía de hasta 483 km. Es un coche similar al Hyundai Ioniq 5, pero con un diseño más deportivo.",
      price: "40.990 USD",
      id: "5"
    },
    {
      image: "https://acnews.blob.core.windows.net/imgnews/medium/NAZ_680ca0f19ee2418f872d9864c11c4fc6.webp",
      car_brand: "Tesla",
      description: "El Tesla Model 3 2024 es un sedán eléctrico con una batería de 75 kWh que ofrece una autonomía de hasta 468 km. Es uno de los coches eléctricos más populares del mercado, gracias a su rendimiento, tecnología y diseño.",
      price: "46.990 USD",
      id: "6"
    },
    {
      image: "https://acroadtrip.blob.core.windows.net/catalogo-imagenes/l/RT_V_655b66b7b2814ee9a866a1692313f7f1.jpg",
      car_brand: "Porsche",
      description: "El Porsche 911 2024 es un deportivo alemán con un motor bóxer de seis cilindros y 3.0 litros que produce 379 caballos de fuerza. Es un coche icónico, conocido por su rendimiento, manejo y diseño.",
      price: "113.200 USD",
      id: "7"
    },
    {
      image: "https://hips.hearstapps.com/hmg-prod/images/2023-audi-r8-gt-front-three-quarters-motion-3-1664827965.jpg?crop=0.585xw:0.438xh;0.0785xw,0.353xh&resize=1200:*",
      car_brand: "Audi",
      description: "El Audi R8 2024 es un superdeportivo alemán con un motor V10 de 5.2 litros que produce 563 caballos de fuerza. Es un coche muy rápido y con un diseño elegante.",
      price: "169.900 USD",
      id: "8"
    },
  ];

  constructor(private router: Router) { }


  evaluarAuto() {
    this.router.navigate(['/credit-check']); // Ajusta la ruta según tu configuración
  }

}
