import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartType, ChartDataset } from 'chart.js';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chart-weather',
  templateUrl: './chart-weather.component.html',
  styleUrls: ['./chart-weather.component.scss']
})
export class ChartWeatherComponent implements OnInit {
  public weatherData: ChartDataset[] = [];
  public weatherLabels: any[] = []; // fix error on importing labels from ng2-charts
  public colorSet = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)'
  ];
  @Input() city: string = 'Madrid';
  @Input() chartType: ChartType = 'bar';

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http
      .get(
        `${environment.openweathermapApiUrl}/data/2.5/weather?q=${this.city}&APPID=${environment.openweathermapApiKey}`
      )
      .subscribe((res: any) => {
        this.weatherData = [
          {
            data: [
              res.main.temp,
              res.main.feels_like,
              res.main.temp_min,
              res.main.temp_max
            ],
            label: 'Temperature',
            borderColor: this.colorSet,
            backgroundColor: this.colorSet
          }
        ];

        this.weatherLabels = ['Current', 'Feels Like', 'Min', 'Max'];
      });
  }

  chartOptions: any = {
    responsive: true
  };
}
