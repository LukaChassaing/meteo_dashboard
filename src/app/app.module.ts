import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TemperatureChartComponent } from './components/temperature-chart/temperature-chart.component';
import { StatsDashboardComponent } from './components/stats-dashboard/stats-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureChartComponent,
    StatsDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }