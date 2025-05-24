import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightOverdue]'
})
export class HighlightOverdueDirective implements OnInit {
  @Input() dueDate: Date;
  @Input() completed: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!this.completed && this.dueDate && new Date(this.dueDate) < new Date()) {
      this.el.nativeElement.style.color = 'red';
      this.el.nativeElement.style.fontWeight = 'bold';
    }
  }
}
