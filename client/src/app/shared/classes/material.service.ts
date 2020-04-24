import {ElementRef} from '@angular/core'

declare var M

export interface MaterialInstance {
  open?(): void

  close?(): void

  destroy?(): void
}

export interface MaterialDatePicker extends MaterialInstance{
  date?: Date
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initialFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(element: ElementRef): MaterialInstance {
    return M.Modal.init(element.nativeElement)
  }

  static initTooltip(element: ElementRef): MaterialInstance {
    return M.Tooltip.init(element.nativeElement)
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatePicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    })
  }
  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement)
  }
}
