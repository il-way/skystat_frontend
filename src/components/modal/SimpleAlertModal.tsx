import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ModalProps } from "./ModalProps";
import { AlertTriangle } from "lucide-react";

export default function SimpleAlertModal(props: ModalProps) {
  const {
    open,
    onOpenChange,
    title = "Error",
    description = "Please try again later.",
    details,
    okText = "OK",
    blockOutsideClose = false,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        {...(blockOutsideClose
          ? {
              onPointerDownOutside: (e) => e.preventDefault(),
              onEscapeKeyDown: (e) => e.preventDefault(),
            }
          : {})}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {details ? (
          <pre className="mt-3 max-h-56 overflow-auto rounded bg-muted/40 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
            {details}
          </pre>
        ) : null}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{okText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
