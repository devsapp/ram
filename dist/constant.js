"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.RETRYOPTIONS = exports.CONTEXT_NAME = exports.CONTEXT = void 0;
exports.CONTEXT = 'RAM';
exports.CONTEXT_NAME = 'ram';
exports.RETRYOPTIONS = {
    retries: 5,
    factor: 2,
    minTimeout: 1 * 1000,
    randomize: true,
};
exports.HELP = [
    {
        header: 'Ram',
        content: 'Operation ram resource.',
    },
    {
        header: 'Usage',
        content: '$ s deploy/delete <options> ',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'help',
                description: '使用引导',
                alias: 'h',
                type: Boolean,
            },
        ],
    },
    {
        header: 'Examples',
        content: [
            {
                example: '$ s exec -- deploy',
            },
            {
                example: '$ s exec -- delete',
            },
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLFFBQUEsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUVyQixRQUFBLFlBQVksR0FBRztJQUMxQixPQUFPLEVBQUUsQ0FBQztJQUNWLE1BQU0sRUFBRSxDQUFDO0lBQ1QsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFJO0lBQ3BCLFNBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUM7QUFFVyxRQUFBLElBQUksR0FBRztJQUNsQjtRQUNFLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLHlCQUF5QjtLQUNuQztJQUNEO1FBQ0UsTUFBTSxFQUFFLE9BQU87UUFDZixPQUFPLEVBQUUsOEJBQThCO0tBQ3hDO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsU0FBUztRQUNqQixVQUFVLEVBQUU7WUFDVjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixXQUFXLEVBQUUsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsSUFBSSxFQUFFLE9BQU87YUFDZDtTQUNGO0tBQ0Y7SUFDRDtRQUNFLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLE9BQU8sRUFBRSxvQkFBb0I7YUFDOUI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsb0JBQW9CO2FBQzlCO1NBQ0Y7S0FDRjtDQUNGLENBQUMifQ==