import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-confirm-modal',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  readonly dialogRef = inject(MatDialogRef<ConfirmModal>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpClient);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.http
      .patch(
        `${environment.apiUrl}/appointments/${this.data.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: (error) => {
          console.log(error);
          this.dialogRef.close();
        },
      });
  }
}
