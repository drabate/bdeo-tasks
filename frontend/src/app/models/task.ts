export interface Task {
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'done';
}
