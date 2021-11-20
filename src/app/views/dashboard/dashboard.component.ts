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

  searchByDate = false;

  dateFrom = '';
  dateTo = '';

  ALL_ORDER_COLOR = "#63c2de"
  CLOSED_ORDER_COLOR = "#4dbd74"
  CANCELED_ORDER_COLOR = "#f86c6b"

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
    { data: [], label: 'All Orders', backgroundColor: this.ALL_ORDER_COLOR, hoverBackgroundColor: this.ALL_ORDER_COLOR },
    { data: [], label: 'Closed Orders', backgroundColor: this.CLOSED_ORDER_COLOR, hoverBackgroundColor: this.CLOSED_ORDER_COLOR },
    { data: [], label: 'Canceled Orders', backgroundColor: this.CANCELED_ORDER_COLOR, hoverBackgroundColor: this.CANCELED_ORDER_COLOR }
  ];

  // Pie
  public pieChartLabels: string[] = [];
  public pieChartColors: string[] = [this.ALL_ORDER_COLOR,this.CLOSED_ORDER_COLOR,this.CANCELED_ORDER_COLOR];
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
      backgroundColor: this.ALL_ORDER_COLOR,
      borderColor: this.ALL_ORDER_COLOR,
      pointBackgroundColor: this.ALL_ORDER_COLOR,
      pointBorderColor: this.ALL_ORDER_COLOR,
      pointHoverBackgroundColor: this.ALL_ORDER_COLOR,
      pointHoverBorderColor: this.ALL_ORDER_COLOR
    },
    { // dark grey
      backgroundColor: this.CLOSED_ORDER_COLOR,
      borderColor: this.CLOSED_ORDER_COLOR,
      pointBackgroundColor: this.CLOSED_ORDER_COLOR,
      pointBorderColor: this.CLOSED_ORDER_COLOR,
      pointHoverBackgroundColor: this.CLOSED_ORDER_COLOR,
      pointHoverBorderColor: this.CLOSED_ORDER_COLOR
    },
    { // grey
      backgroundColor: this.CANCELED_ORDER_COLOR,
      borderColor: this.CANCELED_ORDER_COLOR,
      pointBackgroundColor: this.CANCELED_ORDER_COLOR,
      pointBorderColor: this.CANCELED_ORDER_COLOR,
      pointHoverBackgroundColor: this.CANCELED_ORDER_COLOR,
      pointHoverBorderColor: this.CANCELED_ORDER_COLOR
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
      path: "rest/dashboard?type=" + type + "&dateFrom=" + this.dateFrom + "&dateTo=" + this.dateTo,
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
