import {
    ICredentialType,
    INodeProperties,
    Icon,
    ICredentialTestRequest,
} from 'n8n-workflow';

export class SendPulseOAuth2Api implements ICredentialType {
	name = 'sendPulseOAuth2Api';
	displayName = 'SendPulse OAuth2 API';
	icon: Icon = { light: 'file:../icons/sendpulse.svg', dark: 'file:../icons/sendpulse.dark.svg' };
	documentationUrl = 'https://sendpulse.com/integrations/api';
    extends = ['oAuth2Api'];
    properties: INodeProperties[] = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'clientCredentials',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '',
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://api.sendpulse.com/oauth/access_token',
        },
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'body',
        },
    ];
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.sendpulse.com',
            url: '/user/info',
            method: 'GET',
        },
    };
}
