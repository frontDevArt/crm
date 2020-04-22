import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  form: FormGroup
  positions: Position[] = []
  loading: boolean = false
  positionId = null
  modal: MaterialInstance


  constructor(private positionsService: PositionsService) { }


  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId)
      .subscribe(
        (positons) => {
          this.positions = positons
          this.loading = false
        }
      )
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }
  ngOnDestroy(): void {
    this.modal.destroy()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset()
    this.modal.open()
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {
    this.form.disable()
    const newPosition:Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const complated = () => {
      this.modal.close()
      this.form.reset()
      this.form.enable()
    }

    if(this.positionId){
      newPosition._id = this.positionId
      this.positionsService.update(newPosition)
        .subscribe(
          position => {
            const idx = this.positions.findIndex(p => p._id === position._id)
            this.positions[idx] = position
            MaterialService.toast('Изминение сохранены')
          },
          error => {
            MaterialService.toast(error.error.message)
          },
          complated
        )
    }else{
      this.positionsService.create(newPosition)
        .subscribe(
          position => {
            MaterialService.toast('Позиция создана')
            this.positions.push(position)
          },
          error => {
            MaterialService.toast(error.error.message)
          },
          complated
        )
    }

  }

  onDeletePosition($event: MouseEvent, position: Position) {
    $event.stopPropagation()
    const decision = window.confirm(`Удалиь позицию ${position.name} ?`)
    if(decision){
      this.positionsService.delete(position)
        .subscribe(
          (response) => {
            const idx = this.positions.findIndex(p => p._id === position._id)
            this.positions.splice(idx, 1)
            MaterialService.toast(response.message)
          },
          (error) => MaterialService.toast(error.error.message)
        )
    }
  }
}
