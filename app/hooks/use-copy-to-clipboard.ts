import * as React from "react";

interface CopyToClipboardOptions {
  delay?: number;
}

function useCopyToClipboard(opts?: CopyToClipboardOptions) {
  const { delay = 2000 } = opts ?? {};

  const [status, setStatus] = React.useState<"idle" | "copied" | "error">(
    "idle"
  );
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const copy = React.useCallback(async (text: string) => {
    clear();

    if (!navigator.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");

      timeoutId.current = setTimeout(() => {
        setStatus("idle");
      }, delay);
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }, []);

  function clear() {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }

  return [status, copy] as const;
}

export { useCopyToClipboard, type CopyToClipboardOptions };
