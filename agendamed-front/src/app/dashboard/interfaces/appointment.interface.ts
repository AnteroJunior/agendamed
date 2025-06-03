export interface IAppointment {
  id: number;
  user_id: number;
  speciality_id: string;
  doctor_id: string;
  schedule_day: Date;
  status_code: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  speciality: {
    id: number;
    name: string;
  };
  doctor: {
    id: number;
    name: string;
  };
}