export type ModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  details?: string;   
  okText?: string;    
  blockOutsideClose?: boolean;
};