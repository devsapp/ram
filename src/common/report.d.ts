declare namespace ServerlessDevsReport {
  export interface Ram {
    role: string;
    arn: string;
  }
  export interface ReportData {
    name: string;
    content: Ram;
  }
}
