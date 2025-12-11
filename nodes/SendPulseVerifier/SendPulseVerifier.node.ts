import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseVerifier implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse Verifier',
        name: 'sendPulseVerifier',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse Verifier',
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
            baseURL: 'https://api.sendpulse.com/verifier-service',
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
                ],
                default: 'mailingList',
            },

            // Operations for Flow resource
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
                        name: 'Verify',
                        value: 'verify',
                        description: 'Send a mailing list for verification',
                        action: 'Verify a mailing list',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/send-list-to-verify',
                                body: {
                                    id: '={{ $parameter.mailingListId }}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Get Verified Lists',
                        value: 'getVerifiedLists',
                        description: 'Get a list of verified mailing lists',
                        action: 'Get verified mailing lists',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/check-list',
                                qs: {
                                    count: '={{ $parameter.additionalFields.limit }}',
                                    start: '={{ $parameter.additionalFields.offset }}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Get Verification Results',
                        value: 'getVerificationResults',
                        description: 'Get verification results for a mailing list',
                        action: 'Get mailing list verification results',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/check',
                                qs: {
                                    id: '={{ $parameter.mailingListId }}',
                                    count: '={{ $parameter.additionalFields.limit }}',
                                    start: '={{ $parameter.additionalFields.offset }}',
                                },
                            },
                        },
                    },
                ],
                default: 'getVerifiedLists',
            },

            // Fields
            {
                displayName: 'Mailing List ID',
                name: 'mailingListId',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['mailingList'],
                        operation: ['verify', 'getVerificationResults'],
                    },
                },
                default: 0,
                description: 'ID of the mailing list to verify',
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
                        resource: ['mailingList'],
                        operation: ['getVerifiedLists', 'getVerificationResults'],
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
