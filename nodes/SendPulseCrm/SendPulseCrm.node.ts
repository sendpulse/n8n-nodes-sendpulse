import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseCrm implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse CRM',
        name: 'sendPulseCrm',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse CRM',
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
            baseURL: 'https://api.sendpulse.com/crm/v1',
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
                        name: 'Contact',
                        value: 'contact',
                    },
                    {
                        name: 'Deal',
                        value: 'deal',
                    },
                    {
                        name: 'Pipeline',
                        value: 'pipeline',
                    },
                ],
                default: 'contact',
            },

            // Operations for Contact resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of contacts',
                        action: 'Get many contacts',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/contacts/get-list',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a contact by ID',
                        action: 'Get a contact',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/contacts/{{ $parameter.contactId }}',
                            },
                        },
                    },
                    {
                        name: 'Get by External ID',
                        value: 'getByExternalId',
                        description: 'Get a contact by external ID',
                        action: 'Get a contact by external ID',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/contacts/external/{{ $parameter.externalContactId }}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new contact',
                        action: 'Create a contact',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/contacts/create',
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Operations for Deal resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['deal'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of deals',
                        action: 'Get many deals',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/deals/get-list',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a deal by ID',
                        action: 'Get a deal',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/deals/{{ $parameter.dealId }}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new deal',
                        action: 'Create a deal',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/deals',
                                body: {
                                    pipelineId: '={{ $parameter.pipelineId }}',
                                },
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Operations for Pipeline resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['pipeline'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of pipelines',
                        action: 'Get many pipelines',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/pipelines',
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a pipeline by ID',
                        action: 'Get a pipeline',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/pipelines/{{ $parameter.pipelineId }}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new pipeline',
                        action: 'Create a deal',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/pipelines',
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Fields
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['get'],
                    },
                },
                default: '',
                description: 'The ID of the contact to retrieve',
            },
            {
                displayName: 'External Contact ID',
                name: 'externalContactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['getByExternalId'],
                    },
                },
                default: '',
                description: 'The external ID of the contact to retrieve',
            },
            {
                displayName: 'First Name',
                name: 'firstName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'First name of the contact',
                routing: {
                    send: {
                        type: 'body',
                        property: 'firstName',
                    },
                },
            },
            {
                displayName: 'Last Name',
                name: 'lastName',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Last name of the contact',
                routing: {
                    send: {
                        type: 'body',
                        property: 'lastName',
                    },
                },
            },
            // {
            //     displayName: 'IDs',
            //     name: 'ids',
            //     type: 'number',
            //     typeOptions: {
            //         multipleValues: true,
            //     },
            //     default: '',
            //     description: 'Contact IDs',
            //     routing: {
            //         send: {
            //             type: 'body',
            //             property: 'ids',
            //         },
            //     },
            // },
            {
                displayName: 'Pipeline IDs',
                name: 'pipelineIds',
                type: 'fixedCollection',
                required: true,
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['getMany'],
                    },
                },
                default: {},
                options: [
                    {
                        name: 'id',
                        displayName: 'Pipeline ID',
                        values: [
                            {
                                displayName: 'Pipeline ID',
                                name: 'pipelineId',
                                type: 'number',
                                default: 0,
                            },
                        ],
                    },
                ],
                description: 'The IDs of the deals to retrieve',
                placeholder: 'Add Pipeline ID',
                routing: {
                    send: {
                        type: 'body',
                        property: 'pipelineIds',
                        value: '={{ $value.id.map(({ pipelineId }) => pipelineId) }}',
                    },
                },
            },
            {
                displayName: 'Deal ID',
                name: 'dealId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['get'],
                    },
                },
                default: '',
                description: 'The ID of the deal to retrieve',
            },
            {
                displayName: 'Pipeline ID',
                name: 'pipelineId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['pipeline', 'deal'],
                        operation: ['get', 'create'],
                    },
                },
                default: '',
                description: 'The ID of the pipeline to retrieve',
            },
            {
                displayName: 'Step ID',
                name: 'stepId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['create'],
                    },
                },
                default: 0,
                description: 'The ID of the pipeline step (stage)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'stepId',
                    },
                },
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['pipeline'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name of the pipeline',
                routing: {
                    send: {
                        type: 'body',
                        property: 'name',
                    },
                },
            },
            {
                displayName: 'Deal Name',
                name: 'name',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name of the deal',
                routing: {
                    send: {
                        type: 'body',
                        property: 'name',
                    },
                },
            },

            // Additional Fields for Contact - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['getMany'],
                    },
                },
                options: [
                    {
                        displayName: 'Attributes',
                        name: 'attributes',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'attributesList',
                                displayName: 'Attributes List',
                                values: [
                                    {
                                        displayName: 'ID',
                                        name: 'id',
                                        type: 'string',
                                        default: '',
                                        description: 'Attribute ID',
                                    },
                                    {
                                        displayName: 'Expression',
                                        name: 'expression',
                                        type: 'options',
                                        options: [
                                            {
                                                name: '!=',
                                                value: 'neq',
                                            },
                                            {
                                                name: '<',
                                                value: 'lt',
                                            },
                                            {
                                                name: '<=',
                                                value: 'lte',
                                            },
                                            {
                                                name: '=',
                                                value: 'eq',
                                            },

                                            {
                                                name: '>',
                                                value: 'gt',
                                            },
                                            {
                                                name: '>=',
                                                value: 'gte',
                                            },
                                            {
                                                name: 'In',
                                                value: 'in',
                                            },
                                            {
                                                name: 'Like',
                                                value: 'like',
                                            },
                                        ],
                                        default: 'neq',
                                        description: 'Attribute expression',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Attribute value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Attribute',
                        description: 'Contact attributes',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attributes',
                                value: '={{ $value.attributesList }}',
                            },
                        },
                    },
                    {
                        displayName: 'Created From',
                        name: 'from',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Contact creation date, filter start date',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'from',
                            },
                        },
                    },
                    {
                        displayName: 'Created To',
                        name: 'to',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Contact creation date, filter end date',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'to',
                            },
                        },
                    },
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                        placeholder: 'user@example.com',
                        description: 'Email of a contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'email',
                            },
                        },
                    },
                    {
                        displayName: 'Field Conditions', // TODO
                        name: 'fieldValueConditions',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'conditionsList',
                                displayName: 'Conditions List',
                                values: [
                                    {
                                        displayName: 'Field Name',
                                        name: 'field',
                                        type: 'options',
                                        options: [
                                            {
                                                name: 'Attributes',
                                                value: 'attributes',
                                            },
                                            {
                                                name: 'Emails',
                                                value: 'emails',
                                            },
                                            {
                                                name: 'Last Name',
                                                value: 'lastName',
                                            },
                                            {
                                                name: 'Location',
                                                value: 'location',
                                            },
                                            {
                                                name: 'Messengers',
                                                value: 'messengers',
                                            },
                                            {
                                                name: 'Phones',
                                                value: 'phones',
                                            },
                                            {
                                                name: 'Tags',
                                                value: 'tags',
                                            },
                                        ],
                                        default: 'attributes',
                                        description: 'Contact field name',
                                    },
                                    {
                                        displayName: 'Expression',
                                        name: 'expression',
                                        type: 'options',
                                        options: [
                                            {
                                                name: '!=',
                                                value: 'neq',
                                            },
                                            {
                                                name: '<',
                                                value: 'lt',
                                            },
                                            {
                                                name: '<=',
                                                value: 'lte',
                                            },
                                            {
                                                name: '=',
                                                value: 'eq',
                                            },

                                            {
                                                name: '>',
                                                value: 'gt',
                                            },
                                            {
                                                name: '>=',
                                                value: 'gte',
                                            },
                                            {
                                                name: 'In',
                                                value: 'in',
                                            },
                                            {
                                                name: 'Like',
                                                value: 'like',
                                            },
                                        ],
                                        default: 'neq',
                                        description: 'Field expression',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        displayOptions: {
                                            show: {
                                                expression: ['neq', 'lt', 'lte', 'eq', 'qt', 'gte', 'like'],
                                            },
                                        },
                                        default: '',
                                        description: 'Field value',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        typeOptions: {
                                            multipleValues: true,
                                        },
                                        displayOptions: {
                                            show: {
                                                expression: ['in'],
                                            },
                                        },
                                        default: '',
                                        description: 'Field value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Field Condition',
                        description: 'Contact field conditions',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'fieldValueConditions',
                                value: '={{ $value.conditionsList }}',
                            },
                        },
                    },
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                        description: 'First name of the contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'firstName',
                            },
                        },
                    },
                    {
                        displayName: 'IDs',
                        name: 'ids',
                        type: 'number',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'Contact IDs',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'ids',
                            },
                        },
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                        description: 'Last name of the contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'lastName',
                            },
                        },
                    },
                    {
                        displayName: 'Limit',
                        name: 'limit',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                            maxValue: 100,
                        },
                        default: 50,
                        description: 'Max number of results to return',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'limit',
                            },
                        },
                    },
                    {
                        displayName: 'Location',
                        name: 'location',
                        type: 'string',
                        default: '',
                        description: 'Contact location',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'location',
                            },
                        },
                    },
                    {
                        displayName: 'Messenger Login',
                        name: 'messengerLogin',
                        type: 'string',
                        default: '',
                        description: 'Contact Messenger Login',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'messengerLogin',
                            },
                        },
                    },
                    {
                        displayName: 'Messenger Type',
                        name: 'messengerTypeIds',
                        type: 'multiOptions',
                        options: [
                            {
                                name: 'Telegram',
                                value: 1,
                            },
                            {
                                name: 'Facebook Messenger',
                                value: 2,
                            },
                            {
                                name: 'Instagram',
                                value: 4,
                            },
                            {
                                name: 'WhatsApp',
                                value: 5,
                            },
                            {
                                name: 'Viber',
                                value: 6,
                            },
                            {
                                name: 'TikTok',
                                value: 8,
                            },
                            {
                                name: 'LinkedIn',
                                value: 5008,
                            },
                        ],
                        default: [],
                        description: 'Contact messenger type',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'messengerTypeIds',
                            },
                        },
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
                        routing: {
                            send: {
                                type: 'body',
                                property: 'offset',
                            },
                        },
                    },
                    {
                        displayName: 'Phone',
                        name: 'phone',
                        type: 'string',
                        default: '',
                        description: 'Phone number of a contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'phone',
                            },
                        },
                    },
                    {
                        displayName: 'Responsible IDs',
                        name: 'responsibleIds',
                        type: 'number',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'A list with the ID of users assigned to the contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'responsibleIds',
                            },
                        },
                    },
                    {
                        displayName: 'Sort Direction',
                        name: 'sortDirection',
                        type: 'options',
                        options: [
                            {
                                name: 'Ascending',
                                value: 'asc',
                            },
                            {
                                name: 'Descending',
                                value: 'desc',
                            },
                        ],
                        default: 'asc',
                        description: 'Sorting direction',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sortBy.direction',
                            },
                        },
                    },
                    {
                        displayName: 'Sort Field',
                        name: 'sortField',
                        type: 'options',
                        options: [
                            {
                                name: 'Created At',
                                value: 'created_at',
                            },
                            {
                                name: 'First Name',
                                value: 'first_name',
                            },
                            {
                                name: 'ID',
                                value: 'id',
                            },
                            {
                                name: 'Responsible ID',
                                value: 'responsible_id',
                            },
                        ],
                        default: 'created_at',
                        description: 'Sorting field name',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sortBy.fieldName',
                            },
                        },
                    },
                    {
                        displayName: 'Source Type',
                        name: 'sourceType',
                        type: 'multiOptions',
                        options: [
                            {
                                name: '1',
                                value: 1,
                            },
                            {
                                name: 'Manually',
                                value: 2,
                            },
                            {
                                name: '3',
                                value: 3,
                            },
                            {
                                name: '4',
                                value: 4,
                            },
                            {
                                name: '5',
                                value: 5,
                            },
                            {
                                name: '6',
                                value: 6,
                            },
                            {
                                name: '8',
                                value: 8,
                            },
                            {
                                name: '9',
                                value: 9,
                            },
                            {
                                name: '10',
                                value: 10,
                            },
                            {
                                name: 'Marketplace',
                                value: 13,
                            },
                        ],
                        default: [],
                        description: 'Contact source type',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sourceType',
                            },
                        },
                    },
                    {
                        displayName: 'Tag IDs',
                        name: 'tagIds',
                        type: 'number',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'List of tags to assign',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'tagIds',
                            },
                        },
                    },
                    {
                        displayName: 'Updated From',
                        name: 'updatedFrom',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Contact updated date, filter start date',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'updateFrom',
                            },
                        },
                    },
                    {
                        displayName: 'Updated To',
                        name: 'updatedTo',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Contact updated date, filter end date',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'updateTo',
                            },
                        },
                    },
                ],
            },

            // Additional Fields for Contact - Create
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'External ID',
                        name: 'externalId',
                        type: 'string',
                        default: '',
                        description: 'External identifier for the contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'externalContactId',
                            },
                        },
                    },
                    {
                        displayName: 'Responsible ID',
                        name: 'responsibleId',
                        type: 'number',
                        default: '',
                        description: 'Team member ID to assign to a contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'responsibleId',
                            },
                        },
                    },
                ],
            },

            // Additional Fields for Deal - GetMany
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['getMany'],
                    },
                },
                options: [
                    {
                        displayName: 'Attributes',
                        name: 'attributes',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'attributesList',
                                displayName: 'Attributes List',
                                values: [
                                    {
                                        displayName: 'ID',
                                        name: 'id',
                                        type: 'string',
                                        default: '',
                                        description: 'Attribute ID',
                                    },
                                    {
                                        displayName: 'Expression',
                                        name: 'expression',
                                        type: 'options',
                                        options: [
                                            {
                                                name: '!=',
                                                value: 'neq',
                                            },
                                            {
                                                name: '<',
                                                value: 'lt',
                                            },
                                            {
                                                name: '<=',
                                                value: 'lte',
                                            },
                                            {
                                                name: '=',
                                                value: 'eq',
                                            },

                                            {
                                                name: '>',
                                                value: 'gt',
                                            },
                                            {
                                                name: '>=',
                                                value: 'gte',
                                            },
                                            {
                                                name: 'In',
                                                value: 'in',
                                            },
                                            {
                                                name: 'Like',
                                                value: 'like',
                                            },
                                        ],
                                        default: 'neq',
                                        description: 'Attribute expression',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Attribute value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Attribute',
                        description: 'Deal attributes',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attributes',
                                value: '={{ $value.attributesList }}',
                            },
                        },
                    },
                    {
                        displayName: 'Completion Date From',
                        name: 'completionDateFrom',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Deal completion date from',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'completionDateFrom',
                            },
                        },
                    },
                    {
                        displayName: 'Completion Date To',
                        name: 'completionDateTo',
                        type: 'string',
                        validateType: 'dateTime',
                        default: '',
                        description: 'Deal completion date to',
                        placeholder: 'YYYY-MM-DD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'completionDateTo',
                            },
                        },
                    },
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                        placeholder: 'user@example.com',
                        description: 'Email of a deal contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'email',
                            },
                        },
                    },
                    {
                        displayName: 'Expiration',
                        name: 'expiration',
                        type: 'options',
                        options: [
                            {
                                name: 'Without Date',
                                value: 1,
                            },
                            {
                                name: 'Overdue',
                                value: 2,
                            },
                            {
                                name: 'Within Day',
                                value: 3,
                            },
                            {
                                name: 'Within Week',
                                value: 4,
                            },
                            {
                                name: 'Within Month',
                                value: 5,
                            },
                        ],
                        default: 1,
                        description: 'Filter by deal expiration daten',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'expiration',
                            },
                        },
                    },
                    {
                        displayName: 'Filters',
                        name: 'filters',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'filtersList',
                                displayName: 'Filters List',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'options',
                                        options: [
                                            {
                                                name: 'Created At',
                                                value: 'createdAt',
                                            },
                                            {
                                                name: 'Currency',
                                                value: 'currency',
                                            },
                                            {
                                                name: 'ID',
                                                value: 'id',
                                            },
                                            {
                                                name: 'Name',
                                                value: 'name',
                                            },
                                            {
                                                name: 'Number',
                                                value: 'number',
                                            },
                                            {
                                                name: 'Pipeline ID',
                                                value: 'pipelineId',
                                            },
                                            {
                                                name: 'Price',
                                                value: 'price',
                                            },
                                            {
                                                name: 'Responsible ID',
                                                value: 'responsibleId',
                                            },
                                            {
                                                name: 'Source ID',
                                                value: 'sourceId',
                                            },
                                            {
                                                name: 'Source Type',
                                                value: 'sourceType',
                                            },
                                            {
                                                name: 'Status',
                                                value: 'status',
                                            },
                                            {
                                                name: 'Step ID',
                                                value: 'stepId',
                                            },
                                            {
                                                name: 'Updated At',
                                                value: 'updatedAt',
                                            },
                                        ],
                                        default: 'createdAt',
                                        description: 'Filter name',
                                    },
                                    {
                                        displayName: 'Expression',
                                        name: 'expression',
                                        type: 'options',
                                        options: [
                                            {
                                                name: '!=',
                                                value: 'neq',
                                            },
                                            {
                                                name: '<',
                                                value: 'lt',
                                            },
                                            {
                                                name: '<=',
                                                value: 'lte',
                                            },
                                            {
                                                name: '=',
                                                value: 'eq',
                                            },

                                            {
                                                name: '>',
                                                value: 'gt',
                                            },
                                            {
                                                name: '>=',
                                                value: 'gte',
                                            },
                                            {
                                                name: 'In',
                                                value: 'in',
                                            },
                                            {
                                                name: 'Like',
                                                value: 'like',
                                            },
                                        ],
                                        default: 'neq',
                                        description: 'Filter expression',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        // typeOptions: {
                                        //     multipleValues: true,
                                        // },
                                        default: '',
                                        description: 'Filter value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Filter',
                        description: 'Deal Filters',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'filter',
                                value: '={{ $value.filtersList }}',
                            },
                        },
                    },
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                        description: 'First name of the deal contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'firstName',
                            },
                        },
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                        description: 'Last name of the deal contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'lastName',
                            },
                        },
                    },
                    {
                        displayName: 'Limit',
                        name: 'limit',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                            maxValue: 100,
                        },
                        default: 50,
                        description: 'Max number of results to return',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'limit',
                            },
                        },
                    },
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                        description: 'Name of a deal',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'name',
                            },
                        },
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
                        routing: {
                            send: {
                                type: 'body',
                                property: 'offset',
                            },
                        },
                    },
                    {
                        displayName: 'Phone',
                        name: 'phone',
                        type: 'string',
                        default: '',
                        description: 'Phone number of a deal contact',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'phone',
                            },
                        },
                    },
                    {
                        displayName: 'Sort Direction',
                        name: 'sortDirection',
                        type: 'options',
                        options: [
                            {
                                name: 'Ascending',
                                value: 'asc',
                            },
                            {
                                name: 'Descending',
                                value: 'desc',
                            },
                        ],
                        default: 'asc',
                        description: 'Sorting direction',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sortBy.direction',
                            },
                        },
                    },
                    {
                        displayName: 'Sort Field',
                        name: 'sortField',
                        type: 'options',
                        options: [
                            {
                                name: 'Created At',
                                value: 'created_at',
                            },
                            {
                                name: 'Expiration',
                                value: 'expiration',
                            },
                            {
                                name: 'ID',
                                value: 'id',
                            },
                            {
                                name: 'Name',
                                value: 'name',
                            },
                            {
                                name: 'Price',
                                value: 'price',
                            },
                        ],
                        default: 'created_at',
                        description: 'Sorting field name',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sortBy.fieldName',
                            },
                        },
                    },
                    {
                        displayName: 'Unlimited',
                        name: 'unlimited',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to return active deals without limit',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'unlimited',
                            },
                        },
                    },
                ],
            },

            // Additional Fields for Deal - Create
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['deal'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Attachments',
                        name: 'attachments',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'List of files from file manager',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attachments',
                            },
                        },
                    },
                    {
                        displayName: 'Attributes',
                        name: 'attributes',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'attributesList',
                                displayName: 'Attributes List',
                                values: [
                                    {
                                        displayName: 'ID',
                                        name: 'attributeId',
                                        type: 'number',
                                        default: 0,
                                        description: 'Attribute ID',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Attribute value',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Attribute',
                        description: 'Custom attributes for the deal',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attributes',
                                value: '={{ $value.attributesList }}',
                            },
                        },
                    },
                    {
                        displayName: 'Contact IDs',
                        name: 'contactIds',
                        type: 'number',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'List of contact IDs to associate with the deal',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'contact',
                            },
                        },
                    },
                    {
                        displayName: 'Currency',
                        name: 'currency',
                        type: 'string',
                        default: '',
                        description: 'Currency code (e.g., USD, EUR, UAH)',
                        placeholder: 'USD',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'currency',
                            },
                        },
                    },
                    {
                        displayName: 'Price',
                        name: 'price',
                        type: 'number',
                        default: 0,
                        description: 'Deal value/price',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'price',
                            },
                        },
                    },
                    {
                        displayName: 'Responsible ID',
                        name: 'responsibleId',
                        type: 'number',
                        default: '',
                        description: 'ID of the user responsible for the deal',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'responsibleId',
                            },
                        },
                    },
                    {
                        displayName: 'Source ID',
                        name: 'sourceId',
                        type: 'number',
                        default: 0,
                        description: 'ID of the deal source',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'sourceId',
                            },
                        },
                    },
                ],
            },

            // Additional Fields for Pipeline - Create
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                required: true,
                displayOptions: {
                    show: {
                        resource: ['pipeline'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Settings',
                        name: 'settings',
                        type: 'fixedCollection',
                        options: [
                            {
                                displayName: 'Settings',
                                name: 'settingsValues',
                                values: [
                                    {
                                        displayName: 'Color',
                                        name: 'color',
                                        type: 'color',
                                        default: '#B1B1B1',
                                    },
                                    {
                                        displayName: 'Currency',
                                        name: 'currency',
                                        type: 'string',
                                        default: 'UAH',
                                    },
                                    {
                                        displayName: 'Responsible',
                                        name: 'responsible',
                                        type: 'number',
                                        default: '',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        description: 'Pipeline settings',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'settings',
                                value: '={{ Object.entries($value.settingsValues).map(([name, value]) => ({ name, value })) }}',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
