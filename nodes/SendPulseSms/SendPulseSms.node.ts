import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseSms implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse SMS',
        name: 'sendPulseSms',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse SMS',
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
            baseURL: 'https://api.sendpulse.com/sms',
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
                        name: 'Phone Number',
                        value: 'phoneNumber',
                    },
                    {
                        name: 'Campaign',
                        value: 'campaign',
                    },
                ],
                default: 'phoneNumber',
            },

            // Operations for Phone Number resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['phoneNumber'],
                    },
                },
                options: [
                    {
                        name: 'Add to Mailing List',
                        value: 'addNumbers',
                        description: 'Add phone numbers to a mailing list without variables',
                        action: 'Add phone numbers to mailing list',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/numbers',
                            },
                        },
                    },
                ],
                default: 'addNumbers',
            },

            // Operations for Campaign resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create an SMS campaign for a mailing list',
                        action: 'Create SMS campaign for mailing list',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/campaigns',
                            },
                        },
                    },
                ],
                default: 'create',
            },

            // Fields
            {
                displayName: 'Address Book ID',
                name: 'addressBookId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['phoneNumber', 'campaign'],
                        operation: ['addNumbers', 'create'],
                    },
                },
                default: 0,
                description: 'Mailing list ID',
                routing: {
                    send: {
                        type: 'body',
                        property: 'addressBookId',
                    },
                },
            },
            {
                displayName: 'Phone Numbers',
                name: 'phones',
                type: 'string',
                required: true,
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        resource: ['phoneNumber'],
                        operation: ['addNumbers'],
                    },
                },
                default: '',
                description: 'List of phone numbers',
                routing: {
                    send: {
                        type: 'body',
                        property: 'phones',
                    },
                },
            },
            {
                displayName: 'Sender',
                name: 'sender',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Alphanumeric sender name, maximum 11 symbols',
                routing: {
                    send: {
                        type: 'body',
                        property: 'sender',
                    },
                },
            },
            {
                displayName: 'Message Body',
                name: 'body',
                type: 'string',
                required: true,
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'SMS message text',
                routing: {
                    send: {
                        type: 'body',
                        property: 'body',
                    },
                },
            },

            // Additional Fields for Campaign - Create
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Date',
                        name: 'date',
                        type: 'dateTime',
                        default: '',
                        description: 'Date and time to send the campaign',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'date',
                                value: '={{ $value ? $value.split(".")[0].replace("T", " ") : undefined }}',
                            },
                        },
                    },
                    {
                        displayName: 'Emulate',
                        name: 'emulate',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to enable test mode - campaign will be formed but not sent',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'emulate',
                            },
                        },
                    },
                    {
                        displayName: 'Enable HTTPS on Links',
                        name: 'stat_link_need_protocol',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to enable HTTPS protocol on links',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stat_link_need_protocol',
                            },
                        },
                    },
                    {
                        displayName: 'Enable Link Tracking',
                        name: 'stat_link_tracking',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to enable click-through statistics',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stat_link_tracking',
                            },
                        },
                    },
                    {
                        displayName: 'Routes',
                        name: 'route',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'routesList',
                                displayName: 'Routes',
                                values: [
                                    {
                                        displayName: 'Country Code',
                                        name: 'countryCode',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'UA',
                                        description: 'Data name',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Data value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Route',
                        description: 'List of routes for various countries',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'route',
                                value: '={{ Object.fromEntries($value.routesList?.map(v => [v.countryCode, v.value]) || []) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Use Dynamic List',
                        name: 'use_dynamic_list',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to use dynamic list for scheduled campaigns',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'use_dynamic_list',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
