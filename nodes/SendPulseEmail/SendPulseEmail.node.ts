import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

const emailsFieldDefaultValue = `[
    {
        "email": ""
    }
]`;

export class SendPulseEmail implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Email',
        name: 'sendPulseEmail',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse Email',
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
                        name: 'Mailing List',
                        value: 'mailingList',
                    },
                    {
                        name: 'Email',
                        value: 'email',
                    },
                    {
                        name: 'Campaign',
                        value: 'campaign',
                    },
                ],
                default: 'mailingList',
            },

            // Operations for Mailing List resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['mailingList'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        action: 'Get many mailing lists',
                        description: 'Get many mailing lists',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/addressbooks',
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
                        action: 'Get a mailing list',
                        description: 'Get a mailing list by ID',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/addressbooks/{{ $parameter.listId }}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create a mailing list',
                        description: 'Create a new mailing list',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/addressbooks',
                            },
                        },
                    },

                ],
                default: 'getMany',
            },

            // Operations for Email resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                    },
                },
                options: [
                    {
                        name: 'Add to List',
                        value: 'addToList',
                        action: 'Add emails to list',
                        description: 'Add one or more emails to a mailing list',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/addressbooks/{{ $parameter.listId }}/emails',
                            },
                        },
                    },
                ],
                default: 'addToList',
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
                        name: 'Get Many',
                        value: 'getMany',
                        action: 'Get a list of all email campaigns',
                        description: 'Get many campaigns',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/campaigns',
                                qs: {
                                    limit: '={{ $parameter.additionalFields.limit }}',
                                    offset: '={{ $parameter.additionalFields.offset }}',
                                    order: '={{ $parameter.additionalFields.order }}',
                                    status: '={{ $parameter.additionalFields.status }}',
                                    planed: '={{ $parameter.additionalFields.planed ? 1 : 0 }}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get information about a specific campaign',
                        action: 'Get campaign info',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/campaigns/{{ $parameter.campaignId }}',
                            },
                        },
                    },
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new email campaign',
                        action: 'Create email campaign',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/campaigns',
                            },
                        },
                    },
                ],
                default: 'getMany',
            },

            // Fields
            {
                displayName: 'List ID',
                name: 'listId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['mailingList', 'email'],
                        operation: ['get', 'addToList'],
                    },
                },
                default: '',
                description: 'The ID of the mailing list',
            },
            {
                displayName: 'List Name',
                name: 'bookName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['mailingList'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name of the mailing list to create',
                routing: {
                    send: {
                        type: 'body',
                        property: 'bookName',
                    },
                },
            },
            {
                displayName: 'Emails',
                name: 'emails',
                type: 'json',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['addToList'],
                    },
                },
                default: emailsFieldDefaultValue,
                description: 'Array of email objects to add. Each object should have "email" (required) and optionally "variables" object.',
                hint: 'Format: [{"email":"example1@example.com","variables":{"name":"Elizabeth","Phone":"380960000111"}},{"email":"example2@example.com"}]',
                routing: {
                    send: {
                        type: 'body',
                        property: 'emails',
                    },
                },
            },
            {
                displayName: 'Campaign ID',
                name: 'campaignId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['get'],
                    },
                },
                default: '',
                description: 'The ID of the campaign to retrieve',
            },
            {
                displayName: 'Sender Name',
                name: 'senderName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name of the sender',
                routing: {
                    send: {
                        type: 'body',
                        property: 'sender_name',
                    },
                },
            },
            {
                displayName: 'Sender Email',
                name: 'senderEmail',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                description: 'Email address of the sender',
                routing: {
                    send: {
                        type: 'body',
                        property: 'sender_email',
                    },
                },
            },
            {
                displayName: 'Subject',
                name: 'subject',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Subject of the email campaign',
                routing: {
                    send: {
                        type: 'body',
                        property: 'subject',
                    },
                },
            },
            {
                displayName: 'Use Template',
                name: 'useTemplate',
                type: 'boolean',
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: false,
                description: 'Whether to use a pre‑saved template (template_id) or provide the body manually',
            },
            {
                displayName: 'Template ID',
                name: 'templateId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                        useTemplate: [true],
                    },
                },
                default: '',
                description: 'ID of the template in SendPulse',
                routing: {
                    send: {
                        type: 'body',
                        property: 'template_id',
                    },
                },
            },
            {
                displayName: 'HTML Body (Base64)',
                name: 'htmlBody',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                        useTemplate: [false],
                    },
                },
                default: '',
                description: 'HTML code of the template, encoded in Base64',
                routing: {
                    send: {
                        type: 'body',
                        property: 'body',
                    },
                },
            },
            {
                displayName: 'List IDs',
                name: 'listIds',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'ID or comma-separated IDs of mailing lists to send the campaign to',
                routing: {
                    send: {
                        type: 'body',
                        property: 'list_id',
                    },
                },
            },
            {
                displayName: 'Campaign Name',
                name: 'name',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Email campaign name',
                routing: {
                    send: {
                        type: 'body',
                        property: 'name',
                    },
                },
            },

            // Additional Fields for Mailing List - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['mailingList'],
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
                    }
                ],
            },

            // Additional Fields for Email - Add to List
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['addToList'],
                    },
                },
                options: [
                    {
                        displayName: 'Confirmation',
                        name: 'confirmation',
                        type: 'options',
                        options: [
                            {
                                name: 'Force',
                                value: 'force',
                            },
                        ],
                        default: 'force',
                        description: 'Confirmation mode (fixed to FORCE)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'confirmation',
                            },
                        },
                    },
                    {
                        displayName: 'Message Language',
                        name: 'messageLang',
                        type: 'options',
                        options: [
                            {
                                name: 'English',
                                value: 'en'
                            },
                            {
                                name: 'Portuguese',
                                value: 'pt'
                            },
                            {
                                name: 'Russian',
                                value: 'ru'
                            },
                            {
                                name: 'Spanish',
                                value: 'es'
                            },
                            {
                                name: 'Turkish',
                                value: 'tr'
                            },
                            {
                                name: 'Ukrainian',
                                value: 'ua'
                            },
                        ],
                        default: 'en',
                        description: 'Language of the confirmation email',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'message_lang',
                            },
                        },
                    },
                    {
                        displayName: 'Sender Email',
                        name: 'senderEmail',
                        type: 'string',
                        default: '',
                        description: "Sender's email address (must be verified in SendPulse)",
                    },
                    {
                        displayName: 'Tags',
                        name: 'tags',
                        type: 'number',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: '',
                        description: 'List of tags to assign',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'tags',
                            },
                        },
                    },
                    {
                        displayName: 'Template ID',
                        name: 'templateId',
                        type: 'string',
                        default: '',
                        description: 'Confirmation email template ID',
                    },
                ],
            },

            // Additional Fields for Campaign - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['campaign'],
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
                        default: 'asc',
                        description: 'Order of campaigns by creation date',
                    },
                    {
                        displayName: 'Planned',
                        name: 'planed',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to return only scheduled campaigns',
                    },
                    {
                        displayName: 'Status',
                        name: 'status',
                        type: 'multiOptions',
                        options: [
                            {
                                name: 'New',
                                value: 0,
                            },
                            {
                                name: 'Pending (in Moderation)',
                                value: 1,
                            },
                            {
                                name: 'Sending in Progress',
                                value: 2,
                            },
                            {
                                name: 'Sent',
                                value: 3,
                            },
                            {
                                name: 'Test Campaign (Sent to User\'s Email Address)',
                                value: 4,
                            },
                            {
                                name: 'Campaign Blocked (by the Service)',
                                value: 5,
                            },
                            {
                                name: 'The Campaign Marked to Be Deleted',
                                value: 6,
                            },
                            {
                                name: 'Status Updating (Status 3 Will Follow)',
                                value: 7,
                            },
                            {
                                name: 'Test Campaign Sent',
                                value: 8,
                            },
                            {
                                name: 'Delivery in Progress',
                                value: 9,
                            },
                            {
                                name: 'The Campaign Being Processed to Be Sent Out',
                                value: 10,
                            },
                            {
                                name: 'Awaiting the User\'s Response to the Moderator\'s Query',
                                value: 11,
                            },
                            {
                                name: 'No Active Addresses',
                                value: 12,
                            },
                            {
                                name: 'Campaign Creation in Progress',
                                value: 13,
                            },
                            {
                                name: 'Campaign Created and Sent to the Queue',
                                value: 14,
                            },
                            {
                                name: 'Campaign Awaiting A/B Testing Results',
                                value: 15,
                            },
                            {
                                name: 'Campaign Canceled by a User',
                                value: 16,
                            },
                            {
                                name: 'Sending Partially',
                                value: 22,
                            },
                            {
                                name: 'Sent Partially',
                                value: 23,
                            },
                            {
                                name: 'Campaign Partially Sent and Blocked by Service Admin',
                                value: 25,
                            },
                            {
                                name: 'Draft',
                                value: 26,
                            },
                            {
                                name: 'Requires Editing',
                                value: 27,
                            },
                            {
                                name: 'Scheduled to Resend the Message to Unread',
                                value: 28,
                            },
                            {
                                name: 'Automations. Balance Exceeded',
                                value: 33,
                            },
                            {
                                name: 'Automations Draft',
                                value: 36,
                            },
                        ],
                        default: [],
                        description: 'Filter campaigns by status',
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
                        displayName: 'AMP Body (Base64)',
                        name: 'ampBody',
                        type: 'string',
                        typeOptions: {
                            rows: 4,
                        },
                        default: '',
                        description: 'AMP version of email body',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'body_amp',
                            },
                        },
                    },

                    {
                        displayName: 'Attachments',
                        name: 'attachments',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'attachmentsList',
                                displayName: 'Attachments',
                                values: [
                                    {
                                        displayName: 'Filename',
                                        name: 'filename',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'document.pdf',
                                        description: 'Name of the attached file',
                                    },
                                    {
                                        displayName: 'File Contents',
                                        name: 'data',
                                        type: 'string',
                                        typeOptions: {
                                            rows: 4,
                                        },
                                        default: '',
                                        description: 'File data',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Attachment',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attachments',
                                value: '={{ Object.fromEntries($parameter.additionalFields.attachments?.attachmentsList?.map(a => [a.filename, a.data]) || []) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Attachments Binary',
                        name: 'attachmentsBinary',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'attachmentsList',
                                displayName: 'Attachments',
                                values: [
                                    {
                                        displayName: 'Filename',
                                        name: 'filename',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'document.pdf',
                                        description: 'Name of the attached file',
                                    },
                                    {
                                        displayName: 'File Contents (Base64)',
                                        name: 'data',
                                        type: 'string',
                                        typeOptions: {
                                            rows: 4,
                                        },
                                        default: '',
                                        description: 'Base64 encoded file data',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add Attachment',
                        description: 'Binary attachments (base64 encoded)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'attachments_binary',
                                value: '={{ Object.fromEntries($parameter.additionalFields.attachmentsBinary?.attachmentsList?.map(a => [a.filename, a.data]) || []) }}',
                            },
                        },
                    },
                    {
                        displayName: 'Is Test',
                        name: 'isTest',
                        type: 'boolean',
                        default: false,
                        description: 'Whether this is a test campaign (sends only to the sender email)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'is_test',
                            },
                        },
                    },
                    {
                        displayName: 'Segment ID',
                        name: 'segmentId',
                        type: 'string',
                        default: '',
                        description: 'Segment ID created in your account',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'segment_id',
                            },
                        },
                    },
                    {
                        displayName: 'Send Date',
                        name: 'sendDate',
                        type: 'dateTime',
                        default: '',
                        description: 'Scheduled date for sending the campaign (YYYY-MM-DD HH:mm:ss)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'send_date',
                                value: '={{ $value ? $value.split(".")[0].replace("T", " ") : undefined }}',
                            },
                        },
                    },
                    {
                        displayName: 'Track Clicks',
                        name: 'trackClicks',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to track link clicks',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stats.clicks',
                            },
                        },
                    },
                    {
                        displayName: 'Track Opens',
                        name: 'trackOpens',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to track email opens',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stats.opens',
                            },
                        },
                    },
                    {
                        displayName: 'Type',
                        name: 'type',
                        type: 'options',
                        options: [
                            {
                                name: 'Draft',
                                value: 'draft',
                            },
                        ],
                        default: 'draft',
                        description: 'Campaign type. Use "draft" to create campaign as a draft.',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'type',
                            },
                        },
                    },
                    {
                        displayName: 'Use Dynamic List',
                        name: 'useDynamicList',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to send the campaign with automatic updating of the mailing list (dynamic list)',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'use_dynamic_list',
                            },
                        },
                    },
                    {
                        displayName: 'UTM Campaign',
                        name: 'utmCampaign',
                        type: 'string',
                        default: '',
                        description: 'Custom UTM campaign parameter for tracking',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'stats.utm_campaign',
                            },
                        },
                    },
                ],
            },
        ],
    };
}
