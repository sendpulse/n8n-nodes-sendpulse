import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
    ICredentialTestRequest,
    Icon,
} from 'n8n-workflow';

export class SendPulseApi implements ICredentialType {
    name = 'sendPulseApi';
    displayName = 'SendPulse API';
    icon: Icon = { light: 'file:../icons/sendpulse.svg', dark: 'file:../icons/sendpulse.dark.svg' };
    documentationUrl = 'https://sendpulse.com/integrations/api';
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials?.accessToken}}',
            },
        },
    };
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.sendpulse.com',
            url: '/user/info',
            method: 'GET',
        },
    };
}
