export declare const CONTEXT = "RAM";
export declare const CONTEXT_NAME = "ram";
export declare const RETRYOPTIONS: {
    retries: number;
    factor: number;
    minTimeout: number;
    randomize: boolean;
};
export declare const HELP: ({
    header: string;
    content: string;
    optionList?: undefined;
} | {
    header: string;
    optionList: {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
    }[];
    content?: undefined;
} | {
    header: string;
    content: {
        example: string;
    }[];
    optionList?: undefined;
})[];
