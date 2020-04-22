import { ElementRef } from '@angular/core'

declare var M

export interface MaterialInstance {
  open?():void
  close?():void
  destroy?():void
}

export class MaterialService {
    static toast(message: string){
        M.toast({html: message})
    }
    static initialFloatingButton(ref: ElementRef){
        M.FloatingActionButton.init(ref.nativeElement)
    }
    static updateTextInputs(){
        M.updateTextFields()
    }
    static initModal(element: ElementRef): MaterialInstance{
      return M.Modal.init(element.nativeElement)
    }
}
