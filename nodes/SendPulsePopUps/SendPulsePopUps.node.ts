import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulsePopUps implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Pop-ups',
        name: 'sendPulsePopUps',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse Pop-ups',
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
            baseURL: 'https://login.sendpulse.com/api/pop-ups',
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
                        name: 'Project',
                        value: 'project',
                    },
                    {
                        name: 'Pop-Up',
                        value: 'popUp',
                    },
                ],
                default: 'project',
            },

            // Operations for Project resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['project'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get many projects (widgets)',
                        action: 'Get many projects',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/public/api/widgets/list',
                                qs: {
                                    first: '={{ $parameter.additionalFields.limit }}',
                                    offset: '={{ $parameter.additionalFields.offset }}',
                                },
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Operations for Pop-up resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['popUp'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get many popups for a project',
                        action: 'Get many popups',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/public/api/popups/list/{{ $parameter.projectId }}',
                                qs: {
                                    first: '={{ $parameter.additionalFields.limit }}',
                                    offset: '={{ $parameter.additionalFields.offset }}',
                                },
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Fields
            {
                displayName: 'Project ID',
                name: 'projectId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['popUp'],
                        operation: ['getMany'],
                    },
                },
                default: '',
                description: 'The ID of the project',
            },

            // Additional Fields for Project - Get Many and Pop-up - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['project', 'popUp'],
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
