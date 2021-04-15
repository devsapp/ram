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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLFFBQUEsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUVyQixRQUFBLFlBQVksR0FBRztJQUMxQixPQUFPLEVBQUUsQ0FBQztJQUNWLE1BQU0sRUFBRSxDQUFDO0lBQ1QsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFJO0lBQ3BCLFNBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUM7QUFFVyxRQUFBLElBQUksR0FBRztJQUNsQjtRQUNFLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixLQUFLLEVBQUUsR0FBRztnQkFDVixJQUFJLEVBQUUsT0FBTzthQUNkO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsT0FBTyxFQUFFLG9CQUFvQjthQUM5QjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxvQkFBb0I7YUFDOUI7U0FDRjtLQUNGO0NBQ0YsQ0FBQyJ9