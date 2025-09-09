export interface Task {
  id?: string;        
  title: string;
  description: string;
  startDate?: string; 
  endDate?: string;   
  notes?: string[];   
  column: string;    
  projectId: string;  
}
