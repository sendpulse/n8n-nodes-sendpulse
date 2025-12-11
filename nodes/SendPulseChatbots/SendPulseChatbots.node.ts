import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';
import { prepareMessage } from './shared/utils';

export class SendPulseChatbots implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Chatbots',
        name: 'sendPulseChatbots',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse Chatbots',
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
            baseURL: 'https://api.sendpulse.com',
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
                        name: 'Bot',
                        value: 'bot',
                    },
                    {
                        name: 'Dialog',
                        value: 'dialog',
                    },
                    {
                        name: 'Contact',
                        value: 'contact',
                    },
                    {
                        name: 'Flow',
                        value: 'flow',
                    },
                ],
                default: 'bot',
            },

            // Operations for Bot resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['bot'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of bots',
                        action: 'Get many bots',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/chatbots/bots',
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Operations for Dialog resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['dialog'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        description: 'Get a list of dialogs',
                        action: 'Get many dialogs',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/chatbots/dialogs',
                                qs: {
                                    size: '={{ $parameter.additionalFields.limit }}',
                                    skip: '={{ $parameter.additionalFields.offset }}',
                                    search_after: '={{ $parameter.additionalFields.searchAfterId }}',
                                    order: '={{ $parameter.additionalFields.order }}',
                                },
                            },
                        },
                    },
                ],
                default: 'getMany',
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
                        name: 'Get',
                        value: 'get',
                        description: 'Get a contact by ID',
                        action: 'Get a contact',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/{{ $parameter.channel }}/contacts/get',
                                qs: {
                                    id: '={{ $parameter.contactId }}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Send Message',
                        value: 'send',
                        description: 'Sends a text message, image or file to a contact via chatbot',
                        action: 'Send a message to a contact',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/{{ $parameter.channel }}/contacts/send',
                                body: {
                                    contact_id: '={{ $parameter.contactId }}',
                                },
                            },
                        },
                    },
                ],
                default: 'get',
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
                        name: 'Run',
                        value: 'run',
                        description: 'Run a flow by ID and contact ID',
                        action: 'Run a flow',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/{{ $parameter.channel }}/flows/run',
                                body: {
                                    contact_id: '={{ $parameter.contactId }}',
                                },
                            },
                        },
                    },
                ],
                default: 'run',
            },

            // Fields
            {
                displayName: 'Channel',
                name: 'channel',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact', 'flow'],
                        operation: ['get', 'send', 'run'],
                    },
                },
                options: [
                    {
                        name: 'Facebook Messenger',
                        value: 'messenger',
                    },
                    {
                        name: 'Instagram',
                        value: 'instagram',
                    },
                    {
                        name: 'LiveChat',
                        value: 'live-chat',
                    },
                    {
                        name: 'Telegram',
                        value: 'telegram',
                    },
                    {
                        name: 'TikTok',
                        value: 'tiktok',
                    },
                    {
                        name: 'Viber',
                        value: 'viber/chatbots',
                    },
                    {
                        name: 'WhatsApp',
                        value: 'whatsapp',
                    },
                ],
                default: 'messenger',
                description: 'Chatbot channel',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact', 'flow'],
                        operation: ['get', 'send', 'run'],
                    },
                },
                default: '',
                description: 'The ID of the contact',
            },
            {
                displayName: 'Flow ID',
                name: 'flowId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['flow'],
                        operation: ['run'],
                    },
                },
                default: '',
                description: 'The ID of the flow',
                routing: {
                    send: {
                        type: 'body',
                        property: 'flow_id',
                    },
                },
            },
            {
                displayName: 'Message Text',
                name: 'messageText',
                type: 'string',
                required: true,
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['send'],
                        channel: ['telegram', 'messenger', 'whatsapp'],
                    },
                },
                default: '',
                description: 'The text message to send',
                routing: {
                    send: {
                        type: 'body',
                        property: 'message',
                        value: `={{ (${prepareMessage})($parameter.channel, $value) }}`,
                    },
                },
            },
            {
                displayName: 'Messages',
                name: 'messages',
                type: 'fixedCollection',
                required: true,
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['send'],
                        channel: ['live-chat', 'instagram', 'viber/chatbots', 'tiktok'],
                    },
                },
                options: [
                    {
                        name: 'messagesList',
                        displayName: 'Messages',
                        values: [
                            {
                                displayName: 'Message Text',
                                name: 'messageText',
                                type: 'string',
                                typeOptions: {
                                    rows: 4,
                                },
                                default: '',
                                description: 'The text message',
                            },
                        ],
                    },
                ],
                default: {},
                placeholder: 'Add Message',
                description: 'The text messages to send',
                routing: {
                    send: {
                        type: 'body',
                        property: 'messages',
                        value: `={{ (${prepareMessage})($parameter.channel, $value.messagesList) }}`,
                    },
                },
            },

            // Additional Fields for Dialog - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['dialog'],
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
                            maxValue: 1000,
                        },
                        default: 50,
                        description: 'Max number of results to return',
                    },
                    {
                        displayName: 'Order',
                        name: 'order',
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
                        default: 'desc',
                        description: 'Sorting direction for dialogs',
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
                    {
                        displayName: 'Search After ID',
                        name: 'searchAfterId',
                        type: 'string',
                        default: '',
                        description: 'Dialog ID after which the listing should resume',
                    },
                ],
            },

            // Additional Fields for Flow - Run
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['flow'],
                        operation: ['run'],
                    },
                },
                options: [
                    {
                        displayName: 'External Data',
                        name: 'externalData',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'data',
                                displayName: 'Variables',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
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
                        placeholder: 'Add Data',
                        description: 'Additional data',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'external_data',
                                value: '={{Object.fromEntries($value.data?.map(v => [v.name, v.value]) || [])}}',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
