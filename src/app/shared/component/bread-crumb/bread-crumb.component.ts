import { Component, OnInit, Input } from '@angular/core';

interface BreadCrumbItem{
  text: string;
  link?: string;
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: Array<BreadCrumbItem> = [];

  constructor() { }

  ngOnInit() {
  }

  isTheLastItem(item: BreadCrumbItem): boolean {
    const i = this.items.indexOf(item);

    return i + 1 == this.items.length;
  }
}
