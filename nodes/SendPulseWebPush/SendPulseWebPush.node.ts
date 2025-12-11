import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseWebPush implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Web Push',
        name: 'sendPulseWebPush',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse WebPush',
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
            baseURL: 'https://api.sendpulse.com/push',
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
                        name: 'Website',
                        value: 'website',
                    },
                    {
                        name: 'Campaign',
                        value: 'campaign',
                    },
                ],
                default: 'website',
            },

            // Operations for Website resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['website'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get many websites',
                        action: 'Get many websites',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/websites',
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
                        description: 'Get a website by ID',
                        action: 'Get a website',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/websites/info/{{ $parameter.websiteId }}',
                            },
                        },
                    },
                ],
                default: 'getMany',
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
                        description: 'Create a new web push campaign',
                        action: 'Create web push campaign',
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
                displayName: 'Website ID',
                name: 'websiteId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['website', 'campaign'],
                        operation: ['get', 'create'],
                    },
                },
                default: 0,
                description: 'The ID of the website',
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'The title of the campaign',
                routing: {
                    send: {
                        type: 'body',
                        property: 'title',
                    },
                },
            },
            {
                displayName: 'Body',
                name: 'body',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                typeOptions: {
                    rows: 4,
                },
                default: '',
                description: 'The body text of the campaign',
                routing: {
                    send: {
                        type: 'body',
                        property: 'body',
                    },
                },
            },
            {
                displayName: 'TTL (Seconds)',
                name: 'ttl',
                type: 'number',
                required: true,
                typeOptions: {
                    maxValue: 86400,
                },
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: 0,
                description: 'Time to live for the notification in seconds',
                routing: {
                    send: {
                        type: 'body',
                        property: 'ttl',
                    },
                },
            },

            // Additional Fields for Website - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['website'],
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
                        displayName: 'Browser',
                        name: 'browser',
                        type: 'string',
                        default: '',
                        description: 'Filter subscribers by browser. Multiple values separated by commas (for example – Chrome, Safari).',
                        placeholder: 'Chrome,Safari',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_browser',
                            },
                        },
                    },
                    {
                        displayName: 'Buttons',
                        name: 'buttons',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'buttonsList',
                                displayName: 'Button',
                                values: [
                                    {
                                        displayName: 'Text',
                                        name: 'text',
                                        type: 'string',
                                        default: '',
                                        description: 'Button text',
                                    },
                                    {
                                        displayName: 'URL',
                                        name: 'link',
                                        type: 'string',
                                        default: '',
                                        description: 'Button URL',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Button',
                        description: 'Action buttons to display in the notification',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'buttons',
                                value: '={{ JSON.stringify($value.buttonsList) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Filter',
                        name: 'filter',
                        type: 'fixedCollection',
                        options: [
                            {
                                name: 'filter',
                                displayName: 'Filter',
                                values: [
                                    {
                                        displayName: 'Variable Name',
                                        name: 'variable_name',
                                        type: 'string',
                                        default: '',
                                        description: 'Filter variable name',
                                    },
                                    {
                                        displayName: 'Operator',
                                        name: 'operator',
                                        type: 'options',
                                        options: [
                                            {
                                                name: 'And',
                                                value: 'and',
                                            },
                                            {
                                                name: 'Or',
                                                value: 'or',
                                            },
                                        ],
                                        default: 'and',
                                        description: 'Filter operator',
                                    },
                                    {
                                        displayName: 'Conditions',
                                        name: 'conditions',
                                        type: 'fixedCollection',
                                        typeOptions: {
                                            multipleValues: true,
                                        },
                                        options: [
                                            {
                                                name: 'conditionsList',
                                                displayName: 'Condition',
                                                values: [
                                                    {
                                                        displayName: 'Condition',
                                                        name: 'condition',
                                                        type: 'options',
                                                        options: [
                                                            {
                                                                name: 'End With',
                                                                value: 'endwith',
                                                            },
                                                            {
                                                                name: 'Equal',
                                                                value: 'equal',
                                                            },
                                                            {
                                                                name: 'Greater Than',
                                                                value: 'greaterthan',
                                                            },
                                                            {
                                                                name: 'Less Than',
                                                                value: 'lessthan',
                                                            },
                                                            {
                                                                name: 'Like With',
                                                                value: 'likewith',
                                                            },
                                                            {
                                                                name: 'Not Equal',
                                                                value: 'notequal',
                                                            },
                                                            {
                                                                name: 'Not Like With',
                                                                value: 'notlikewith',
                                                            },
                                                            {
                                                                name: 'Start With',
                                                                value: 'startwith',
                                                            },
                                                        ],
                                                        default: 'equal',
                                                        description: 'Filter Condition',
                                                    },
                                                    {
                                                        displayName: 'Value',
                                                        name: 'value',
                                                        type: 'string',
                                                        default: '',
                                                        description: 'Variable value',
                                                    },
                                                ],
                                            },
                                        ],
                                        default: {},
                                        placeholder: 'Add Condition',
                                        description: 'Filters conditions',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        description: 'Filter to target specific subscribers',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter',
                                value: '={{ {...$value.filter, conditions: $value.filter.conditions.conditionsList} }}',
                            },
                        },
                    },
                    {
                        displayName: 'Icon',
                        name: 'icon',
                        type: 'fixedCollection',
                        options: [
                            {
                                name: 'icon',
                                displayName: 'Icon',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'Icon name',
                                    },
                                    {
                                        displayName: 'Data (Base64)',
                                        name: 'data',
                                        type: 'string',
                                        default: '',
                                        description: 'Icon data (Base64)',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        description: 'Custom image of a standard size for the notification',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'icon',
                                value: '={{ JSON.stringify($value.icon) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Image',
                        name: 'image',
                        type: 'fixedCollection',
                        options: [
                            {
                                name: 'image',
                                displayName: 'Icon',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'Image name',
                                    },
                                    {
                                        displayName: 'Data (Base64)',
                                        name: 'data',
                                        type: 'string',
                                        default: '',
                                        description: 'Image data (Base64)',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        description: 'Larger image for the web-push notification. Must be JPG, PNG or GIF format and less than 200KB.',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'image',
                                value: '={{ JSON.stringify($value.image) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Language',
                        name: 'language',
                        type: 'string',
                        default: '',
                        description: 'Filter subscribers by language (for example, en)',
                        placeholder: 'en',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_lang',
                            },
                        },
                    },
                    {
                        displayName: 'Navigation Link',
                        name: 'link',
                        type: 'string',
                        default: '',
                        placeholder: 'https://example.com',
                        description: 'Navigation link, if it’s not specified, the website URL will be used',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'link',
                            },
                        },
                    },
                    {
                        displayName: 'Region',
                        name: 'region',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'Regional filter',
                        placeholder: 'UK',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_region',
                                value: '={{ JSON.stringify($value) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Send Date',
                        name: 'sendDate',
                        type: 'dateTime',
                        default: '',
                        description: 'Schedule the campaign for a specific date and time',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'send_date',
                                value: '={{ $value ? $value.split(".")[0].replace("T", " ") : undefined }}',
                            },
                        },
                    },
                    {
                        displayName: 'Stretch Time',
                        name: 'stretchTime',
                        type: 'number',
                        default: 18000,
                        description: 'Timespan in which the campaign must be completed (in seconds). If not specified, the default time (5 hours = 18000 seconds) applies.',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stretch_time',
                            },
                        },
                    },
                    {
                        displayName: 'Subscription Date From',
                        name: 'subscriptionDateFrom',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Filter subscribers by the date they were added (starting date in YYYY-MM-DD format)',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_subscription_date_from',
                            },
                        },
                    },
                    {
                        displayName: 'Subscription Date To',
                        name: 'subscriptionDateTo',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Filter subscribers by the date they were added (ending date in YYYY-MM-DD format)',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_subscription_date_to',
                            },
                        },
                    },
                    {
                        displayName: 'URL',
                        name: 'url',
                        type: 'fixedCollection',
                        options: [
                            {
                                name: 'url',
                                displayName: 'URL',
                                values: [
                                    {
                                        displayName: 'Type',
                                        name: 'type',
                                        type: 'options',
                                        options: [
                                            {
                                                name: 'Direct',
                                                value: 'direct',
                                            },
                                            {
                                                name: 'Exclude',
                                                value: 'exclude',
                                            },
                                            {
                                                name: 'Include',
                                                value: 'include',
                                            },
                                        ],
                                        default: 'direct',
                                        description: 'URL Type',
                                    },
                                    {
                                        displayName: 'Search',
                                        name: 'search',
                                        type: 'string',
                                        displayOptions: {
                                            show: {
                                                type: ['exclude', 'include'],
                                            },
                                        },
                                        default: '',
                                        description: 'String for search',
                                    },
                                    {
                                        displayName: 'Search',
                                        name: 'search',
                                        type: 'string',
                                        typeOptions: {
                                            multipleValues: true,
                                        },
                                        displayOptions: {
                                            show: {
                                                type: ['direct'],
                                            },
                                        },
                                        default: '',
                                        description: 'List of links to search',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        description: 'URL filter',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter_url',
                                value: '={{ JSON.stringify($value.url) }}',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
