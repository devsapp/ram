"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.RETRYOPTIONS = exports.CONTEXT = void 0;
exports.CONTEXT = 'FC-RAM';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc3RhbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBRW5CLFFBQUEsWUFBWSxHQUFHO0lBQzFCLE9BQU8sRUFBRSxDQUFDO0lBQ1YsTUFBTSxFQUFFLENBQUM7SUFDVCxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQztBQUVXLFFBQUEsSUFBSSxHQUFHO0lBQ2xCO1FBQ0UsTUFBTSxFQUFFLFNBQVM7UUFDakIsVUFBVSxFQUFFO1lBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osV0FBVyxFQUFFLE1BQU07Z0JBQ25CLEtBQUssRUFBRSxHQUFHO2dCQUNWLElBQUksRUFBRSxPQUFPO2FBQ2Q7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxPQUFPLEVBQUUsb0JBQW9CO2FBQzlCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLG9CQUFvQjthQUM5QjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIn0=