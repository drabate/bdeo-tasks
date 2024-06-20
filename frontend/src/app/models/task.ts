export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'done';
}
