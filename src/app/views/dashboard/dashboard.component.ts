import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  radioModel: string = 'Day';

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number Of Orders'
        }
      }]
    }
  };
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [], label: 'All Orders' },
    { data: [], label: 'Closed Orders' },
    { data: [], label: 'Canceled Orders' }
  ];

  // Pie
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';

  // Doughnut
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType = 'doughnut';

  // lineChart
  public lineChartData: Array<any> = [
    { data: [], label: 'All Orders' },
    { data: [], label: 'Closed Orders' },
    { data: [], label: 'Canceled Orders' }
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Value Of Orders (JD)'
        }
      }]
    }
  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  public dashboardData;

  constructor(private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private httpService: HttpService,
    private notifyService: NotifyService) {


  }



  async ngOnInit() {
    await this.findDashboard("DAILY");
  }

  async findDashboard(type) {

    this.barChartLabels = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];

    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartData[2].data = [];

    let request = {
      method: "GET",
      path: "rest/dashboard?type=" + type,
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.dashboardData = response.data;
      console.log('dashboardData :', this.dashboardData);

      this.pieChartLabels = ['All Orders', 'Closed Orders', 'Canceled Orders'];
      this.pieChartData = [this.dashboardData.allOrder.count, this.dashboardData.closedOrder.count, this.dashboardData.canceledOrder.count];

      this.doughnutChartLabels = ['All Orders', 'Closed Orders', 'Canceled Orders'];
      this.doughnutChartData = [this.dashboardData.allOrder.value, this.dashboardData.closedOrder.value, this.dashboardData.canceledOrder.value];

      for (var index = 0; index < this.dashboardData.genericChart.length; index++) {
        let chartItem = this.dashboardData.genericChart[index];
        this.barChartLabels.push(chartItem.alias);
        this.barChartData[0].data.push(chartItem.allOrder.count);
        this.barChartData[1].data.push(chartItem.closedOrder.count);
        this.barChartData[2].data.push(chartItem.canceledOrder.count);

        this.lineChartLabels.push(chartItem.alias);
        this.lineChartData[0].data.push(chartItem.allOrder.value);
        this.lineChartData[1].data.push(chartItem.closedOrder.value);
        this.lineChartData[2].data.push(chartItem.canceledOrder.value);
      }
    }
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
