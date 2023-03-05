import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
// import 'chartist/dist/index.css';
import { LineChart, PieChart } from 'chartist';

import { AuthService } from '../../auth/auth.service';
import { ModalDialogComponent } from '../../components/modal-dialog/modal-dialog.component';
import { User } from '../../../models/user.model';
import { Address, UserDoc } from '../../../models/ddbb.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userLogued$!: Observable<User | null>;
  private destroyed$ = new Subject<void>();
  public address: Address | undefined;
  public name: string | undefined;
  public users: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // consume for Subject
    this.userLogued$ = this.authService.user$.pipe(
      filter((user) => !!user),
      takeUntil(this.destroyed$)
    );

    this.userLogued$.subscribe((user) => {
      this.address = user?.address;
      this.name = user?.name;
    });

    this._loadUsersData();
    this._buildCharts();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private _loadUsersData() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((doc: UserDoc[]) => {
        let order = 0;
        this.users = doc.map((user: UserDoc) => {
          ++order;
          return {
            ...user,
            order,
            addressRe: `${user.address.street}, ${user.address.city}`
          };
        });
      });
  }

  private _buildCharts() {
    // 1
    new LineChart(
      '#linear-chart',
      {
        labels: ['January', 'Februrary', 'March', 'April', 'May', 'June'],
        series: [[23000, 25000, 19000, 34000, 56000, 64000]]
      },
      {
        low: 0,
        showArea: true
      }
    );
    // 2
    const data = {
      series: [5, 3, 4]
    };

    new PieChart('#pie-chart', data, {
      labelInterpolationFnc: (value) =>
        Math.round((+value / data.series.reduce((a, b) => a + b)) * 100) + '%'
    });
  }

  onSignOut() {
    this.authService.logout();
  }

  onInfoUser(selected: UserDoc) {
    const modalRef = this.modalService.open(ModalDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    (modalRef.componentInstance as ModalDialogComponent).user = selected;
    // modalRef.result.then(
    //   (result) => {
    //     this.authService.updateCredentials(result.email, result.password).then(
    //       () => {
    //         this.router.navigate(['login']);
    //       },
    //       (err) => console.error(err)
    //     );
    //     this.authService.logout();
    //   },
    //   (reason) => {
    //     console.info(`Dismissed with: ${reason}`);
    //   }
    // );
  }
}
