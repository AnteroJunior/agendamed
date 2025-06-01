export interface IAppointment {
  id: number;
  user_id: number;
  speciality_id: number;
  doctor_id: number;
  schedule_day: Date;
  status_code: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
