export default function Hint({ text }: { text?: string }) {
  return text ? <div className="text-xs text-muted-foreground mt-1">{text}</div> : null;
}