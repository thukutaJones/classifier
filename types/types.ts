export interface Annotation {
  id: string; // Internal React key
  trackId: number; 
  videoFileName: string;
  startTime: number;
  endTime: number;
  classification: 'leaning_to_copy' | 'sharing_answers';
  timestamp: string;
}

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
}