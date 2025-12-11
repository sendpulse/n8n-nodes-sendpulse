import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseA360 implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Automation360',
        name: 'sendPulseA360',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse Automation360',
        },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'sendPulseApi',
                required: false,
                displayOptions: {
                    show: {
                        authentication: ['accessToken'],
                    },
                },
            },
            {
                name: 'sendPulseOAuth2Api',
                required: false,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                    },
                },
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.sendpulse.com/a360',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            // Authentication selector
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'Client ID & Client Secret',
                        value: 'oAuth2',
                    },
                    {
                        name: 'Access Token',
                        value: 'accessToken',
                    }
                ],
                default: 'oAuth2',
            },

            // Resource selector
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Flow',
                        value: 'flow',
                    },
                ],
                default: 'flow',
            },

            // Operations for Flow resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['flow'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of automation flows',
                        action: 'Get many automation flows',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/autoresponders/list',
                                qs: {
                                    limit: '={{ $parameter.additionalFields.limit }}',
                                    offset: '={{ $parameter.additionalFields.offset }}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a automation flow by ID',
                        action: 'Get a automation flow',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/autoresponders/{{ $parameter.flowId }}',
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Fields
            {
                displayName: 'Flow ID',
                name: 'flowId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['flow'],
                        operation: ['get'],
                    },
                },
                default: 0,
                description: 'The ID of the flow to retrieve',
            },

            // Additional Fields for Flow - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['flow'],
                        operation: ['getMany'],
                    },
                },
                options: [
                    {
                        displayName: 'Limit',
                        name: 'limit',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                        },
                        default: 50,
                        description: 'Max number of results to return',
                    },
                    {
                        displayName: 'Offset',
                        name: 'offset',
                        type: 'number',
                        typeOptions: {
                            minValue: 0,
                        },
                        default: 0,
                        description: 'Number of results to skip',
                    },
                ],
            },
        ],
    };
}
