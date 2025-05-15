import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-detalle-pedido',
  templateUrl: './dialog-detalle-pedido.component.html',
  styleUrls: ['./dialog-detalle-pedido.component.scss'],
  standalone: false
})
export class DialogDetallePedidoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogDetallePedidoComponent>
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
