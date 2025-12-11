import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseSmtp implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse SMTP',
        name: 'sendPulseSmtp',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse SMTP',
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
            baseURL: 'https://api.sendpulse.com/smtp',
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
                        name: 'Email',
                        value: 'email',
                    },
                ],
                default: 'email',
            },

            // Operations for Email
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
                        name: 'Get Many',
                        value: 'getMany',
                        action: 'Get all SMTP emails',
                        description: 'Get a list of sent emails via SMTP',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/emails',
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
                        description: 'Get information about a specific SMTP email',
                        action: 'Get SMTP email info',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/emails/{{ $parameter.emailId }}',
                            },
                        },
                    },
                    {
                        name: 'Send',
                        value: 'send',
                        description: 'Send an email via SMTP',
                        action: 'Send an email via SMTP',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/emails',
                                body: {
                                    email: {
                                        subject: '={{ $parameter.subject }}',
                                        from: {
                                            name: '={{ $parameter.fromName }}',
                                            email: '={{ $parameter.fromEmail }}',
                                        },
                                        to: '={{ $parameter.toRecipients.recipients }}',
                                        html: '={{ Buffer.from($parameter.htmlBody).toString("base64") }}',
                                        text: '={{ $parameter.textBody }}',
                                        template: {
                                            id: '={{ $parameter.templateId }}',
                                            variables: '={{Object.fromEntries($parameter.templateVariables.variables?.map(v => [v.name, v.value]) || [])}}',
                                        },
                                        auto_plain_text: '={{ $parameter.additionalFields.autoPlainText }}',
                                        cc: '={{ $parameter.additionalFields.cc?.recipients }}',
                                        bcc: '={{ $parameter.additionalFields.bcc?.recipients }}',
                                        attachments: '={{ Object.fromEntries($parameter.additionalFields.attachments?.attachmentsList?.map(a => [a.filename, a.data]) || []) }}',
                                        attachments_binary: '={{ Object.fromEntries($parameter.additionalFields.attachmentsBinary?.attachmentsList?.map(a => [a.filename, a.data]) || []) }}',
                                    },
                                },
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
                        resource: ['mailingList'],
                        operation: ['get'],
                    },
                },
                default: '',
                description: 'The ID of the mailing list to retrieve',
            },
            {
                displayName: 'Email ID',
                name: 'emailId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['get'],
                    },
                },
                default: '',
                description: 'The ID of the SMTP email to retrieve',
            },
            {
                displayName: 'Subject',
                name: 'subject',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                default: '',
                description: 'The subject of the email',
            },
            {
                displayName: 'From Name',
                name: 'fromName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                default: '',
                description: 'The sender name',
            },
            {
                displayName: 'From Email',
                name: 'fromEmail',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                default: '',
                description: 'The sender email address',
            },
            {
                displayName: 'To',
                name: 'toRecipients',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                options: [
                    {
                        name: 'recipients',
                        displayName: 'Recipients',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                description: 'Recipient name',
                            },
                            {
                                displayName: 'Email',
                                name: 'email',
                                type: 'string',
                                default: '',
                                placeholder: 'name@email.com',
                                description: 'Recipient email address',
                            },
                        ],
                    },
                ],
                default: {},
                placeholder: 'Add Recipient',
                description: 'Email recipients',

                routing: {
                    send: {
                        type: 'body',
                        property: 'email.to',
                        value: '={{ $parameter.toRecipients.recipients }}',
                    },
                },
            },
            {
                displayName: 'Email Body Type',
                name: 'emailBodyType',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                options: [
                    {
                        name: 'HTML and Text',
                        value: 'both',
                    },
                    {
                        name: 'HTML Only',
                        value: 'html',
                    },
                    {
                        name: 'Text Only',
                        value: 'text',
                    },
                    {
                        name: 'Template',
                        value: 'template',
                    },
                ],
                default: 'both',
                description: 'The type of email body to send',
            },
            {
                displayName: 'HTML Body',
                name: 'htmlBody',
                type: 'string',
                typeOptions: {
                    editor: 'htmlEditor',
                },
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                        emailBodyType: ['html', 'both'],
                    },
                },
                default: '',
                description: 'The HTML content of the email',
            },
            {
                displayName: 'Text Body',
                name: 'textBody',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                        emailBodyType: ['text', 'both'],
                    },
                },
                default: '',
                description: 'The plain text content of the email',
            },
            {
                displayName: 'Template ID',
                name: 'templateId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                        emailBodyType: ['template'],
                    },
                },
                default: '',
                description: 'The ID of the template created in SendPulse',
            },
            {
                displayName: 'Template Variables',
                name: 'templateVariables',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                        emailBodyType: ['template'],
                    },
                },
                options: [
                    {
                        name: 'variables',
                        displayName: 'Variables',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                description: 'Variable name',
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
                placeholder: 'Add Variable',
                description: 'Variables to use in the template',
            },

            // Additional Fields for Email - Get Many
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['getMany'],
                    },
                },
                options: [
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                        placeholder: 'user@example.com',
                        description: 'Filter by recipient email address',
                        routing: {
                            send: { type: 'query', property: 'email' },
                        },
                    },
                    {
                        displayName: 'From Date',
                        name: 'from',
                        type: 'string',
                        default: '',
                        placeholder: '2025-11-01',
                        description: 'Filter emails sent from this date (YYYY-MM-DD)',
                        routing: {
                            send: { type: 'query', property: 'from' },
                        },
                    },
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
                        displayName: 'Status',
                        name: 'status',
                        type: 'string',
                        default: '',
                        placeholder: 'sent',
                        description: 'Filter by email status',
                        routing: {
                            send: { type: 'query', property: 'status' },
                        },
                    },
                    {
                        displayName: 'To Date',
                        name: 'to',
                        type: 'string',
                        default: '',
                        placeholder: '2025-11-17',
                        description: 'Filter emails sent up to this date (YYYY-MM-DD)',
                        routing: {
                            send: { type: 'query', property: 'to' },
                        },
                    },
                ],
            },

            // Additional Fields for Email - Send
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['email'],
                        operation: ['send'],
                    },
                },
                options: [
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
                    },
                    {
                        displayName: 'Auto Plain Text',
                        name: 'autoPlainText',
                        type: 'boolean',
                        default: true,
                        description: 'Whether or not to automatically generate a text part for messages that are not given text',
                    },
                    {
                        displayName: 'BCC',
                        name: 'bcc',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'recipients',
                                displayName: 'Recipients',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'BCC recipient name',
                                    },
                                    {
                                        displayName: 'Email',
                                        name: 'email',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'name@email.com',
                                        description: 'BCC email address',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add BCC',
                        description: 'BCC recipients',
                        routing: {
                            send: {
                                type: 'body',
                                property: 'email.bcc',
                                value: '={{ $parameter.additionalOptions.bcc?.recipients }}',
                            },
                        },
                    },
                    {
                        displayName: 'CC',
                        name: 'cc',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'recipients',
                                displayName: 'Recipients',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'CC recipient name',
                                    },
                                    {
                                        displayName: 'Email',
                                        name: 'email',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'name@email.com',
                                        description: 'CC email address',
                                    },
                                ],
                            },
                        ],
                        default: {},
                        placeholder: 'Add CC',
                        description: 'CC recipients',
                    },
                ],
            },
        ],
    };
}
