export default class BaseComponent {
    protected inputs: any;
    protected client: any;
    name: string;
    private basePath;
    constructor(inputs: any);
    __getBasePath(): string;
    protected help(name: any): void;
    protected __report(reportData: ServerlessDevsReport.ReportData): ServerlessDevsReport.Ram;
    private getEntityByName;
    private getEntityHelpInfoByName;
}
