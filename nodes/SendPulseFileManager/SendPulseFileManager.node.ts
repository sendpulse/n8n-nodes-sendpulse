import {
    INodeType,
    INodeTypeDescription,
    NodeConnectionTypes,
} from 'n8n-workflow';

export class SendPulseFileManager implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SendPulse FileManager',
        name: 'sendPulseFileManager',
        icon: 'file:sendpulse.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Interact with SendPulse API',
        defaults: {
            name: 'SendPulse FileManager',
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
            baseURL: 'https://api.sendpulse.com/fm/public/v1',
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
                        name: 'File',
                        value: 'file',
                    },
                ],
                default: 'file',
            },

            // Operations for File resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['file'],
                    },
                },
                options: [
                    {
                        name: 'Upload',
                        value: 'upload',
                        description: 'Upload a file to SendPulse FileManager',
                        action: 'Upload a file',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '=/file',
                            },
                            send: {
                                preSend: [
                                    async function (this, requestOptions) {
                                        const files = this.getNodeParameter('files') as {
                                            filesList: Array<{
                                                name: string;
                                                data: string;
                                            }>;
                                        };
                                        const filePath = this.getNodeParameter('filePath') as string;

                                        const formData = new FormData();
                                        formData.append('pathToStore', filePath);

                                        files.filesList.forEach((file, index) => {
                                            let fileBase64Data = file.data.trim();
                                            let mimeType = 'application/octet-stream';

                                            const dataMatch = fileBase64Data.match(/^data:([^;]+);base64,(.+)$/);
                                            if (dataMatch) {
                                                mimeType = dataMatch[1];
                                                fileBase64Data = dataMatch[2];
                                            }

                                            const binary = atob(fileBase64Data);
                                            const array = new Uint8Array(binary.length);

                                            for (let i = 0; i < binary.length; i++) {
                                                array[i] = binary.charCodeAt(i);
                                            }

                                            const blob = new Blob([array], { type: mimeType });

                                            formData.append(`content[${index}]`, blob, file.name);
                                        });

                                        const additionalFields = this.getNodeParameter('additionalFields', {}) as {
                                            height?: number;
                                            width?: number;
                                        };

                                        if (additionalFields.height) {
                                            formData.append('height', additionalFields.height);
                                        }

                                        if (additionalFields.width) {
                                            formData.append('width', additionalFields.width);
                                        }

                                        requestOptions.body = formData;

                                        if (requestOptions.headers) {
                                            delete requestOptions.headers['Content-Type'];
                                        }

                                        return requestOptions;
                                    },
                                ],
                            },
                        },
                    },
                ],
                default: 'upload',
            },

            // Fields
            {
                displayName: 'Files',
                name: 'files',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'filesList',
                        displayName: 'Files',
                        values: [
                            {
                                displayName: 'File Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                description: 'The name of the file to upload (including extension)',
                                placeholder: 'document.pdf',
                            },
                            {
                                displayName: 'File Contents (Base64)',
                                name: 'data',
                                type: 'string',
                                typeOptions: {
                                    rows: 4,
                                },
                                default: '',
                                description: 'Name of the binary property which contains the file to upload',
                            },
                        ],
                    },
                ],
                default: {},
                placeholder: 'Add File',
                description: 'Files (base64 encoded)',
            },
            {
                displayName: 'Path',
                name: 'filePath',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['upload'],
                    },
                },
                default: '/',
                description: 'The path where the file will be uploaded in SendPulse FileManager',
                placeholder: '/',
            },

            // Additional Fields for File - Upload
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['upload'],
                    },
                },
                options: [
                    {
                        displayName: 'Height',
                        name: 'height',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                        },
                        default: 500,
                        description: 'Optional height parameter for video files',
                    },
                    {
                        displayName: 'Width',
                        name: 'width',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                        },
                        default: 500,
                        description: 'Optional width parameter for video files',
                    },
                ],
            },
        ],
    };
}
