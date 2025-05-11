import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-dialog',
  templateUrl: './confirmar-dialog.component.html',
  styleUrls: ['./confirmar-dialog.component.scss'],
  standalone : false
})
export class ConfirmarDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmarDialogComponent>) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
