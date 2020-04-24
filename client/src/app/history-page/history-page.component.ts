import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef
  oSub: Subscription
  tooltip: MaterialInstance
  isFilterVisible: boolean;
  orders: Order[] = []
  filter: Filter = {}

  offset = 0
  limit = STEP
  loading: boolean;
  reloading: boolean
  noMoreOrders: boolean


  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.fetch()
    this.reloading = true
  }
  private fetch(){
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }
  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
  ngOnDestroy(): void {
    if(this.oSub){
      this.oSub.unsubscribe()
    }
    this.tooltip.destroy()
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyEvenet(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }
  isFiltered():boolean{
    return Object.keys(this.filter).length !== 0
  }
}
