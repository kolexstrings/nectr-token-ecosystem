declare module "react-copy-to-clipboard" {
  import * as React from "react";

  export interface CopyToClipboardOptions {
    format?: string;
    debug?: boolean;
    message?: string;
  }

  export interface CopyToClipboardProps {
    text: string;
    onCopy?: (text: string, result: boolean) => void;
    options?: CopyToClipboardOptions;
    children?: React.ReactNode;
  }

  export class CopyToClipboard extends React.Component<CopyToClipboardProps> {}
  export default CopyToClipboard;
}
